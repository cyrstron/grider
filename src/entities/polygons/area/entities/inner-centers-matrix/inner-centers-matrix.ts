import { CenterPoint } from "../../../../points/center-point";
import { GeoPoint } from "../../../../points/geo-point";
import { CentersMatrix } from "../centers-matrix";
import { getInnerCentersMatrix } from "./utils/get-inner-centers";
import { calcTopLeft } from "../../utils/calc-top-left";
import {PolyMatrix} from '../poly-matrix';

type InnerCentersMatrixPayload = Array<CenterPoint | 'inner' | undefined>[];

export class InnerCentersMatrix extends PolyMatrix {
  payload: InnerCentersMatrixPayload;

  constructor(
    payload: InnerCentersMatrixPayload, 
    topLeft: CenterPoint
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

  get startIndexes(): [number, number] {
    return this.startIndexesBy((value) => value === 'inner');
  }

  static fromCentersMatrix(
    matrix: CentersMatrix, 
    empties: number[][]
  ): InnerCentersMatrix {
    const payload = getInnerCentersMatrix(matrix, empties);
    const topLeft = calcTopLeft(payload);

    return new InnerCentersMatrix(payload, topLeft).removeEmptyLines();
  }

  removeEmptyLines(): InnerCentersMatrix {
    const {payload, topLeft} = super.removeEmptyLines();

    return new InnerCentersMatrix(payload as InnerCentersMatrixPayload, topLeft);
  }
}