import {
  getNorthWest,
  getNorthEast,
  getSouthWest,
  getSouthEast,
  getNorth,
  getSouth,
  getEast,
  getWest,
  getAll,
} from '../neighborer';
import {GridParams} from '../../../../grid-params';
import {CenterPoint} from '../../center-point';

function createCenterPoint(
  config: Partial<grider.GridConfig> = {},
  point: Partial<grider.GridPoint> = {},
): CenterPoint {
  return CenterPoint.fromPlain({i: 0, j: 0, ...point}, GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  }));
}

describe('getNorthWest', () => {
  describe('when grid is hexagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper northWest point', () => {
        expect(getNorthWest(centerPoint)).toStrictEqual({northWest: {i: -1, j: 1, k: 0}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper northWest point', () => {
        expect(getNorthWest(centerPoint)).toStrictEqual({northWest: {i: 1, j: -1, k: 0}});
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper northWest point', () => {
        expect(getNorthWest(centerPoint)).toStrictEqual({northWest: {i: -1, j: 1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper northWest point', () => {
        expect(getNorthWest(centerPoint)).toStrictEqual({northWest: {i: 1, j: -1}});
      });
    });
  });
});

describe('getNorthEast', () => {
  describe('when grid is hexagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper northEast point', () => {
        expect(getNorthEast(centerPoint)).toStrictEqual({northEast: {i: 1, j: 0, k: -1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper northEast point', () => {
        expect(getNorthEast(centerPoint)).toStrictEqual({northEast: {i: 1, j: 0, k: -1}});
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper northEast point', () => {
        expect(getNorthEast(centerPoint)).toStrictEqual({northEast: {i: 1, j: 1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper northEast point', () => {
        expect(getNorthEast(centerPoint)).toStrictEqual({northEast: {i: 1, j: 1}});
      });
    });
  });
});

describe('getSouthWest', () => {
  describe('when grid is hexagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper southWest point', () => {
        expect(getSouthWest(centerPoint)).toStrictEqual({southWest: {i: -1, j: 0, k: 1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper southWest point', () => {
        expect(getSouthWest(centerPoint)).toStrictEqual({southWest: {i: -1, j: 0, k: 1}});
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper southWest point', () => {
        expect(getSouthWest(centerPoint)).toStrictEqual({southWest: {i: -1, j: -1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper southWest point', () => {
        expect(getSouthWest(centerPoint)).toStrictEqual({southWest: {i: -1, j: -1}});
      });
    });
  });
});

describe('getSouthEast', () => {
  describe('when grid is hexagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper southEast point', () => {
        expect(getSouthEast(centerPoint)).toStrictEqual({southEast: {i: 1, j: -1, k: 0}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper southEast point', () => {
        expect(getSouthEast(centerPoint)).toStrictEqual({southEast: {i: -1, j: 1, k: 0}});
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper southEast point', () => {
        expect(getSouthEast(centerPoint)).toStrictEqual({southEast: {i: 1, j: -1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper southEast point', () => {
        expect(getSouthEast(centerPoint)).toStrictEqual({southEast: {i: -1, j: 1}});
      });
    });
  });
});

describe('getNorth', () => {
  describe('when grid is hexagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper northEast & northWest points', () => {
        expect(getNorth(centerPoint)).toStrictEqual({
          northEast: {i: 1, j: 0, k: -1},
          northWest: {i: -1, j: 1, k: 0},
        });
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper north point', () => {
        expect(getNorth(centerPoint)).toStrictEqual({north: {i: 0, j: 1, k: -1}});
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper north point', () => {
        expect(getNorth(centerPoint)).toStrictEqual({north: {i: 0, j: 1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper north point', () => {
        expect(getNorth(centerPoint)).toStrictEqual({north: {i: 1, j: 0}});
      });
    });
  });
});

describe('getSouth', () => {
  describe('when grid is hexagonal', () => {
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper southEast & southWest points', () => {
        expect(getSouth(centerPoint)).toStrictEqual({
          southEast: {i: 1, j: -1, k: 0},
          southWest: {i: -1, j: 0, k: 1},
        });
      });
    });
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper south point', () => {
        expect(getSouth(centerPoint)).toStrictEqual({south: {i: 0, j: -1, k: 1}});
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper south point', () => {
        expect(getSouth(centerPoint)).toStrictEqual({south: {i: 0, j: -1}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper south point', () => {
        expect(getSouth(centerPoint)).toStrictEqual({south: {i: -1, j: 0}});
      });
    });
  });
});

