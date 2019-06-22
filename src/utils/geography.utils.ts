import isEqual from 'lodash/isEqual';
import {constants} from '../constants';
import { GeometryUtils } from './geometry.utils';
import {MathUtils} from './math.utils';
import {ShapeUtils} from './shape.utils';

export class GeographyUtils {
  constants: grider.Constants = constants;

  constructor(
    public math: MathUtils,
    public geometry: GeometryUtils,
    public shape: ShapeUtils,
  ) {}

  //done
  calcMercDistance(
    pointA: grider.GeoPoint,
    pointB: grider.GeoPoint,
  ): number {
    const minLng = Math.min(pointA.lng, pointB.lng);
    const maxLng = Math.max(pointA.lng, pointB.lng);

    if (maxLng - minLng > 180) {
      pointA = {
        ...pointA,
        lng: this.reduceLng(pointA.lng - 180),
      };
      pointB = {
        ...pointB,
        lng: this.reduceLng(pointB.lng - 180),
      };
    }

    return this.geometry.calcDistance(
      this.spherToMercRel(pointA),
      this.spherToMercRel(pointB),
    );
  }

  //geoPoly
  calcPolyItselfIntersections(
    poly: grider.GeoPoint[],
  ): grider.GeoPoint[] {
    return this.shape.reduceShapeOppositeSides<grider.GeoPoint, grider.GeoPoint[]>(poly, (
      intersects,
      sideA,
      sideB,
    ) => {
      const intersect = this.calcSectionsIntersect(sideA, sideB);

      if (intersect) {
        intersects.push(intersect);
      }
      return intersects;
    }, [])
      .filter((intersect) => {
        return !poly.find((point) => isEqual(intersect, point));
      });
  }


  //geopoly, geoline
  calcPolyAndLineInersections(
    poly: grider.GeoPoint[],
    line: [grider.GeoPoint, grider.GeoPoint],
  ): grider.GeoPoint[] {
    return poly.reduce((
      intersects: grider.GeoPoint[],
      pointB: grider.GeoPoint,
      index: number,
    ): grider.GeoPoint[] => {
      const nextPointB = poly[index + 1] || poly[0];

      const intersect = this.calcSectionsIntersect(
        line,
        [pointB, nextPointB],
      );

      if (intersect) {
        intersects.push(intersect);
      }
      return intersects;
    }, []);
  }

  //geopoly
  polyContainsPoint(
    poly: grider.GeoPoint[],
    {lat, lng}: grider.GeoPoint,
  ): boolean {
    const lngIntersects = poly.reduce((
      intersects: number[],
      point: grider.GeoPoint,
      index: number,
    ): number[] => {
      const nextPoint = poly[index + 1] || poly[0];

      if (
        Math.min(point.lat, nextPoint.lat) > lat ||
        Math.max(point.lat, nextPoint.lat) < lat
      ) {
        return intersects;
      }

      const lngIntersect = this.calcLngByLatOnLox(lat, [point, nextPoint]);

      if (lngIntersect) {
        intersects.push(lngIntersect);
      }

      return intersects;
    }, [])
    .sort((a, b) => a - b);

    const edges = this.findLngEdges(lngIntersects);
    const gapStartIndex = lngIntersects.indexOf(edges.west);

    const gaps = [
      ...lngIntersects.slice(gapStartIndex),
      ...lngIntersects.slice(0, gapStartIndex),
    ];

    return gaps.reduce((
      isContained: boolean,
      intersect: number,
      index: number,
    ): boolean => {
      if (isContained || index % 2) return isContained;

      const from = intersect;
      const to = gaps[index + 1];

      if (from <= to) {
        return from <= lng && to >= lng;
      }

      return (
        from <= lng && lng <= 180
      ) || (
        to >= lng && lng > -180
      );
    }, false);
  }

  // geopoly/line?
  calcLngEdges(
    lng1: number,
    lng2: number,
  ): grider.LngEdges {
    const lngMin = Math.min(lng1, lng2);
    const lngMax = Math.max(lng1, lng2);

    const delta1 = lngMax - lngMin;
    const delta2 = 360 + lngMin - lngMax;

    return lng1 === lngMin ? {
      east: delta1,
      west: delta2,
    } : {
      east: delta2,
      west: delta1,
    };
  }

  //geoPoint
  calcDeltaLng(
    eastLng: number,
    westLng: number,
  ) {
    const {east, west} = this.calcLngEdges(eastLng, westLng);

    return Math.min(east, west);
  }


