import {GridParams} from '../../grid-params';
import {GridPoint} from '../grid-point';
import {GeoPoint} from '../geo-point';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('constructor', () => {
  it('should return GridPoint instance', () => {
    const gridParams = createParams();
    const point = new GridPoint(gridParams, 10, 20);

    expect(point).toBeInstanceOf(GridPoint);
  });
});

describe('toFormatted', () => {
  it('should return GridPoint instance', () => {
    const gridParams = createParams();
    const point = new GridPoint(gridParams, 10, 20).toFormatted();

    expect(point).toBeInstanceOf(GridPoint);
  });

  it('should convert i to equal', () => {
    const gridParams = createParams();
    const point = new GridPoint(gridParams, 10, 20).toFormatted();

    expect(point.i).toBe(10);
  });

  it('should convert j to equal', () => {
    const gridParams = createParams();
    const point = new GridPoint(gridParams, 10, 20).toFormatted();

    expect(point.j).toBe(20);
  });

  it('should convert k to equal', () => {
    const gridParams = createParams({type: 'hex'});
    const point = new GridPoint(gridParams, 10, 20, -30).toFormatted();

    expect(point.k).toBe(-30);
  });
});

describe('isEqual', () => {
  describe('when grid is rectagonal', () => {
    const gridParams = createParams();

    describe('when points are equal', () => {
      it('should return true', () => {
        const pointA = new GridPoint(gridParams, 10, 20);
        const pointB = new GridPoint(gridParams, 10, 20);

        expect(pointA.isEqual(pointB)).toBe(true);
      });
    });

    describe('when points are not equal', () => {
      it('should return false when only i is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20);
        const pointB = new GridPoint(gridParams, 10, 30);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when only j is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20);
        const pointB = new GridPoint(gridParams, 20, 20);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when neither axes are equal', () => {
        const pointA = new GridPoint(gridParams, 20, 20);
        const pointB = new GridPoint(gridParams, 10, 30);

        expect(pointA.isEqual(pointB)).toBe(false);
      });
    });
  });

  describe('when grid is hexagonal', () => {
    const gridParams = createParams({type: 'hex'});

    describe('when points are equal', () => {
      it('should return true', () => {
        const pointA = new GridPoint(gridParams, 10, 20, -30);
        const pointB = new GridPoint(gridParams, 10, 20, -30);

        expect(pointA.isEqual(pointB)).toBe(true);
      });
    });

    describe('when points are not equal', () => {
      it('should return false when only i is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, -30);
        const pointB = new GridPoint(gridParams, 10, 30, -40);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when only j is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, -30);
        const pointB = new GridPoint(gridParams, 20, 20, -40);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when only k is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, -30);
        const pointB = new GridPoint(gridParams, 20, 10, -30);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when neither axes are equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, -30);
        const pointB = new GridPoint(gridParams, 20, 30, -50);

        expect(pointA.isEqual(pointB)).toBe(false);
      });
    });
  });
});

describe('toGeo', () => {
  it('should return GeoPoint instance', () => {
    const gridParams = createParams();
    const point = new GridPoint(gridParams, 2, 3).toGeo();

    expect(point).toBeInstanceOf(GeoPoint);
  });

  describe('when the grid is rectagonal & correction is none', () => {
    it('should convert grid point to geo point', () => {
      const gridParams = createParams({cellSize: 1000});
      const point = new GridPoint(gridParams, 2, 3).toGeo();

      expect(point.toPlain()).toStrictEqual({lat: 0.018, lng: 0.027});
    });
  });

  describe('when the grid is hexagonal & correction is none', () => {
    it('should convert grid point to geo point', () => {
      const gridParams = createParams({
        cellSize: 1000,
        type: 'hex',
      });
      const point = new GridPoint(gridParams, 2, 3, -5).toGeo();

      expect(point.toPlain()).toStrictEqual({lat: 0.0155885, lng: 0.036});
    });
  });

  describe('when the grid is rectagonal & correction is mercator', () => {
    it('should convert grid point to geo point', () => {
      const gridParams = createParams({
        cellSize: 1000,
        correction: 'merc',
      });
      const point = new GridPoint(gridParams, 20, 30).toGeo();

      expect(point.toPlain()).toStrictEqual({lat: 0.1799997, lng: 0.27});
    });
  });

  describe('when the grid is hexagonal & correction is mercator', () => {
    it('should convert grid point to geo point', () => {
      const gridParams = createParams({
        cellSize: 1000,
        type: 'hex',
        correction: 'merc',
      });
      const point = new GridPoint(gridParams, 20, 30, -50).toGeo();

      expect(point.toPlain()).toStrictEqual({lat: 0.1558844, lng: 0.36});
    });
  });
});

