import { MercPoint } from "./merc-point";
import {constants} from '../../constants';
import { GridParams } from "../grid-params";
import { Point } from "./point";

export class TileMercPoint extends MercPoint {
  tileX: number; 
  tileY: number;
  tileWidth: number;
  tileHeight: number;
  zoom: number;

  constructor(
    x: number,
    y: number,
    tileX: number, 
    tileY: number, 
    tileWidth: number, 
    tileHeight: number, 
    zoom: number
  ) {
    super(x, y);

    this.tileX = tileX;
    this.tileY = tileY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.zoom = zoom;
  }

  gridPatternStartPoint(params: GridParams): Point {
    const gridCenter = this.toSphere().toCenter(params);
    const {northWest} = gridCenter.northWestNeighbors;
    const gridTileTopLeft = northWest.toGeo().toMerc();

    const startTilePoint = TileMercPoint.fromMerc(
      gridTileTopLeft,
      this.tileWidth,
      this.tileHeight,
      this.zoom,
    );

    let x = startTilePoint.tileX - this.tileX;
    const y = startTilePoint.tileY - this.tileY;

    if (x > this.tileX) {
      x = x - Math.ceil(x);
    }

    return new Point(x, y);
  }

  get zoomCoofX(): number {
    return 2 ** this.zoom * constants.googleTileSize / this.tileWidth;
  }

  get zoomCoofY(): number {
    return 2 ** this.zoom * constants.googleTileSize / this.tileHeight;    
  }

  static fromTile(    
    tileX: number, 
    tileY: number, 
    tileWidth: number, 
    tileHeight: number, 
    zoom: number
  ): TileMercPoint {
    const x = tileX / (2 ** (zoom) * (constants.googleTileSize / tileWidth));
    const y = tileY / (2 ** (zoom) * (constants.googleTileSize / tileHeight));
    
    return new TileMercPoint(
      x,
      y,
      tileX,
      tileY,
      tileWidth,
      tileHeight,
      zoom
    );
  }

  static fromMerc(
    mercPoint: MercPoint,
    tileWidth: number,
    tileHeight: number,
    zoom: number,
  ): TileMercPoint {
    const tileX = mercPoint.x * (2 ** (zoom) * (constants.googleTileSize / tileWidth));
    const tileY = mercPoint.y * (2 ** (zoom) * (constants.googleTileSize / tileHeight));

    return new TileMercPoint(
      mercPoint.x,
      mercPoint.y,
      tileX,
      tileY,
      tileWidth,
      tileHeight,
      zoom
    );
  }

  get north(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;
    
    return TileMercPoint.fromTile(
      tileX,
      tileY - 1,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get south(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;
    
    return TileMercPoint.fromTile(
      tileX,
      tileY + 1,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get east(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;
    
    return TileMercPoint.fromTile(
      tileX + 1,
      tileY,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get west(): TileMercPoint {
    const {
        tileX,
        tileY,
        tileHeight,
        tileWidth,
        zoom,
    } = this;
    
    return TileMercPoint.fromTile(
      tileX - 1,
      tileY,
      tileWidth,
      tileHeight,
      zoom,
    );
  }

  get northBound(): number {
    return this.north.toSphere().lat;
  }

  get southBound(): number {
    return this.south.toSphere().lat;
  }

  get eastBound(): number {
    return this.east.toSphere().lng;
  }

  get westBound(): number {
    return this.west.toSphere().lng;
  }
}