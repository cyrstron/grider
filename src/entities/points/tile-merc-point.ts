import { MercPoint } from "./merc-point";
import {constants} from '../../constants';
import { GridParams } from "../grid-params";

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

  gridPatternStartPoint(params: GridParams): TileMercPoint {
    const gridCenter = this.toSphere().toCenter(params);
    const {northWest} = gridCenter.northWestNeighbors;
    const gridTileTopLeft = northWest.toGeo().toMerc();

    const tilePoint = TileMercPoint.fromMerc(
      gridTileTopLeft,
      this.tileWidth,
      this.tileHeight,
      this.zoom,
    );

    return TileMercPoint.fromTile(
      tilePoint.tileX - this.tileX,
      tilePoint.tileY - this.tileY,
      this.tileWidth,
      this.tileHeight,
      this.zoom,
    );
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
  ) {
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
  ) {
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
}