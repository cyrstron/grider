import {GridParams} from '../../grid-params';
import {GridPoint} from '../grid-point';

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
    const point = new GridPoint(gridParams, 10, 20, 30).toFormatted();

    expect(point.k).toBe(30);
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
        const pointA = new GridPoint(gridParams, 10, 20, 30);
        const pointB = new GridPoint(gridParams, 10, 20, 30);

        expect(pointA.isEqual(pointB)).toBe(true);
      });
    });

    describe('when points are not equal', () => {
      it('should return false when only i is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, 30);
        const pointB = new GridPoint(gridParams, 10, 30, 40);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when only j is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, 30);
        const pointB = new GridPoint(gridParams, 20, 20, 40);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when only k is equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, 30);
        const pointB = new GridPoint(gridParams, 20, 30, 30);

        expect(pointA.isEqual(pointB)).toBe(false);
      });

      it('should return false when neither axes are equal', () => {
        const pointA = new GridPoint(gridParams, 10, 20, 30);
        const pointB = new GridPoint(gridParams, 20, 30, 40);

        expect(pointA.isEqual(pointB)).toBe(false);
      });
    });
  });
});

describe('toGeo', () => {
  it.todo('should convert point to GeoPoint');
});
