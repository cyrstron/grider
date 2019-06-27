import {CenterPoint} from '../center-point';
import {GeoSegment} from '../../../segments/geo-segment';
import {GridSegment} from '../../../segments/grid-segment';

export function getNextCenterByCellSide(
  center: CenterPoint,
  segment: GeoSegment,
): CenterPoint {
  const {i, j, k, params} = center;
  const {
    averagePoint: {i: averI, j: averJ, k: averK}
  } = GridSegment.fromGeo(segment, params);

  const nextI = Math.round(i + (averI - i) * 2);
  const nextJ = Math.round(j + (averJ - j) * 2);
  const nextK = k !== undefined && averK !== undefined ? 
    Math.round(k + (averK - k) * 2) :
    undefined;

  return new CenterPoint(params, nextI, nextJ, nextK)
    .toGeo()
    .toCenter(params);
}