  //edges
  findLngEdges(
    lngs: number[],
  ): grider.LngEdges {
    const edges = lngs.reduce((
        edges: grider.LngEdges,
        lng: number,
        index: number,
      ): grider.LngEdges => {
        if (index === 0) return edges;

        const edgesEast = this.calcLngEdges(lng, edges.east);
        const edgesWest = this.calcLngEdges(lng, edges.west);

        if (edgesEast.west < edgesEast.east) {
          edges.east = lng;
        }

        if (edgesWest.west > edgesWest.east) {
          edges.west = lng;
        }

        return edges;
      }, {east: lngs[0], west: lngs[0]});

    return edges;
  }

  //done
  closestPointOnSection(
    point: grider.GeoPoint,
    [pointA, pointB]: [grider.GeoPoint, grider.GeoPoint],
  ): grider.GeoPoint | undefined {
    const lngMin = Math.min(pointA.lng, pointB.lng);
    const lngMax = Math.max(pointA.lng, pointB.lng);

    const isRipped = lngMax - lngMin > 180;

    let pointStart;
    let pointEnd;
    let pointTest;

    if (isRipped) {
      pointStart = {
        lat: pointA.lat,
        lng: this.reduceLng(pointA.lng - 180),
      };
      pointEnd = {
        lat: pointB.lat,
        lng: this.reduceLng(pointB.lng - 180),
      };
      pointTest = {
        lat: point.lat,
        lng: this.reduceLng(point.lng - 180),
      };
    } else {
      pointStart = pointA;
      pointEnd = pointB;
      pointTest = point;
    }

    const a = this.spherToMercRel(pointStart);
    const b = this.spherToMercRel(pointEnd);
    const c = this.spherToMercRel(pointTest);

    const closestPoint = this.geometry.closestPointOnSection(c, [a, b]);

    if (!closestPoint) return;

    const {lat, lng} = this.mercToSpherRel(closestPoint);

    return isRipped ? {
      lat,
      lng: this.reduceLng(lng + 180),
    } : {
      lat,
      lng,
    };
  }

  //done
  calcSectionsIntersect(
    [pointStart1, pointEnd1]: [grider.GeoPoint, grider.GeoPoint],
    [pointStart2, pointEnd2]: [grider.GeoPoint, grider.GeoPoint],
  ): grider.GeoPoint | undefined {
    const lngMin1 = Math.min(pointStart1.lng, pointEnd1.lng);
    const lngMax1 = Math.max(pointStart1.lng, pointEnd1.lng);
    const lngMin2 = Math.min(pointStart2.lng, pointEnd2.lng);
    const lngMax2 = Math.max(pointStart2.lng, pointEnd2.lng);

    const isRipped = (
      lngMax1 - lngMin1 > 180
    ) || (
      lngMax2 - lngMin2 > 180
    );

    let pointStartA;
    let pointEndA;
    let pointStartB;
    let pointEndB;

    if (isRipped) {
      pointStartA = {
        lat: pointStart1.lat,
        lng: this.reduceLng(pointStart1.lng - 180),
      };
      pointEndA = {
        lat: pointEnd1.lat,
        lng: this.reduceLng(pointEnd1.lng - 180),
      };
      pointStartB = {
        lat: pointStart2.lat,
        lng: this.reduceLng(pointStart2.lng - 180),
      };
      pointEndB = {
        lat: pointEnd2.lat,
        lng: this.reduceLng(pointEnd2.lng - 180),
      };
    } else {
      pointStartA = pointStart1;
      pointEndA = pointEnd1;
      pointStartB = pointStart2;
      pointEndB = pointEnd2;
    }

    const a1 = this.spherToMercRel(pointStartA);
    const b1 = this.spherToMercRel(pointEndA);
    const a2 = this.spherToMercRel(pointStartB);
    const b2 = this.spherToMercRel(pointEndB);

    const intersect = this.geometry.calcSectionsIntersect(
      [[a1.x, a1.y], [b1.x, b1.y]],
      [[a2.x, a2.y], [b2.x, b2.y]],
    );

    if (!intersect) return;

    const [x, y] = intersect;

    const geoPoint = this.mercToSpherRel({x, y});

    if (!isRipped) return geoPoint;

    return {
      lat: geoPoint.lat,
      lng: this.reduceLng(geoPoint.lng + 180),
    };
  }

