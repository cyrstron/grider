import { GridParams } from '../../grid-params';
import { GeoPolygon } from '../../polygons/geo-polygon';
import { GeoPoint } from '../geo-point';
import { GridPoint } from '../grid-point';
export declare class PeakPoint extends GridPoint {
    readonly nearestPeaks: PeakPoint[];
    readonly nearestPeaksGeo: GeoPoint[];
    toFormatted(): PeakPoint;
    nearestNotSeparatedByPoly(polygon: GeoPolygon): PeakPoint[];
    static fromPlain({ i, j, k }: grider.GridPoint, params: GridParams): PeakPoint;
    static fromGeo(point: GeoPoint, params: GridParams): PeakPoint;
}
