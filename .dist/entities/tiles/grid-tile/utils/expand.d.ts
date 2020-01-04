import { GridParams } from '../../../grid-params';
import { GeoPoint } from '../../../points/geo-point';
import { Point } from '../../../points/point';
import { TileMercPoint } from '../../../points/tile-merc-point';
export declare function expandTile(geoPoint: GeoPoint, startTilePoint: TileMercPoint, tileWidth: number, tileHeight: number, params: GridParams): Point[][];
