import {Point} from '../points/point';
import {Vector} from '../vectors/vector';

export class Line {

  get isParallelToAxisX(): boolean {
    return this.b === 0;
  }

  get isParallelToAxisY(): boolean {
    return this.a === 0;
  }

  static fromTwoPoints(
    {x: x1, y: y1}: Point,
    {x: x2, y: y2}: Point,
  ): Line {
    return new Line(
      y1 - y2,
      x2 - x1,
      -((x1 * y2) - (y1 * x2)),
    );
  }
  constructor(
    public a: number,
    public b: number,
    public c: number,
  ) {}

  calcAlikePoint(point: Point): Point {
    const calcX = this.xByY(point.y);
    const calcY = this.yByX(point.x);

    return new Point(
      calcX === undefined ? point.x : calcX,
      calcY === undefined ? point.y : calcY,
    );
  }

  hasPoint(point: Point): boolean {
    const alikePoint = this.calcAlikePoint(point);

    return alikePoint.isEqual(point);
  }

  xByY(y: number): number | undefined {
    if (this.isParallelToAxisY) return;

    return (this.c - this.b * y) / this.a;
  }

  yByX(x: number) {
    if (this.isParallelToAxisX) return;

    return (this.c - this.a * x) / this.b;
  }

  distanceToPoint(
    point: Point,
  ): number {
    const closestPoint = this.closestToPoint(point);

    return point.distanceToPoint(closestPoint);
  }

  getNormalVector(): Vector {
    return new Vector(this.a, this.b);
  }

  closestToPoint(
    point: Point,
  ): Point {
    const {x, y} = point;

    if (this.isParallelToAxisX) {
      return new Point(
        this.c / this.a,
        y,
      );
    } else if (this.isParallelToAxisY) {
      return new Point(
        x,
        this.c / this.b,
      );
    }

    const perpendicular = this.perpendicularByPoint(point);

    return this.intersectionPoint(perpendicular) as Point;
  }

  perpendicularByPoint(
    {x: x1, y: y1}: Point,
  ): Line {
    const {x, y} = this.getNormalVector();

    return new Line(
      1 / x,
      -(1 / y),
      (x1 / x) - (y1 / y),
    );
  }

  intersectionX({a, b, c}: Line): number | undefined {
    const delta = this.a * b - this.b * a;
    const deltaX = this.c * b - this.b * c;

    if (!delta) return;

    return deltaX / delta;
  }

  intersectionY({a, b, c}: Line): number | undefined {
    const delta = this.a * b - this.b * a;
    const deltaY = this.a * c - this.c * a;

    if (!delta) return;

    return deltaY / delta;
  }

  intersectionPoint(line: Line): Point | undefined {
    if (
      (line.isParallelToAxisX && this.isParallelToAxisX) ||
      (line.isParallelToAxisY && this.isParallelToAxisY)
    ) return;

    const {a, b, c} = line;

    let x;
    let y;

    if (line.isParallelToAxisX) {
      x = c / a;
    } else if (this.isParallelToAxisX) {
      x = this.c / this.a;
    } else {
      x = this.intersectionX(line);
    }

    if (line.isParallelToAxisY) {
      y = c / b;
    } else if (this.isParallelToAxisY) {
      y = this.c / this.b;
    } else {
      y = this.intersectionY(line);
    }

    if (x === undefined && y !== undefined) {
      x = this.xByY(y) || line.xByY(y);
    }

    if (x !== undefined && y === undefined) {
      y = this.yByX(x) || line.yByX(x);
    }

    if (x === undefined || y === undefined) return;

    return new Point(x, y);
  }
}
