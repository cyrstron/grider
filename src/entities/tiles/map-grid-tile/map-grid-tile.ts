import {TileMercPoint} from '../../points/tile-merc-point';
import { GridParams } from '../../grid-params';
import { GridPattern } from '../grid-pattern';

import {createPatterns} from './utils/create-patterns'
import { GeoPoint } from '../../points/geo-point';

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

    get northWest(): GeoPoint {
        return this.tilePoint.toSphere();
    }

    get southWest(): GeoPoint {
        return this.tilePoint.south.toSphere();
    }

    get northEast(): GeoPoint {
        return this.tilePoint.east.toSphere();
    }

    get southEast(): GeoPoint {
        return this.tilePoint.south.east.toSphere();
    }

    get north(): number {
        return this.northWest.lat;
    }

    get west(): number {
        return this.northWest.lng;
    }
    
    get south(): number {
        return this.southWest.lat;
    }
    
    get east(): number {
        return this.northEast.lng;
    }
}
