import { Point } from './point';
export declare class MercPoint extends Point {
    constructor(x: number, y: number);
    toFormatted(): MercPoint;
    toOppositeHemisphere(): MercPoint;
    calcMercDistance(pointB: MercPoint): number;
    isCloserThroughAntiMeridian(point: MercPoint): boolean;
    toSphereLiteral(): grider.GeoPoint;
    toSemiSphereLiteral(): grider.GeoPoint;
    isEasternTo(point: MercPoint): boolean;
    isWesternTo(point: MercPoint): boolean;
    isNorthernTo(point: MercPoint): boolean;
    isSouthernTo(point: MercPoint): boolean;
}
