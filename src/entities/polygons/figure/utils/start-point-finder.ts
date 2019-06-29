import { GeoPoint } from "../../../points/geo-point";
import { GeoPolygon } from "../../geo-polygon";
import { PeakPoint } from "../../../points/peak-point";
import { Cell } from "../../cell";
import { GridParams } from "../../../grid-params";
import { GeoSegment } from "../../../segments/geo-segment";

function checkStartPoint(
  shape: GeoPolygon,
  peak: PeakPoint,
  prevPeak?: PeakPoint
): boolean {
  const okPoints = peak.nearestNotSeparatedByPoly(shape);

  const {length} = okPoints;

  if (length === 1) {
    return checkStartPoint(shape, okPoints[0], peak);
  } else if (prevPeak) {
    return length > 1;
  } else {
    return okPoints.map((okPeak) => checkStartPoint(shape, okPeak, peak))
    .some((isValid) => isValid);
  }  
}

function findFirstPoint(
  shape: GeoPolygon,
  params: GridParams,
  isInner: boolean = true,
): GeoPoint | undefined {
  const startCell = Cell.fromGeoPoint(shape.points[0], params);

  const points = isInner ? 
    startCell.pointsInsidePoly(shape) : 
    startCell.pointsOutsidePoly(shape);

  if (points.length === 0) return;

  if (points.length === 1) {
    const peak = PeakPoint.fromGeo(points[0], params);

    return checkStartPoint(shape, peak) ? points[0] : undefined;
  }

  const shapeSide = shape.sideByIndex(0);

  if (points.length === startCell.points.length) {
    const lastShapeIndex = shape.points.length - 1;
    const prevShapeSide = shape.sideByIndex(lastShapeIndex);

    return startCell.reduceSides((
      firstPoint: GeoPoint | undefined,
      cellSide,
    ): GeoPoint | undefined => {
      if (firstPoint) return firstPoint;

      const intersectA = cellSide.intersectionPoint(shapeSide);
      const intersectB = cellSide.intersectionPoint(prevShapeSide);

      if (!intersectA || !intersectB) return firstPoint;

      const {pointA, pointB} = cellSide;

      const distanceA = pointA.calcMercDistance(intersectA);
      const distanceB = pointA.calcMercDistance(intersectB);

      return distanceA > distanceB ? pointB : pointA;
    }, undefined);
  }

  const nextCell = startCell.nextCellOnSegment(shapeSide) || 
    Cell.fromGeoPoint(shape.points[1], params);

  const firstPoint = points.find((
    point
  ) => {
    const pointIndex = startCell.points.indexOf(point);
    const prevPoint = startCell.prevPointByIndex(pointIndex);
    const nextPoint = startCell.nextPointByIndex(pointIndex);
    const prevConained = shape.containsPoint(prevPoint);
    const nextConained = shape.containsPoint(nextPoint);

    return prevConained === nextConained && 
      !nextCell.points.find((nextPoint) => nextPoint.isEqual(point));
  });

  if (!firstPoint) return;

  const peak = PeakPoint.fromGeo(firstPoint, params);
  const isPointValid = checkStartPoint(shape, peak);

  return isPointValid ? firstPoint : undefined;
}