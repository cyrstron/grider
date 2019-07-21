import {Line} from './line';
import { MercPoint } from '../points';

export class MercLine extends Line {
  calcAlikePoint(point: MercPoint): MercPoint {
    const {x, y} = super.calcAlikePoint(point);

    return new MercPoint(x, y);
  }

  closestToPoint(point: MercPoint): MercPoint {
    const {x, y} = super.closestToPoint(point);

    return new MercPoint(x, y);
  }

  perpendicularByPoint(point: MercPoint): MercLine {
    const {a, b, c} = super.perpendicularByPoint(point);

    return new MercLine(a, b, c);
  }

  intersectionPoint(line: MercLine): MercPoint | undefined {
    const intersection = super.intersectionPoint(line);

    if (!intersection) return;

    const {x, y} = intersection;

    return new MercPoint(x, y);
  }

  static fromTwoPoints(pointA: MercPoint, pointB: MercPoint): MercLine {
    const {a, b, c} = Line.fromTwoPoints(pointA, pointB);

    return new MercLine(a, b ,c);
  }
}