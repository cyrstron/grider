import { PeakPoint } from '..';

export function calcNearestPeaks(
  center: PeakPoint,
): grider.GridPoint[] {
  const {type} = center.params;

  if (type === 'hex') {
    return nearestHexPeaks(center);
  } else {
    return nearestRectPeaks(center);
  }
}

function nearestHexPeaks(
  {i, j, k}: PeakPoint,
): grider.GridPoint[] {
  const iDiff = Math.round((i % 1) * 3);
  if (iDiff === 2) {
    return [{
      i: i + (2 / 3),
      j: j - (1 / 3),
      k: k as number - (1 / 3),
    }, {
      i: i - (1 / 3),
      j: j + (2 / 3),
      k: k as number - (1 / 3),
    }, {
      i: i - (1 / 3),
      j: j - (1 / 3),
      k: k as number + (2 / 3),
    }];
  } else {    
    return [{
      i: i - (2 / 3),
      j: j + (1 / 3),
      k: k as number + (1 / 3),
    }, {
      i: i + (1 / 3),
      j: j - (2 / 3),
      k: k as number + (1 / 3),
    }, {
      i: i + (1 / 3),
      j: j + (1 / 3),
      k: k as number - (2 / 3),
    }];
  }
}

function nearestRectPeaks(
  {i, j}: PeakPoint,
): grider.GridPoint[] {
  return [{
    i: i + 1,
    j: j - 1,
  }, {
    i: i + 1,
    j: j + 1,
  }, {
    i: i - 1,
    j: j + 1,
  }, {
    i: i - 1,
    j: j - 1,
  }];
}
