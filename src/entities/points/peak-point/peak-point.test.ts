import {PeakPoint} from './peak-point';
import {GridParams} from '../../grid-params';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('constructor', () => {
  it('should return PeakPoint instance', () => {
    const gridParams = createParams();
    const point = new PeakPoint(gridParams, 1.5, 2.5);

    expect(point).toBeInstanceOf(PeakPoint);
  });
});

describe('get nearestPeaks', () => {
  it('should return array of peak points', () => {
    const params = createParams();
    const point = new PeakPoint(params, 0.5, 1.5);

    expect(point.nearestPeaks[0]).toBeInstanceOf(PeakPoint);
  });

  describe('when grid is rectagonal', () => {
    const params = createParams({cellSize: 1000});

    describe('when point is not near the anti-meridian', () => {
      const point = new PeakPoint(params, 0.5, 1.5);

      it('should return 4 points', () => {
        expect(point.nearestPeaks).toHaveLength(4);
      });

      it('should return all nearest peaks values', () => {
        expect(point.nearestPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: 1.5,
              j: 0.5,
            }),
            expect.objectContaining({
              i: 1.5,
              j: 2.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: 2.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: 0.5,
            }),
          ]),
        );
      });
    });

    describe('when point is near the anti-meridian', () => {
      const point = new PeakPoint(params, 0.5, 19999.5);

      it('should return valid nearest peaks values', () => {
        expect(point.nearestPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: 1.5,
              j: 19998.5,
            }),
            expect.objectContaining({
              i: 1.5,
              j: -19999.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: -19999.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: 19998.5,
            }),
          ]),
        );
      });
    });
  });

  describe('when grid is hexagonal', () => {
    const params = createParams({cellSize: 1000, type: 'hex'});

    describe('when point is neither on or near the anti-meridian', () => {
      const point = new PeakPoint(params, 1 - 2/3, 2 + 1/3, -3 + 1/3);

      it('should return 3 points', () => {
        expect(point.nearestPeaks).toHaveLength(3);
      });

      it('should return all nearest peaks values', () => {
        expect(point.nearestPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: -0.333,
              j: 2.667,
              k: -2.333,
            }),
            expect.objectContaining({
              i: 0.667,
              j: 1.667,
              k: -2.333,
            }),
            expect.objectContaining({
              i: 0.667,
              j: 2.667,
              k: -3.333,
            }),
          ]),
        );
      });
    });

    describe('when point is on the anti-meridian', () => {
      const params = createParams({cellSize: 1000, type: 'hex'});
      const point = new PeakPoint(params, 0 + 2/3, -20000 - 1/3, 20000 + 1/3);

      it('should return valid nearest peaks values', () => {
        expect(point.nearestPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: 1.333,
              j: -20000.667,
              k: 19999.333,
            }),
            expect.objectContaining({
              i: 0.333,
              j: -19999.667,
              k: 19999.333,
            }),
            expect.objectContaining({
              i: 0.333,
              j: 19999.333,
              k: -19999.667,
            }),
          ]),
        );
      });
    });

    describe('when point is near the anti-meridian', () => {
      const point = new PeakPoint(params, 1 - 2/3, 20000 + 1/3, -20000 + 1/3);

      it('should return valid nearest peaks values', () => {
        expect(point.nearestPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: -0.333,
              j: -19999.333,
              k: 19999.667,
            }),
            expect.objectContaining({
              i: 0.667,
              j: 19999.667,
              k: -20000.333,
            }),
            expect.objectContaining({
              i: 0.667,
              j: -19999.333,
              k: 19998.667,
            }),
          ]),
        );
      });
    });
  });
});
