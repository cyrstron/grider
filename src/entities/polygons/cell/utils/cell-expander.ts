import {CenterPoint} from '../../../points/center-point';
import {PeakPoint} from '../../../points/peak-point';
import {GeoPoint} from '../../../points/geo-point';

export function expand(
  center: CenterPoint
): PeakPoint[] {
  const {type} = center.params;

  if (type === 'hex') {
    return getHexPoints(center);
  } else {
    return getRectPoints(center);
  }
}

function getHexPoints(
  {i, j, k, params}: CenterPoint
): PeakPoint[] {
  return [
    new PeakPoint(
      params,      
      i - (2 / 3),
      j + (1 / 3),
      k as number + (1 / 3),
    ),
    new PeakPoint(
      params,      
      i - (1 / 3),
      j - (1 / 3),
      k as number + (2 / 3),
    ),
    new PeakPoint(
      params,      
      i - (1 / 3),
      j - (2 / 3),
      k as number + (1 / 3),
    ),
    new PeakPoint(
      params,      
      i + (2 / 3),
      j - (1 / 3),
      k as number - (1 / 3),
    ),
    new PeakPoint(
      params,      
      i + (1 / 3),
      j + (1 / 3),
      k as number - (2 / 3),
    ),
    new PeakPoint(
      params,      
      i - (1 / 3),
      j + (2 / 3),
      k as number - (1 / 3),
    ),
  ];
}

function getRectPoints(
  {i, j, params}: CenterPoint
): PeakPoint[] {
  return [
    new PeakPoint(
      params,      
      i + (1 / 2),
      j - (1 / 2),
    ),
    new PeakPoint(
      params,      
      i + (1 / 2),
      j + (1 / 2),
    ),
    new PeakPoint(
      params,      
      i - (1 / 2),
      j + (1 / 2),
    ),
    new PeakPoint(
      params,      
      i - (1 / 2),
      j - (1 / 2),
    ),
  ];
}