import {
  yToLat, 
  xToLng,
  xToSemiLng,
  yToSemiLat,
  reduceX,
} from './utils';

import {Point} from '../point';
import {GeoPoint} from '../geo-point';

export class MercPoint extends Point {
  constructor(x: number, y: number) {
    x = reduceX(x);

    super(x, y);
  }

  toOppositeHemisphere(): MercPoint {
    const x = reduceX(this.x - 0.5);

    return new MercPoint(x, this.y);
  }

  calcMercDistance(pointB: MercPoint): number {
    const pointA = this.isCloserThroughAntiMeridian(pointB) ?
      this.toOppositeHemisphere() : this;

    return pointA.distanceToPoint(pointB);
  }

  isCloserThroughAntiMeridian(point: MercPoint): boolean {
    const minX = Math.min(this.x, point.x);
    const maxX = Math.max(this.x, point.x);

    return maxX - minX > 1;
  }

  toSphere(): GeoPoint {
    const lat = yToLat(this.y);
    const lng = xToLng(this.x);

    return new GeoPoint(lat, lng);
  }

  toSemiSphere(): GeoPoint {
    const lat = yToSemiLat(this.y);
    const lng = xToSemiLng(this.x);

    return new GeoPoint(lat, lng);
  }

  isEasternTo(point: MercPoint): boolean {
    return this.isCloserThroughAntiMeridian(point) ? 
      this.x < point.x :
      this.x > point.x;
  }

  isWesternTo(point: MercPoint): boolean {
    return this.isCloserThroughAntiMeridian(point) ? 
      this.x > point.x :
      this.x < point.x;
  }

  isNorthernTo(point: MercPoint): boolean {
    return this.y > point.y;
  }

  isSouthernTo(point: MercPoint): boolean {
    return this.y < point.y;    
  }
}