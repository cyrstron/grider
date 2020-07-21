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
    get isAntiMeridian(): boolean;
    get isParallelToAxisX(): boolean;
    get isParallelToAxisY(): boolean;
    get easternPoint(): MercPoint;
    get westernPoint(): MercPoint;
    get northernPoint(): MercPoint;
    get southernPoint(): MercPoint;
}