describe('getEast', () => {
  describe('when grid is hexagonal', () => {
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper east point', () => {
        expect(getEast(centerPoint)).toStrictEqual({east: {i: 0, j: 1, k: -1}});
      });
    });
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper southEast & northEast points', () => {
        expect(getEast(centerPoint)).toStrictEqual({
          northEast: {i: 1, j: 0, k: -1},
          southEast: {i: -1, j: 1, k: 0},
        });
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper east point', () => {
        expect(getEast(centerPoint)).toStrictEqual({east: {i: -1, j: 0}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper east point', () => {
        expect(getEast(centerPoint)).toStrictEqual({east: {i: 0, j: 1}});
      });
    });
  });
});

describe('getWest', () => {
  describe('when grid is hexagonal', () => {
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return proper west point', () => {
        expect(getWest(centerPoint)).toStrictEqual({west: {i: 0, j: -1, k: 1}});
      });
    });
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return proper southWest & northWest points', () => {
        expect(getWest(centerPoint)).toStrictEqual({
          northWest: {i: 1, j: -1, k: 0},
          southWest: {i: -1, j: 0, k: 1},
        });
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return proper west point', () => {
        expect(getWest(centerPoint)).toStrictEqual({west: {i: 1, j: 0}});
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return proper west point', () => {
        expect(getWest(centerPoint)).toStrictEqual({west: {i: 0, j: -1}});
      });
    });
  });
});

describe('getAll', () => {
  describe('when grid is hexagonal', () => {
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex', isHorizontal: true}, {k: 0});

      it('should return all neighbor points', () => {
        expect(getAll(centerPoint)).toStrictEqual({
          east: {i: 0, j: 1, k: -1},
          west: {i: 0, j: -1, k: 1},
          northEast: {i: 1, j: 0, k: -1},
          northWest: {i: -1, j: 1, k: 0},
          southEast: {i: 1, j: -1, k: 0},
          southWest: {i: -1, j: 0, k: 1},
        });
      });
    });
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({type: 'hex'}, {k: 0});

      it('should return all neighbor points', () => {
        expect(getAll(centerPoint)).toStrictEqual({
          north: {i: 0, j: 1, k: -1},
          south: {i: 0, j: -1, k: 1},
          northEast: {i: 1, j: 0, k: -1},
          northWest: {i: 1, j: -1, k: 0},
          southEast: {i: -1, j: 1, k: 0},
          southWest: {i: -1, j: 0, k: 1},
        });
      });
    });
  });

  describe('when grid is rectagonal', () => {
    describe('when longitude is main axis', () => {
      const centerPoint = createCenterPoint({isHorizontal: true});

      it('should return all neighbor points', () => {
        expect(getAll(centerPoint)).toStrictEqual({
          north: {i: 0, j: 1},
          east: {i: -1, j: 0},
          west: {i: 1, j: 0},
          south: {i: 0, j: -1},
          northEast: {i: 1, j: 1},
          northWest: {i: -1, j: 1},
          southEast: {i: 1, j: -1},
          southWest: {i: -1, j: -1},
        });
      });
    });
    describe('when latitude is main axis', () => {
      const centerPoint = createCenterPoint();

      it('should return all neighbor points', () => {
        expect(getAll(centerPoint)).toStrictEqual({
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
    });
  });
});
