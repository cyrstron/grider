import {MathUtils} from './math.utils';

export class GeometryUtils {

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
        j: centerGridPoint.j + (1 / 2),
      },
      {
        i: centerGridPoint.i - (1 / 2),
        j: centerGridPoint.j + (1 / 2),
      },
      {
        i: centerGridPoint.i - (1 / 2),
        j: centerGridPoint.j - (1 / 2),
      },
    ];
  }
}
