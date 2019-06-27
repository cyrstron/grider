import {GridPoint} from '../points/grid-point';
import {GeoSegment} from '../segments/geo-segment';
import {GridParams} from '../grid-params';

export class GridSegment {
  constructor(
    public pointA: GridPoint, 
    public pointB: GridPoint,
  ) {}

  static fromGeo(
    {pointA, pointB}: GeoSegment,
    params: GridParams
  ): GridSegment {
    return new GridSegment(
      pointA.toGrid(params),
      pointB.toGrid(params),
    );
  }

  get averagePoint(): GridPoint {
    const {i: i1, j: j1, k: k1, params} = this.pointA;
    const {i: i2, j: j2, k: k2} = this.pointA;

    return new GridPoint(
      params,
      (i1 + i2) / 2,
      (j1 + j2) / 2,
      k1 !== undefined && k2 !== undefined ? (k1 + k2) / 2 : undefined,
    );
  }
}