import { CentersMatrix } from "../centers-matrix";
import { CenterPoint, GeoPoint } from "../../../../points";
import { getOuterCentersMatrix } from "./utils/get-outer-centers";
import { calcTopLeft } from "../../utils/calc-top-left";
import { getOuterPoly } from "./utils/build-outer-poly";
import { calcNearestAndTouchedIndexes } from "../../utils/nearest-indexes";

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

  get startIndexes(): [number, number] {
    const {
      payload,
      topLeft: {params}
    } = this;
    
    const startI: number = 0;
    const startJ = payload[0].reduce((startJ, _value, j) => {
      if (startJ !== undefined) return startJ;

      const nearest = calcNearestAndTouchedIndexes(startI, j, params);
      const hasNearest = nearest.reduce((hasNearest, [i, j]) => {
        return hasNearest || (!!payload[i] && payload[i][j] instanceof CenterPoint);
      }, false);

      return hasNearest ? j : startJ;
    }, undefined as undefined | number) as number;

    return [startI, startJ];
  }

  removeEmptyLines(): OuterCentersMatrix {
    const {
      payload, 
      topLeft
    } = super.removeEmptyLines();

    return new OuterCentersMatrix(
      payload as OuterCentersMatrixPayload, 
      topLeft
    );
  }
}