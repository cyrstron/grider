import {
  cosDeg,
  sinDeg,
} from '../../../../utils/math-utils';
import {GridParams} from '../../../grid-params';
import {GeoPoint} from '../../geo-point';
import {GridPoint} from '../grid-point';

export function rotateToGrid(
  point: GeoPoint,
  axisParams: grider.GridAxis,
  isHorizontal: boolean,
): number {
  const mainAxis = isHorizontal ? 'lng' : 'lat';
  const auxAxis = isHorizontal ? 'lat' : 'lng';

  const main = point[mainAxis];
  const aux = point[auxAxis];

  const angle = axisParams.angle;
  const sin = sinDeg(angle);
  const cos = cosDeg(angle);

  const axisValue = aux * sin + main * cos;

  return axisValue;
}

export function rotateToGeo(
  point: GridPoint,
  axisParams: grider.Axis,
): number {
  const {
    isHorizontal,
  } = point.params;

  const mainAxis = isHorizontal ? 'lng' : 'lat';

  const angle = axisParams.angle;
  const sin = sinDeg(angle);
  const cos = cosDeg(angle);

  if (axisParams.name === mainAxis) {
    return (point.i - point.j * sin) / cos;
  } else {
    return (point.j - point.i * cos) / sin;
  }
}

export function toGridScale(
  value: number,
  gridParams: grider.GridParams,
): number {
  const size = gridParams.initSize;
  const result = value * 10000000 / size;

  return result;
}

export function toGeoScale(
  value: number,
  gridParams: grider.GridParams,
): number {
  const size = gridParams.initSize;
  const result = value * size / 10000000;

  return result;
}

export function toGrid(
  point: GeoPoint,
  axisParams: grider.GridAxis,
  params: GridParams,
): number {
  const rotatedAxis = rotateToGrid(point, axisParams, params.isHorizontal);
  const scaledAxis = toGridScale(rotatedAxis, params);

  return scaledAxis;
}

export function toGeo(
  point: GridPoint,
  axisParams: grider.Axis,
): number {
  const rotatedAxis = rotateToGeo(point, axisParams);
  const scaledAxis = toGeoScale(rotatedAxis, point.params);

  return scaledAxis;
}
