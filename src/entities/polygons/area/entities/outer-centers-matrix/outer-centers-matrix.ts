import { CentersMatrix } from "../centers-matrix";
import { CenterPoint, GeoPoint } from "../../../../points";
import { getOuterCentersMatrix } from "./utils/get-outer-centers";
import { calcTopLeft } from "../../utils/calc-top-left";
import { getOuterPoly } from "./utils/build-outer-poly";

type OuterCentersMatrixPayload = Array<(CenterPoint | "outer" | undefined)>[]

export class OuterCentersMatrix extends CentersMatrix {
  payload: OuterCentersMatrixPayload;

  constructor(
    payload: OuterCentersMatrixPayload, 
    topLeft: CenterPoint
  ) {
    super(payload, topLeft);

    this.payload = payload;
  }

  static fromCentersMatrix(matrix: CentersMatrix): OuterCentersMatrix {
    const payload = getOuterCentersMatrix(matrix);
    const topLeft = calcTopLeft(payload);

    return new OuterCentersMatrix(payload, topLeft);
  }

  toPoly(): GeoPoint[] {
    return getOuterPoly(this);
  }
}