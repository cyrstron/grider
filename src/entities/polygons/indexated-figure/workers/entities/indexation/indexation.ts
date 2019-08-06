import { GeoPoint } from '../../../../../points/geo-point';
import { Point } from '../../../../../points/point';
import { TileMercPoint } from '../../../../../points/tile-merc-point';
import { BoundIntersection } from '../bound-intersection';
import {SideIndexation} from '../side-indexation';
import { TileIntersection } from '../tile-intersection';
import {spreadPointsBySides} from './utils/spread-points';

export interface SpreadedPoint {
  index: number;
  point: GeoPoint;
}
export type SpreadedSide = SpreadedPoint[];
export type SpreadedFigure = SpreadedSide[];

export class Indexation {

  static fromPoints(points: GeoPoint[]) {
    const spreadedPoints = spreadPointsBySides(points);

    const indexations = spreadedPoints.map(
      (spreadedSide) => SideIndexation.fromSpreadedSide(points, spreadedSide),
    );

    return new Indexation(points, spreadedPoints, indexations);
  }
  constructor(
    public points: GeoPoint[],
    public spreaded: SpreadedFigure,
    public indexations: SideIndexation[],
  ) {}

  tileIntersection(tilePoint: TileMercPoint) {
    const north: BoundIntersection[] = [];
    const south: BoundIntersection[] = [];
    const east: BoundIntersection[] = [];
    const west: BoundIntersection[] = [];

    const tilePoly = tilePoint.toPoly();

    this.indexations.forEach((
      sideIndexation,
    ) => {
      const northIntersect = sideIndexation.boundIntersection(tilePoint.northBound, tilePoly, 'north');
      const southIntersect = sideIndexation.boundIntersection(tilePoint.southBound, tilePoly, 'south');
      const eastIntersect = sideIndexation.boundIntersection(tilePoint.eastBound, tilePoly, 'east');
      const westIntersect = sideIndexation.boundIntersection(tilePoint.westBound, tilePoly, 'west');

      if (northIntersect) {
        north.push(northIntersect);
      }
      if (southIntersect) {
        south.push(southIntersect);
      }
      if (eastIntersect) {
        east.push(eastIntersect);
      }
      if (westIntersect) {
        west.push(westIntersect);
      }
    });

    const intersection = TileIntersection.fromBounds(
      tilePoint,
      north,
      south,
      east,
      west,
    );

    const normalized = intersection.normalize();

    return normalized;
  }

  tileBorderPoints(tilePoint: TileMercPoint): Point[] {
    const tileIntersects = this.tileIntersection(tilePoint);

    if (tileIntersects.isEmpty) {
      const points = tilePoint.toPoly().containsPoint(this.points[0]) ?
        tilePoint.projectGeoPoints(this.points) :
        [];

      return points;
    }

    if (tileIntersects.isContained) {
      const points = tilePoint.projectGeoPoints(tilePoint.toPoly().points);

      return points;
    }

    const points = tileIntersects.reduce((
      points: GeoPoint[],
      segments,
      direction,
    ): GeoPoint[] => {
      if (segments.length === 0) return points;

      const bound = tilePoint[direction];
      const {pointA, pointB} = bound;

      if (tileIntersects.tileContainedByDirection(direction)) {
        points.push(...bound.points);

        return points;
      }

      const lastIndex = segments.length - 1;

      const boundPoints = segments.reduce((
        boundPoints: GeoPoint[],
        segment,
        index,
      ): GeoPoint[] => {
        const isFirst = index === 0;
        const isLast = index === lastIndex;

        if (isFirst && segment.containsPoint(pointA)) {
          boundPoints.push(pointA);
        } else if (isFirst) {
          boundPoints.push(segment.pointA);
        }

        if (!isLast || !segment.containsPoint(pointB)) {
          boundPoints.push(segment.pointB);
        } else {
          boundPoints.push(pointB);
          return boundPoints;
        }

        const {toIndex: indexA} = segment.boundB;

        if (indexA === undefined) return boundPoints;

        let indexB: number | undefined;
        const nextSegment = segments[index + 1];

        if (nextSegment && nextSegment.boundA.toIndex) {
          indexB = nextSegment.boundA.toIndex;
        } else {
          const {keys} = tileIntersects;
          const directionIndex = keys.indexOf(direction);
          const directions = [
            ...keys.slice(directionIndex + 1),
            ...keys.slice(0, directionIndex + 1),
          ];

          const nextDirection = directions.find((key) => tileIntersects[key].length > 0);

          indexB = nextDirection && tileIntersects[nextDirection][0].boundA.toIndex;
        }

        if (indexB === undefined) return boundPoints;

        if (indexA === indexB) {
          boundPoints.push(this.points[indexA]);

          return boundPoints;
        }

        const minIndex = Math.min(indexA, indexB);
        const maxIndex = Math.max(indexA, indexB);
        const checkPoint = this.points[minIndex + 1];
        const isOnSplit = !tilePoint.containsPoint(checkPoint);
        const isInversed = (indexA > indexB) !== isOnSplit;

        let borderPoints: GeoPoint[];

        if (!isOnSplit) {
          borderPoints = this.points.slice(minIndex, maxIndex + 1);
        } else {
          borderPoints = [
            ...this.points.slice(maxIndex),
            ...this.points.slice(0, minIndex + 1),
          ];
        }

        if (isInversed) {
          borderPoints.reverse();
        }

        boundPoints.push(...borderPoints);

        return boundPoints;
      }, []);

      points.push(...boundPoints);

      return points;
    }, []);

    const projectedPoints = tilePoint.projectGeoPoints(points);

    return projectedPoints;
  }
}
