import {CenterPoint} from '../../../points/center-point';
import {GridPoint} from '../../../points/grid-point';
import {GeoPoint} from '../../../points/geo-point';

export function expand(
  center: CenterPoint
): GeoPoint[] {
  const {type} = center.params;

  if (type === 'hex') {
    return getHexPoints(center);
  } else {
    return getRectPoints(center);
  }
}

function getHexPoints(
  {i, j, k, params}: CenterPoint
): GeoPoint[] {
  return [
    new GridPoint(
      params,      
      i - (2 / 3),
      j + (1 / 3),
      k as number + (1 / 3),
    ).toGeo(),
    new GridPoint(
      params,      
      i - (1 / 3),
      j - (1 / 3),
      k as number + (2 / 3),
    ).toGeo(),
    new GridPoint(
      params,      
      i - (1 / 3),
      j - (2 / 3),
      k as number + (1 / 3),
    ).toGeo(),
    new GridPoint(
      params,      
      i + (2 / 3),
      j - (1 / 3),
      k as number - (1 / 3),
    ).toGeo(),
    new GridPoint(
      params,      
      i + (1 / 3),
      j + (1 / 3),
      k as number - (2 / 3),
    ).toGeo(),
    new GridPoint(
      params,      
      i - (1 / 3),
      j + (2 / 3),
      k as number - (1 / 3),
    ).toGeo(),
  ];
}

function getRectPoints(
  {i, j, params}: CenterPoint
): GeoPoint[] {
  return [
    new GridPoint(
      params,      
      i + (1 / 2),
      j - (1 / 2),
    ).toGeo(),
    new GridPoint(
      params,      
      i + (1 / 2),
      j + (1 / 2),
    ).toGeo(),
    new GridPoint(
      params,      
      i - (1 / 2),
      j + (1 / 2),
    ).toGeo(),
    new GridPoint(
      params,      
      i - (1 / 2),
      j - (1 / 2),
    ).toGeo(),
  ];
}