describe('onSameLineWith', () => {
  describe('when points are not closer through anti-meridian', () => {
    describe('when grid is rectagonal', () => {
      const params = createParams({cellSize: 1000});

      it('should return true when all points are on the same line', () => {
        const pointA = new GridPoint(params, 10, 15);
        const pointB = new GridPoint(params, 5, 5);
        const pointC = new GridPoint(params, -2.5, -10);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(true);
      });

      it('should return false when all points are not on the same line', () => {
        const pointA = new GridPoint(params, 5, 15);
        const pointB = new GridPoint(params, 15, 5);
        const pointC = new GridPoint(params, -2.5, -10);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(false);
      });
    });

    describe('when grid is hexagonal', () => {
      const params = createParams({cellSize: 1000, type: 'hex'});

      it('should return true when all points are on the same line', () => {
        const pointA = new GridPoint(params, 10, 15, -25);
        const pointB = new GridPoint(params, 5, 5, -10);
        const pointC = new GridPoint(params, -2.5, -10, 12.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(true);
      });

      it('should return false when all points are not on the same line', () => {
        const pointA = new GridPoint(params, 5, 15, -25);
        const pointB = new GridPoint(params, 15, 5, -20);
        const pointC = new GridPoint(params, -2.5, -10, -12.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(false);
      });
    });
  });

  describe('when points are closer through anti-meridian', () => {
    describe('when grid is rectagonal', () => {
      const params = createParams({cellSize: 1000});

      it('should return true when all points are on the same line', () => {
        const pointA = new GridPoint(params, 15, -19990);
        const pointB = new GridPoint(params, 5, -19995);
        const pointC = new GridPoint(params, -10, 19997.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(true);
      });

      it('should return false when all points are not on the same line', () => {
        const pointA = new GridPoint(params, 15, -19995);
        const pointB = new GridPoint(params, 5, -19985);
        const pointC = new GridPoint(params, -10, 19997.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(false);
      });

      it('should return false when all points on the same line not through anti-meridian', () => {
        const pointA = new GridPoint(params, 15, -19995);
        const pointB = new GridPoint(params, 14.99374882790523, -19985);
        const pointC = new GridPoint(params, -10, 19997.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(false);
      });
    });

    describe('when grid is hexagonal', () => {
      const params = createParams({cellSize: 1000, type: 'hex'});

      it('should return true when all points are on the same line', () => {
        const pointA = new GridPoint(params, 15, -19990, 19975);
        const pointB = new GridPoint(params, 5, -19995, 19990);
        const pointC = new GridPoint(params, -10, 19997.5, 19987.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(true);
      });

      it('should return false when all points are not on the same line', () => {
        const pointA = new GridPoint(params, 15, -19995, 19980);
        const pointB = new GridPoint(params, 5, -19985, 19980);
        const pointC = new GridPoint(params, -10, 19997.5, 19987.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(false);
      });

      it('should return false when all points on the same line not through anti-meridian', () => {
        const pointA = new GridPoint(params, 15, -19995, 19980);
        const pointB = new GridPoint(params, 14.99374882790523, -19985, -199970.0062511721);
        const pointC = new GridPoint(params, -10, 19997.5, 19987.5);

        expect(pointA.onSameLineWith(pointB, pointC)).toBe(false);
      });
    });
  });
});

describe('fromGeo', () => {
  it.todo('should convert grid point to geo point');
});
