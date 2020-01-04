import { Line } from '../lines/line';
import { Point } from '../points/point';
export declare class Segment {
    pointA: Point;
    pointB: Point;
    line: Line;
    constructor(pointA: Point, pointB: Point);
    readonly minX: number;
    readonly maxX: number;
    readonly minY: number;
    readonly maxY: number;
    readonly minXPoint: Point;
    readonly maxXPoint: Point;
    readonly minYPoint: Point;
    readonly maxYPoint: Point;
    closestToPoint(point: Point): Point;
    hasPoint(point: Point): boolean;
    intersectionPoint(segment: Segment): Point | undefined;
}
