import { Point } from '../points/point';
import { Vector } from '../vectors/vector';
export declare class Line {
    a: number;
    b: number;
    c: number;
    readonly isParallelToAxisX: boolean;
    readonly isParallelToAxisY: boolean;
    static fromTwoPoints({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): Line;
    constructor(a: number, b: number, c: number);
    calcAlikePoint(point: Point): Point;
    hasPoint(point: Point): boolean;
    xByY(y: number): number | undefined;
    yByX(x: number): number | undefined;
    distanceToPoint(point: Point): number;
    getNormalVector(): Vector;
    closestToPoint(point: Point): Point;
    perpendicularByPoint({ x: x1, y: y1 }: Point): Line;
    intersectionX({ a, b, c }: Line): number | undefined;
    intersectionY({ a, b, c }: Line): number | undefined;
    intersectionPoint(line: Line): Point | undefined;
}
