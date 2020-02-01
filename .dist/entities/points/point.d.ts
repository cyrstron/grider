import { Line } from '../lines/line';
import { Segment } from '../segments/segment';
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    distanceToPoint({ x, y }: grider.Point): number;
    toFormatted(): Point;
    toPlain(): grider.Point;
    containedByLine(line: Line): boolean;
    containedBySegment(segment: Segment): boolean;
    isEqual(point: Point): boolean;
    distanceToLine(line: Line): number;
    closestOnLine(line: Line): Point;
    closestOnSegment(segment: Segment): Point;
    static fromPlain({ x, y }: grider.Point): Point;
}
