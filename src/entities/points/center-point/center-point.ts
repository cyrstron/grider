import { Cell } from '../../polygons/cell';
import {CellSide} from '../../segments/cell-side';
import {GridPoint} from '../grid-point';
import {
  getNextCenterByCellSide,
} from './utils/center-finder';
import {isNeighbor} from './utils/is-neighbor';
import {
  getAll,
  getEast,
  getNorth,
  getNorthEast,
  getNorthWest,
  getSouth,
  getSouthEast,
  getSouthWest,
  getWest,
} from './utils/neighborer';
import {
  round,
} from './utils/rounder';

export class CenterPoint extends GridPoint {

  get neighbors() {
    return getAll(this);
  }

  get northNeighbors() {
    return getNorth(this);
  }

  get southNeighbors() {
    return getSouth(this);
  }

  get westNeighbors() {
    return getWest(this);
  }

  get eastNeighbors() {
    return getEast(this);
  }

  get northEastNeighbors() {
    return getNorthEast(this);
  }

  get southWestNeighbors() {
    return getSouthWest(this);
  }

  get northWestNeighbors() {
    return getNorthWest(this);
  }

  get southEastNeighbors() {
    return getSouthEast(this);
  }

  static fromGrid(point: GridPoint): CenterPoint {
    // To get the same center value on antimeridian.
    const {i: preI, j: preJ, k: preK} = round(point);

    const reducedGridCenter = new GridPoint(point.params, preI, preJ, preK)
      .toGeo()
      .toGrid(point.params);

    const {i, j, k} = round(reducedGridCenter);

    return new CenterPoint(point.params, i, j , k);
  }

  toCell(): Cell {
    return Cell.fromCenterPoint(this);
  }

  nextCenterByCellSide(cellSide: CellSide): CenterPoint {
    return getNextCenterByCellSide(this, cellSide);
  }

  isNeighbor(center: CenterPoint): boolean {
    let pointA: CenterPoint = this;
    let pointB: CenterPoint = center;

    if (this.isCloserThroughAntiMeridian(center)) {
      pointA = pointA.toOppositeHemishpere();
      pointB = pointB.toOppositeHemishpere();
    }

    return isNeighbor(pointA, pointB);
  }

  isCloserThroughAntiMeridian(center: CenterPoint): boolean {
    return this.toGeo()
      .isCloserThroughAntiMeridian(center.toGeo());
  }

  toOppositeHemishpere(): CenterPoint {
    return this.toGeo()
      .toOppositeHemisphere()
      .toCenter(this.params);
  }

  moveByDiff(iDiff: number, jDiff: number): CenterPoint {
    const i = this.i + iDiff;
    const j = this.j + jDiff;
    const k = this.k === undefined ?
      undefined :
      this.k - (iDiff + jDiff);

    return new CenterPoint(this.params, i, j , k)
      .toGeo()
      .toCenter(this.params);
  }
}
