import {GeoPoint} from '../../geo-point';
import {GridParams} from '../../../grid-params';
import {GeoPolygon} from '../../../polygons/geo-polygon/geo-polygon';

export function correctForGrid(
  point: GeoPoint,
  {correction}: GridParams,
): GeoPoint {
  if (correction === 'merc') {
    return point.toSemiSphere();
  } else {
    return point;
  }
}

export function correctForGeo(
  point: GeoPoint,
  gridParams: GridParams,
): GeoPoint {
  const {correction} = gridParams;

  if (correction === 'merc') {
    return point.fromSemiSphere().toFormatted();
  } else {
    return point.toFormatted();
  }
}

export function correctPoly(
  poly: GeoPolygon,
  {correction}: GridParams,
): GeoPolygon {
  if (correction === 'merc') {
    return poly;
  } else {
    return poly;
  }
}
