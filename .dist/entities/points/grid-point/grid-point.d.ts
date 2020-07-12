import { GridParams } from '../../grid-params';
import { GeoPoint } from '../geo-point';
export declare class GridPoint {
    i: number;
    j: number;
    k?: number;
    params: GridParams;
    constructor(params: GridParams, i: number, j: number, k?: number);
    toFormatted(): GridPoint;
    isEasternTo(point: GridPoint): boolean;
    isWesternTo(point: GridPoint): boolean;
    isNorthernTo(point: GridPoint): boolean;
    isSouthernTo(point: GridPoint): boolean;
    isEqual(point: GridPoint): boolean;
    toGeo(): GeoPoint;
    isCloserThroughAntiMeridian(point: GridPoint): boolean;
    toOppositeHemisphere(): GridPoint;
    onSameLineWith(prevPoint: GridPoint, nextPoint: GridPoint): boolean;
    toPlain(): grider.GridPoint;
    static fromPlain({ i, j, k }: grider.GridPoint, params: GridParams): GridPoint;
    static fromGeo(point: GeoPoint, params: GridParams): GridPoint;
}
