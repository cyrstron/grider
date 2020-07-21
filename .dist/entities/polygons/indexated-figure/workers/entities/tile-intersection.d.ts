import { TileMercPoint } from '../../../../points/tile-merc-point';
import { BoundIntersection } from './bound-intersection';
import { SplitGeoSegment } from './split-geo-segment';
declare type Intersects = {
    [key in grider.Cardinal]: SplitGeoSegment[];
};
export declare class TileIntersection implements Intersects {
    tilePoint: TileMercPoint;
    north: SplitGeoSegment[];
    south: SplitGeoSegment[];
    east: SplitGeoSegment[];
    west: SplitGeoSegment[];
    get isContained(): boolean;
    get keys(): grider.Cardinal[];
    get isEmpty(): boolean;
    get pointsIndexes(): number[];
    static fromBounds(tilePoint: TileMercPoint, north: BoundIntersection[], south: BoundIntersection[], east: BoundIntersection[], west: BoundIntersection[]): TileIntersection;
    constructor(tilePoint: TileMercPoint, north: SplitGeoSegment[], south: SplitGeoSegment[], east: SplitGeoSegment[], west: SplitGeoSegment[]);
    normalize(): TileIntersection;
    forEach(callback: (segments: SplitGeoSegment[], cardinal: grider.Cardinal) => void): void;
    map<Result = SplitGeoSegment>(callback: (segments: SplitGeoSegment[], cardinal: grider.Cardinal) => Result): Result[];
    reduce<Result = SplitGeoSegment>(callback: (result: Result, segments: SplitGeoSegment[], cardinal: grider.Cardinal) => Result, result: Result): Result;
    tileContainedByDirection(direction: grider.Cardinal): boolean;
    tileOverlappedByDirection(direction: grider.Cardinal): boolean;
}
export {};
