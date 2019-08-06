import { GridParams } from '../../../../grid-params';
import { GeoPoint } from '../../../../points/geo-point';
import { GeoSegment } from '../../../../segments/geo-segment';
import { Cell } from '../../../cell';
import { GeoPolygon } from '../../../geo-polygon/geo-polygon';

import {
  getInvalidCells,
} from './cells-invalid-for-figure';
import {cleanFigure} from './clean-figure';
import {
  findStartPointForSide,
  recalcStartCell,
} from './start-point-finder';

export function buildFigurePoints(
  shape: GeoPolygon,
  params: GridParams,
  isInner: boolean,
): GeoPoint[] {
  if (!shape.isValidForFigure(params)) {
    return [];
  }

  const invalidCells = getInvalidCells(shape, params);

  if (invalidCells.length > 0) return [];

  const figurePoints = shape.reduceSides((
    figurePoints: GeoPoint[],
    shapeSide,
  ): GeoPoint[] => calcSidePoints(shapeSide, shape, figurePoints, params, isInner), []);

  return cleanFigure(figurePoints);
}

function calcSidePoints(
  shapeSide: GeoSegment,
  shape: GeoPolygon,
  points: GeoPoint[],
  params: GridParams,
  isInner: boolean,
): GeoPoint[] {
  let isPointFound = false;
  let startCell: Cell | undefined = Cell.fromGeoPoint(shapeSide.pointA, params);
  let firstPoint: GeoPoint | undefined;

  if (points.length === 0) {
    firstPoint = findStartPointForSide(shapeSide, shape, params, isInner);

    if (firstPoint) {
      points.push(firstPoint);
    }
  } else {
    firstPoint = points[points.length - 1];
  }

  if (!firstPoint) return [];

  const endCell = Cell.fromGeoPoint(shapeSide.pointB, params);

  while (startCell && !startCell.isEqual(endCell)) {
    if (!isPointFound) {
      startCell = recalcStartCell(points, shapeSide, params);
    }

    if (!startCell) break;

    const lastPoint = points[points.length - 1];
    const startPoint = startCell.findEqualGeoPoint(lastPoint);

    if (!startPoint) break;

    if (!isPointFound && !!startPoint) {
      isPointFound = true;
    }

    const figurePointsFromCell = getFigurePointsFromCell(
      shapeSide,
      shape,
      startCell,
      startPoint,
      isInner,
    );

    points.push(...figurePointsFromCell);

    startCell = startCell.nextCellOnSegment(shapeSide);

    if (!startCell) break;
  }

  return points;
}

function getFigurePointsFromCell(
  shapeSide: GeoSegment,
  shape: GeoPolygon,
  startCell: Cell,
  startPoint: GeoPoint,
  isInner: boolean,
): GeoPoint[] {
  let index = startCell.points.indexOf(startPoint);
  let nextPoint = startCell.nextPointByIndex(index);
  let cellSide = startCell.sideByIndex(index);
  let isIntersected = cellSide.intersects(shapeSide);
  let isNextContained = shape.containsPoint(nextPoint);

  const isReversed = isIntersected || isNextContained !== isInner;
  const points: GeoPoint[] = [];

  if (isReversed) {
    nextPoint = startCell.prevPointByIndex(index);
    isNextContained = shape.containsPoint(nextPoint);
    cellSide = startCell.sideByIndex(startCell.prevIndex(index));
    // isIntersected = shape.containsPoint(nextPoint);
    isIntersected = shape.intersectsSegment(cellSide);
  }

  while (!isIntersected && isNextContained === isInner) {
    const lastPoint = points[points.length - 1] || startPoint;
    const cellPoint = startCell.points[index];

    if (!lastPoint.isEqual(cellPoint)) {
      points.push(cellPoint);
    }

    const cellSide = isReversed ?
      startCell.sideByIndexInversed(index) :
      startCell.sideByIndex(index);

    isIntersected = cellSide.intersects(shapeSide);
    index = isReversed ?
      startCell.prevIndex(index) :
      startCell.nextIndex(index);
    nextPoint = startCell.points[index];
    isNextContained = shape.containsPoint(nextPoint);
  }

  return points;
}
