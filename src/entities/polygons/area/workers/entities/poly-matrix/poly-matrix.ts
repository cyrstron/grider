import { CenterPoint } from '../../../../../points/center-point';
import { GeoPoint } from '../../../../../points/geo-point';
import { CentersMatrix } from '../centers-matrix';
import { buildPoly } from './utils/build-poly';
import {callNextIndexes} from './utils/next-indexes';
import {getNextPoints} from './utils/next-points';
import { getStartIndexesTouchedBy } from './utils/start-indexes';
import {getStartPoints} from './utils/start-point';

export abstract class PolyMatrix extends CentersMatrix {
  abstract get startIndexes(): number[];

  abstract touchedInnerIndexes(i: number, j: number): number[][];
  abstract touchedOuterIndexes(i: number, j: number): number[][];

  get startPoints(): GeoPoint[] {
    return getStartPoints(this);
  }

  startIndexesBy(
    callback: (value: CenterPoint | 'inner' | 'outer' | undefined) => boolean,
  ) {
    return getStartIndexesTouchedBy(this, callback);
  }

  nextIndexes(
    points: GeoPoint[],
    startI: number,
    startJ: number,
    prevI?: number,
    prevJ?: number,
  ): [number, number] {
    return callNextIndexes(this, points, startI, startJ, prevI, prevJ);
  }

  nextPoints(
    points: GeoPoint[],
    outerI: number,
    outerJ: number,
    isInner: boolean = false,
  ): GeoPoint[] {
    return getNextPoints(this, points, outerI, outerJ, isInner);
  }

  toPoly(isInner?: boolean): GeoPoint[] {
    return buildPoly(this, isInner);
  }
}
