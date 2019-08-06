import { CenterPoint } from '../../../../../points/center-point';
import { GeoPoint } from '../../../../../points/geo-point';
import { calcTopLeft } from '../../utils/calc-top-left';
import { CentersMatrix } from '../centers-matrix';
import {PolyMatrix} from '../poly-matrix';
import { getInnerCentersMatrix } from './utils/get-inner-centers';

type InnerCentersMatrixPayload = Array<Array<CenterPoint | 'inner' | undefined>>;

export class InnerCentersMatrix extends PolyMatrix {

  get startIndexes(): [number, number] {
    return this.startIndexesBy((value) => value === 'inner');
  }

  static fromCentersMatrix(
    matrix: CentersMatrix,
    empties: number[][],
  ): InnerCentersMatrix {
    const payload = getInnerCentersMatrix(matrix, empties);
    const topLeft = calcTopLeft(payload);

    return new InnerCentersMatrix(payload, topLeft).removeEmptyLines();
  }
  payload: InnerCentersMatrixPayload;

  constructor(
    payload: InnerCentersMatrixPayload,
    topLeft: CenterPoint,
  ) {
    super(payload, topLeft);

    this.payload = payload;
  }

  touchedInnerIndexes(i: number, j: number): number[][] {
    return this.touchedInnerEmpties(i, j);
  }

  touchedOuterIndexes(i: number, j: number): number[][] {
    return this.touchedCenters(i, j);
  }

  toPoly(): GeoPoint[] {
    return super.toPoly(true).reverse();
  }

  removeEmptyLines(): InnerCentersMatrix {
    const {payload, topLeft} = super.removeEmptyLines();

    return new InnerCentersMatrix(payload as InnerCentersMatrixPayload, topLeft);
  }
}
