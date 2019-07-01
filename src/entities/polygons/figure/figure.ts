import {GeoPolygon} from '../geo-polygon/geo-polygon';

export class Figure extends GeoPolygon {
  shape: GeoPolygon;
  simplifiedPoints: GeoPolygon;

  constructor(shape: GeoPolygon) {
    this.shape = shape;
  }
}