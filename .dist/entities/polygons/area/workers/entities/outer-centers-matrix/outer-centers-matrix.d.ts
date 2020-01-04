import { CenterPoint } from '../../../../../points/center-point';
import { GeoPoint } from '../../../../../points/geo-point';
import { CentersMatrix } from '../centers-matrix';
import { PolyMatrix } from '../poly-matrix';
declare type OuterCentersMatrixPayload = Array<Array<(CenterPoint | 'outer' | undefined)>>;
export declare class OuterCentersMatrix extends PolyMatrix {
    readonly startIndexes: [number, number];
    static fromCentersMatrix(matrix: CentersMatrix): OuterCentersMatrix;
    payload: OuterCentersMatrixPayload;
    constructor(payload: OuterCentersMatrixPayload, topLeft: CenterPoint);
    touchedInnerIndexes(i: number, j: number): number[][];
    touchedOuterIndexes(i: number, j: number): number[][];
    toPoly(): GeoPoint[];
    removeEmptyLines(): OuterCentersMatrix;
}
export {};
