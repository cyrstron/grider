import {
  formatLat,
  formatLng,
  latToY,
  lngToX,
  reduceLat,
  reduceLng,
  semiLatToY,
  semiLngToX,
} from '../../utils/geo.utils';
import {MercPoint} from './merc-point';

export class GeoPoint {
  static createFormatted(
    lat: number,
    lng: number,
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

  static fromMerc(point: MercPoint): GeoPoint {
    const {lat, lng} = point.toSphereLiteral();

    return new GeoPoint(lat, lng);
  }

  constructor(
    public lat: number,
    public lng: number,
  ) {}

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

  toMerc(): MercPoint {
    const x = lngToX(this.lng);
    const y = latToY(this.lat);

    return new MercPoint(x, y);
  }

  toSemiSphere(): GeoPoint {
    const {lat, lng} = this.toMerc().toSemiSphereLiteral();

    return new GeoPoint(lat, lng);
  }

  fromSemiSphere(): GeoPoint {
    const x = semiLngToX(this.lng);
    const y = semiLatToY(this.lat);

    const {lat, lng} = new MercPoint(x, y).toSphereLiteral();

    return new GeoPoint(lat, lng);
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

  toPlain(): grider.GeoPoint {
    const {lat, lng} = this;

    return {
      lat,
      lng,
    };
  }

  toGeoJSON(): grider.GeoJSONPoint {
    return {
      type: 'Point',
      coordinates: [this.lng, this.lat],
    }
  }

  static fromPlain(
    {lat, lng}: grider.GeoPoint
  ): GeoPoint {
    return new GeoPoint(lat, lng);
  }

  static fromGeoJSON({coordinates: [lng, lat]}: grider.GeoJSONPoint): GeoPoint {
    return GeoPoint.fromPlain({lat, lng});
  }
}
