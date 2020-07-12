import { CenterPoint } from '../center-point';
export declare function isHexNeighbor({ i: iA, j: jA, k: kA }: grider.GridPoint, { i: iB, j: jB, k: kB }: grider.GridPoint): boolean;
export declare function isRectNeighbor({ i: iA, j: jA }: grider.GridPoint, { i: iB, j: jB }: grider.GridPoint): boolean;
export declare function isNeighbor(centerA: CenterPoint, centerB: CenterPoint): boolean;
