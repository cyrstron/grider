import {TileMercPoint} from '../../points/tile-merc-point';
import { GridParams } from '../../grid-params';

export class MapGridTile {
  
    fromTileCoords(
        {x, y}: grider.Point,
        params: GridParams,
        zoom: number,
        tileWidth: number,
        tileHeight: number,
    ) {
        const tilePoint = TileMercPoint.fromTile(x, y, tileWidth, tileHeight, zoom);
        const delta = tilePoint.gridTileStartDelta(params);


    }
}