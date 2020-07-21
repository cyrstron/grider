import { GridParams } from '../../grid-params';
import { TileMercPoint } from '../../points/tile-merc-point';
import { GridPattern } from '../grid-pattern';
import { GeoPoint } from '../../points/geo-point';
import { PatternWorker } from './utils/pattern-worker';
export declare class MapGridTile {
    tilePoint: TileMercPoint;
    patterns: GridPattern[];
    params: GridParams;
    get northWest(): GeoPoint;
    get southWest(): GeoPoint;
    get northEast(): GeoPoint;
    get southEast(): GeoPoint;
    get north(): number;
    get west(): number;
    get south(): number;
    get east(): number;
    static fromTileCoords({ x, y }: grider.Point, params: GridParams, zoom: number, tileWidth: number, tileHeight: number): Promise<MapGridTile>;
    static fromTilePoint(tilePoint: TileMercPoint, params: GridParams): Promise<MapGridTile>;
    toPlain(): grider.MapGridTile;
    static worker?: PatternWorker;
    static fromPlain({ tilePoint: tileLiteral, patterns }: grider.MapGridTile, params: GridParams): MapGridTile;
    constructor(tilePoint: TileMercPoint, patterns: GridPattern[], params: GridParams);
}
