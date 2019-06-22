import {MercSegment} from './merc-segment';
import {GeoPoint} from '../points/geo-point';

export class GeoSegment {
  constructor(
    public pointA: GeoPoint,
    public pointB: GeoPoint,
  ) {}

  toMerc(): MercSegment {
    const pointA = this.pointA.toMerc();
    const pointB = this.pointB.toMerc();

    return new MercSegment(pointA, pointB);
  }

  toOppositeHemisphere(): GeoSegment {
    const pointA = this.pointA.toOppositeHemisphere();
    const pointB = this.pointB.toOppositeHemisphere();

    return new GeoSegment(pointA, pointB);
  }

  intersectionPoint(segment: GeoSegment): GeoPoint | undefined {
    let segmentA: GeoSegment = this;
    let segmentB: GeoSegment = segment;

    const isAntiMeridian = this.isAntiMeridian || segment.isAntiMeridian;

    if (isAntiMeridian) {
      segmentA = segmentA.toOppositeHemisphere();
      segmentB = segmentB.toOppositeHemisphere();
    }
    
    const mercSegmentA = segmentA.toMerc();
    const mercSegmentB = segmentB.toMerc();
    const mercInersection = mercSegmentA.intersectionPoint(mercSegmentB);

    if (!mercInersection) return;

    const intersection = mercInersection.toSphere();

    return isAntiMeridian ? intersection.toOppositeHemisphere() : intersection;
  }

  closestToPoint(point: GeoPoint): GeoPoint {
    const {isAntiMeridian} = this;

    let segment: GeoSegment = this;

    if (isAntiMeridian) {
      segment = segment.toOppositeHemisphere();
      point = point.toOppositeHemisphere();
    }

    const mercPoint = point.toMerc();
    const mercSegment = segment.toMerc();
    const closest = mercSegment.closestToPoint(mercPoint).toSphere();

    return isAntiMeridian ? closest.toOppositeHemisphere() : closest;
  }

  get isAntiMeridian(): boolean {
    return this.pointA.isCloserThroughAntiMeridian(this.pointB);
  }

  get isParallel(): boolean {
    return this.pointA.lat === this.pointB.lat;
  }

  get isMeridian(): boolean {
    return this.pointA.lat === this.pointB.lat;
  }

  get easternPoint(): GeoPoint {
    if (this.isMeridian) {
      return this.pointA;
    }

    return this.pointA.isEasternTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }

  get westernPoint(): GeoPoint {
    if (this.isMeridian) {
      return this.pointA;
    }

    return this.pointA.isWesternTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }

  get northernPoint(): GeoPoint {
    if (this.isParallel) {
      return this.pointA;
    }

    return this.pointA.isNorthernTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }

  get southernPoint(): GeoPoint {
    if (this.isParallel) {
      return this.pointA;
    }

    return this.pointA.isSouthernTo(this.pointB) ?
      this.pointA :
      this.pointB;
  }
}