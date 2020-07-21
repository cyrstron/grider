import { CenterPoint } from '../../../../../points/center-point';
import { GeoPoint } from '../../../../../points/geo-point';
import { CentersMatrix } from '../centers-matrix';
export declare abstract class PolyMatrix extends CentersMatrix {
    abstract get startIndexes(): number[];
    abstract touchedInnerIndexes(i: number, j: number): number[][];
    abstract touchedOuterIndexes(i: number, j: number): number[][];
    get startPoints(): GeoPoint[];
    startIndexesBy(callback: (value: CenterPoint | 'inner' | 'outer' | undefined) => boolean): [number, number];
    nextIndexes(points: GeoPoint[], startI: number, startJ: number, prevI?: number, prevJ?: number): [number, number];
    nextPoints(points: GeoPoint[], outerI: number, outerJ: number, isInner?: boolean): GeoPoint[];
    toPoly(isInner?: boolean): GeoPoint[];
}
