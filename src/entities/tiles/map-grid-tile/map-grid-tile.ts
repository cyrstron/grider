import {TileMercPoint} from '../../points/tile-merc-point';
import { GridParams } from '../../grid-params';
import { GridPattern } from '../grid-pattern/grid-pattern';

import {createPatterns} from './utils/create-patterns'

export class MapGridTile {
    constructor(
        public tilePoint: TileMercPoint,
        public patterns: GridPattern[],
        public params: GridParams,
    ) {}
    
    fromTileCoords(
        {x, y}: grider.Point,
        params: GridParams,
        zoom: number,
        tileWidth: number,
        tileHeight: number,
    ) {
        const tilePoint = TileMercPoint.fromTile(x, y, tileWidth, tileHeight, zoom);

        const patterns = createPatterns(tilePoint, params);

        return new MapGridTile(tilePoint, patterns, params);
    }
}
