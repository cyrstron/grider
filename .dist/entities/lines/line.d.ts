import { Point } from '../points/point';
import { Vector } from '../vectors/vector';
export declare class Line {
    a: number;
    b: number;
    c: number;
    constructor(a: number, b: number, c: number);
    get isParallelToAxisY(): boolean;
    get isParallelToAxisX(): boolean;
    xByY(y: number): number | undefined;
    yByX(x: number): number | undefined;
    hasPoint(point: Point): boolean;
    isEqual(line: Line): boolean;
    distanceToPoint(point: Point): number;
    getNormalVector(): Vector;
    perpendicularByPoint({ x: x1, y: y1 }: Point): Line;
    closestToPoint(point: Point): Point;
    intersectionX(line: Line): number | undefined;
    intersectionY(line: Line): number | undefined;
    intersectionPoint(line: Line): Point | undefined;
    static fromTwoPoints({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): Line;
}
