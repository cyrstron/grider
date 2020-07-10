import {Line} from '../line';
import {Point} from '../../points';

describe('line', () => {
  describe('isParallelToAxisX', () => {
    describe('when line is parallel to x', () => {
      it('should return true', () => {
        const line = new Line(0, 1, 2);

        expect(line.isParallelToAxisX).toBe(true);
      });
    });

    describe('when line is not parallel to x', () => {
      it('should return true', () => {
        const line = new Line(1, 3, 2);

        expect(line.isParallelToAxisX).toBe(false);
      });
    });
  });

  describe('isParallelToAxisY', () => {
    describe('when line is parallel to y', () => {
      it('should return true', () => {
        const line = new Line(1, 0, 2);

        expect(line.isParallelToAxisY).toBe(true);
      });
    });

    describe('when line is not parallel to y', () => {
      it('should return true', () => {
        const line = new Line(1, 3, 2);

        expect(line.isParallelToAxisY).toBe(false);
      });
    });
  });

  describe('xByY', () => {
    describe('when line is parallel to x', () => {
      it('should return undefined', () => {
        const line = new Line(0, 1, 2);

        expect(line.xByY(2)).toBeUndefined();
      });
    });

    describe('when line is not parallel to x', () => {
      it('should return proper value for x', () => {
        const line = new Line(1, 3, 2);

        expect(line.xByY(2)).toBe(-8);
      });
    });
  });

  describe('yByX', () => {
    describe('when line is parallel to y', () => {
      it('should return undefined', () => {
        const line = new Line(1, 0, 2);

        expect(line.yByX(2)).toBeUndefined();
      });
    });

    describe('when line is not parallel to y', () => {
      it('should return proper value for y', () => {
        const line = new Line(1, 3, 2);

        expect(line.yByX(2)).toBe(-1.3333333333333333);
      });
    });
  });

  describe('calcPointThroughLine', () => {
    describe('when point is not on the line', () => {
      it('should calc proper point', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-1, 3);

        expect(line.calcPointThroughLine(point)).toMatchObject({x: -11, y: -0.3333333333333333});
      });
    });

    describe('when point is on the line', () => {
      it('should return equivalent point', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-1, 1);

        expect(line.calcPointThroughLine(point)).toMatchObject({x: -5, y: -0.3333333333333333});
      });
    });

    describe('when line is parallel to y', () => {
      describe('when point is not on the line', () => {
        it('should calc proper point', () => {
          const line = new Line(0, 1, 2);
          const point = new Point(-1, 1);

          expect(line.calcPointThroughLine(point)).toMatchObject({x: -1, y: -2});
        });
      });

      describe('when point is on the line', () => {
        it('should return equivalent point', () => {
          const line = new Line(0, 1, 2);
          const point = new Point(-2, 2);

          expect(line.calcPointThroughLine(point)).toMatchObject({x: -2, y: -2});
        });
      });
    });

    describe('when line is parallel to x', () => {
      describe('when point is not on the line', () => {
        it('should calc proper point', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-1, 1);

          expect(line.calcPointThroughLine(point)).toMatchObject({x: -2, y: 1});
        });
      });

      describe('when point is on the line', () => {
        it('should return equivalent point', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(2, -2);

          expect(line.calcPointThroughLine(point)).toMatchObject({x: -2, y: -2});
        });
      });
    });
  });

  describe('hasPoint', () => {
    describe('when point is on line', () => {
      it('should return true', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        expect(line.hasPoint(point)).toBe(true);
      });
    });
  });
});
