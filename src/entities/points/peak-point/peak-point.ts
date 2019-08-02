import { GridParams } from '../../grid-params';
import { GeoPolygon } from '../../polygons/geo-polygon';
import {CellSide} from '../../segments/cell-side';
import { GeoPoint } from '../geo-point';
import {GridPoint} from '../grid-point';
import {calcNearestPeaks} from './utils/nearest-peaks'

export class PeakPoint extends GridPoint {
  get nearestPeaks(): PeakPoint[] {
    return calcNearestPeaks(this)
      .map(({i, j, k}) => {
        const geoPoint = new PeakPoint(this.params, i, j, k).toGeo();
        const reduced = GridPoint.fromGeo(geoPoint, this.params);

        return new PeakPoint(this.params, reduced.i, reduced.j, reduced.k);
      });
  }

  get nearestPeaksGeo() {
    return this.nearestPeaks.map((peak) => peak.toGeo());
  }

  static fromGeo(point: GeoPoint, params: GridParams) {
    const {i, j, k} = GridPoint.fromGeo(point, params);

    return new PeakPoint(params, i, j, k);
  }

  toFormatted(): PeakPoint {
    const {params, i, j, k} = this;

    return new PeakPoint(
      params,
      +i.toFixed(6),
      +j.toFixed(6),
      k && +k.toFixed(6),
    );
  }

  nearestNotSeparatedByPoly(polygon: GeoPolygon): PeakPoint[] {
    const {nearestPeaks} = this;

    return nearestPeaks.reduce((
      okPoints: PeakPoint[],
      nearestPeak: PeakPoint,
    ): PeakPoint[] => {
      const cellSide = CellSide.fromPeaks(this, nearestPeak);
      const doesFit = !polygon.intersectsSegment(cellSide);

      if (doesFit) {
        okPoints.push(nearestPeak);
      }

      return okPoints;
    }, [] as PeakPoint[]);
  }
}
