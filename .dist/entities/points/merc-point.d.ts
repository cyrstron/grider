import { Point } from './point';
export declare class MercPoint extends Point {
    constructor(x: number, y: number);
    toFormatted(): MercPoint;
    toOppositeHemisphere(): MercPoint;
    isCloserThroughAntiMeridian(point: MercPoint): boolean;
    calcMercDistance(pointB: MercPoint): number;
    toSphereLiteral(): grider.GeoPoint;
    toSemiSphereLiteral(): grider.GeoPoint;
    isEasternTo(point: MercPoint): boolean;
    isWesternTo(point: MercPoint): boolean;
    isNorthernTo(point: MercPoint): boolean;
    isSouthernTo(point: MercPoint): boolean;
}
