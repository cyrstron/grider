import { MercLine } from '../lines/merc-line';
import {MercPoint} from '../points/merc-point';
import {Segment} from './segment';

export class MercSegment extends Segment {
  line: MercLine;

  constructor(
    public pointA: MercPoint,
    public pointB: MercPoint,
  ) {
    super(pointA, pointB);

    this.line = MercLine.fromTwoPoints(pointA, pointB);
  }

  // toSphere(): GeoSegment {
  //   const pointA = this.pointA.toSphere();
  //   const pointB = this.pointB.toSphere();

  //   return new GeoSegment(pointA, pointB);
  // }

  toOppositeHemisphere(): MercSegment {
    const pointA = this.pointA.toOppositeHemisphere();
    const pointB = this.pointB.toOppositeHemisphere();

    return new MercSegment(pointA, pointB);
  }

  intersectionPoint(segment: MercSegment): MercPoint | undefined {
    if (!this.isAntiMeridian && !segment.isAntiMeridian) {
      const point = super.intersectionPoint(segment);

      return point && new MercPoint(point.x, point.y);
    }

    const segmentA = this.toOppositeHemisphere();
    const segmentB = segment.toOppositeHemisphere();

    const intersection = segmentA.intersectionPoint(segmentB);

    return intersection && intersection.toOppositeHemisphere();
  }

  closestToPoint(point: MercPoint): MercPoint {
    if (!this.isAntiMeridian) {
      const closest = super.closestToPoint(point);

      return new MercPoint(closest.x, closest.y);
    }

    const segment = this.toOppositeHemisphere();
    point = point.toOppositeHemisphere();

    return segment.closestToPoint(point).toOppositeHemisphere();
  }

  get isAntiMeridian(): boolean {
    return this.pointA.isCloserThroughAntiMeridian(this.pointB);
  }

  get isParallelToAxisX(): boolean {
    return this.line.isParallelToAxisX;
  }

  get isParallelToAxisY(): boolean {
    return this.line.isParallelToAxisY;
  }

  get easternPoint(): MercPoint {
    if (this.isParallelToAxisY) {
      return this.pointA;
    }

    return this.pointA.isEasternTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }

  get westernPoint(): MercPoint {
    if (this.isParallelToAxisY) {
      return this.pointA;
    }

    return this.pointA.isWesternTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }

  get northernPoint(): MercPoint {
    if (this.isParallelToAxisX) {
      return this.pointA;
    }

    return this.pointA.isNorthernTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }

  get southernPoint(): MercPoint {
    if (this.isParallelToAxisX) {
      return this.pointA;
    }

    return this.pointA.isSouthernTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }
}
