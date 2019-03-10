import {MathUtils} from './math.utils';

export class GeometryUtils {
  constructor(
    public math: MathUtils, 
  ) {}

  calcSectionsIntersect(
    sectionA: [[number, number], [number, number]],
    sectionB: [[number, number], [number, number]],
  ): [number, number] | undefined {    
    const [[x1, y1], [x2, y2]] = sectionA;
    const [[x3, y3], [x4, y4]] = sectionB;

    const coofsA = this.calcFlatLineCoofs(sectionA);
    const coofsB = this.calcFlatLineCoofs(sectionB);

    const intersect = this.resolveFlatLineMatrix([coofsA, coofsB]);

    if (!intersect) return;

    const [x, y] = intersect;

    if (
      Math.max(x1, x2) < x ||
      Math.min (x1, x2) > x ||
      Math.max (x3, x4) < x ||
      Math.min (x3, x4) > x ||
      Math.max(y1, y2) < y ||
      Math.min (y1, y2) > y ||
      Math.max (y3, y4) < y ||
      Math.min (y3, y4) > y
    ) return;

    return intersect;
  }

  calcFlatLineCoofs(
    [[x1, y1], [x2, y2]]: [
      [number, number], [number, number]
  ]): [number, number, number] {
    return [
      y1 - y2,
      x2 - x1,
      -((x1 * y2) - (y1 * x2))
    ];
  }

  resolveFlatLineMatrix(
    [[a1, b1, c1], [a2, b2, c2]]: number[][]
  ): [number, number] | undefined {
    const delta = a1 * b2 - b1 * a2;
    const deltaX = c1 * b2 - b1 * c2;
    const deltaY = a1 * c2 - c1 * a2;

    if (delta === 0) return;

    return [
      deltaX / delta,
      deltaY / delta,
    ]
  }

  calcXLineEquation(
    [[x1, y1], [x2, y2]]: [[number, number], [number, number]]
  ): (y: number) => number {
    return (y: number): number => {
      return (
        y - y1 / (y2 - y1)
      ) * (x2 - x1) + x1;
    }
  }

  calcYLineEquation(
    [[x1, y1], [x2, y2]]: [[number, number], [number, number]]
  ): (x: number) => number {
    return (x: number): number => {      
      return (
        x - x1 / (x2 - x1)
      ) * (y2 - y1) + y1;
    }
  }

  calcLatIntersecs(
    lat: number,
    poly: grider.GeoPoint[],
  ): number[] | undefined {
    const intersecs = poly
      .reduce((
        intersecs: number[] | undefined,
        {lat: latA, lng: lngA}: grider.GeoPoint,
        index: number,
      ): number[] | undefined => {
        const {lat: latB, lng: lngB} = poly[index + 1] || poly[0];

        if (
          (latB < lat && latA < lat) || (latB > lat && latA > lat)
        ) return intersecs;

        const intersec = (lat * latA) / (latB - latA) *
        (lngB - lngA) / lngA;

        if (!intersecs) {
          intersecs = [];
        }

        intersecs.push(intersec);

        return intersecs;
      }, undefined);

    return intersecs;
  }

  sortLatIntersecs(intersecs: number[]): number[] {
    intersecs = intersecs.sort();

    const startIndex = intersecs
      .map((
        intersec: number,
        index: number,
      ): number => {
        const nextIntersec = intersecs[index + 1];

        if (nextIntersec !== undefined) {
          return nextIntersec - intersec;
        } else {
          return (180 - intersec) + (intersecs[0] + 180);
        }
      })
      .reduce((
        startIndex: number,
        gap: number,
        index: number,
        gaps: number[],
      ): number => {
        if (gap > gaps[startIndex]) {
          return index;
        } else {
          return startIndex;
        }
      }, 0);

    return [
      ...intersecs.slice(startIndex + 1),
      ...intersecs.slice(0, startIndex + 1),
    ];
  }

  buildLngSections(
    intersecs: number[],
  ): Array<{from: number, to: number}> {
    const sections = intersecs.reduce((
      sections: Array<{from: number, to: number}>,
      intersec: number,
      index: number,
    ): Array<{from: number, to: number}>  => {
      if (index % 2 !== 0) {
        sections.push({
          from: intersecs[index - 1],
          to: intersec,
        });
      }

      return sections;
    }, []);

    return sections;
  }

  polyContains(
    poly: grider.GeoPoint[],
    {lat, lng}: grider.GeoPoint,
  ): boolean {
    const intersecs = this.calcLatIntersecs(lat, poly);

    if (!intersecs) return false;

    const sortedIntersecs = this.sortLatIntersecs(intersecs);

    const sections = this.buildLngSections(sortedIntersecs);

    const isContains = sections.some((
      {from, to}: {from: number, to: number},
    ): boolean => from <= lng && to >= lng);

    return isContains;
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
