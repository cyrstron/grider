import {MercSegment} from './merc-segment';
import {GeoPoint} from '../points/geo-point';
import {RhumbLine} from '../lines/rhumb-line';
import {GeoPolygon} from '../polygons/geo-polygon/geo-polygon';

export class GeoSegment {
  rhumbLine: RhumbLine;

  constructor(
    public pointA: GeoPoint,
    public pointB: GeoPoint,
  ) {
    this.rhumbLine = RhumbLine.fromTwoGeoPoints(pointA, pointB);
  }

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

  intersectsWithPoly(poly: GeoPolygon): GeoPoint[] {
    return poly.intersectsWithSegment(this);
  }

  intersects(segment: GeoSegment): boolean {
    return !!this.intersectionPoint(segment);
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

  isEqual({pointA, pointB}: GeoSegment) {
    return (
      this.pointA.isEqual(pointA) && this.pointB.isEqual(pointB)
    ) || (
      this.pointA.isEqual(pointB) && this.pointB.isEqual(pointA)
    );
  }

  mercDistanceToPoint(point: GeoPoint): number {
    const closestPoint = this.closestToPoint(point);

    return point.calcMercDistance(closestPoint);
  }

  latByLng(lng: number): number | undefined {
    const lat = this.rhumbLine.latByLng(lng);

    if (lat === undefined) return;

    if (!this.containsLat(lat)) return;

    return lat;
  }

  lngByLat(lat: number): number | undefined {
    const lng = this.rhumbLine.lngByLat(lat);

    if (lng === undefined) return;

    if (!this.containsLng(lng)) return;

    return lng;
  }

  get points() {
    return [this.pointA, this.pointB];
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

  containsLat(lat: number): boolean {
    const {lat: latA} = this.pointA;
    const {lat: latB} = this.pointB;

    return Math.max(latA, latB) > lat &&
      Math.min(latA, latB) < lat;
  }

  containsLng(lng: number): boolean {
    const {lng: lngA} = this.pointA;
    const {lng: lngB} = this.pointB;

    const maxLng = Math.max(lngA, lngB);
    const minLng = Math.min(lngA, lngB);

    if (!this.isAntiMeridian) {
      return maxLng > lng && minLng < lng;
    } else {
      return (maxLng < lng && lng < 360) ||
        (minLng > lng && lng > 0);
    }   
  }
}