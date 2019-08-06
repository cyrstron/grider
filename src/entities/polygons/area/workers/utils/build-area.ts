import { CenterPoint } from '../../../../points/center-point';
import { GeoPoint } from '../../../../points/geo-point';

import { Cell } from '../../../cell';
import { CentersMatrix } from '../entities/centers-matrix';
import { InnerCentersMatrix } from '../entities/inner-centers-matrix';
import { OuterCentersMatrix } from '../entities/outer-centers-matrix';
import {getBiggestSet} from './biggest-set';

export function buildArea(centers: CenterPoint[]): GeoPoint[][] {
  if (centers.length === 0) return [[]];
  if (centers.length === 1) return [Cell.fromCenter(centers[0]).points];

  const matrix = CentersMatrix.fromCenters(centers);
  const set = getBiggestSet(matrix);
  const filteredMatrix = matrix.filterBySet(set);
  const {innerEmpties} = filteredMatrix;

  const outerMatrix = OuterCentersMatrix.fromCentersMatrix(filteredMatrix);
  const innerMatrixes = innerEmpties.map(
    (empties) => InnerCentersMatrix.fromCentersMatrix(filteredMatrix, empties),
  );
  const outerPoints = outerMatrix.toPoly();
  const innerPolys = innerMatrixes.map(
    (innerMatrix) => innerMatrix.toPoly(),
  );

  return [outerPoints, ...innerPolys];
}

export function pickBiggestSet(centers: CenterPoint[]): CenterPoint[] {
  if (centers.length === 0) return [];

  const matrix = CentersMatrix.fromCenters(centers);

  return [...getBiggestSet(matrix)];
}