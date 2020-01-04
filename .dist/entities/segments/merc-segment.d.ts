import { MercLine } from '../lines/merc-line';
import { MercPoint } from '../points/merc-point';
import { Segment } from './segment';
export declare class MercSegment extends Segment {
    pointA: MercPoint;
    pointB: MercPoint;
    line: MercLine;
    constructor(pointA: MercPoint, pointB: MercPoint);
    toOppositeHemisphere(): MercSegment;
    intersectionPoint(segment: MercSegment): MercPoint | undefined;
    closestToPoint(point: MercPoint): MercPoint;
    readonly isAntiMeridian: boolean;
    readonly isParallelToAxisX: boolean;
    readonly isParallelToAxisY: boolean;
    readonly easternPoint: MercPoint;
    readonly westernPoint: MercPoint;
    readonly northernPoint: MercPoint;
    readonly southernPoint: MercPoint;
}
