import { GridParams } from '../grid-params';
import { Point } from '../points/point';
import { TileMercPoint } from '../points/tile-merc-point';
import { GridTile } from './grid-tile/grid-tile';
export declare class GridPattern {
    tilePoint: TileMercPoint;
    tile: GridTile;
    start: Point;
    end: Point;
    params: GridParams;
    static fromTileCoords(tilePoint: TileMercPoint, start: Point, params: GridParams): GridPattern;
    constructor(tilePoint: TileMercPoint, tile: GridTile, start: Point, end: Point, params: GridParams);
    toPlain(): grider.GridPattern;
    static fromPlain({ start, end, tile, }: grider.GridPattern, tilePoint: TileMercPoint, params: GridParams): GridPattern;
}
