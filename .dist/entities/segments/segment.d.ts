import { Line } from '../lines/line';
import { Point } from '../points/point';
export declare class Segment {
    pointA: Point;
    pointB: Point;
    line: Line;
    constructor(pointA: Point, pointB: Point);
    get minX(): number;
    get maxX(): number;
    get minY(): number;
    get maxY(): number;
    get minXPoint(): Point;
    get maxXPoint(): Point;
    get minYPoint(): Point;
    get maxYPoint(): Point;
    closestToPoint(point: Point): Point;
    hasPoint(point: Point): boolean;
    intersectionPoint(segment: Segment): Point | undefined;
}
