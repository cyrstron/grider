import {CenterPoint} from './center-point';
import {GridParams} from '../../grid-params';
import {GeoPoint} from '../geo-point';
import {GridPoint} from '../grid-point';
import {CellSide} from '../../segments';
import {PeakPoint} from '../peak-point';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('constructor', () => {
  it('should return CenterPoint instance', () => {
    const gridParams = createParams();
    const point = new CenterPoint(gridParams, 1, 2);

    expect(point).toBeInstanceOf(CenterPoint);
  });

  describe('get neighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.neighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.neighbors).toMatchObject({
        north: {i: 1, j: 0},
        east: {i: 0, j: 1},
        west: {i: 0, j: -1},
        south: {i: -1, j: 0},
        northEast: {i: 1, j: 1},
        northWest: {i: 1, j: -1},
        southEast: {i: -1, j: 1},
        southWest: {i: -1, j: -1},
      });
    });

    describe('when grid is hexagonal', () => {
      describe('when grid is not horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex'});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.neighbors).toMatchObject({
            north: {i: 0, j: 1, k: -1},
            south: {i: 0, j: -1, k: 1},
            northEast: {i: 1, j: 0, k: -1},
            northWest: {i: 1, j: -1, k: 0},
            southEast: {i: -1, j: 1, k: 0},
            southWest: {i: -1, j: 0, k: 1},
          });
        });
      });

      describe('when grid is horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex', isHorizontal: true});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.neighbors).toMatchObject({
            east: {i: 0, j: 1, k: -1},
            west: {i: 0, j: -1, k: 1},
            northEast: {i: 1, j: 0, k: -1},
            northWest: {i: -1, j: 1, k: 0},
            southEast: {i: 1, j: -1, k: 0},
            southWest: {i: -1, j: 0, k: 1},
          });
        });
      });
    });
  });

  describe('get northNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.northNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.northNeighbors).toMatchObject({
        north: {i: 1, j: 0},
      });
    });
  });

  describe('when grid is hexagonal', () => {
    describe('when grid is not horizontal', () => {
      it('should return proper neighbors', () => {
        const params = createParams({type: 'hex'});

        const point = new CenterPoint(params, 0, 0, 0);

        expect(point.northNeighbors).toMatchObject({
          north: {i: 0, j: 1, k: -1},
        });
      });
    });

    describe('when grid is horizontal', () => {
      it('should return proper neighbors', () => {
        const params = createParams({type: 'hex', isHorizontal: true});

        const point = new CenterPoint(params, 0, 0, 0);

        expect(point.northNeighbors).toMatchObject({
          northEast: {i: 1, j: 0, k: -1},
          northWest: {i: -1, j: 1, k: 0},
        });
      });
    });
  });

  describe('get southNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.southNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.southNeighbors).toMatchObject({
        south: {i: -1, j: 0},
      });
    });


    describe('when grid is hexagonal', () => {
      describe('when grid is not horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex'});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.southNeighbors).toMatchObject({
            south: {i: 0, j: -1, k: 1},
          });
        });
      });

      describe('when grid is horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex', isHorizontal: true});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.southNeighbors).toMatchObject({
            southEast: {i: 1, j: -1, k: 0},
            southWest: {i: -1, j: 0, k: 1},
          });
        });
      });
    });
  });

  describe('get westNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.westNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.westNeighbors).toMatchObject({
        west: {i: 0, j: -1},
      });
    });


    describe('when grid is hexagonal', () => {
      describe('when grid is not horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex'});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.westNeighbors).toMatchObject({
            northWest: {i: 1, j: -1, k: 0},
            southWest: {i: -1, j: 0, k: 1},
          });
        });
      });

      describe('when grid is horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex', isHorizontal: true});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.westNeighbors).toMatchObject({
            west: {i: 0, j: -1, k: 1},
          });
        });
      });
    });
  });

  describe('get eastNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.eastNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.eastNeighbors).toMatchObject({
        east: {i: 0, j: 1},
      });
    });

    describe('when grid is hexagonal', () => {
      describe('when grid is not horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex'});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.eastNeighbors).toMatchObject({
            northEast: {i: 1, j: 0, k: -1},
            southEast: {i: -1, j: 1, k: 0},
          });
        });
      });

      describe('when grid is horizontal', () => {
        it('should return proper neighbors', () => {
          const params = createParams({type: 'hex', isHorizontal: true});

          const point = new CenterPoint(params, 0, 0, 0);

          expect(point.eastNeighbors).toMatchObject({
            east: {i: 0, j: 1, k: -1},
          });
        });
      });
    });
  });

  describe('get northEastNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.northEastNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.northEastNeighbors).toMatchObject({
        northEast: {i: 1, j: 1},
      });
    });
  });

  describe('get southWestNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.southWestNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.southWestNeighbors).toMatchObject({
        southWest: {i: -1, j: -1},
      });
    });
  });

  describe('get northWestNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.northWestNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.northWestNeighbors).toMatchObject({
        northWest: {i: 1, j: -1},
      });
    });
  });

  describe('get southEastNeighbors', () => {
    it('should return center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      const neighbors = Object.values(point.southEastNeighbors);

      expect(neighbors).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(CenterPoint.prototype),
        ]),
      );
    });

    it('should return proper neighbor center points', () => {
      const params = createParams();

      const point = new CenterPoint(params, 0, 0);

      expect(point.southEastNeighbors).toMatchObject({
        southEast: {i: -1, j: 1},
      });
    });
  });

  describe('nextCenterByCellSide', () => {
    it('should return CenterPoint instance', () => {
      const gridParams = createParams();
      const cellSide = CellSide.fromPeaks(
        PeakPoint.fromPlain({i: -1/3, j: -1/3}, gridParams),
        PeakPoint.fromPlain({i: -2/3, j: 1/3}, gridParams),
      );

      const centerPoint = new CenterPoint(gridParams, 0, 0);

      expect(centerPoint.nextCenterByCellSide(cellSide)).toBeInstanceOf(CenterPoint);
    });

    describe('when grid is rectagonal', () => {
      const gridParams = createParams();
      it('should return a proper next center point', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: 667.5, j: 1111.5}, gridParams),
          PeakPoint.fromPlain({i: 666.5, j: 1111.5}, gridParams),
        );

        const nextPoint = new CenterPoint(gridParams, 667, 1111).nextCenterByCellSide(cellSide);

        expect(nextPoint).toMatchObject({i: 667, j: 1112});
      });

      describe('when center point is on antimeridian', () => {
        it('should return same center point for conters on both sides of antimeridian', () => {
          const cellSideA = CellSide.fromPeaks(
            PeakPoint.fromPlain({i: 667.5, j: 1999.5}, gridParams),
            PeakPoint.fromPlain({i: 666.5, j: 1999.5}, gridParams),
          );
          const cellSideB = CellSide.fromPeaks(
            PeakPoint.fromPlain({i: 667.5, j: -1999.5}, gridParams),
            PeakPoint.fromPlain({i: 666.5, j: -1999.5}, gridParams),
          );

          const nextPointA = new CenterPoint(gridParams, 667, 1999)
            .nextCenterByCellSide(cellSideA);
          const nextPointB = new CenterPoint(gridParams, 667, -1999)
            .nextCenterByCellSide(cellSideB);

          expect(nextPointA).toStrictEqual(nextPointB);
        });
      });
    });

    describe('when grid is hexagonal', () => {
      const gridParams = createParams({type: 'hex'});
      it('should return a proper next center point', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: 770 - 1/3, j: 726 - 1/3, k: -1496 + 2/3}, gridParams),
          PeakPoint.fromPlain({i: 770-2/3, j: 726+1/3, k: -1496 + 1/3}, gridParams),
        );

        const nextPoint = new CenterPoint(gridParams, 770, 726, -1496)
          .nextCenterByCellSide(cellSide);

        expect(nextPoint).toMatchObject({i: 769, j: 726, k: -1495});
      });


      describe('when center point is on antimeridian', () => {
        it('should return same center point for conters on both sides of antimeridian', () => {
          const cellSideA = CellSide.fromPeaks(
            PeakPoint.fromPlain({i: 770 + 1/3, j: 1614 + 1/3, k: -2384 - 2/3}, gridParams),
            PeakPoint.fromPlain({i: 770 - 1/3, j: 1614 + 2/3, k: -2384 -1/3}, gridParams),
          );
          const cellSideB = CellSide.fromPeaks(
            PeakPoint.fromPlain({i: 770 + 1/3, j: -2384 -2/3, k: 1614 + 1/3}, gridParams),
            PeakPoint.fromPlain({i: 770 - 1/3, j: -2384 -1/3, k: 1614 + 2/3}, gridParams),
          );

          const nextPointA = new CenterPoint(gridParams, 770, 1614, -2384)
            .nextCenterByCellSide(cellSideA);
          const nextPointB = new CenterPoint(gridParams, 770, -2384, 1614)
            .nextCenterByCellSide(cellSideB);

          expect(nextPointA).toStrictEqual(nextPointB);
        });
      });
    });
  });

  describe('isNeighbor', () => {
    const gridParams = createParams();

    describe('when points are on the same side of antimeridian', () => {
      describe('when points are neighbors', () => {
        it('should return true', () => {
          const pointA = new CenterPoint(gridParams, 0, 0);
          const pointB = new CenterPoint(gridParams, 0, 1);

          expect(pointA.isNeighbor(pointB)).toBe(true);
        });
      });
      describe('when points are not neighbors', () => {
        it('should return false', () => {
          const pointA = new CenterPoint(gridParams, 0, 0);
          const pointB = new CenterPoint(gridParams, 0, 2);

          expect(pointA.isNeighbor(pointB)).toBe(false);
        });
      });
    });

    describe('when points are on the different sides of antimeridian', () => {
      describe('when points are neighbors', () => {
        it('should return true', () => {
          const pointA = new CenterPoint(gridParams, 0, -2000);
          const pointB = new CenterPoint(gridParams, 0, 1999);

          expect(pointA.isNeighbor(pointB)).toBe(true);
        });
      });
      describe('when points are not neighbors', () => {
        it('should return false', () => {
          const pointA = new CenterPoint(gridParams, 0, -1999);
          const pointB = new CenterPoint(gridParams, 0, 1999);

          expect(pointA.isNeighbor(pointB)).toBe(false);
        });
      });
    });
  });

  describe('isCloserThroughAntiMeridian', () => {
    const gridParams = createParams();

    describe('when points are closer through antimeridian', () => {
      it('should return true', () => {
        const pointA = new CenterPoint(gridParams, 0, -1800);
        const pointB = new CenterPoint(gridParams, 0, 1800);

        expect(pointA.isCloserThroughAntiMeridian(pointB)).toBe(true);
      });
    });

    describe('when points are not closer through antimeridian', () => {
      it('should return false', () => {
        const pointA = new CenterPoint(gridParams, 0, 1600);
        const pointB = new CenterPoint(gridParams, 0, 1800);

        expect(pointA.isCloserThroughAntiMeridian(pointB)).toBe(false);
      });
    });
  });

  describe('toOppositeHemishpere', () => {
    it('should return CenterPoint instance', () => {
      const gridParams = createParams();
      const point = new CenterPoint(gridParams, 1, 1);

      expect(point.toOppositeHemishpere()).toBeInstanceOf(CenterPoint);
    });

    it('should move point to opposite hemisphere', () => {
      const gridParams = createParams();
      const point = new CenterPoint(gridParams, 1, 1);

      expect(point.toOppositeHemishpere())
        .toMatchObject({i: 1, j: -1999});
    });
  });


  describe('moveByDiff', () => {
    it('should return CenterPoint instance', () => {
      const gridParams = createParams();
      const point = new CenterPoint(gridParams, 1, 1);

      expect(point.moveByDiff(1, -1)).toBeInstanceOf(CenterPoint);
    });

    describe('when grid is rectagonal', () => {
      const gridParams = createParams();
      describe('when moving to the same side of antimeridian', () => {
        it('should move point properly', () => {
          const point = new CenterPoint(gridParams, 1, -1);

          expect(point.moveByDiff(1, 2))
            .toMatchObject({i: 2, j: 1});
        });
      });
      describe('when moving to the other side of antimeridian', () => {
        it('should move point properly', () => {
          const point = new CenterPoint(gridParams, 1, 1999);

          expect(point.moveByDiff(1, 2))
            .toMatchObject({i: 2, j: -1999});
        });
      });
    });

    describe('when grid is hexagonal', () => {
      const gridParams = createParams({type: 'hex'});
      describe('when moving to the same side of antimeridian', () => {
        it('should move point properly', () => {
          const point = new CenterPoint(gridParams, 1, -1, 0);

          expect(point.moveByDiff(1, 2))
            .toMatchObject({i: 2, j: 1, k: -3});
        });
      });
      describe('when moving to the other side of antimeridian', () => {
        it('should move point properly', () => {
          const point = new CenterPoint(gridParams, 770, 1614, -2384);

          expect(point.moveByDiff(1, 2))
            .toMatchObject({i: 771, j: -2384, k: 1613});
        });
      });
    });
  });

  describe('static fromGeo', () => {
    it('should return CenterPoint instance', () => {
      const gridParams = createParams();
      const geoPoint = new GeoPoint(60, 100);

      const point = CenterPoint.fromGeo(geoPoint, gridParams);

      expect(point).toBeInstanceOf(CenterPoint);
    });

    describe('when grid is rectagonal', () => {
      const gridParams = createParams();
      it('should return a proper center point', () => {
        const geoPoint = new GeoPoint(60, 100);

        const point = CenterPoint.fromGeo(geoPoint, gridParams);

        expect(point).toMatchObject({i: 667, j: 1111});
      });

      describe('when center point is on antimeridian', () => {
        it('should return same center point for both sides of antimeridian', () => {
          const gridPointA = new GeoPoint(60, 179.999999);
          const gridPointB = new GeoPoint(60, -179.999999);

          const pointA = CenterPoint.fromGeo(gridPointA, gridParams);
          const pointB = CenterPoint.fromGeo(gridPointB, gridParams);

          expect(pointA).toStrictEqual(pointB);
        });
      });
    });

    describe('when grid is hexagonal', () => {
      const gridParams = createParams({type: 'hex'});
      it('should return a proper center point', () => {
        const geoPoint = new GeoPoint(60, 100);

        const point = CenterPoint.fromGeo(geoPoint, gridParams);

        expect(point).toMatchObject({i: 770, j: 726, k: -1496});
      });


      describe('when center point is on antimeridian', () => {
        it('should return same center point for both sides of antimeridian', () => {
          const gridPointA = new GeoPoint(60, 179.999999);
          const gridPointB = new GeoPoint(60, -179.999999);

          const pointA = CenterPoint.fromGeo(gridPointA, gridParams);
          const pointB = CenterPoint.fromGeo(gridPointB, gridParams);

          expect(pointA).toStrictEqual(pointB);
        });
      });
    });
  });

  describe('static fromGrid', () => {
    it('should return CenterPoint instance', () => {
      const gridParams = createParams();
      const gridPoint = new GridPoint(gridParams, 1.2, 1.6);

      const point = CenterPoint.fromGrid(gridPoint);

      expect(point).toBeInstanceOf(CenterPoint);
    });

    describe('when grid is rectagonal', () => {
      const gridParams = createParams();
      it('should return a proper center point', () => {
        const gridPoint = new GridPoint(gridParams, 667.3, 1110.55);

        const point = CenterPoint.fromGrid(gridPoint);

        expect(point).toMatchObject({i: 667, j: 1111});
      });

      describe('when center point is on antimeridian', () => {
        it('should return same center point for both sides of antimeridian', () => {
          const gridPointA = new GridPoint(gridParams, 667.3, 1999.99);
          const gridPointB = new GridPoint(gridParams, 667.3, -1999.99);

          const pointA = CenterPoint.fromGrid(gridPointA);
          const pointB = CenterPoint.fromGrid(gridPointB);

          expect(pointA).toStrictEqual(pointB);
        });
      });
    });

    describe('when grid is hexagonal', () => {
      const gridParams = createParams({type: 'hex'});
      it('should return a proper center point', () => {
        const gridPoint = new GridPoint(gridParams, 770.1, 726.1, -1496.2);

        const point = CenterPoint.fromGrid(gridPoint);

        expect(point).toMatchObject({i: 770, j: 726, k: -1496});
      });


      describe('when center point is on antimeridian', () => {
        it('should return same center point for both sides of antimeridian', () => {
          const gridPointA = new GridPoint(gridParams, 770.1, 1615.1, -2384.8);
          const gridPointB = new GridPoint(gridParams, 770.1, -2384.8, 1615.1);

          const pointA = CenterPoint.fromGrid(gridPointA);
          const pointB = CenterPoint.fromGrid(gridPointB);

          expect(pointA).toStrictEqual(pointB);
        });
      });
    });
  });

  describe('static fromPlain', () => {
    it('should return CenterPoint instance', () => {
      const gridParams = createParams();
      const point = CenterPoint.fromPlain({i: 1, j: 2}, gridParams);

      expect(point).toBeInstanceOf(CenterPoint);
    });

    describe('when grid is rectagonal', () => {
      const gridParams = createParams();
      it('should return a proper center point', () => {
        const point = CenterPoint.fromPlain({i: 1, j: 2}, gridParams);

        expect(point).toMatchObject({i: 1, j: 2});
      });
    });

    describe('when grid is hexagonal', () => {
      const gridParams = createParams({type: 'hex'});
      it('should return a proper center point', () => {
        const point = CenterPoint.fromPlain({i: 1, j: 2, k: -3}, gridParams);

        expect(point).toMatchObject({i: 1, j: 2, k: -3});
      });
    });
  });
});
