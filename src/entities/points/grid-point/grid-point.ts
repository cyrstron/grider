import {GridParams} from '../../grid-params';
import {GeoPoint} from '../geo-point';
import {
  correctForGeo,
  correctForGrid,
} from './utils/corrector';
import {
  toGeo,
  toGrid,
} from './utils/transformer';

export class GridPoint {
  i: number;
  j: number;
  k?: number;
  params: GridParams;

  constructor(
    params: GridParams,
    i: number,
    j: number,
    k?: number,
  ) {
    this.params = params;
    this.i = i;
    this.j = j;
    this.k = k;
  }

  toFormatted(): GridPoint {
    return this;
  }

  isEasternTo(point: GridPoint): boolean {
    return this.toGeo().isEasternTo(point.toGeo());
  }

  isWesternTo(point: GridPoint): boolean {
    return this.toGeo().isWesternTo(point.toGeo());
  }

  isNorthernTo(point: GridPoint): boolean {
    return this.toGeo().isNorthernTo(point.toGeo());
  }

  isSouthernTo(point: GridPoint): boolean {
    return this.toGeo().isSouthernTo(point.toGeo());
  }

  isEqual(point: GridPoint): boolean {
    const {i: iA, j: jA, k: kA} = this.toFormatted();
    const {i: iB, j: jB, k: kB} = point.toFormatted();

    return (iA === iB) && (jA === jB) && (kA === kB);
  }

  toGeo(): GeoPoint {
    const {
      geoAxes: axesParams,
    } = this.params;

    const {lat, lng} = axesParams
      .reduce((geoPoint: grider.GeoPoint, axisParams: grider.Axis) => {
        geoPoint[axisParams.name] = toGeo(this, axisParams);

        return geoPoint;
      }, {} as grider.GeoPoint);

    const geoPoint = new GeoPoint(lat, lng);

    return correctForGeo(geoPoint, this.params);
  }

  isCloserThroughAntiMeridian(point: GridPoint): boolean {
    const pointA = this.toGeo();
    const pointB = point.toGeo();

    return pointA.isCloserThroughAntiMeridian(pointB);
  }

  toOppositeHemisphere(): GridPoint {
    const geoPoint = this.toGeo().toOppositeHemisphere();

    return GridPoint.fromGeo(geoPoint, this.params);
  }

  onSameLineWith(prevPoint: GridPoint, nextPoint: GridPoint): boolean {
    let pointA = this as GridPoint;
    let pointB = prevPoint as GridPoint;
    let pointC = nextPoint as GridPoint;

    if (
      pointA.isCloserThroughAntiMeridian(pointB) ||
      pointA.isCloserThroughAntiMeridian(pointC)
    ) {
      pointA = pointA.toOppositeHemisphere();
      pointB = pointB.toOppositeHemisphere();
      pointC = pointC.toOppositeHemisphere();

      console.log(pointA);
      console.log(pointB);
      console.log(pointC);
    }

    let diff = (
      (pointA.i - pointB.i) * (pointA.j - pointC.j) -
      (pointA.i - pointC.i) * (pointA.j - pointB.j)
    );

    if (this.params.type === 'hex') {
      diff *= 3;
    }

    return 0 === Math.round(diff);
  }

  static fromGeo(point: GeoPoint, params: GridParams): GridPoint {
    const correctedGeoPoint = correctForGrid(point, params);
    const {
      axes: axesParams,
    } = params;

    const {i, j, k} = axesParams.reduce((gridPoint: any, axisParams) => {
      gridPoint[axisParams.name] = toGrid(correctedGeoPoint, axisParams, params);

      return gridPoint;
    }, {}) as grider.GridPoint;

    return new GridPoint(params, i, j, k);
  }
}
