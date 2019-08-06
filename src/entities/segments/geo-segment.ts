import {formatLat, formatLng} from '../../utils/geo.utils';
import {RhumbLine} from '../lines/rhumb-line';
import {GeoPoint} from '../points/geo-point';
import {GeoPolygon} from '../polygons/geo-polygon/geo-polygon';
import {MercSegment} from './merc-segment';

export class GeoSegment {

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

  static segmentsFromPointsByLng(points: GeoPoint[]) {
    const sorted = points.sort(({lng: lngA}, {lng: lngB}) => lngA - lngB);

    const easternIndex = sorted.reduce((easternIndex, point, index) => {
      return sorted[easternIndex].isEasternTo(point) ? index : easternIndex;
    }, 0);

    return [
      ...sorted.slice(easternIndex),
      ...sorted.slice(0, easternIndex),
    ].reduce((
      splitSegments: GeoSegment[],
      point,
      index,
      sorted,
    ): GeoSegment[] => {
      if (index % 2) return splitSegments;

      const splitSegment = new GeoSegment(sorted[index + 1], point);

      splitSegments.push(splitSegment);

      return splitSegments;
    }, []);
  }

  static segmentsFromPointsByLat(points: GeoPoint[]) {
    const sorted = points.sort(({lat: latA}, {lat: latB}) => latA - latB);

    return sorted.reduce((
        splitSegments: GeoSegment[],
        point,
        index,
        sorted,
      ): GeoSegment[] => {
        if (index % 2) return splitSegments;

        const splitSegment = new GeoSegment(sorted[index + 1], point);

        splitSegments.push(splitSegment);

        return splitSegments;
      }, []);
  }
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

    const intersection = GeoPoint.fromMerc(mercInersection);

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
    const mercClosest = mercSegment.closestToPoint(mercPoint);
    const closest = GeoPoint.fromMerc(mercClosest);

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
    if (!this.containsLng(lng)) return;

    const lat = this.rhumbLine.latByLng(lng);

    if (lat === undefined) return;

    if (this.rhumbLine.a !== 0 && !this.containsLat(lat)) return;

    return lat;
  }

  lngByLat(lat: number): number | undefined {
    if (!this.containsLat(lat)) return;

    const lng = this.rhumbLine.lngByLat(lat);

    if (lng === undefined) return;

    if (this.rhumbLine.b !== 0 && !this.containsLng(lng)) return;

    return lng;
  }

  containsLat(lat: number): boolean {
    lat = formatLat(lat);

    const {lat: latA} = this.pointA.toFormatted();
    const {lat: latB} = this.pointB.toFormatted();

    return Math.max(latA, latB) >= lat &&
      Math.min(latA, latB) <= lat;
  }

  containsLng(lng: number): boolean {
    lng = formatLng(lng);

    const {lng: lngA} = this.pointA.toFormatted();
    const {lng: lngB} = this.pointB.toFormatted();

    const maxLng = Math.max(lngA, lngB);
    const minLng = Math.min(lngA, lngB);

    if (!this.isAntiMeridian) {
      return maxLng >= lng && minLng <= lng;
    } else {
      return (maxLng <= lng && lng < 180) ||
        (minLng >= lng && lng >= -180);
    }
  }

  containsPoint({lat, lng}: GeoPoint): boolean {
    return this.containsLat(lat) && this.containsLng(lng);
  }

  containsSegment({pointA, pointB}: GeoSegment): boolean {
    return this.containsPoint(pointA) && this.containsPoint(pointB);
  }

  overlapsSegment(segment: GeoSegment) {
    const {pointA, pointB} = segment;

    return (
      this.containsPoint(pointA) ||
      this.containsPoint(pointB) ||
      segment.containsPoint(this.pointB) ||
      segment.containsPoint(this.pointB)
    );
  }
}
