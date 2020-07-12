import {MercPoint} from '../points/merc-point';
import {Line} from './line';

export class MercLine extends Line {
  closestToPoint(point: MercPoint): MercPoint {
    const {x, y} = super.closestToPoint(point);

    return new MercPoint(x, y);
  }

  perpendicularByPoint(point: MercPoint): MercLine {
    const {a, b, c} = super.perpendicularByPoint(point);

    return new MercLine(a, b, c);
  }

  hasPoint(point: MercPoint): boolean {
    const interceptPoint = new MercPoint(
      this.xByY(point.y) || point.x,
      this.yByX(point.x) || point.y,
    );

    return interceptPoint.isEqual(point);
  }

  intersectionPoint(line: MercLine): MercPoint | undefined {
    const intersection = super.intersectionPoint(line);

    if (!intersection) return;

    const {x, y} = intersection;

    return new MercPoint(x, y);
  }

  static fromTwoPoints(pointA: MercPoint, pointB: MercPoint): MercLine {
    const {a, b, c} = Line.fromTwoPoints(pointA, pointB);

    return new MercLine(a, b, c);
  }
}
