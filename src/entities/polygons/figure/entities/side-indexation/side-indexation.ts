import {SpreadedSide} from '../indexation';
import {GeoSegment} from '../../../../segments/geo-segment';
import {floorNumStrByOrder} from '../../../../../utils/math.utils';

import {indexateKeys} from './utils/indexate-keys';

export class SideIndexation {
  constructor(
    public spreadedSide: SpreadedSide,
    public lngIndexes: {[key: string]: number[]},
    public latIndexes: {[key: string]: number[]},
    public lngKeys: {[key: string]: number[]},
    public latKeys: {[key: string]: number[]},
    public approximation: GeoSegment,
  ) {}

  closestLatKeys(lat: number): number[] | undefined {
    let latStr = lat + '';
    let keys: number[] | undefined;

    while (true) {
      keys = this.latKeys[latStr];

      if (keys) break;

      const nextStr = floorNumStrByOrder(latStr);

      if (nextStr === latStr) break;

      latStr = nextStr;
    }

    return keys;
  }

  closestLngKeys(lng: number): number[] | undefined {
    let lngStr = lng + '';
    let keys: number[] | undefined;

    while (!keys) {
      keys = this.lngKeys[lngStr];

      if (keys) break;

      const nextStr = floorNumStrByOrder(lngStr);

      if (nextStr === lngStr) break;

      lngStr = nextStr;
    }

    return keys;
  }

  get isAntiMeridian(): boolean {
    return this.approximation.isAntiMeridian;
  }

  get north(): number {
    return this.approximation.northernPoint.lat;
  }

  get south(): number {
    return this.approximation.southernPoint.lat;
  }

  get east(): number {
    return this.approximation.easternPoint.lng;
  }

  get west(): number {
    return this.approximation.westernPoint.lng;
  }

  static fromSpreadedSide(spreaded: SpreadedSide): SideIndexation {
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
}