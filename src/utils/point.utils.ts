import { GeometryUtils } from './geometry.utils';

export class PointUtils {
  constructor(public geometry: GeometryUtils) {
  }

  roundHexGridPoint(gridPoint: grider.PointHex): grider.PointHex {
    const diffs = this.geometry.calcPointDecimalRemains(gridPoint);
    const keys = Object.keys(diffs)
      .sort((keyA, keyB) => diffs[keyB] - diffs[keyA]);

    let diffsSum = keys.reduce((diffsSum, key) => diffsSum + diffs[key], 0);

    const roundedPoint = keys.reduce((roundedPoint: any, key: string) => {
      if (diffsSum > 0) {
        roundedPoint[key] = Math.ceil(gridPoint[key]);
        diffsSum -= 1;
      } else {
        roundedPoint[key] = Math.floor(gridPoint[key]);
      }

      return roundedPoint;
    }, {}) as grider.PointHex;

    return roundedPoint;
  }

  roundRectGridPoint(gridPoint: grider.PointRect): grider.PointRect {
    const keys = Object.keys(gridPoint);

    const roundedPoint = keys.reduce((roundedPoint: any, key: string) => {
      roundedPoint[key] = Math.round(gridPoint[key]);

      return roundedPoint;
    }, {}) as grider.PointRect;

    return roundedPoint;
  }
}
