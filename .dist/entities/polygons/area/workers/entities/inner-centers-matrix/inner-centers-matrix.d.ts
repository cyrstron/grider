import { CenterPoint } from '../../../../../points/center-point';
import { GeoPoint } from '../../../../../points/geo-point';
import { CentersMatrix } from '../centers-matrix';
import { PolyMatrix } from '../poly-matrix';
declare type InnerCentersMatrixPayload = Array<Array<CenterPoint | 'inner' | undefined>>;
export declare class InnerCentersMatrix extends PolyMatrix {
    readonly startIndexes: [number, number];
    static fromCentersMatrix(matrix: CentersMatrix, empties: number[][]): InnerCentersMatrix;
    payload: InnerCentersMatrixPayload;
    constructor(payload: InnerCentersMatrixPayload, topLeft: CenterPoint);
    touchedInnerIndexes(i: number, j: number): number[][];
    touchedOuterIndexes(i: number, j: number): number[][];
    toPoly(): GeoPoint[];
    removeEmptyLines(): InnerCentersMatrix;
}
export {};
