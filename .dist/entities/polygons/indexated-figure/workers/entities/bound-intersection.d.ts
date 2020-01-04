import { GeoPoint } from '../../../../points/geo-point';
import { GeoPolygon } from '../../../geo-polygon';
export declare class BoundIntersection {
    intersection: GeoPoint;
    bound: number;
    boundKey: grider.Cardinal;
    toIndex?: number | undefined;
    toPoint?: GeoPoint | undefined;
    static fromPoints(points: GeoPoint[], indexA: number, indexB: number, tilePoly: GeoPolygon, bound: number, boundKey: grider.Cardinal): BoundIntersection | undefined;
    constructor(intersection: GeoPoint, bound: number, boundKey: grider.Cardinal, toIndex?: number | undefined, toPoint?: GeoPoint | undefined);
}
