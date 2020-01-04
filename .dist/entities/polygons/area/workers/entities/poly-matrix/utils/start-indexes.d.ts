import { CenterPoint } from '../../../../../../points/center-point';
import { PolyMatrix } from '../poly-matrix';
export declare function getStartIndexesTouchedBy(matrix: PolyMatrix, callback: (value: CenterPoint | 'inner' | 'outer' | undefined) => boolean): [number, number];
