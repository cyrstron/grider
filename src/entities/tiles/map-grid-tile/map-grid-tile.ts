import { GridParams } from '../../grid-params';
import {TileMercPoint} from '../../points/tile-merc-point';
import { GridPattern } from '../grid-pattern';

import { GeoPoint } from '../../points/geo-point';
import {createPatterns} from './utils/create-patterns';
import { WorkerService } from '../../../services/worker-service';

import Worker from './workers/create-pattern.worker';

export class MapGridTile {
  get northWest(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint);
  }

  get southWest(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint.southTile);
  }

  get northEast(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint.eastTile);
  }

  get southEast(): GeoPoint {
    return GeoPoint.fromMerc(this.tilePoint.southTile.eastTile);
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

  static fromTileCoords(
    {x, y}: grider.Point,
    params: GridParams,
    zoom: number,
    tileWidth: number,
    tileHeight: number,
  ): Promise<MapGridTile> {
    const tilePoint = TileMercPoint.fromTile(x, y, tileWidth, tileHeight, zoom);

    return MapGridTile.fromTilePoint(tilePoint, params);
  }

  static async fromTilePoint(
    tilePoint: TileMercPoint,
    params: GridParams,
  ): Promise<MapGridTile> {
    if (!MapGridTile.worker) {
      MapGridTile.worker = new WorkerService(new Worker());

      await MapGridTile.worker.post({
        type: 'params',
        payload: {
          params: params.toPlain()
        }
      });
    }

    if (!MapGridTile.worker) return new MapGridTile(tilePoint, [], params);

    const {data: mapTile} = await MapGridTile.worker.post({
      type: 'grid-tile',
      payload: {
        tilePoint: tilePoint.toPlain()
      }
    });

    return MapGridTile.fromPlain(mapTile, params);
  }

  toPlain(): grider.MapGridTile {
    return {
      patterns: this.patterns.map((pattern) => pattern.toPlain()),
      tilePoint: this.tilePoint.toPlain(),
    };
  }

  static worker?: WorkerService<any>;

  static fromPlain(
    {tilePoint: tileLiteral, patterns}: grider.MapGridTile,
    params: GridParams,
  ): MapGridTile {
    const tilePoint = TileMercPoint.fromPlain(tileLiteral);

    return new MapGridTile(
      tilePoint,
      patterns.map((pattern) => GridPattern.fromPlain(pattern, tilePoint, params)),
      params,
    );
  }
  
  constructor(
    public tilePoint: TileMercPoint,
    public patterns: GridPattern[],
    public params: GridParams,
  ) {}
}
