import { GridParams } from '../../../../../../grid-params';
import { CenterPoint } from '../../../../../../points/center-point';
export declare function getNearestEmpties(i: number, j: number, matrix: Array<Array<CenterPoint | undefined | 'inner' | 'outer'>>, params: GridParams, emptiesCoords?: number[][]): number[][];
