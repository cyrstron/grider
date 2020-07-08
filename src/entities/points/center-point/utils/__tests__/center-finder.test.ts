import {getNextCenterByCellSide} from '../center-finder';
import {CellSide} from '../../../../segments';
import {PeakPoint} from '../../../peak-point';
import {GridParams} from '../../../../grid-params';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('getNextCenterByCellSide', () => {
  describe('when grid is rectagonal', () => {
    const point: grider.GridPoint = {i: 0, j: 0};
    const params = createParams();

    describe('when next grid center on bigger i', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: 1/2, j: -1/2}, params),
          PeakPoint.fromPlain({i: 1/2, j: 1/2}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 1, j: 0});
      });
    });

    describe('when next grid center on smaller i', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: -1/2, j: -1/2}, params),
          PeakPoint.fromPlain({i: -1/2, j: 1/2}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: -1, j: 0});
      });
    });

    describe('when next grid center on bigger j', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: -1/2, j: 1/2}, params),
          PeakPoint.fromPlain({i: 1/2, j: 1/2}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 0, j: 1});
      });
    });

    describe('when next grid center on smaller j', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: -1/2, j: -1/2}, params),
          PeakPoint.fromPlain({i: 1/2, j: -1/2}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 0, j: -1});
      });
    });
  });

  describe('when grid is hexagonal', () => {
    const point: grider.GridPoint = {i: 0, j: 0, k: 0};
    const params = createParams({type: 'hex'});

    describe('when next grid center on bigger i & smaller j', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: 2/3, j: -1/3, k: -1/3}, params),
          PeakPoint.fromPlain({i: 1/3, j: -2/3, k: 1/3}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 1, j: -1, k: 0});
      });
    });

    describe('when next grid center on bigger j & smaller i', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: -2/3, j: 1/3, k: 1/3}, params),
          PeakPoint.fromPlain({i: -1/3, j: 2/3, k: -1/3}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: -1, j: 1, k: 0});
      });
    });

    describe('when next grid center on bigger k & smaller i', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: -1/3, j: -1/3, k: 2/3}, params),
          PeakPoint.fromPlain({i: -2/3, j: 1/3, k: 1/3}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: -1, j: 0, k: 1});
      });
    });

    describe('when next grid center on bigger i & smaller k', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: 1/3, j: 1/3, k: -2/3}, params),
          PeakPoint.fromPlain({i: 2/3, j: -1/3, k: -1/3}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 1, j: 0, k: -1});
      });
    });

    describe('when next grid center on bigger j & smaller k', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: -1/3, j: 2/3, k: -1/3}, params),
          PeakPoint.fromPlain({i: 1/3, j: 1/3, k: -2/3}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 0, j: 1, k: -1});
      });
    });

    describe('when next grid center on bigger k & smaller j', () => {
      it('should return proper next cell center', () => {
        const cellSide = CellSide.fromPeaks(
          PeakPoint.fromPlain({i: 1/3, j: -2/3, k: 1/3}, params),
          PeakPoint.fromPlain({i: -1/3, j: -1/3, k: 2/3}, params),
        );

        expect(getNextCenterByCellSide(point, cellSide)).toStrictEqual({i: 0, j: -1, k: 1});
      });
    });
  });
});
