import {spreadPointsBySides} from './utils/spread-points';
import { GeoPoint } from '../../../../points/geo-point';
import {SideIndexation} from '../side-indexation';
import { TileMercPoint } from '../../../../points/tile-merc-point';
import { TileIntersection } from '../tile-intersection';
import { BoundIntersection } from '../bound-intersection';
import { Point } from '../../../../points';
import {startMeasure, endMeasure} from '../../../../../dev/performance';

export type SpreadedPoint = {index: number, point: GeoPoint};
export type SpreadedSide = SpreadedPoint[];
export type SpreadedFigure = SpreadedSide[];

export class Indexation {
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

    // startMeasure('TileMercPoint.toPoly');
    const tilePoly = tilePoint.toPoly();
    // endMeasure('TileMercPoint.toPoly');

    // startMeasure('Indexation.tileIntersection: BoundIntersection creation external');

    this.indexations.forEach((
      sideIndexation,
    ) => {
      // startMeasure('Indexation.tileIntersection: BoundIntersection creation internal');
      // startMeasure('Indexation.tileIntersection: BoundIntersection creation internal north');
      const northIntersect = sideIndexation.boundIntersection(tilePoint.northBound, tilePoly, 'north');
      // endMeasure('Indexation.tileIntersection: BoundIntersection creation internal north');
      // startMeasure('Indexation.tileIntersection: BoundIntersection creation internal south');
      const southIntersect = sideIndexation.boundIntersection(tilePoint.southBound, tilePoly, 'south');
      // endMeasure('Indexation.tileIntersection: BoundIntersection creation internal south');
      // startMeasure('Indexation.tileIntersection: BoundIntersection creation internal east');
      const eastIntersect = sideIndexation.boundIntersection(tilePoint.eastBound, tilePoly, 'east');
      // endMeasure('Indexation.tileIntersection: BoundIntersection creation internal east');
      // startMeasure('Indexation.tileIntersection: BoundIntersection creation internal west');
      const westIntersect = sideIndexation.boundIntersection(tilePoint.westBound, tilePoly, 'west');
      // endMeasure('Indexation.tileIntersection: BoundIntersection creation internal west');
      // endMeasure('Indexation.tileIntersection: BoundIntersection creation internal');

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
    // endMeasure('Indexation.tileIntersection: BoundIntersection creation external');

    // startMeasure('TileIntersect.fromBounds');
    const intersection = TileIntersection.fromBounds(
      tilePoint,
      north,
      south,
      east,
      west
    );
    // endMeasure('TileIntersect.fromBounds');

    // startMeasure('TileIntersect.normalize');
    const normalized = intersection.normalize();
    // endMeasure('TileIntersect.normalize');

    return normalized;
  }

  tileBorderPoints(tilePoint: TileMercPoint): Point[] {
    // startMeasure('Indexation.tileBorderPoints');
    let tileIntersects = this.tileIntersection(tilePoint);

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
      direction
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
        let nextSegment = segments[index + 1];

        if (nextSegment && nextSegment.boundA.toIndex) {
          indexB = nextSegment.boundA.toIndex;
        } else {
          const {keys} = tileIntersects;
          const directionIndex = keys.indexOf(direction);
          const directions = [
            ...keys.slice(directionIndex + 1), 
            ...keys.slice(0, directionIndex + 1)
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
            ...this.points.slice(0, minIndex + 1)
          ]
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

    // endMeasure('Indexation.tileBorderPoints');

    return projectedPoints;
  }

  static fromPoints(points: GeoPoint[]) {
    const spreadedPoints = spreadPointsBySides(points);

    const indexations = spreadedPoints.map(
      (spreadedSide) => SideIndexation.fromSpreadedSide(points, spreadedSide)
    )

    return new Indexation(points, spreadedPoints, indexations);
  }
} 