  //done
  spherToMercMap(
    point: grider.GeoPoint,
  ): grider.Point {
    const {x, y} = this.spherToMercRel(point);

    return {
      x: (x / (Math.PI) + 1) / 2,
      y: (-y / Math.PI + 1) / 2,
    };
  }

  //done
  mercToSpherMap(
    {x, y}: grider.Point,
  ): grider.GeoPoint {
    return this.mercToSpherRel({
      x: (x * 2 - 1) * Math.PI,
      y: -(y * 2 - 1) * Math.PI,
    });
  }


  //done
  spherToMercAbs(
    point: grider.GeoPoint,
  ): grider.Point {
    const {x, y} = this.spherToMercRel(point);

    return {
      x: x * this.constants.radius,
      y: y * this.constants.radius,
    };
  }

  //done
  spherToMercGeo(
    point: grider.GeoPoint,
  ): grider.GeoPoint {
    const {x, y} = this.spherToMercRel(point);

    return {
      lng: x * 90,
      lat: y * 90,
    };
  }

  //done
  spherToMercRel(
    {lat, lng}: grider.GeoPoint,
  ): grider.Point {
    return {
      x: this.spherLngToMercX(lng),
      y: this.spherLatToMercY(lat),
    };
  }

  //done
  spherLngToMercX(
    lng: number,
  ): number {
    return this.math.degToRad(lng);
  }

  //done
  spherLatToMercY(
    lat: number,
  ): number {
    return Math.log(
      Math.tan(
        (Math.PI / 4 + this.math.degToRad(lat) / 2),
      ),
    );
  }

  //done
  mercToSpherAbs(
    {x, y}: grider.Point,
  ): grider.GeoPoint {
    return this.mercToSpherRel({
      x: x / this.constants.radius,
      y: y / this.constants.radius,
    });
  }

  //done
  mercToSpherGeo(
    {lng, lat}: grider.GeoPoint,
  ): grider.GeoPoint {
    return this.mercToSpherRel({
      x: lng / 90,
      y: lat / 90,
    });
  }

  //done
  mercToSpherRel(
    {x, y}: grider.Point,
  ): grider.GeoPoint {
    const lat = this.mercYToSpherLat(y);
    const lng = this.mercXToSpherLng(x);

    return {
      lat: this.formatSpherValue(lat),
      lng: this.formatSpherValue(lng),
    };
  }

  //done
  mercXToSpherLng(
    x: number,
  ): number {
    return this.math.radToDeg(x);
  }

  //done
  mercYToSpherLat(
    y: number,
  ): number {
    const latRad = 2 * (Math.atan(
      Math.pow(Math.E, y),
    ) - Math.PI / 4);

    return this.math.radToDeg(latRad);
  }

  //done
  formatGeoPoint(
    geoPoint: grider.GeoPoint,
  ): grider.GeoPoint {
    if (geoPoint.lat > 90) {
      geoPoint.lat = 90;
    }

    if (geoPoint.lat < -90) {
      geoPoint.lat = -90;
    }

    if (geoPoint.lng > 180 || geoPoint.lng <= -180) {
      geoPoint.lng = this.reduceLng(geoPoint.lng);
    }

    const result = {
      lat: this.formatSpherValue(geoPoint.lat),
      lng: this.formatSpherValue(geoPoint.lng),
    };

    return result;
  }

  //done
  formatSpherValue(value: number) {
    return +value.toFixed(7);
  }

  //done
  reduceLat(lat: number): number {
    if (lat > 360 || lat < -360) {
      lat %= 360;
    }

    if (lat > 90) {
      return 180 - lat;
    } else if (lat < -90) {
      return -180 + lat;
    } else {
      return lat;
    }
  }

  //done
  reduceLng(lng: number): number {
    if (lng > 360 || lng < -360) {
      lng %= 360;
    }

    if (lng > 180) {
      return lng - 360;
    } else if (lng <= -180) {
      return lng + 360;
    } else {
      return lng;
    }
  }

  //rhumb
  calcLngLoxEquation(
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): (lat: number) => number | void {
    return (lat: number) => this.calcLngByLatOnLox(lat, loxPoints);
  }

  //rhumb
  calcLatLoxEquation(
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): (lng: number) => number | void {
    return (lng: number) => this.calcLatByLngOnLox(lng, loxPoints);
  }

