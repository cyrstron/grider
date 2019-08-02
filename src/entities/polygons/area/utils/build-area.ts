import { CenterPoint } from "../../../points/center-point";
import { GeoPoint } from "../../../points/geo-point";

import {getBiggestSet} from './biggest-set';
import { CentersMatrix } from "../entities/centers-matrix";
import { OuterCentersMatrix } from "../entities/outer-centers-matrix";
import { InnerCentersMatrix } from "../entities/inner-centers-matrix";

export function buildArea(centers: CenterPoint[]): GeoPoint[][] {
  if (centers.length === 0) return [[]];
  if (centers.length === 1) return [centers[0].toCell().points];

  const matrix = CentersMatrix.fromCenters(centers);
  console.log('Full matrix:');
  console.log(matrix);
  const set = getBiggestSet(matrix);
  console.log('Biggest set:');
  console.log(set);
  const filteredMatrix = matrix.filterBySet(set);
  console.log('Filtered matrix:');
  console.log(filteredMatrix);
  const {innerEmpties} = filteredMatrix;

  const outerMatrix = OuterCentersMatrix.fromCentersMatrix(filteredMatrix);
  console.log('Outer matrix:');
  console.log(outerMatrix);
  const innerMatrixes = innerEmpties.map(
    (empties) => InnerCentersMatrix.fromCentersMatrix(filteredMatrix, empties)
  );
  console.log('Inner matrixes:');
  console.log(innerMatrixes);
  const outerPoints = outerMatrix.toPoly();
  const innerPolys = innerMatrixes.map(
    (innerMatrix) => innerMatrix.toPoly()
  );

  console.log('Outer poly');
  console.log(outerPoints);
  console.log('Inner polys');
  console.log(innerPolys);

  return [outerPoints, ...innerPolys];
}
