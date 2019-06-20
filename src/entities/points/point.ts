import {Line} from '../lines/line';
import {Segment} from '../segments/segment';

export class Point {
  constructor(
    public x: number, 
    public y: number,
  ) {}

  distanceToPoint(
    {x, y}: grider.Point,
  ): number {
    return Math.sqrt(
      Math.pow(x - this.x, 2) +
      Math.pow(y - this.y, 2),
    );
  }

  containedByLine(line: Line): boolean {
    return line.hasPoint(this);
  }

  containedBySegment(segment: Segment): boolean {
    return segment.hasPoint(this);
  }

  isEqual({x, y}: Point): boolean {
    return this.x === x && this.y === y;
  }

  distanceToLine(line: Line) {
    return line.distanceToPoint(this);
  }

  closestOnLine(line: Line): Point {
    return line.closestToPoint(this);
  }

  closestOnSegment(segment: Segment): Point {
    return segment.closestToPoint(this);
  }
}