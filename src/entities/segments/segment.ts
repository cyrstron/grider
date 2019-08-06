import {Line} from '../lines/line';
import {Point} from '../points/point';

export class Segment {
  line: Line;

  constructor(
    public pointA: Point,
    public pointB: Point,
  ) {
    this.line = Line.fromTwoPoints(pointA, pointB);
  }

  get minX(): number {
    const {
      pointA: {x: x1},
      pointB: {x : x2},
    } = this;

    return Math.min(x1, x2);
  }

  get maxX(): number {
    const {
      pointA: {x: x1},
      pointB: {x : x2},
    } = this;

    return Math.max(x1, x2);
  }

  get minY(): number {
    const {
      pointA: {y: y1},
      pointB: {y : y2},
    } = this;

    return Math.min(y1, y2);
  }

  get maxY(): number {
    const {
      pointA: {y: y1},
      pointB: {y : y2},
    } = this;

    return Math.max(y1, y2);
  }

  get minXPoint() {
    const {x} = this.pointA;

    return this.minX === x ? this.pointA : this.pointB;
  }

  get maxXPoint() {
    const {x} = this.pointA;

    return this.maxX === x ? this.pointA : this.pointB;
  }

  get minYPoint() {
    const {y} = this.pointA;

    return this.minY === y ? this.pointA : this.pointB;
  }

  get maxYPoint() {
    const {y} = this.pointA;

    return this.maxY === y ? this.pointA : this.pointB;
  }

  closestToPoint(point: Point): Point {
    const closestToLine = this.line.closestToPoint(point)
      .toFormatted();

    const {x: x1, y: y1} = this.pointA.toFormatted();
    const {x: x2, y: y2} = this.pointB.toFormatted();

    if (closestToLine.x < Math.min(x1, x2)) {
      return this.minXPoint;
    } else if (closestToLine.x > Math.max(x1, x2)) {
      return this.maxXPoint;
    } else if (closestToLine.y < Math.min(y1, y2)) {
      return this.minYPoint;
    } else if (closestToLine.y > Math.max(y1, y2)) {
      return this.maxYPoint;
    } else {
      return closestToLine;
    }
  }

  hasPoint(point: Point): boolean {
    const {
      pointA,
      pointB,
    } = this;

    const {x, y} = point.toFormatted();
    const {x: x1, y: y1} = pointA.toFormatted();
    const {x: x2, y: y2} = pointB.toFormatted();

    return this.line.hasPoint(point) &&
      Math.max(x1, x2) >= x &&
      Math.min(x1, x2) <= x &&
      Math.max(y1, y2) >= y &&
      Math.min(y1, y2) <= y;
  }

  intersectionPoint(
    segment: Segment,
  ): Point | undefined {
    if (
      (this.line.a === segment.line.a) ||
      (this.line.b === segment.line.b)
    ) return undefined;

    const intersection = this.line.intersectionPoint(segment.line);

    if (!intersection) return undefined;

    let segmentAHasPoint: boolean;
    let segmentBHasPoint: boolean;

    const maxXA = Math.max(this.pointA.x, this.pointB.x);
    const minXA = Math.min(this.pointA.x, this.pointB.x);
    const maxYA = Math.max(this.pointA.y, this.pointB.y);
    const minYA = Math.min(this.pointA.y, this.pointB.y);

    const maxXB = Math.max(segment.pointA.x, segment.pointB.x);
    const minXB = Math.min(segment.pointA.x, segment.pointB.x);
    const maxYB = Math.max(segment.pointA.y, segment.pointB.y);
    const minYB = Math.min(segment.pointA.y, segment.pointB.y);

    if (this.line.a === 0) {
      segmentAHasPoint = intersection.x <= maxXA && intersection.x >= minXA &&
        maxYB >= maxYA && minYB <= minYA;
    } else if (this.line.b === 0) {
      segmentAHasPoint = intersection.y <= maxYA && intersection.y >= minYA &&
        maxXB >= maxXA && minXB <= minXA;
    } else {
      segmentAHasPoint = this.hasPoint(intersection);
    }

    if (segment.line.a === 0) {
      segmentBHasPoint = intersection.x <= maxXB && intersection.x >= minXB &&
        maxYA >= maxYB && minYA <= minYB;
    } else if (segment.line.b === 0) {
      segmentBHasPoint = intersection.y <= maxYB && intersection.y >= minYB &&
        maxXA >= maxXB && minXA <= minXB;
    } else {
      segmentBHasPoint = segment.hasPoint(intersection);
    }

    const isIntersectValid = segmentAHasPoint && segmentBHasPoint;

    return isIntersectValid ? intersection : undefined;
  }
}
