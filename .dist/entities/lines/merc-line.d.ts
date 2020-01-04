import { MercPoint } from '../points/merc-point';
import { Line } from './line';
export declare class MercLine extends Line {
    static fromTwoPoints(pointA: MercPoint, pointB: MercPoint): MercLine;
    calcAlikePoint(point: MercPoint): MercPoint;
    closestToPoint(point: MercPoint): MercPoint;
    perpendicularByPoint(point: MercPoint): MercLine;
    intersectionPoint(line: MercLine): MercPoint | undefined;
}
