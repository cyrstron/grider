import { GridParams } from '../../grid-params';
import {CellSide} from '../../segments/cell-side';
import { GeoPoint } from '../geo-point';
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
  get neighbors(): {
    south?: CenterPoint,
    north?: CenterPoint,
    west?: CenterPoint,
    east?: CenterPoint,
    southEast: CenterPoint,
    southWest: CenterPoint,
    northEast: CenterPoint,
    northWest: CenterPoint,
  } {
    const {
      south,
      north,
      west,
      east,
      southEast,
      southWest,
      northEast,
      northWest,
    } = getAll(this);

    return {
      south: south && CenterPoint.fromObject(south, this.params),
      north: north && CenterPoint.fromObject(north, this.params),
      west: west && CenterPoint.fromObject(west, this.params),
      east: east && CenterPoint.fromObject(east, this.params),
      southEast: CenterPoint.fromObject(southEast, this.params),
      southWest: CenterPoint.fromObject(southWest, this.params),
      northEast: CenterPoint.fromObject(northEast, this.params),
      northWest: CenterPoint.fromObject(northWest, this.params),
    };
  }

  get northNeighbors(): {
    north?: CenterPoint,
    northEast?: CenterPoint,
    northWest?: CenterPoint,
  } {
    const {
      northWest,
      north,
      northEast,
    } = getNorth(this);

    return {
      northWest: northWest && CenterPoint.fromObject(northWest, this.params),
      north: north && CenterPoint.fromObject(north, this.params),
      northEast: northEast && CenterPoint.fromObject(northEast, this.params),
    };
  }

  get southNeighbors(): {
    south?: CenterPoint,
    southEast?: CenterPoint,
    southWest?: CenterPoint,
  } {
    const {
      southWest,
      south,
      southEast,
    } = getSouth(this);

    return {
      southWest: southWest && CenterPoint.fromObject(southWest, this.params),
      south: south && CenterPoint.fromObject(south, this.params),
      southEast: southEast && CenterPoint.fromObject(southEast, this.params),
    };
  }

  get westNeighbors(): {
    west?: CenterPoint,
    northWest?: CenterPoint,
    southWest?: CenterPoint,
  } {
    const {
      southWest,
      west,
      northWest,
    } = getWest(this);

    return {
      southWest: southWest && CenterPoint.fromObject(southWest, this.params),
      west: west && CenterPoint.fromObject(west, this.params),
      northWest: northWest && CenterPoint.fromObject(northWest, this.params),
    };
  }

  get eastNeighbors(): {
    east?: CenterPoint,
    southEast?: CenterPoint,
    northEast?: CenterPoint,
  } {
    const {
      southEast,
      east,
      northEast,
    } = getEast(this);

    return {
      southEast: southEast && CenterPoint.fromObject(southEast, this.params),
      east: east && CenterPoint.fromObject(east, this.params),
      northEast: northEast && CenterPoint.fromObject(northEast, this.params),
    };
  }

  get northEastNeighbors(): {
    northEast: CenterPoint,
  } {
    const {
      northEast,
    } = getNorthEast(this);

    return {
      northEast: CenterPoint.fromObject(northEast, this.params),
    };
  }

  get southWestNeighbors(): {
    southWest: CenterPoint,
  } {
    const {
      southWest,
    } = getSouthWest(this);

    return {
      southWest: CenterPoint.fromObject(southWest, this.params),
    };
  }

  get northWestNeighbors(): {
    northWest: CenterPoint,
  } {
    const {
      northWest,
    } = getNorthWest(this);

    return {
      northWest: CenterPoint.fromObject(northWest, this.params),
    };
  }

  get southEastNeighbors(): {
    southEast: CenterPoint,
  } {
    const {
      southEast,
    } = getSouthEast(this);

    return {
      southEast: CenterPoint.fromObject(southEast, this.params),
    };
  }

  static fromObject(
    {i, j, k}: grider.GridPoint,
    params: GridParams,
  ): CenterPoint {
    return new CenterPoint(params, i, j, k);
  }

  static fromGeo(point: GeoPoint, params: GridParams): CenterPoint {
    const gridPoint = GridPoint.fromGeo(point, params);

    return CenterPoint.fromGrid(gridPoint);
  }

  static fromGrid(point: GridPoint): CenterPoint {
    // To get the same center value on antimeridian.
    const {i: preI, j: preJ, k: preK} = round(point);

    const reducedGeoCenter = new GridPoint(point.params, preI, preJ, preK)
      .toGeo();

    const reducedGridCenter = GridPoint.fromGeo(reducedGeoCenter, point.params);

    const {i, j, k} = round(reducedGridCenter);

    return new CenterPoint(point.params, i, j , k);
  }

  nextCenterByCellSide(cellSide: CellSide): CenterPoint {
    const {i, j, k} = getNextCenterByCellSide(this, cellSide);

    const geoCenter = new GridPoint(this.params, i, j, k)
      .toGeo();

    return CenterPoint.fromGeo(geoCenter, this.params);
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
    const oppositeGeo = this.toGeo()
      .toOppositeHemisphere();

    return CenterPoint.fromGeo(oppositeGeo, this.params);
  }

  moveByDiff(iDiff: number, jDiff: number): CenterPoint {
    const i = this.i + iDiff;
    const j = this.j + jDiff;
    const k = this.k === undefined ?
      undefined :
      this.k - (iDiff + jDiff);

    const centerGeo = new CenterPoint(this.params, i, j , k)
      .toGeo();

    return CenterPoint.fromGeo(centerGeo, this.params);
  }

  toPlain(): grider.GridPoint {
    return {
      i: this.i,
      j: this.j,
      k: this.k,
    }
  }

  static fromPlain(
    {i, j, k}: grider.GridPoint,
    params: GridParams,
  ): CenterPoint {
    return new CenterPoint(params, i, j, k);
  }
}
