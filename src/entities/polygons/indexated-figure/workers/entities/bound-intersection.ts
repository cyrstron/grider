import { GeoPoint } from '../../../../points/geo-point';
import { GeoSegment } from '../../../../segments/geo-segment';
import { GeoPolygon } from '../../../geo-polygon';

export class BoundIntersection {
  static fromPoints(
    points: GeoPoint[],
    indexA: number,
    indexB: number,
    tilePoly: GeoPolygon,
    bound: number,
    boundKey: grider.Cardinal,
  ): BoundIntersection | undefined {
    let pointA = points[indexA];
    const pointB = points[indexB];
    const isLat = boundKey === 'north' || boundKey === 'south';

    let lat: number | undefined;
    let lng: number | undefined;

    let geoSegment = new GeoSegment(pointA, pointB);

    if (isLat) {
      lat = bound;
      lng = geoSegment.lngByLat(lat);
    } else {
      lng = bound;
      lat = geoSegment.latByLng(lng);
    }

    if (lat === undefined || lng === undefined) return;

    let intersection = new GeoPoint(lat, lng);
    let toPoint: GeoPoint | undefined;
    let toIndex: number | undefined;
    let isReplaced: boolean = false;

    const diff = indexA - indexB;

    if (
      isLat && (intersection.lat === pointA.lat) ||
      !isLat && (intersection.lng === pointA.lng)
    ) {
      const nextIndexA = indexA + diff;
      const nextPointA = points[nextIndexA];
      const needToReplace = isLat ?
        pointA.lat === nextPointA.lat :
        pointA.lng === nextPointA.lng;

      isReplaced = needToReplace;
      indexA = needToReplace ? nextIndexA : indexA;
      pointA = needToReplace ? nextPointA : pointA;
    }

    if (
      isLat && (intersection.lat === pointB.lat) ||
      !isLat && (intersection.lng === pointB.lng)
    ) {
      const nextIndexB = indexB - diff;
      const nextPointB = points[nextIndexB];
      const needToReplace = isLat ?
        pointB.lat === nextPointB.lat :
        pointB.lng === nextPointB.lng;

      isReplaced = needToReplace;
      indexA = needToReplace ? nextIndexB : indexB;
      pointA = needToReplace ? nextPointB : pointB;
    }

    if (isReplaced) {
      geoSegment = new GeoSegment(pointA, pointB);
    }

    if (isReplaced && isLat) {
      lng = geoSegment.lngByLat(lat);
    } else if (isReplaced && !isLat) {
      lat = geoSegment.latByLng(lng);
    }

    if (lat === undefined || lng === undefined) return;

    if (isReplaced) {
      intersection = new GeoPoint(lat, lng);
    }

    if (tilePoly.containsPoint(pointA)) {
      toPoint = pointA;
      toIndex = indexA;
    } else if (tilePoly.containsPoint(pointB)) {
      toPoint = pointB;
      toIndex = indexB;
    }

    const boundIntersection = new BoundIntersection(
      intersection,
      bound,
      boundKey,
      toIndex,
      toPoint,
    );

    return boundIntersection;
  }

  constructor(
    public intersection: GeoPoint,
    public bound: number,
    public boundKey: grider.Cardinal,
    public toIndex?: number,
    public toPoint?: GeoPoint,
  ) {}
}
