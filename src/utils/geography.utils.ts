import {constants} from '../constants';
import {MathUtils} from './math.utils';

export class GeographyUtils {
  mathUtils: MathUtils;
  constants: any;

  constructor(mathUtils: MathUtils) {
    this.mathUtils = mathUtils;
    this.constants = constants;
  }

  sphericalToMercator(
    point: grider.GeoPoint,
    isAbsolute: boolean = false,
  ): grider.GeoPoint {
    const R: number = isAbsolute ? this.constants.radius : 90;

    let lat = this.mathUtils.degToRad(point.lat);
    let lng = this.mathUtils.degToRad(point.lng);

    lat = R * Math.log(
      Math.tan(
        (Math.PI / 4 + lat / 2),
      ),
    );

    lng = R * lng;

    return {
      lat,
      lng,
    };
  }

  mercatorToSpherical(
    point: grider.GeoPoint,
    isAbsolute: boolean = false,
  ): grider.GeoPoint {
    const R = isAbsolute ? this.constants.radius : 90;

    let lng = point.lng / R;
    let lat = 2 * (Math.atan(
      Math.pow(Math.E, (point.lat / R)),
    ) - Math.PI / 4);

    lat = this.mathUtils.radToDeg(lat),
    lng = this.mathUtils.radToDeg(lng);

    return {
      lat,
      lng,
    };
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
      geoPoint.lng = isCrop ? 180 : geoPoint.lng - 360;
    }

    if (geoPoint.lng < -180) {
      geoPoint.lng = isCrop ? -180 : geoPoint.lng + 360;
    }

    const result = {
      lat: +geoPoint.lat.toFixed(7),
      lng: +geoPoint.lng.toFixed(7),
    };

    return result;
  }

  calcInitialCellWidth(
    desiredSize: number,
    sizeCoof: number,
  ): number {
    const minWidth = this.constants.equatorLength / 3600000000;
    const relPolyWidth = Math.round(desiredSize / minWidth);
    let result = this.mathUtils.calcClosestMultiple(relPolyWidth, 3600000000);

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

    let result = this.mathUtils.calcClosestMultiple(relPolyWidth, 1800000000);

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

    const growthCoofs = this.mathUtils
      .calcAreaCorrectionGrowthCoofs(cellsAmount);

    let coof = 1;

    const breakPoints = growthCoofs.reduce((breakPoints: any, value: number) => {
      coof *= value;

      const cosLat = 1 / (value * coof);
      let breakpoint: number = this.mathUtils.radToDeg(Math.acos(cosLat));

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
