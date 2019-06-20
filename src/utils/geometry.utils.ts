import {MathUtils} from './math.utils';

export class GeometryUtils {
  constructor(
    public math: MathUtils,
  ) {}


  //done
  closestPointOnLine(
    {x: x0, y: y0}: grider.Point,
    [{x: x1, y: y1}, {x: x2, y: y2}]: [grider.Point, grider.Point],
  ): grider.Point | undefined {
    if (x1 === x2) {
      return {
        x: x1,
        y: y0,
      };
    } else if (y1 === y2) {
      return {
        x: x0,
        y: y1,
      };
    }

    const coofsA = this.calcFlatLineCoofs([[x1, y1], [x2, y2]]);
    const normalVector: [number, number] = [y1 - y2, x2 - x1];
    const coofsB = this.calcFlatLineCoofsByVector([x0, y0], normalVector);

    const closestPoint = this.resolveFlatLineMatrix([coofsA, coofsB]);

    if (!closestPoint) return;

    const [x, y] = closestPoint;

    return {x, y};
  }

  //done
  closestPointOnSection(
    c: grider.Point,
    [a, b]: [grider.Point, grider.Point],
  ): grider.Point | undefined {
    const linePoint = this.closestPointOnLine(c, [a, b]);

    if (!linePoint) return;

    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);

    if (linePoint.x < minX) {
      return minX === a.x ? a : b;
    } else if (linePoint.x > maxX) {
      return maxX === a.x ? a : b;
    } else if (linePoint.y < minY) {
      return minY === a.y ? a : b;
    } else if (linePoint.y > maxY) {
      return maxY === a.y ? a : b;
    } else {
      return linePoint;
    }
  }

  // done
  calcDistanceToLine(
    {x: x0, y: y0}: grider.Point,
    [{x: x1, y: y1}, {x: x2, y: y2}]: [grider.Point, grider.Point],
  ): number {
    return Math.abs(
      (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1,
    ) / Math.sqrt(
      Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2),
    );
  }

  // done
  calcDistance(
    {x: x1, y: y1}: grider.Point,
    {x: x2, y: y2}: grider.Point,
  ): number {
    return Math.sqrt(
      Math.pow(x2 - x1, 2) +
      Math.pow(y2 - y1, 2),
    );
  }

  //done
  calcSectionsIntersect(
    sectionA: [[number, number], [number, number]],
    sectionB: [[number, number], [number, number]],
  ): [number, number] | undefined {
    const [[x1, y1], [x2, y2]] = sectionA;
    const [[x3, y3], [x4, y4]] = sectionB;

    const intersect = this.calcLinesIntersection(sectionA, sectionB);

    if (!intersect) return;

    const [x, y] = intersect;

    if (
      Math.max(x1, x2) < x ||
      Math.min(x1, x2) > x ||
      Math.max(x3, x4) < x ||
      Math.min(x3, x4) > x ||
      Math.max(y1, y2) < y ||
      Math.min(y1, y2) > y ||
      Math.max(y3, y4) < y ||
      Math.min(y3, y4) > y
    ) return;

    return intersect;
  }

  // done
  calcLinesIntersection(
    sectionA: [[number, number], [number, number]],
    sectionB: [[number, number], [number, number]],
  ): [number, number] | undefined {
    const [[x1, y1], [x2, y2]] = sectionA;
    const [[x3, y3], [x4, y4]] = sectionB;

    let x;
    let y;

    if (x1 === x2 && x3 === x4) {
      return;
    } else if (x1 === x2) {
      x = x1;
    } else if (x3 === x4) {
      x = x3;
    } else {
      x = this.calcXIntersection(sectionA, sectionB);
    }

    if (y1 === y2 && y3 === y4) {
      return;
    } else if (y1 === y2) {
      y = y1;
    } else if (y3 === y4) {
      y = y3;
    } else {
      y = this.calcYIntersection(sectionA, sectionB);
    }

    if (x === undefined && y !== undefined) {
      x = this.calcXByYOnLine(y, sectionA) || this.calcXByYOnLine(y, sectionB);
    }

    if (y === undefined && x !== undefined) {
      y = this.calcYByXOnLine(x, sectionA) || this.calcYByXOnLine(x, sectionB);
    }

    if (x === undefined || y === undefined) return;

    return [x, y];
  }

  // done
  calcYIntersection(
    sectionA: [[number, number], [number, number]],
    sectionB: [[number, number], [number, number]],
  ): number | void {
    const [a1, b1, c1] = this.calcFlatLineCoofs(sectionA);
    const [a2, b2, c2] = this.calcFlatLineCoofs(sectionB);

    const delta = a1 * b2 - b1 * a2;
    const deltaY = a1 * c2 - c1 * a2;

    if (!delta) return;

    return deltaY / delta;
  }

  //done
  calcXIntersection(
    sectionA: [[number, number], [number, number]],
    sectionB: [[number, number], [number, number]],
  ): number | void {
    const [a1, b1, c1] = this.calcFlatLineCoofs(sectionA);
    const [a2, b2, c2] = this.calcFlatLineCoofs(sectionB);

    const delta = a1 * b2 - b1 * a2;
    const deltaX = c1 * b2 - b1 * c2;

    if (!delta) return;

    return deltaX / delta;
  }


  // done
  calcFlatLineCoofs(
    [[x1, y1], [x2, y2]]: [
      [number, number], [number, number]
  ]): [number, number, number] {
    return [
      y1 - y2,
      x2 - x1,
      -((x1 * y2) - (y1 * x2)),
    ];
  }

  // done
  calcFlatLineCoofsByVector(
    [x1, y1]: [number, number],
    [ax, ay]: [number, number],
  ): [number, number, number] {
    return [
      1 / ax,
      -(1 / ay),
      (x1 / ax - y1 / ay),
    ];
  }

  //done
  resolveFlatLineMatrix(
    [[a1, b1, c1], [a2, b2, c2]]: number[][],
  ): [number, number] | undefined {
    const delta = a1 * b2 - b1 * a2;
    const deltaX = c1 * b2 - b1 * c2;
    const deltaY = a1 * c2 - c1 * a2;

    if (delta === 0) return;

    return [
      deltaX / delta,
      deltaY / delta,
    ];
  }

  //done
  calcXLineEquation(
    points: [[number, number], [number, number]],
  ): (y: number) => number | void {
    return (
      y: number,
    ): number | void => this.calcXByYOnLine(y, points);
  }

  //done
  calcYLineEquation(
    points: [[number, number], [number, number]],
  ): (x: number) => number | void {
    return (
      x: number,
    ): number | void => this.calcYByXOnLine(x, points);
  }

  //done
  calcXByYOnLine(
    y: number,
    [[x1, y1], [x2, y2]]: [[number, number], [number, number]],
  ): number | void {
    if (y2 === y1) return;

    return (
      (y - y1) * (x2 - x1) / (y2 - y1)
    ) + x1;
  }

  //done
  calcYByXOnLine(
    x: number,
    [[x1, y1], [x2, y2]]: [[number, number], [number, number]],
  ): number | void {
    if (x2 === x1) return;

    return (
      (x - x1) * (y2 - y1) / (x2 - x1)
    )  + y1;
  }

  calcPointDecimalRemains(point: grider.PointHex): grider.PointHex {
    const remains: grider.PointHex = Object.keys(point)
      .reduce((remains: any, key: string) => {
        const value = point[key];
        const remain = this.math.decRemain(value);

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
