import { GeoSegment } from '../../../segments/geo-segment';
import { Cell } from '../cell';

export function getIntersectedWithSegmentNeighbor(
  cell: Cell,
  segment: GeoSegment,
): Cell | undefined {
  const intersects = cell.intersectsWithSegment(segment);

  if (intersects.length > 0) {
    return cell;
  }

  const closestSide = cell.closestSideToSegment(segment);
  const nextCell = cell.nextCellBySide(closestSide);
  const nextCellIntersects = nextCell.intersectsWithSegment(segment);

  if (nextCellIntersects.length > 0) {
    return nextCell;
  }
}
