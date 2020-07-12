import { MercPoint } from '../points/merc-point';
import { Line } from './line';
export declare class MercLine extends Line {
    closestToPoint(point: MercPoint): MercPoint;
    perpendicularByPoint(point: MercPoint): MercLine;
    hasPoint(point: MercPoint): boolean;
    intersectionPoint(line: MercLine): MercPoint | undefined;
    static fromTwoPoints(pointA: MercPoint, pointB: MercPoint): MercLine;
}
