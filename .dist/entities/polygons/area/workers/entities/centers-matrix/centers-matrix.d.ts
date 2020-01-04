import { CenterPoint } from '../../../../../points/center-point';
import { Cell } from '../../../../cell';
declare type MatrixPayload = Array<Array<CenterPoint | 'outer' | 'inner' | undefined>>;
export declare class CentersMatrix {
    payload: MatrixPayload;
    topLeft: CenterPoint;
    readonly outerCoords: number[][];
    readonly borderEmpties: number[][];
    readonly innerEmpties: number[][][];
    static fromCenters(centers: CenterPoint[]): CentersMatrix;
    constructor(payload: MatrixPayload, topLeft: CenterPoint);
    removeEmptyLines(): CentersMatrix;
    filterBySet(set: Set<CenterPoint>): CentersMatrix;
    equivalentCenter(i: number, j: number): CenterPoint;
    equivalentCell(i: number, j: number): Cell;
    touchedCenters(i: number, j: number): number[][];
    nearestCenters(i: number, j: number): number[][];
    touchedEmpties(i: number, j: number): number[][];
    nearestEmpties(i: number, j: number): number[][];
    touchedInnerEmpties(i: number, j: number): number[][];
    nearestInnerEmpties(i: number, j: number): number[][];
    touchedOuterEmpties(i: number, j: number): number[][];
    nearestOuterEmpties(i: number, j: number): number[][];
}
export {};
