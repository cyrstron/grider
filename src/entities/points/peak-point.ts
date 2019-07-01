import {GridPoint} from './grid-point';
import {CellSide} from '../segments/cell-side';
import {Cell} from '../polygons/cell';
import { GeoPoint } from './geo-point';
import { GridParams } from '../grid-params';
import { GeoPolygon } from '../polygons/geo-polygon/geo-polygon';

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

  nearestNotSeparatedByPoly(polygon: GeoPolygon): PeakPoint[] {
    const {nearestPeaks} = this;
  
    return nearestPeaks.reduce((
      okPoints: PeakPoint[],
      nearestPeak: PeakPoint
    ): PeakPoint[] => {
      const cellSide = CellSide.fromPeaks(this, nearestPeak);
      const doesFit = !polygon.intersectsSegment(cellSide);
  
      if (doesFit) {
        okPoints.push(nearestPeak);
      }
  
      return okPoints;
    }, [] as PeakPoint[]);
  }

  static fromGeo(point: GeoPoint, params: GridParams) {
    const {i, j, k} = point.toGrid(params);

    return new PeakPoint(params, i, j, k);
  }
}