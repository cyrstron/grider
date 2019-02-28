import { MercatorCorrector } from './mercator.corrector';
import { NoneCorrector } from './none.corrector';

export class Corrector {
  none: NoneCorrector;
  merc: MercatorCorrector;
  constructor({merc, none}: {
    none: NoneCorrector,
    merc: MercatorCorrector,
  }) {
    this.merc = merc;
    this.none = none;
  }

  correctForGrid(point: grider.GeoPoint, {correction}: grider.GridParams): grider.GeoPoint {
    if (correction === 'merc') {
      return this.merc.correctForGrid(point);
    } else {
      return this.none.correctForGrid(point);
    }
  }

  correctForGeo(point: grider.GeoPoint, gridParams: grider.GridParams): grider.GeoPoint {
    const {correction} = gridParams;

    if (correction === 'merc') {
      return this.merc.correctForGeo(point, gridParams);
    } else {
      return this.none.correctForGeo(point);
    }
  }

  correctPoly(poly: grider.GeoPoint[], {correction}: grider.GridParams): grider.GeoPoint[] {
    if (correction === 'merc') {
      return this.merc.correctPoly(poly);
    } else {
      return this.none.correctPoly(poly);
    }
  }
}
