declare module "*.worker" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

declare namespace grider {
  export type Cardinal = 'north' | 'south' | 'east' | 'west';
  
  export interface Point {
    x: number;
    y: number;
  }

  export interface LngEdges {
    west: number;
    east: number;
  }
  
  export interface GeoPoint {
    lat: number,
    lng: number
  }
  
  export type PointRectKeys = 'i' | 'j';
  
  export interface PointRect {
    i: number;
    j: number;
    [key: string]: number;
  }
  
  export type PointHexKeys = PointRectKeys | 'k';
  
  export interface PointHex extends PointRect {
    k: number;
  }
  
  export type GridPoint = {
    i: number,
    j: number,
    k?: number,
  };
  
  export type ShapeType = 'hex' | 'rect';
  
  export type GridHexagon = [
    PointHex, 
    PointHex, 
    PointHex, 
    PointHex, 
    PointHex, 
    PointHex
  ];
  
  export type GridRectangle = [
    PointRect, 
    PointRect, 
    PointRect, 
    PointRect, 
  ];
  
  export type CorrectionType = 'merc' | 'none';
  export type OrientType = 'horizontal' | 'vertical';
  
  export interface GridConfig {
    isHorizontal?: boolean;
    type: ShapeType;
    correction: CorrectionType;
    cellSize: number;
  }
  
  export interface Axis {
    name: 'lat' | 'lng';
    angle: number;
  }
  
  export interface GridAxis {
    name: PointHexKeys;
    angle: number;
  }
  
  export interface InitCoof {
    vertical: number;
    horizontal: number;
  }
  
  export interface InitCoofs {
    merc: InitCoof;
    none: InitCoof;
    area: InitCoof;
  }
  
  export interface GridParams {
    isHorizontal: boolean;
    type: ShapeType;
    axes: GridAxis[];
    geoAxes: Axis[];
    initSize: number;
    initHeight: number;
    correction: CorrectionType;
  }
  
  export interface Constants {
    equatorLength: number;
    radius: number;
    meridianLength: number;
    googleTileSize: number;
  }  

  export interface PatternConfig {
    pattern: grider.Point[][];
    widthRel: number;
    heightRel: number;
  }

  export interface GridPatternConfig {
    patternConfig: PatternConfig;
    start: Point;
    end: Point;
  }

  export interface GridTileConfig {
    patterns: GridPatternConfig[];
  }

  export interface TilePoint extends Point {
    tileX: number;
    tileY: number;
    tileWidth: number;
    tileHeight: number;
    zoom: number;
  }

  export interface GridTile {
    points: Point[][];
    tileHeight: number;
    tileWidth: number;
  }

  export interface GridPattern {
    tile: GridTile,
    start: Point,
    end: Point,
  }

  export interface MapGridTile {
    tilePoint: TilePoint,
    patterns: GridPattern[]
  }

  export interface WorkerPost<Payload> {
    type: string,
    payload: Payload
  }

  export interface WorkerAnswer<Data> extends MessageEvent {
    data: Data
  }

  export interface GeoJSONPolygon {
    type: "Polygon",
    coordinates: Array<[number, number]>[],
  }

  export interface GeoJSONLineString {
    type: "LineString",
    coordinates: Array<[number, number]>,
  }

  export interface GeoJSONPoint {
    type: "Point",
    coordinates: [number, number],
  }
}

export = grider;
export as namespace grider;