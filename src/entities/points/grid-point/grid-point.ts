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
import {
  roundHexGridPoint,
  roundRectGridPoint,
} from './utils/rounder';

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

  round(): GridPoint {
    const {type} = this.params;

    if (type === 'hex') {
      const {i, j, k} = this;

      const {
        i: roundedI, 
        j: roundedJ, 
        k: roundedK
      } = roundHexGridPoint({i, j, k: k as number});

      return new GridPoint(this.params, roundedI, roundedJ, roundedK);
    } else {
      const {i, j} = this;

      const {
        i: roundedI, 
        j: roundedJ
      } = roundRectGridPoint({i, j});

      return new GridPoint(this.params, roundedI, roundedJ);
    }
  }
}