import {GridPoint} from '../grid-point';
import {GeoSegment} from '../../segments/geo-segment';
import {
  round,
} from './utils/rounder';
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
  getNextCenterByCellSide
} from './utils/center-finder';

export class CenterPoint extends GridPoint {
  static fromGrid(point: GridPoint): CenterPoint {
    const {i, j, k} = round(point);

    return new CenterPoint(point.params, i, j ,k);
  }

  nextCenterByCellSide(cellSide: GeoSegment): GridPoint {
    return getNextCenterByCellSide(this, cellSide)
  }

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
}
