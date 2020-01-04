import { GeoPoint } from '../../../../../points/geo-point';
import { Point } from '../../../../../points/point';
import { TileMercPoint } from '../../../../../points/tile-merc-point';
import { SideIndexation } from '../side-indexation';
import { TileIntersection } from '../tile-intersection';
export interface SpreadedPoint {
    index: number;
    point: GeoPoint;
}
export declare type SpreadedSide = SpreadedPoint[];
export declare type SpreadedFigure = SpreadedSide[];
export declare class Indexation {
    points: GeoPoint[];
    spreaded: SpreadedFigure;
    indexations: SideIndexation[];
    static fromPoints(points: GeoPoint[]): Indexation;
    constructor(points: GeoPoint[], spreaded: SpreadedFigure, indexations: SideIndexation[]);
    tileIntersection(tilePoint: TileMercPoint): TileIntersection;
    tileBorderPoints(tilePoint: TileMercPoint): Point[];
}
