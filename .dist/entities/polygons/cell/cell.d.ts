import { GridParams } from '../../grid-params';
import { CenterPoint } from '../../points/center-point';
import { GeoPoint } from '../../points/geo-point';
import { GridPoint } from '../../points/grid-point';
import { PeakPoint } from '../../points/peak-point';
import { CellSide } from '../../segments/cell-side';
import { GeoSegment } from '../../segments/geo-segment';
import { GeoPolygon } from '../geo-polygon/geo-polygon';
export declare class Cell extends GeoPolygon<CellSide> {
    readonly neighbors: {
        west: Cell | undefined;
        southWest: Cell;
        east: Cell | undefined;
        southEast: Cell;
        south: Cell | undefined;
        northEast: Cell;
        north: Cell | undefined;
        northWest: Cell;
    };
    readonly northNeighbors: {
        northEast: Cell | undefined;
        north: Cell | undefined;
        northWest: Cell | undefined;
    };
    readonly southNeighbors: {
        southWest: Cell | undefined;
        southEast: Cell | undefined;
        south: Cell | undefined;
    };
    readonly westNeighbors: {
        west: Cell | undefined;
        southWest: Cell | undefined;
        northWest: Cell | undefined;
    };
    readonly eastNeighbors: {
        east: Cell | undefined;
        southEast: Cell | undefined;
        northEast: Cell | undefined;
    };
    readonly northEastNeighbors: {
        northEast: Cell;
    };
    readonly southWestNeighbors: {
        southWest: Cell;
    };
    readonly northWestNeighbors: {
        northWest: Cell;
    };
    readonly southEastNeighbors: {
        southEast: Cell;
    };
    static fromCenter(center: CenterPoint): Cell;
    static fromGeoPoint(point: GeoPoint, params: GridParams): Cell;
    static fromGridPoint(point: GridPoint): Cell;
    static fromCenterPoint(point: CenterPoint): Cell;
    center: CenterPoint;
    peaks: PeakPoint[];
    constructor(center: CenterPoint);
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
