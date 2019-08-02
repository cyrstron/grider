import {GridParams} from '../grid-params';
import { GeoPoint } from '../points/geo-point';
import {GridPoint} from '../points/grid-point';
import {PeakPoint} from '../points/peak-point';
import {GeoSegment} from './geo-segment';

export class CellSide extends GeoSegment {

  get averagePoint(): GridPoint {
    const {i: i1, j: j1, k: k1, params} = this.peakA;
    const {i: i2, j: j2, k: k2} = this.peakB;

    return new GridPoint(
      params,
      (i1 + i2) / 2,
      (j1 + j2) / 2,
      k1 !== undefined && k2 !== undefined ? (k1 + k2) / 2 : undefined,
    );
  }

  static fromPeaks(peakA: PeakPoint, peakB: PeakPoint) {
    const pointA = peakA.toGeo();
    const pointB = peakB.toGeo();

    return new CellSide(
      pointA,
      pointB,
      peakA,
      peakB,
      peakA.params,
    );
  }
  constructor(
    pointA: GeoPoint,
    pointB: GeoPoint,
    public peakA: PeakPoint,
    public peakB: PeakPoint,
    public params: GridParams,
  ) {
    super(pointA, pointB);
  }
}
