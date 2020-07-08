import {GridParams} from '../../../../grid-params';
import {GridPoint} from '../../../grid-point';

import {
  calcPointDecimalRemains,
  roundRectGridPoint,
  roundHexGridPoint,
  round,
} from '../rounder';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('roundRectGridPoint', () => {
  describe('when point is round', () => {
    it('should return equivalent point', () => {
      const point: grider.PointRect = {i: 1, j: 1};

      expect(roundRectGridPoint(point)).toStrictEqual({i: 1, j: 1});
    });
  });

  describe('when point is not round', () => {
    it('should round rectagonal grid cell properly', () => {
      const point: grider.PointRect = {i: 1.123, j: 0.987};

      expect(roundRectGridPoint(point)).toStrictEqual({i: 1, j: 1});
    });
  });
});

describe('calcPointDecimalRemains', () => {
  it('should return point\'s axes decimal remains', () => {
    expect(calcPointDecimalRemains({
      i: 3.123,
      j: 2.321,
      k: -5.444,
    })).toStrictEqual({
      i: 0.12300000000000022,
      j: 0.3210000000000002,
      k: 0.556,
    });
  });
});

describe('roundHexGridPoint', () => {
  describe('when point is round', () => {
    it('should return equivalent point', () => {
      const point: grider.PointHex = {i: 1, j: 1, k: -2};

      expect(roundHexGridPoint(point)).toStrictEqual({i: 1, j: 1, k: -2});
    });
  });

  describe('when point is not round', () => {
    it('should round hexagomal grid cell with big decimal remains properly', () => {
      const point: grider.PointHex = {i: 1.123, j: 0.987, k: -2.11};

      expect(roundHexGridPoint(point)).toStrictEqual({i: 1, j: 1, k: -2});
    });

    it('should round hexagomal grid cell with small decimal remains properly', () => {
      const point: grider.PointHex = {i: 1.123, j: 0.123, k: -1.246};

      expect(roundHexGridPoint(point)).toStrictEqual({i: 1, j: 0, k: -1});
    });
  });
});

describe('round', () => {
  describe('when grid is rectagonal', () => {
    const params = createParams();
    it('should return equivalent point', () => {
      const point: GridPoint = GridPoint.fromPlain({i: 1.123, j: 0.987}, params);

      expect(round(point)).toStrictEqual({i: 1, j: 1});
    });
  });
  describe('when grid is hexagonal', () => {
    const params = createParams({type: 'hex'});
    it('should return equivalent point', () => {
      const point: GridPoint = GridPoint.fromPlain({i: 1.123, j: 0.987, k: -2.11}, params);

      expect(round(point)).toStrictEqual({i: 1, j: 1, k: -2});
    });
  });
});
