import {
  latToY, 
  lngToX, 
  semiLatToY,
  semiLngToX,
  reduceLat,
  reduceLng,
  formatLat,
  formatLng,
} from '../../utils/geo.utils';
import {MercPoint} from './merc-point';
import {GridPoint} from './grid-point';
import {CenterPoint} from './center-point';
import {GridParams} from '../grid-params';
import { TileMercPoint } from './tile-merc-point';

export class GeoPoint {
  constructor(
    public lat: number, 
    public lng: number
  ) {}

  inSameCell(point: GeoPoint, params: GridParams): boolean {
    const cellCenterA = this.toGrid(params);
    const cellCenterB = point.toGrid(params);

    return cellCenterA.isEqual(cellCenterB);
  }

  isEqual(point: GeoPoint): boolean {
    const formattedA = this.toFormatted();
    const formattedB = point.toFormatted();

    return formattedA.lat === formattedB.lat && 
      formattedA.lng === formattedB.lng;
  }

  isCloserThroughAntiMeridian(point: GeoPoint): boolean {
    const minLng = Math.min(this.lng, point.lng);
    const maxLng = Math.max(this.lng, point.lng);

    return maxLng - minLng > 180;
  }

  toOppositeHemisphere(): GeoPoint {
    const lng = reduceLng(this.lng - 180);

    return new GeoPoint(this.lat, lng);
  }

  calcMercDistance(pointB: GeoPoint): number {
    let pointA: GeoPoint = this;

    if (this.isCloserThroughAntiMeridian(pointB)) {
      pointA = this.toOppositeHemisphere();
      pointB = pointB.toOppositeHemisphere();
    }
    
    const mercPointA = pointA.toMerc();
    const mercPointB = pointB.toMerc();

    return mercPointA.distanceToPoint(mercPointB);
  }

  toCell(params: GridParams) {
    return this.toCenter(params).toCell();
  }

  toMerc(): MercPoint {
    const x = lngToX(this.lng);
    const y = latToY(this.lat);

    return new MercPoint(x, y);
  }

  // toTile(
  //   tileWidth: number, 
  //   tileHeight: number, 
  //   zoom: number
  // ): TileMercPoint {
  //   return TileMercPoint.fromMerc(
  //     this.toMerc(),
  //     tileWidth,
  //     tileHeight,
  //     zoom,
  //   );
  // }

  toGrid(params: GridParams): GridPoint {
    return GridPoint.fromGeo(this, params);
  }

  toCenter(params: GridParams): CenterPoint {
    return GridPoint.fromGeo(this, params).round();
  }

  toSemiSphere(): GeoPoint {
    return this.toMerc()
      .toSemiSphere();
  }

  fromSemiSphere(): GeoPoint {
    const x = semiLngToX(this.lng);
    const y = semiLatToY(this.lat);

    return new MercPoint(x, y).toSphere();
  }

  toFormatted(): GeoPoint {
    const lat = formatLat(this.lat);
    const lng = formatLng(this.lng);

    return new GeoPoint(lat, lng);
  }

  isEasternTo(point: GeoPoint): boolean {
    return this.isCloserThroughAntiMeridian(point) ? 
      this.lng < point.lng :
      this.lng > point.lng;
  }

  isWesternTo(point: GeoPoint): boolean {
    return this.isCloserThroughAntiMeridian(point) ? 
      this.lng > point.lng :
      this.lng < point.lng;
  }

  isNorthernTo(point: GeoPoint): boolean {
    return this.lat > point.lat;
  }

  isSouthernTo(point: GeoPoint): boolean {
    return this.lat < point.lat;    
  }

  static createFormatted(
    lat: number, 
    lng: number
  ): GeoPoint {
    lat = formatLat(lat);
    lng = formatLng(lng);

    return new GeoPoint(lat, lng);
  }

  static fromUnsafeCoords(lat: number, lng: number): GeoPoint {
    lat = reduceLat(lat); 
    lng = reduceLng(lng);

    return new GeoPoint(lat, lng);
  }
}