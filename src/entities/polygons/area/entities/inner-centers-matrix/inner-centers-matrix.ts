import { CenterPoint, GeoPoint } from "../../../../points";
import { CentersMatrix } from "../centers-matrix";
import { getInnerCentersMatrix } from "./utils/get-inner-centers";
import { calcTopLeft } from "../../utils/calc-top-left";
import {getInnerPoly} from './utils/build-inner-poly';
import { calcNearestAndTouchedIndexes } from "../../utils/nearest-indexes";

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

  toPoly(): GeoPoint[] {
    return getInnerPoly(this);
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
        return hasNearest || (!!payload[i] && payload[i][j] === 'inner');
      }, false);

      return hasNearest ? j : startJ;
    }, undefined as undefined | number) as number;

    return [startI, startJ];
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