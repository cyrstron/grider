import {MathUtils} from './math.utils';

export class GeometryUtils {
  mathUtils: MathUtils;

  constructor(mathUtils: MathUtils) {
    this.mathUtils = mathUtils;
  }

  calcPointDecimalRemains(point: grider.PointHex): grider.PointHex {
    const remains: grider.PointHex = Object.keys(point)
      .reduce((remains: any, key: string) => {
        const value = point[key];
        const remain = this.mathUtils.decRemain(value);

        remains[key] = remain;

        return remains;
      }, {}) as grider.PointHex;

    return remains;
  }

  getHexGridPolyPoints(centerGridPoint: grider.PointHex): grider.GridHexagon {
    return [
      {
        i: centerGridPoint.i - (2 / 3),
        j: centerGridPoint.j + (1 / 3),
        k: centerGridPoint.k + (1 / 3),
      },
      {
        i: centerGridPoint.i - (1 / 3),
        j: centerGridPoint.j - (1 / 3),
        k: centerGridPoint.k + (2 / 3),
      },
      {
        i: centerGridPoint.i + (1 / 3),
        j: centerGridPoint.j - (2 / 3),
        k: centerGridPoint.k + (1 / 3),
      },
      {
        i: centerGridPoint.i + (2 / 3),
        j: centerGridPoint.j - (1 / 3),
        k: centerGridPoint.k - (1 / 3),
      },
      {
        i: centerGridPoint.i + (1 / 3),
        j: centerGridPoint.j + (1 / 3),
        k: centerGridPoint.k - (2 / 3),
      },
      {
        i: centerGridPoint.i - (1 / 3),
        j: centerGridPoint.j + (2 / 3),
        k: centerGridPoint.k - (1 / 3),
      },
    ];
  }

  getRectGridPolyPoints(centerGridPoint: grider.PointRect): grider.GridRectangle {
    return [
      {
        i: centerGridPoint.i + (1 / 2),
        j: centerGridPoint.j - (1 / 2),
      },
      {
        i: centerGridPoint.i + (1 / 2),
        j: centerGridPoint.j,
      },
      {
        i: centerGridPoint.i + (1 / 2),
        j: centerGridPoint.j + (1 / 2),
      },
      {
        i: centerGridPoint.i,
        j: centerGridPoint.j + (1 / 2),
      },
      {
        i: centerGridPoint.i - (1 / 2),
        j: centerGridPoint.j + (1 / 2),
      },
      {
        i: centerGridPoint.i - (1 / 2),
        j: centerGridPoint.j,
      },
      {
        i: centerGridPoint.i - (1 / 2),
        j: centerGridPoint.j - (1 / 2),
      },
      {
        i: centerGridPoint.i,
        j: centerGridPoint.j - (1 / 2),
      },
    ];
  }
}
