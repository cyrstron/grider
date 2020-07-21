import { GridParams } from '../grid-params';
import { GeoPoint } from '../points/geo-point';
import { GridPoint } from '../points/grid-point';
import { PeakPoint } from '../points/peak-point';
import { GeoSegment } from './geo-segment';
export declare class CellSide extends GeoSegment {
    peakA: PeakPoint;
    peakB: PeakPoint;
    params: GridParams;
    constructor(pointA: GeoPoint, pointB: GeoPoint, peakA: PeakPoint, peakB: PeakPoint, params: GridParams);
    get averagePoint(): GridPoint;
    static fromPeaks(peakA: PeakPoint, peakB: PeakPoint): CellSide;
}
