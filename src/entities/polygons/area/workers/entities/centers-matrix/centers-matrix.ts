import { CenterPoint } from '../../../../../points/center-point';
import { Cell } from '../../../../cell';
import {calcTopLeft} from '../../utils/calc-top-left';
import { calcNearestAndTouchedIndexes, calcNearestIndexes } from '../../utils/nearest-indexes';
import {buildMatrix} from './utils/build-matrix';
import {isOnAntiMeridian} from './utils/is-anti-meridian';
import { getNearestEmpties } from './utils/nearest-empties';

type MatrixPayload = Array<Array<CenterPoint | 'outer' | 'inner' | undefined>>;

export class CentersMatrix {

  get outerCoords(): number[][] {
    const outerEmptinessIndexes: number[][] = [];

    const rowLength = this.payload.length;
    const columnLength = this.payload[0].length;

    const maxI = rowLength - 1;
    const maxJ = columnLength - 1;

    for (let j = 0; j < columnLength; j += 1) {
      outerEmptinessIndexes.push([0, j]);
    }

    for (let i = 0; i < rowLength; i += 1) {
      outerEmptinessIndexes.push([i, maxJ]);
    }

    for (let j = 0; j < columnLength; j += 1) {
      outerEmptinessIndexes.push([maxI, j]);
    }

    for (let i = 0; i < rowLength; i += 1) {
      outerEmptinessIndexes.push([i, 0]);
    }

    return outerEmptinessIndexes;
  }

  get borderEmpties(): number[][] {
    const {outerCoords} = this;
    const {params} = this.topLeft;

    return outerCoords.reduce((borderEmpties, [i, j]) => {
      if (this.payload[i][j]) return borderEmpties;

      const hasPoint = borderEmpties
        .some(([i2, j2]) => i === i2 && j === j2);

      if (hasPoint) return borderEmpties;

      const coords = getNearestEmpties(i, j, this.payload, params);

      borderEmpties.push(...coords);

      return borderEmpties;
    }, [] as number[][]);
  }

  get innerEmpties(): number[][][] {
    const {
      borderEmpties,
      topLeft: {params},
    } = this;

    return this.payload.reduce((innerEmpties, row, i) =>
      row.reduce((innerEmpties, _center, j) => {
        if (this.payload[i][j]) return innerEmpties;

        const hasPoint = borderEmpties
          .some(([i2, j2]) => i === i2 && j === j2) ||
          innerEmpties.some(
            (empties) => empties.some(([i2, j2]) => i === i2 && j === j2),
          );

        if (hasPoint) return innerEmpties;

        const coords = getNearestEmpties(i, j, this.payload, params);

        innerEmpties.push(coords);

        return innerEmpties;
      }, innerEmpties),
    [] as number[][][]);
  }

  static fromCenters(centers: CenterPoint[]): CentersMatrix {
    const isAntiMeridian = isOnAntiMeridian(centers);
    const matrix = buildMatrix(centers, isAntiMeridian);
    const topLeft = calcTopLeft(matrix);

    return new CentersMatrix(matrix, topLeft);
  }
  constructor(
    public payload: MatrixPayload,
    public topLeft: CenterPoint,
  ) {}

  removeEmptyLines(): CentersMatrix {
    const filtered = this.payload.filter((row) =>
      !row.every((point) => !(point instanceof CenterPoint)),
    );

    const emptyColumnsIndexes: number[] = [];

    for (let i = 0; i < filtered[0].length; i += 1) {
      const isColumnEmpty = filtered.reduce((isColumnEmpty, row) => {
        if (!isColumnEmpty) return isColumnEmpty;

        const value = row[i];

        return !(value instanceof CenterPoint);
      }, true);

      if (isColumnEmpty) {
        emptyColumnsIndexes.push(i);
      }
    }

    const matrix = filtered.map((row) => row
      .filter((_center, index) => !emptyColumnsIndexes.includes(index)),
    );
    const topLeft = calcTopLeft(matrix);

    return new CentersMatrix(matrix, topLeft);
  }

  filterBySet(set: Set<CenterPoint>): CentersMatrix {
    const payload = this.payload.map((row) => row.map(
      (point) => {
        return point instanceof CenterPoint && set.has(point) ?
          point :
          undefined;
      },
    ));

    return new CentersMatrix(payload, this.topLeft)
      .removeEmptyLines();
  }

  equivalentCenter(i: number, j: number): CenterPoint {
    return this.topLeft.moveByDiff(i, j);
  }

  equivalentCell(i: number, j: number): Cell {
    const equivalentCenter =  this.equivalentCenter(i, j);

    return Cell.fromCenter(equivalentCenter);
  }

  touchedCenters(i: number, j: number): number[][] {
    return calcNearestAndTouchedIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && (
          this.payload[i][j] instanceof CenterPoint
      ));
  }

  nearestCenters(i: number, j: number): number[][] {
    return calcNearestIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && (
          this.payload[i][j] instanceof CenterPoint
      ));
  }

  touchedEmpties(i: number, j: number): number[][] {
    return calcNearestAndTouchedIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && !(
          this.payload[i][j] instanceof CenterPoint
      ));
  }

  nearestEmpties(i: number, j: number): number[][] {
    return calcNearestIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && !(
          this.payload[i][j] instanceof CenterPoint
      ));
  }

  touchedInnerEmpties(i: number, j: number): number[][] {
    return calcNearestAndTouchedIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && (
          this.payload[i][j] === 'inner'
      ));
  }

  nearestInnerEmpties(i: number, j: number): number[][] {
    return calcNearestIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && (
          this.payload[i][j] === 'inner'
      ));
  }

  touchedOuterEmpties(i: number, j: number): number[][] {
    return calcNearestAndTouchedIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && (
          this.payload[i][j] === 'outer'
      ));
  }

  nearestOuterEmpties(i: number, j: number): number[][] {
    return calcNearestIndexes(i, j, this.topLeft.params)
      .filter(
        ([i, j]) => this.payload[i] && (
          this.payload[i][j] === 'outer'
      ));
  }
}
