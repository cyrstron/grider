import {Point} from '../points/point';
import {Line} from '../lines/line';

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
      pointB: {x :x2}            
    } = this;

    return Math.min(x1, x2);
  }

  get maxX(): number {
    const {
      pointA: {x: x1},
      pointB: {x :x2}            
    } = this;

    return Math.max(x1, x2);
  }

  get minY(): number {
    const {
      pointA: {y: y1},
      pointB: {y :y2}            
    } = this;

    return Math.min(y1, y2);
  }

  get maxY(): number {
    const {
      pointA: {y: y1},
      pointB: {y :y2}            
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
    const closestToLine = this.line.closestToPoint(point);

    if (closestToLine.x < this.minX) {
      return this.minXPoint;
    } else if (closestToLine.x > this.maxX) {
      return this.maxXPoint;
    } else if (closestToLine.y < this.minY) {
      return this.minYPoint;
    } else if (closestToLine.y > this.maxY) {
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
    segment: Segment
  ): Point | undefined {
    const intersection = this.line.intersectionPoint(segment.line);

    const isIntersectValid = !!intersection &&
      this.hasPoint(intersection) &&
      segment.hasPoint(intersection);

    return isIntersectValid ? intersection : undefined;
  } 
}