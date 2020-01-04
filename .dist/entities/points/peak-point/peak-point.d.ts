import { GridParams } from '../../grid-params';
import { GeoPolygon } from '../../polygons/geo-polygon';
import { GeoPoint } from '../geo-point';
import { GridPoint } from '../grid-point';
export declare class PeakPoint extends GridPoint {
    readonly nearestPeaks: PeakPoint[];
    readonly nearestPeaksGeo: GeoPoint[];
    static fromGeo(point: GeoPoint, params: GridParams): PeakPoint;
    toFormatted(): PeakPoint;
    nearestNotSeparatedByPoly(polygon: GeoPolygon): PeakPoint[];
}
