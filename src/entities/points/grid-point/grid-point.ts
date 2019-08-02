import {GridParams} from '../../grid-params';
// import {CenterPoint} from '../center-point';
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

  static fromGeo(point: GeoPoint, params: GridParams) {
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

  isEasternTo(center: GridPoint): boolean {
    return this.toGeo().isEasternTo(center.toGeo());
  }

  isWesternTo(center: GridPoint): boolean {
    return this.toGeo().isWesternTo(center.toGeo());
  }

  isNorthernTo(center: GridPoint): boolean {
    return this.toGeo().isNorthernTo(center.toGeo());
  }

  isSouthernTo(center: GridPoint): boolean {
    return this.toGeo().isSouthernTo(center.toGeo());
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

  // round(): CenterPoint {
  //   return CenterPoint.fromGrid(this);
  // }

  onSameAxis(prevPoint: GridPoint, nextPoint: GridPoint) {
    let diff = (
      (this.i - prevPoint.i) * (this.j - nextPoint.j) -
      (this.i - nextPoint.i) * (this.j - prevPoint.j)
    );

    if (this.params.type === 'hex') {
      diff *= 3;
    }

    return 0 === Math.round(diff);
  }
}
