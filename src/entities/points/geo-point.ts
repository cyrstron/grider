import {MercPoint} from './merc-point';

export class GeoPoint {
  constructor(
    public lat: number,
    public lng: number,
  ) {}

  toMerc(): MercPoint {

  }
}