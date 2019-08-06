import { CenterPoint } from '../../../../../points/center-point';
import { GeoPoint } from '../../../../../points/geo-point';
import { calcTopLeft } from '../../utils/calc-top-left';
import { CentersMatrix } from '../centers-matrix';
import { PolyMatrix } from '../poly-matrix';
import { getOuterCentersMatrix } from './utils/get-outer-centers';

type OuterCentersMatrixPayload = Array<Array<(CenterPoint | 'outer' | undefined)>>;

export class OuterCentersMatrix extends PolyMatrix {

  get startIndexes(): [number, number] {
    return this.startIndexesBy((value) => value instanceof CenterPoint);
  }

  static fromCentersMatrix(matrix: CentersMatrix): OuterCentersMatrix {
    const payload = getOuterCentersMatrix(matrix);
    const topLeft = calcTopLeft(payload);

    return new OuterCentersMatrix(payload, topLeft);
  }
  payload: OuterCentersMatrixPayload;

  constructor(
    payload: OuterCentersMatrixPayload,
    topLeft: CenterPoint,
  ) {
    super(payload, topLeft);

    this.payload = payload;
  }

  touchedInnerIndexes(i: number, j: number): number[][] {
    return this.touchedCenters(i, j);
  }

  touchedOuterIndexes(i: number, j: number): number[][] {
    return this.touchedOuterEmpties(i, j);
  }

  toPoly(): GeoPoint[] {
    return super.toPoly();
  }

  removeEmptyLines(): OuterCentersMatrix {
    const {
      payload,
      topLeft,
    } = super.removeEmptyLines();

    return new OuterCentersMatrix(
      payload as OuterCentersMatrixPayload,
      topLeft,
    );
  }

}
