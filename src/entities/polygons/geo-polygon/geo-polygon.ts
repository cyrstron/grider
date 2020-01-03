import {GeoPoint} from '../../points/geo-point';
import {GeoSegment} from '../../segments/geo-segment';
import {GenericPolygon} from '../generic-polygon';

import { GridParams } from '../../grid-params';

export class GeoPolygon<
  SegmentType extends GeoSegment = GeoSegment
> extends GenericPolygon<GeoPoint, SegmentType> {
  sideByIndex(index: number): SegmentType {
    const {pointA, pointB} = super.sideByIndex(index);

    return new GeoSegment(pointA, pointB) as SegmentType;
  }

  sideByIndexInversed(index: number): SegmentType {
    const {pointA, pointB} = super.sideByIndexInversed(index);

    return new GeoSegment(pointA, pointB) as SegmentType;
  }

  splitSectionsByLng(lng: number): GeoSegment[] {
    const intersects = this.reduceSides((
      intersects: GeoPoint[],
      side: GeoSegment,
    ): GeoPoint[] => {
      const lat = side.latByLng(lng);

      if (lat === undefined) return intersects;

      const intersect = new GeoPoint(lat, lng);

      if (!intersects.find((point) => point.isEqual(intersect))) {
        intersects.push(intersect);
      }

      return intersects;
    }, []);

    return GeoSegment.segmentsFromPointsByLat(intersects);
  }

  splitSectionsByLat(lat: number): GeoSegment[] {
    const intersects = this.reduceSides((
      intersects: GeoPoint[],
      side: GeoSegment,
    ): GeoPoint[] => {
      const lng = side.lngByLat(lat);

      if (lng !== undefined) {
        const intersect = new GeoPoint(lat, lng);
        intersects.push(intersect);
      }

      return intersects;
    }, []);

    return GeoSegment.segmentsFromPointsByLng(intersects);
  }

  intersectsSegment(segment: GeoSegment): boolean {
    return super.intersectsSegment(segment);
  }

  intersectsWithSegment(segment: GeoSegment): GeoPoint[] {
    return super.intersectsWithSegment(segment);
  }

  closestSideToSegment(segment: GeoSegment): SegmentType {
    const [pointA, pointB] = this.pointsByDistanceToSegment(segment);

    const indexA = this.points.indexOf(pointA);
    const indexB = this.points.indexOf(pointB);

    return this.sideByIndex(Math.min(indexA, indexB));
  }

  pointsByDistanceToSegment(segment: GeoSegment): GeoPoint[] {
    return [...this.points].sort((pointA, pointB) => {
      const distanceA = segment.mercDistanceToPoint(pointA);
      const distanceB = segment.mercDistanceToPoint(pointB);

      return distanceA - distanceB;
    });
  }

  pointsInsidePoly(poly: GeoPolygon): GeoPoint[] {
    return this.points.filter((point) => poly.containsPoint(point));
  }

  pointsOutsidePoly(poly: GeoPolygon): GeoPoint[] {
    return this.points.filter((point) => !poly.containsPoint(point));
  }

  arePointsInsidePoly(poly: GeoPolygon): boolean {
    return this.points.every((point) => poly.containsPoint(point));
  }

  arePointsOutsidePoly(poly: GeoPolygon): boolean {
    return this.points.every((point) => !poly.containsPoint(point));
  }

  containsPoint(point: GeoPoint): boolean {
    const splitSegment = this.splitSectionsByLat(point.lat);

    return splitSegment.reduce((
      isContained: boolean,
      segment,
    ) => isContained || segment.containsLng(point.lng), false);
  }

  isValidForFigure(params: GridParams): boolean {
    if (this.outmapPoints.length > 0) return false;

    if (this.points.length < 3) return false;

    const {selfIntersections} = this;

    if (selfIntersections.length > 0) return false;

    // const invalidCells = this.cellsInvalidForFigure(params);

    // if (invalidCells.length > 0) return false;

    return true;
  }

  // cellsInvalidForFigure(params: GridParams): Cell[] {
  //   return getInvalidCells(this, params);
  // }

  get outmapPoints() {
    return this.points.filter((point) => {
      const {y} = point.toMerc();

      return y > 1 || y < 0;
    });
  }

  get easternPoint(): GeoPoint {
    return this.points.reduce((
        easternPoint,
        point,
      ) => point.isEasternTo(easternPoint) ?
        point :
        easternPoint,
      this.points[0],
    );
  }

  get westernPoint(): GeoPoint {
    return this.points.reduce((
        westernPoint,
        point,
      ) => point.isWesternTo(westernPoint) ?
        point :
        westernPoint,
      this.points[0],
    );
  }

  get northernPoint(): GeoPoint {
    return this.points.reduce((
        northernPoint,
        point,
      ) => point.isNorthernTo(northernPoint) ?
        point :
        northernPoint,
      this.points[0],
    );
  }

  get southernPoint(): GeoPoint {
    return this.points.reduce((
        southernPoint,
        point,
      ) => point.isSouthernTo(southernPoint) ?
        point :
        southernPoint,
      this.points[0],
    );
  }

  toPlain(): grider.GeoPoint[] {
    return this.points.map((point) => point.toPlain());
  }

  toGeoJSON(): grider.GeoJSONPolygon {
    const closedPoints = [...this.points, this.points[0]];

    return {
      type: 'Polygon',
      coordinates: [closedPoints.map(({lat, lng}) => [lng, lat] as [number, number])],
    };
  }

  static fromGeoJSON({coordinates: [polygon]}: grider.GeoJSONPolygon): GeoPolygon {
    const firstPoint = GeoPoint.fromGeoJSON({
      type: 'Point',
      coordinates: polygon[0],
    });

    const lastPoint = GeoPoint.fromGeoJSON({
      type: 'Point',
      coordinates: polygon[polygon.length - 1],
    });

    if (!firstPoint.isEqual(lastPoint)) throw new Error('Loop is not closed');

    return GeoPolygon.fromPlain(polygon.slice(0, -1).map(([lng, lat]) => ({lat, lng})));
  }

  static fromPlain(points: grider.GeoPoint[]): GeoPolygon {
    return new GeoPolygon(points.map(({lat, lng}) => new GeoPoint(lat, lng)));
  }
}
