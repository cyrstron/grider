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

  toFormatted(): Point {
    return this;
  }

  containedByLine(line: Line): boolean {
    return line.hasPoint(this);
  }

  containedBySegment(segment: Segment): boolean {
    const isContained = segment.hasPoint(this);

    return isContained;
  }

  isEqual(point: Point): boolean {
    const formattedA = this.toFormatted();
    const formattedB = point.toFormatted();

    const isEqual = formattedA.x === formattedB.x && 
      formattedA.y === formattedB.y;

    return isEqual;
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