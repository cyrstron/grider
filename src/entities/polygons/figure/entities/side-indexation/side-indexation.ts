import {SpreadedSide} from '../indexation';

import {indexateKeys} from './utils/indexate-keys';
import { GeoSegment } from '../../../../segments/geo-segment';

export class SideIndexation {
  constructor(
    public spreadedSide: SpreadedSide,
    public lngIndexes: {[key: string]: number[]},
    public latIndexes: {[key: string]: number[]},
    public lngKeys: {[key: string]: number[]},
    public latKeys: {[key: string]: number[]},
    public approximation: GeoSegment,
  ) {}

  static fromSpreadedSide(spreaded: SpreadedSide) {
    const lngIndexes: {[key: string]: number[]} = {};
    const latIndexes: {[key: string]: number[]} = {};

    spreaded.forEach(({point: {lat, lng}, index}) => {
      if (!lngIndexes[lng]) {
        lngIndexes[lng] = [];
      }
      if (!latIndexes[lat]) {
        latIndexes[lat] = [];
      }

      lngIndexes[lng].push(index);
      latIndexes[lat].push(index);
    }, {});

    const lngKeys = Object.keys(lngIndexes).sort((a, b) => +a - +b);
    const latKeys = Object.keys(latIndexes).sort((a, b) => +a - +b);

    const lngKeysIndexation = indexateKeys(lngKeys);
    const latKeysIndexation = indexateKeys(latKeys);

    const approximation = new GeoSegment(
      spreaded[0].point,
      spreaded[spreaded.length - 1].point,
    );

    return new SideIndexation(
      spreaded,
      lngIndexes,
      latIndexes,
      lngKeysIndexation,
      latKeysIndexation,
      approximation,
    );
  }

  get isAntiMeridian() {
    return this.approximation.isAntiMeridian;
  }

  get north() {
    return this.approximation.northernPoint.lat;
  }

  get south() {
    return this.approximation.southernPoint.lat;
  }

  get east() {
    return this.approximation.easternPoint.lng;
  }

  get west() {
    return this.approximation.westernPoint.lng;
  }
}