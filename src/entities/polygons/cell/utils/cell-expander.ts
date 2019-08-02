import {CenterPoint} from '../../../points/center-point';

export function expand(
  center: CenterPoint,
): grider.GridPoint[] {
  const {type} = center.params;

  if (type === 'hex') {
    return getHexPoints(center);
  } else {
    return getRectPoints(center);
  }
}

function getHexPoints(
  {i, j, k}: CenterPoint,
): grider.GridPoint[] {
  return [{
    i: i - (2 / 3),
    j: j + (1 / 3),
    k: k as number + (1 / 3),
  }, {
    i: i - (1 / 3),
    j: j - (1 / 3),
    k: k as number + (2 / 3),
  }, {
    i: i + (1 / 3),
    j: j - (2 / 3),
    k: k as number + (1 / 3),
  }, {
    i: i + (2 / 3),
    j: j - (1 / 3),
    k: k as number - (1 / 3),
  }, {
    i: i + (1 / 3),
    j: j + (1 / 3),
    k: k as number - (2 / 3),
  }, {
    i: i - (1 / 3),
    j: j + (2 / 3),
    k: k as number - (1 / 3),
  }];
}

function getRectPoints(
  {i, j}: CenterPoint,
): grider.GridPoint[] {
  return [{
    i: i + (1 / 2),
    j: j - (1 / 2),
  }, {
    i: i + (1 / 2),
    j: j + (1 / 2),
  }, {
    i: i - (1 / 2),
    j: j + (1 / 2),
  }, {
    i: i - (1 / 2),
    j: j - (1 / 2),
  }];
}
