import {
  nearestRectPeaks,
  nearestHexPeaks,
  calcNearestPeaks,
} from '../nearest-peaks';
import {GridParams} from '../../../../grid-params';
import {PeakPoint} from '../../peak-point';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('nearestRectPeaks', () => {
  const params = createParams();
  const peak = new PeakPoint(params, 0.5, 1.5);
  const nearestPeaks = nearestRectPeaks(peak);

  it('should return 4 points', () => {
    expect(nearestPeaks).toHaveLength(4);
  });

  it('should return all nearest peaks values for rectagonal cell peak', () => {
    expect(nearestPeaks).toContainEqual({
      i: 1.5,
      j: 1.5,
    });
    expect(nearestPeaks).toContainEqual({
      i: -0.5,
      j: 1.5,
    });
    expect(nearestPeaks).toContainEqual({
      i: 0.5,
      j: 2.5,
    });
    expect(nearestPeaks).toContainEqual({
      i: 0.5,
      j: 0.5,
    });
  });
});


describe('nearestHexPeaks', () => {
  const params = createParams({type: 'hex'});

  describe('when peak is odd', () => {
    const peak = new PeakPoint(params, 1 - 2/3, 2 + 1/3, -3 + 1/3);
    const nearestPeaks = nearestHexPeaks(peak);

    it('should return 3 points', () => {
      expect(nearestPeaks).toHaveLength(3);
    });

    it('should return all nearest peaks values for hexagonal cell peak', () => {
      expect(nearestPeaks).toContainEqual({
        i: -0.33333333333333326,
        j: 2.666666666666667,
        k: -2.333333333333333,
      });
      expect(nearestPeaks).toContainEqual({
        i: 0.6666666666666667,
        j: 1.666666666666667,
        k: -2.333333333333333,
      });
      expect(nearestPeaks).toContainEqual({
        i: 0.6666666666666667,
        j: 2.666666666666667,
        k: -3.333333333333333,
      });
    });
  });

  describe('when peak is even', () => {
    const peak = new PeakPoint(params, 1 - 1/3, 2 - 1/3, -3 + 2/3);
    const nearestPeaks = nearestHexPeaks(peak);

    it('should return 3 points', () => {
      expect(nearestPeaks).toHaveLength(3);
    });

    it('should return all nearest peaks values for hexagonal cell peak', () => {
      expect(nearestPeaks).toContainEqual({
        i: 1.3333333333333335,
        j: 1.3333333333333335,
        k: -2.666666666666667,
      });
      expect(nearestPeaks).toContainEqual({
        i: 0.3333333333333334,
        j: 2.3333333333333335,
        k: -2.666666666666667,
      });
      expect(nearestPeaks).toContainEqual({
        i: 0.3333333333333334,
        j: 1.3333333333333335,
        k: -1.666666666666667,
      });
    });
  });
});

describe('calcNearestPeaks', () => {
  describe('when grid point is rectagonal', () => {
    const params = createParams();
    const peak = new PeakPoint(params, 0.5, 1.5);

    it('should return 4 points', () => {
      const nearestPeaks = calcNearestPeaks(peak);

      expect(nearestPeaks).toHaveLength(4);
    });
  });

  describe('when grid point is hexagonal', () => {
    const params = createParams({type: 'hex'});
    const peak = new PeakPoint(params, 1 - 2/3, 2 + 1/3, -3 + 1/3);

    it('should return 4 points', () => {
      const nearestPeaks = calcNearestPeaks(peak);

      expect(nearestPeaks).toHaveLength(3);
    });
  });
});
