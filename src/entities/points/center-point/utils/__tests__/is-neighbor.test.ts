import {isHexNeighbor, isRectNeighbor, isNeighbor} from '../is-neighbor';
import {CenterPoint} from '../../center-point';
import {GridParams} from '../../../../grid-params';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('isHexNeighbor', () => {
  const pointA: grider.GridPoint = {i: 0, j: 0, k: 0};

  describe('when center point is neighbor', () => {
    describe('when point is neighbor with same i & bigger j', () => {
      const pointB: grider.GridPoint = {i: 0, j: 1, k: -1};

      it('should return true', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same i & bigger k', () => {
      const pointB: grider.GridPoint = {i: 0, j: -1, k: 1};

      it('should return true', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same j & bigger k', () => {
      const pointB: grider.GridPoint = {i: -1, j: 0, k: 1};

      it('should return true', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same j & bigger i', () => {
      const pointB: grider.GridPoint = {i: 1, j: 0, k: -1};

      it('should return true', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same k & bigger i', () => {
      const pointB: grider.GridPoint = {i: 1, j: -1, k: 0};

      it('should return true', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same k & bigger j', () => {
      const pointB: grider.GridPoint = {i: -1, j: 1, k: 0};

      it('should return true', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(true);
      });
    });
  });

  describe('when center point is not neighbor', () => {
    const pointB: grider.GridPoint = {i: -2, j: 1, k: 1};

    it('should return false', () => {
      expect(isHexNeighbor(pointA, pointB)).toBe(false);
    });

    describe('when point is the same', () => {
      const pointB: grider.GridPoint = {i: 0, j: 0, k: 0};

      it('should return false', () => {
        expect(isHexNeighbor(pointA, pointB)).toBe(false);
      });
    });
  });
});

describe('isRectNeighbor', () => {
  const pointA: grider.GridPoint = {i: 0, j: 0};

  describe('when cell is neighbor', () => {
    describe('when point is neighbor with same i & bigger j', () => {
      const pointB: grider.GridPoint = {i: 0, j: 1};

      it('should return true', () => {
        expect(isRectNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same j & bigger i', () => {
      const pointB: grider.GridPoint = {i: 1, j: 0};

      it('should return true', () => {
        expect(isRectNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same i & smaller j', () => {
      const pointB: grider.GridPoint = {i: 0, j: -1};

      it('should return true', () => {
        expect(isRectNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when point is neighbor with same j & smaller i', () => {
      const pointB: grider.GridPoint = {i: -1, j: 0};

      it('should return true', () => {
        expect(isRectNeighbor(pointA, pointB)).toBe(true);
      });
    });
  });

  describe('when center point is not neighbor', () => {
    const pointB: grider.GridPoint = {i: -2, j: 1};

    it('should return false', () => {
      expect(isRectNeighbor(pointA, pointB)).toBe(false);
    });

    describe('when point is the same', () => {
      const pointB: grider.GridPoint = {i: 0, j: 0};

      it('should return false', () => {
        expect(isRectNeighbor(pointA, pointB)).toBe(false);
      });
    });
  });
});

describe('isNeighbor', () => {
  describe('when grid is rectagonal', () => {
    const params = createParams();
    const pointA = CenterPoint.fromPlain({i: 0, j: 0}, params);

    describe('when cell is neighbor', () => {
      const pointB = CenterPoint.fromPlain({i: 0, j: 1}, params);
      it('should return true', () => {
        expect(isNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when cell is not neighbor', () => {
      const pointB = CenterPoint.fromPlain({i: 1, j: 2}, params);
      it('should return false', () => {
        expect(isNeighbor(pointA, pointB)).toBe(false);
      });
    });
  });

  describe('when grid is hexagonal', () => {
    const params = createParams({type: 'hex'});
    const pointA = CenterPoint.fromPlain({i: 0, j: 0, k: 0}, params);

    describe('when cell is neighbor', () => {
      const pointB = CenterPoint.fromPlain({i: 0, j: 1, k: -1}, params);
      it('should return true', () => {
        expect(isNeighbor(pointA, pointB)).toBe(true);
      });
    });

    describe('when cell is not neighbor', () => {
      const pointB = CenterPoint.fromPlain({i: 1, j: 2, k: -1}, params);
      it('should return false', () => {
        expect(isNeighbor(pointA, pointB)).toBe(false);
      });
    });
  });
});
