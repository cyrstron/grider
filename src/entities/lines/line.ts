import {Point} from '../points/point';
import {Vector} from '../vectors/vector';

export class Line {
  constructor(
    public a: number,
    public b: number,
    public c: number,
  ) {}

  get isParallelToAxisY(): boolean {
    return this.b === 0;
  }

  get isParallelToAxisX(): boolean {
    return this.a === 0;
  }

  xByY(y: number): number | undefined {
    if (this.isParallelToAxisX) return;

    return (-this.c - this.b * y) / this.a;
  }

  yByX(x: number): number | undefined {
    if (this.isParallelToAxisY) return;

    return (-this.c - this.a * x) / this.b;
  }

  calcPointThroughLine(point: Point): Point {
    const calcX = this.xByY(point.y);
    const calcY = this.yByX(point.x);

    return new Point(
      calcX === undefined ? point.x : calcX,
      calcY === undefined ? point.y : calcY,
    );
  }

  hasPoint(point: Point): boolean {
    const calcedPoint = this.calcPointThroughLine(point);

    return calcedPoint.isEqual(point);
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

    if (this.isParallelToAxisY) {
      return new Point(
        this.xByY(y) as number,
        y,
      );
    } else if (this.isParallelToAxisX) {
      return new Point(
        x,
        this.yByX(x) as number,
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
      -(x1 / x) - (y1 / y),
    );
  }

  intersectionX(line: Line): number | undefined {
    const {a, b, c} = line;

    if (line.isParallelToAxisY) {
      return - c / a;
    } else if (this.isParallelToAxisY) {
      return - this.c / this.a;
    }

    const deltaX = this.b * c - this.c * b;
    const delta = this.a * b - this.b * a;

    if (!delta) return;

    return deltaX / delta;
  }

  intersectionY(line: Line): number | undefined {
    const {a, b, c} = line;

    if (line.isParallelToAxisX) {
      return - c / b;
    } else if (this.isParallelToAxisX) {
      return - this.c / this.b;
    }

    const deltaY = this.a * c - this.c * a;
    const delta = this.b * a - this.a * b;

    return deltaY / delta;
  }

  intersectionPoint(line: Line): Point | undefined {
    let x = this.intersectionX(line);
    let y = this.intersectionY(line);

    if (x === undefined && y !== undefined) {
      x = this.xByY(y) || line.xByY(y);
    }

    if (x !== undefined && y === undefined) {
      y = this.yByX(x) || line.yByX(x);
    }

    if (x === undefined || y === undefined) return;

    return new Point(x, y);
  }

  static fromTwoPoints(
    {x: x1, y: y1}: Point,
    {x: x2, y: y2}: Point,
  ): Line {
    return new Line(
      y1 - y2,
      x2 - x1,
      (x1 * y2) - (y1 * x2),
    );
  }
}
