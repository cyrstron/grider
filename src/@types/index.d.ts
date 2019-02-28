declare namespace grider {
  export interface Point {
    x: number;
    y: number;
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
    PointRect, 
    PointRect, 
    PointRect, 
    PointRect
  ];
  
  export type CorrectionType = 'merc' | 'none';
  export type OrientType = 'horizontal' | 'vertical';
  
  export interface GridConfig {
    isHorizontal?: boolean;
    type: ShapeType;
    correction: CorrectionType;
    crop?: boolean;
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
    crop: boolean;
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
  }  

  export interface Grider {
    buildPolyByGeoPoint(
      geoPoint: GeoPoint,
      gridParams: GridParams,
    ): GeoPoint[];
    buildPolyByCenterGridPoint(
      centerGridPoint: PointHex | PointRect,
      gridParams: GridParams,
    ): grider.GeoPoint[];
    calcGridCenterPointByGeoPoint(
      geoPoint: grider.GeoPoint,
      gridParams: grider.GridParams,
    ): grider.PointHex | grider.PointRect;
  }

  export interface StaticGrider {
    buildPolyByGeoPoint(
      geoPoint: GeoPoint,
    ): GeoPoint[];
    buildPolyByCenterGridPoint(
      centerGridPoint: PointHex | PointRect,
    ): grider.GeoPoint[];
    calcGridCenterPointByGeoPoint(
      geoPoint: grider.GeoPoint,
    ): grider.PointHex | grider.PointRect;

  }
}

declare function createStaticGrider(GridParams: grider.GridParams): grider.StaticGrider;
