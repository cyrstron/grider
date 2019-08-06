import {floorNumStrByOrder} from '../../../../../../utils/math.utils';
import {GeoSegment} from '../../../../../segments/geo-segment';
import {SpreadedSide} from '../indexation';

import { GeoPoint } from '../../../../../points/geo-point';
import { GeoPolygon } from '../../../../geo-polygon';
import { BoundIntersection } from '../bound-intersection';
import {indexateKeys} from './utils/indexate-keys';

export class SideIndexation {

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

  static fromSpreadedSide(
    points: GeoPoint[],
    spreaded: SpreadedSide,
  ): SideIndexation {
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
      points,
      spreaded,
      lngIndexes,
      latIndexes,
      lngKeysIndexation,
      latKeysIndexation,
      approximation,
    );
  }
  constructor(
    public points: GeoPoint[],
    public spreadedSide: SpreadedSide,
    public lngIndexes: {[key: string]: number[]},
    public latIndexes: {[key: string]: number[]},
    public lngKeys: {[key: string]: number[]},
    public latKeys: {[key: string]: number[]},
    public approximation: GeoSegment,
  ) {}

  boundIntersection(
    bound: number,
    tilePoly: GeoPolygon,
    boundKey: grider.Cardinal,
  ): BoundIntersection | undefined {
    const isLat = boundKey === 'north' || boundKey === 'south';
    const keys = isLat ? this.closestLatKeys(bound) : this.closestLngKeys(bound);

    if (!keys) {
      return;
    }

    let fromKey = keys[0];
    let toKey = keys[keys.length - 1];

    if (bound < fromKey || bound > toKey) {
      return;
    }

    keys.forEach((key) => {
      if (key > bound && key < toKey) {
        toKey = key;
      }

      if (key < bound && key > fromKey) {
        fromKey = key;
      }
    });

    const indexes = isLat ? this.latIndexes : this.lngIndexes;
    const toIndexes = indexes[toKey];
    const fromIndexes = indexes[fromKey];

    let fromIndex: number;
    let toIndex: number;

    if (toIndexes.length === 1 && fromIndexes.length === 1) {
      fromIndex = fromIndexes[0];
      toIndex = toIndexes[0];

      const intersection = BoundIntersection.fromPoints(
        this.points,
        fromIndex,
        toIndex,
        tilePoly,
        bound,
        boundKey,
      );

      return intersection;
    }

    const toMin = Math.min(...toIndexes);
    const toMax = Math.max(...toIndexes);
    const fromMin = Math.min(...fromIndexes);
    const fromMax = Math.max(...fromIndexes);

    const toMinDiff = Math.abs(toMin - fromMax);
    const toMaxDiff = Math.abs(toMax - fromMin);

    if (
      toMinDiff === 1 || (
        toMaxDiff !== 1 && toMaxDiff < toMinDiff
      )
    ) {
      toIndex = toMin;
      fromIndex = fromMax;
    } else {
      toIndex = toMax;
      fromIndex = fromMin;
    }

    const intersection = BoundIntersection.fromPoints(
      this.points,
      fromIndex,
      toIndex,
      tilePoly,
      bound,
      boundKey,
    );

    return intersection;
  }

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
}
