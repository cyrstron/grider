import {decRemain} from '../../../../utils/math.utils';
import {GridPoint} from '../../grid-point';

export function round(point: GridPoint): grider.GridPoint {
  const {type} = point.params;

  if (type === 'hex') {
    const {i, j, k} = point;

    return roundHexGridPoint({i, j, k: k as number});
  } else {
    const {i, j} = point;

    return roundRectGridPoint({i, j});
  }
}

function roundHexGridPoint(point: grider.PointHex): grider.PointHex {
  const diffs = calcPointDecimalRemains(point as {[key: string]: number});
  const sortedAxes = Object.keys(diffs)
    .sort((keyA, keyB) => diffs[keyB] - diffs[keyA]);

  let diffsSum = Object.values(diffs)
    .reduce((diffsSum, diff) => diffsSum + diff, 0);

  diffsSum = Math.round(diffsSum);

  const roundedPoint = sortedAxes
    .reduce((roundedPoint: any, key: string) => {
      if (diffsSum > 0) {
        roundedPoint[key] = Math.ceil(point[key]);
        diffsSum -= 1;
      } else {
        roundedPoint[key] = Math.floor(point[key]);
      }

      return roundedPoint;
    }, {}) as grider.PointHex;

  return roundedPoint;
}

function roundRectGridPoint(point: grider.PointRect): grider.PointRect {
  const roundedPoint = Object.keys(point as {[key: string]: number})
    .reduce((roundedPoint: any, key: string) => {
        roundedPoint[key] = Math.round(point[key]);

        return roundedPoint;
    }, {}) as grider.PointRect;

  return roundedPoint;
}

function calcPointDecimalRemains(point: {[key: string]: number}): grider.PointHex {
  const remains: grider.PointHex = Object.keys(point)
    .reduce((remains: any, key: string) => {
      const value = point[key];
      const remain = decRemain(value);

      remains[key] = remain;

      return remains;
    }, {}) as grider.PointHex;

  return remains;
}
