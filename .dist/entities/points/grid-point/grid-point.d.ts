import { GridParams } from '../../grid-params';
import { GeoPoint } from '../geo-point';
export declare class GridPoint {
    static fromGeo(point: GeoPoint, params: GridParams): GridPoint;
    i: number;
    j: number;
    k?: number;
    params: GridParams;
    constructor(params: GridParams, i: number, j: number, k?: number);
    toFormatted(): GridPoint;
    isEasternTo(center: GridPoint): boolean;
    isWesternTo(center: GridPoint): boolean;
    isNorthernTo(center: GridPoint): boolean;
    isSouthernTo(center: GridPoint): boolean;
    isEqual(point: GridPoint): boolean;
    toGeo(): GeoPoint;
    onSameAxis(prevPoint: GridPoint, nextPoint: GridPoint): boolean;
}
