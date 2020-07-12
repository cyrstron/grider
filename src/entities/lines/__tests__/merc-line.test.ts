import {MercLine} from '../merc-line';
import {MercPoint} from '../../points';

describe('mercator line', () => {
  describe('perpendicularByPoint', () => {
    it('should return Line', () => {
      const line = new MercLine(1, 3, 0.05);
      const point = new MercPoint(0.5, 0.4);

      const perpedicular = line.perpendicularByPoint(point);

      expect(perpedicular).toBeInstanceOf(MercLine);
    });
  });

  describe('closestToPoint', () => {
    it('should return a MercPoint', () => {
      const line = new MercLine(1, 3, 0.05);
      const point = new MercPoint(0.5, 0.4);

      const closestPoint = line.closestToPoint(point);

      expect(closestPoint).toBeInstanceOf(MercPoint);
    });
  });

  describe('intersectionPoint', () => {
    it('should return a MercPoint', () => {
      const lineA = new MercLine(1, 3, 0.05);
      const lineB = new MercLine(3, 1, -0.05);

      const intersection = lineA.intersectionPoint(lineB);

      expect(intersection).toBeInstanceOf(MercPoint);
    });

    describe('when lines are parallel', () => {
      it('should return undefined', () => {
        const lineA = new MercLine(1, 3, 0.05);
        const lineB = new MercLine(1, 3, -0.05);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toBeUndefined();
      });
    });
  });

  describe('hasPoint', () => {
    describe('when point is on the line', () => {
      it('should return true', () => {
        const line = MercLine.fromTwoPoints(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        const point = new MercPoint(0.5025, 0.4975);

        expect(line.hasPoint(point)).toBe(true);
      });
    });

    describe('when point is very close to line', () => {
      it('should return true', () => {
        const line = MercLine.fromTwoPoints(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        const point = new MercPoint(0.5024999999999997, 0.4975000000000003);

        expect(line.hasPoint(point)).toBe(true);
      });
    });

    describe('when point is not on line', () => {
      it('should return false', () => {
        const line = MercLine.fromTwoPoints(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        const point = new MercPoint(0.6, 0.4975000000000003);

        expect(line.hasPoint(point)).toBe(false);
      });
    });
  });

  describe('static fromTwoPoints', () => {
    it('should return a line', () => {
      const pointA = new MercPoint(0.5, 0.4);
      const pointB = new MercPoint(0.55, 0.7);

      const line = MercLine.fromTwoPoints(pointA, pointB);

      expect(line).toBeInstanceOf(MercLine);
    });
  });
});
