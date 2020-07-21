import { GridParams } from '../../grid-params';
import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { GridPoint } from '../../points/grid-point';
import { PeakPoint } from '../../points/peak-point';
import { CellSide } from '../../segments/cell-side';
import { GeoSegment } from '../../segments/geo-segment';
import { GeoPolygon } from '../geo-polygon/geo-polygon';
export declare class Cell extends GeoPolygon<CellSide> {
    center: CenterPoint;
    peaks: PeakPoint[];
    constructor(center: CenterPoint);
    get neighbors(): {
        west?: Cell;
        southWest: Cell;
        east?: Cell;
        southEast: Cell;
        south?: Cell;
        northEast: Cell;
        north?: Cell;
        northWest: Cell;
    };
    get northNeighbors(): {
        northEast?: Cell;
        north?: Cell;
        northWest?: Cell;
    };
    get southNeighbors(): {
        southWest?: Cell;
        southEast?: Cell;
        south?: Cell;
    };
    get westNeighbors(): {
        west?: Cell;
        southWest?: Cell;
        northWest?: Cell;
    };
    get eastNeighbors(): {
        east?: Cell;
        southEast?: Cell;
        northEast?: Cell;
    };
    get northEastNeighbors(): {
        northEast: Cell;
    };
    get southWestNeighbors(): {
        southWest: Cell;
    };
    get northWestNeighbors(): {
        northWest: Cell;
    };
    get southEastNeighbors(): {
        southEast: Cell;
    };
    static fromCenter(center: CenterPoint): Cell;
    static fromGeoPoint(point: GeoPoint, params: GridParams): Cell;
    static fromGridPoint(point: GridPoint): Cell;
    static fromCenterPoint(point: CenterPoint): Cell;
    findEqualGeoPoint(point: GeoPoint): GeoPoint | undefined;
    intersectedWithSegmentNeighbor(segment: GeoSegment): Cell | undefined;
    intersectedWithSegmentsNeighbors(segments: GeoSegment[]): Cell[];
    nearestPeaks(peak: PeakPoint): PeakPoint[];
    nearestPeaksGeo(peak: GeoPoint): GeoPoint[];
    prevPeak(peakPoint: PeakPoint): PeakPoint | undefined;
    nextPeak(peakPoint: PeakPoint): PeakPoint | undefined;
    prevPeakGeo(peakPoint: GeoPoint): GeoPoint | undefined;
    nextPeakGeo(peakPoint: GeoPoint): GeoPoint | undefined;
    nextPeakByIndex(index: number): PeakPoint;
    prevPeakByIndex(index: number): PeakPoint;
    isEqual(cell: Cell): boolean;
    sideByIndex(index: number): CellSide;
    nextCellBySide(cellSide: CellSide): Cell;
    containsPoint(point: GeoPoint): boolean;
    nearestToEndIntersectedSide(segment: GeoSegment): CellSide | undefined;
    nextCellOnSegment(segment: GeoSegment): Cell | undefined;
    isNeighbor(cell: Cell): boolean;
    commonPoints(cell: Cell): GeoPoint[];
    moveByDiff(iDiff: number, jDiff: number): Cell;
}
