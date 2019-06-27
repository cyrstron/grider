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

export class GeoPoint {
  lat: number;
  lng: number;

  constructor(lat: number, lng: number) {
    this.lat = reduceLat(lat); 
    this.lng = reduceLng(lng);
  }

  isEqual(point: GeoPoint): boolean {
    return this.lat === point.lat && this.lng === point.lng;
  }

  isCloserThroughAntiMeridian(point: GeoPoint): boolean {
    const minLng = Math.min(this.lng, point.lng);
    const maxLng = Math.max(this.lng, point.lng);

    return maxLng - minLng > 180;
  }

  toOppositeHemisphere(): GeoPoint {
    const lng = this.lng - 180;

    return new GeoPoint(this.lat, lng);
  }

  calcMercDistance(pointB: GeoPoint): number {
    const pointA = this.isCloserThroughAntiMeridian(pointB) ?
      this.toOppositeHemisphere() : this;

    const mercPointA = pointA.toMerc();
    const mercPointB = pointB.toMerc();

    return mercPointA.distanceToPoint(mercPointB);
  }

  toMerc(): MercPoint {
    const x = lngToX(this.lng);
    const y = latToY(this.lat);

    return new MercPoint(x, y);
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
}