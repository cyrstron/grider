import { CenterPoint } from "../../../../points";
import { CentersMatrix } from "../centers-matrix";
import { getInnerCentersMatrix } from "./utils/get-inner-centers";
import { calcTopLeft } from "../../utils/calc-top-left";

type InnerCentersMatrixPayload = Array<CenterPoint | 'inner' | undefined>[];

export class InnerCentersMatrix extends CentersMatrix {
  payload: InnerCentersMatrixPayload;

  constructor(
    payload: InnerCentersMatrixPayload, 
    topLeft: CenterPoint
  ) {
    super(payload, topLeft);

    this.payload = payload;
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