  //rhumb
  calcLngByLatOnLox(
    lat: number,
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): number | void {
    const [pointStart, pointEnd] = loxPoints;

    const lngMax = Math.max(pointStart.lng, pointEnd.lng);
    const lngMin = Math.min(pointStart.lng, pointEnd.lng);

    const isRipped = (lngMax - lngMin) > 180;

    let pointA;
    let pointB;

    if (isRipped) {
      pointA = {
        lat: pointStart.lat,
        lng: this.reduceLng(pointStart.lng - 180),
      };
      pointB = {
        lat: pointEnd.lat,
        lng: this.reduceLng(pointEnd.lng - 180),
      };
    } else {
      pointA = pointStart;
      pointB = pointEnd;
    }

    const y = this.spherLatToMercY(lat);
    const {x: x1, y: y1} = this.spherToMercRel(pointA);
    const {x: x2, y: y2} = this.spherToMercRel(pointB);

    const x = this.geometry.calcXByYOnLine(y, [
      [x1, y1],
      [x2, y2],
    ]);

    if (x === undefined) return;

    let lng = this.mercXToSpherLng(x);

    if (isRipped) {
      lng += 180;
    }

    return this.reduceLng(lng);
  }

  //rhumb
  calcLatByLngOnLox(
    lng: number,
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): number | void {
    const [pointStart, pointEnd] = loxPoints;

    const x = this.spherLngToMercX(lng);
    const {x: x1, y: y1} = this.spherToMercRel(pointStart);
    const {x: x2, y: y2} = this.spherToMercRel(pointEnd);

    const y = this.geometry.calcYByXOnLine(x, [
      [x1, y1],
      [x2, y2],
    ]);

    if (y === undefined) return;

    const lat = this.mercYToSpherLat(y);

    return this.reduceLng(lat);
  }

  //config
  calcInitialCellWidth(
    desiredSize: number,
    sizeCoof: number,
  ): number {
    const minWidth = this.constants.equatorLength / 3600000000;
    const relPolyWidth = Math.round(desiredSize / minWidth);
    let result = this.math.calcClosestMultiple(relPolyWidth, 3600000000);

    if (result > 1800000000) {
      result = 1800000000;
    }

    if (result < 1) {
      result = 1;
    }

    return result * sizeCoof;
  }

  //config
  calcInitialCellHeight(desiredSize: number): number {
    const minWidth = this.constants.meridianLength / 3600000000;
    const relPolyWidth = Math.round(desiredSize / minWidth);

    let result = this.math.calcClosestMultiple(relPolyWidth, 1800000000);

    if (result > 1800000000) {
      result = 1800000000;
    }

    if (result < 1) {
      result = 1;
    }

    return result;
  }

  // getGridBreakpoints(initWidth: number, initHeight: number): {
  //   [key: number]: number,
  // } {
  //   const cellsAmount = 3600000000 / initWidth;

  //   const growthCoofs = this.math
  //     .calcAreaCorrectionGrowthCoofs(cellsAmount);

  //   let coof = 1;

  //   const breakPoints = growthCoofs.reduce((breakPoints: any, value: number) => {
  //     coof *= value;

  //     const cosLat = 1 / (value * coof);
  //     let breakpoint: number = this.math.radToDeg(Math.acos(cosLat));

  //     breakpoint = (
  //       Math.round((breakpoint * 10000000 / (initHeight))) - 0.5
  //     ) * initHeight;

  //     breakpoint = +(breakpoint / 10000000).toFixed(7);

  //     breakPoints[breakpoint] = coof;

  //     return breakPoints;
  //   }, {}) as {
  //     [key: number]: number,
  //   };

  //   return breakPoints;
  // }

  // stringifyGeoPoints(polyGeoPoints: grider.GeoPoint[]): string[] {
  //   return polyGeoPoints.map((item) => `${item.lat} ${item.lng}`);
  // }

  // serializePoly(polyGeoPoints: grider.GeoPoint[]): string {
  //   const strPoints = this.stringifyGeoPoints(polyGeoPoints);

  //   strPoints.push(strPoints[0]);

  //   return `POLYGON((${strPoints.join(',')}))`;
  // }

  // serializeMultiPoint(polyGeoPoints: grider.GeoPoint[]): string {
  //   const strPoints = this.stringifyGeoPoints(polyGeoPoints);

  //   return `MULTIPOINT(${strPoints.join(',')})`;
  // }

  // parsePoly(polyStr: string): grider.GeoPoint[] {
  //   const points = polyStr.slice(9, -2)
  //     .split(',')
  //     .map((point) => {
  //       const coords = point.split(' ');
  //       return {
  //         lat: +coords[0],
  //         lng: +coords[1],
  //       };
  //     });

  //   return points;
  // }
}
