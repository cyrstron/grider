import { GridParams } from '../../grid-params';
import { Point } from '../../points/point';
import { TileMercPoint } from '../../points/tile-merc-point';
export declare class GridTile {
    points: Point[][];
    tilePoint: TileMercPoint;
    tileWidth: number;
    tileHeight: number;
    params: GridParams;
    static fromTileCoords(tilePoint: TileMercPoint, start: Point, params: GridParams): GridTile;
    static fromPlain({ points, tileHeight, tileWidth }: {
        points: grider.Point[][];
        tileHeight: number;
        tileWidth: number;
    }, tilePoint: TileMercPoint, params: GridParams): GridTile;
    constructor(points: Point[][], tilePoint: TileMercPoint, tileWidth: number, tileHeight: number, params: GridParams);
    toPlain(): grider.GridTile;
}
