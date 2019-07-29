import { CenterPoint, GeoPoint } from "../../../points";

import {getBiggestSet} from './biggest-set';
import { CentersMatrix } from "../entities/centers-matrix";
import { OuterCentersMatrix } from "../entities/outer-centers-matrix";
import { InnerCentersMatrix } from "../entities/inner-centers-matrix";

export function buildArea(centers: CenterPoint[]): GeoPoint[][] {
  if (centers.length === 0) return [[]];
  if (centers.length === 1) return [centers[0].toCell().points];

  const matrix = CentersMatrix.fromCenters(centers);
  const set = getBiggestSet(matrix);
  const filteredMatrix = matrix.filterBySet(set);

  const {innerEmpties} = filteredMatrix;

  const outerMatrix = OuterCentersMatrix.fromCentersMatrix(filteredMatrix);
  const innerMatrixes = innerEmpties.map(
    (empties) => InnerCentersMatrix.fromCentersMatrix(filteredMatrix, empties)
  );
  const outerPoints = outerMatrix.toPoly();

  return [outerPoints];
}
