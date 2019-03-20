import {constants} from '../constants';
import { GeometryUtils } from './geometry.utils';
import {MathUtils} from './math.utils';

export class GeographyUtils {
  constants: any = constants;

  constructor(
    public math: MathUtils,
    public geometry: GeometryUtils,
  ) {}

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
      const lngIntersect = this.calcLngByLatOnLox(lat, [point, nextPoint]);

      if (
        Math.min(point.lat, nextPoint.lat) < lat &&
        Math.max(point.lat, nextPoint.lat) > lat &&
        lngIntersect
      ) {
        intersects.push(lngIntersect);
      }

      return intersects;
    }, []);

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
        from <= lng || from < (lng + 360)
      ) && (
        to >= lng || to > (lng - 360)
      );
    }, false);
  }

  calcDeltaLng(
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

  findLngEdges(
    lngs: number[],
  ): grider.LngEdges {
    const edges = lngs.reduce((
        edges: grider.LngEdges,
        lng: number,
        index: number,
      ): grider.LngEdges => {
        if (index === 0) return edges;

        const edgesEast = this.calcDeltaLng(lng, edges.east);
        const edgesWest = this.calcDeltaLng(lng, edges.west);

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

  calcSectionsIntersect(
    [pointStart1, pointEnd1]: [grider.GeoPoint, grider.GeoPoint],
    [pointStart2, pointEnd2]: [grider.GeoPoint, grider.GeoPoint],
  ): grider.GeoPoint | undefined {
    const a1 = this.spherToMercRel(pointStart1);
    const b1 = this.spherToMercRel(pointEnd1);
    const a2 = this.spherToMercRel(pointStart2);
    const b2 = this.spherToMercRel(pointEnd2);

    const intersect = this.geometry.calcSectionsIntersect(
      [[a1.x, a1.y], [b1.x, b1.y]],
      [[a2.x, a2.y], [b2.x, b2.y]],
    );

    if (!intersect) return;

    const [x, y] = intersect;

    return this.mercToSpherRel({x, y});
  }

  spherToMercAbs(
    point: grider.GeoPoint,
  ): grider.Point {
    const {x, y} = this.spherToMercRel(point);

    return {
      x: x * this.constants.radius,
      y: y * this.constants.radius,
    };
  }

  spherToMercGeo(
    point: grider.GeoPoint,
  ): grider.GeoPoint {
    const {x, y} = this.spherToMercRel(point);

    return {
      lng: x * 90,
      lat: y * 90,
    };
  }

  spherToMercRel(
    {lat, lng}: grider.GeoPoint,
  ): grider.Point {
    return {
      y: this.spherLatToMercY(lat),
      x: this.spherLngToMercX(lng),
    };
  }

  spherLngToMercX(
    lng: number,
  ): number {
    return this.math.degToRad(lng);
  }

  spherLatToMercY(
    lat: number,
  ): number {
    return Math.log(
      Math.tan(
        (Math.PI / 4 + this.math.degToRad(lat) / 2),
      ),
    );
  }

  mercToSpherAbs(
    {x, y}: grider.Point,
  ): grider.GeoPoint {
    return this.mercToSpherRel({
      x: x / this.constants.radius,
      y: y / this.constants.radius,
    });
  }

  mercToSpherGeo(
    {lng, lat}: grider.GeoPoint,
  ): grider.GeoPoint {
    return this.mercToSpherRel({
      x: lng / 90,
      y: lat / 90,
    });
  }

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

  mercXToSpherLng(
    x: number,
  ): number {
    return this.math.radToDeg(x);
  }

  mercYToSpherLat(
    y: number,
  ): number {
    const latRad = 2 * (Math.atan(
      Math.pow(Math.E, y),
    ) - Math.PI / 4);

    return this.math.radToDeg(latRad);
  }

  formatGeoPoint(
    geoPoint: grider.GeoPoint,
    isCrop: boolean,
  ): grider.GeoPoint {
    if (geoPoint.lat > 90) {
      geoPoint.lat = 90;
    }

    if (geoPoint.lat < -90) {
      geoPoint.lat = -90;
    }

    if (geoPoint.lng > 180) {
      geoPoint.lng = isCrop ? 180 : this.reduceLng(geoPoint.lng);
    }

    if (geoPoint.lng < -180) {
      geoPoint.lng = isCrop ? -180 :  this.reduceLng(geoPoint.lng);
    }

    const result = {
      lat: this.formatSpherValue(geoPoint.lat),
      lng: this.formatSpherValue(geoPoint.lng),
    };

    return result;
  }

  formatSpherValue(value: number) {
    return +value.toFixed(7);
  }

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

  calcLngLoxEquation(
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): (lat: number) => number | void {
    return (lat: number) => this.calcLngByLatOnLox(lat, loxPoints);
  }

  calcLatLoxEquation(
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): (lng: number) => number {
    return (lng: number) => this.calcLatByLngOnLox(lng, loxPoints);
  }

  calcLngByLatOnLox(
    lat: number,
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): number | void {
    const [pointStart, pointEnd] = loxPoints;

    const y = this.spherLatToMercY(lat);
    const {x: x1, y: y1} = this.spherToMercRel(pointStart);
    const {x: x2, y: y2} = this.spherToMercRel(pointEnd);

    const x = this.geometry.calcXByYOnLine(y, [
      [x1, y1],
      [x2, y2],
    ]);

    if (x === undefined) return;

    const {lng} = this.mercToSpherRel({x, y});

    // TODO: add correction for loxes on 180 lng;

    return this.reduceLng(lng);
  }

  calcLatByLngOnLox(
    lng: number,
    loxPoints: [grider.GeoPoint, grider.GeoPoint],
  ): number {
    const [pointStart, pointEnd] = loxPoints;

    const x = this.spherLngToMercX(lng);
    const {x: x1, y: y1} = this.spherToMercRel(pointStart);
    const {x: x2, y: y2} = this.spherToMercRel(pointEnd);

    const pointStartRecalc = this.mercToSpherRel({x: x1, y: y1});

    // TODO: add correction for loxes on 180 lng;

    const y = this.geometry.calcYByXOnLine(x, [
      [x1, y1],
      [x2, y2],
    ]);

    const {lat} = this.mercToSpherRel({x, y});

    return this.reduceLng(lat);
  }

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

  getGridBreakpoints(initWidth: number, initHeight: number): {
    [key: number]: number,
  } {
    const cellsAmount = 3600000000 / initWidth;

    const growthCoofs = this.math
      .calcAreaCorrectionGrowthCoofs(cellsAmount);

    let coof = 1;

    const breakPoints = growthCoofs.reduce((breakPoints: any, value: number) => {
      coof *= value;

      const cosLat = 1 / (value * coof);
      let breakpoint: number = this.math.radToDeg(Math.acos(cosLat));

      breakpoint = (
        Math.round((breakpoint * 10000000 / (initHeight))) - 0.5
      ) * initHeight;

      breakpoint = +(breakpoint / 10000000).toFixed(7);

      breakPoints[breakpoint] = coof;

      return breakPoints;
    }, {}) as {
      [key: number]: number,
    };

    return breakPoints;
  }

  stringifyGeoPoints(polyGeoPoints: grider.GeoPoint[]): string[] {
    return polyGeoPoints.map((item) => `${item.lat} ${item.lng}`);
  }

  serializePoly(polyGeoPoints: grider.GeoPoint[]): string {
    const strPoints = this.stringifyGeoPoints(polyGeoPoints);

    strPoints.push(strPoints[0]);

    return `POLYGON((${strPoints.join(',')}))`;
  }

  serializeMultiPoint(polyGeoPoints: grider.GeoPoint[]): string {
    const strPoints = this.stringifyGeoPoints(polyGeoPoints);

    return `MULTIPOINT(${strPoints.join(',')})`;
  }

  parsePoly(polyStr: string): grider.GeoPoint[] {
    const points = polyStr.slice(9, -2)
      .split(',')
      .map((point) => {
        const coords = point.split(' ');
        return {
          lat: +coords[0],
          lng: +coords[1],
        };
      });

    return points;
  }
}
