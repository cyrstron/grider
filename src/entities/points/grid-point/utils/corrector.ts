import {GridParams} from '../../../grid-params';
import {GeoPolygon} from '../../../polygons/geo-polygon';
import {GeoPoint} from '../../geo-point';

export function correctForGrid(
  point: GeoPoint,
  {correction}: GridParams,
): GeoPoint {
  if (correction === 'merc') {
    const {lat, lng} = point.toSemiSphere();

    return new GeoPoint(lat, lng / 2);
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
    const {lat, lng} = point;

    return new GeoPoint(lat, lng * 2).fromSemiSphere().toFormatted();
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
