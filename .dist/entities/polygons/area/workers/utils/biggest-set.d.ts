import { CenterPoint } from '../../../../points/center-point';
import { CentersMatrix } from '../entities/centers-matrix';
export declare function unionNearestCenters(i: number, j: number, matrix: CentersMatrix, set?: Set<CenterPoint>): Set<CenterPoint>;
export declare function getBiggestSet(matrix: CentersMatrix): Set<CenterPoint>;
