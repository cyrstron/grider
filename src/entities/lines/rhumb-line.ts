import {
  latToY,
  lngToX,
  reduceLng,
} from '../../utils/geo.utils';
import {
  xToLng, yToLat,
} from '../../utils/merc.utils';
import {GeoPoint} from '../points/geo-point';
import {MercLine} from './merc-line';

export class RhumbLine extends MercLine {

  static fromTwoGeoPoints(pointA: GeoPoint, pointB: GeoPoint) {
    const isAntiMeridian = pointA.isCloserThroughAntiMeridian(pointB);

    if (isAntiMeridian) {
      pointA = pointA.toOppositeHemisphere();
      pointB = pointB.toOppositeHemisphere();
    }

    const {a, b, c} = MercLine.fromTwoPoints(pointA.toMerc(), pointB.toMerc());

    return new RhumbLine(a, b, c, isAntiMeridian);
  }
  isAntiMeridian: boolean;

  constructor(
    a: number,
    b: number,
    c: number,
    isAntiMeridial: boolean,
  ) {
    super(a, b, c);

    this.isAntiMeridian = isAntiMeridial;
  }

  lngByLat(lat: number): number | undefined {
    const y = latToY(lat);
    const x = this.xByY(y);

    if (x === undefined) return;

    let lng = xToLng(x);

    if (this.isAntiMeridian) {
      lng = reduceLng(lng - 180);
    }

    return lng;
  }

  latByLng(lng: number): number | undefined {
    if (this.isAntiMeridian) {
      lng = reduceLng(lng - 180);
    }

    const x = lngToX(lng);
    const y = this.yByX(x);

    if (y === undefined) return;

    return yToLat(y);
  }
}
