import {GridPoint} from '../grid-point';
import {CellSide} from '../../segments/cell-side';
import {Cell} from '../../polygons/cell';

export class PeakPoint extends GridPoint {
  get nearestPeaks(): PeakPoint[] {
    const cell = Cell.fromGridPoint(this);

    const nearestPeaks = cell.nearestPeaks(this);

    const restPeaks = nearestPeaks.reduce((restPeaks, peak) => {
      const cellSide = CellSide.fromPeaks(this, peak);
      const nextCell = cell.nextCellBySide(cellSide);
      restPeaks.push(...nextCell.nearestPeaks(this));

      return restPeaks;
    }, [] as PeakPoint[])
      .filter((peak) => !nearestPeaks.find(
        (nearestPeak) => nearestPeak.isEqual(peak))
      );

    nearestPeaks.push(...restPeaks);

    return nearestPeaks;
  }

  get nearestPeaksGeo() {
    return this.nearestPeaks.map((peak) => peak.toGeo());
  }
}