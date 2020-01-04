import { GridParams } from '../../grid-params';
import { TileMercPoint } from '../../points/tile-merc-point';
import { GridPattern } from '../grid-pattern';
import { GeoPoint } from '../../points/geo-point';
import { PatternWorker } from './utils/pattern-worker';
export declare class MapGridTile {
    tilePoint: TileMercPoint;
    patterns: GridPattern[];
    params: GridParams;
    readonly northWest: GeoPoint;
    readonly southWest: GeoPoint;
    readonly northEast: GeoPoint;
    readonly southEast: GeoPoint;
    readonly north: number;
    readonly west: number;
    readonly south: number;
    readonly east: number;
    static fromTileCoords({ x, y }: grider.Point, params: GridParams, zoom: number, tileWidth: number, tileHeight: number): Promise<MapGridTile>;
    static fromTilePoint(tilePoint: TileMercPoint, params: GridParams): Promise<MapGridTile>;
    toPlain(): grider.MapGridTile;
    static worker?: PatternWorker;
    static fromPlain({ tilePoint: tileLiteral, patterns }: grider.MapGridTile, params: GridParams): MapGridTile;
    constructor(tilePoint: TileMercPoint, patterns: GridPattern[], params: GridParams);
}
