import {Point} from '../point';

describe('instance', () => {
  describe('instance creation', () => {
    it('should create Point instance', () => {
      expect(new Point(1, 1)).toBeInstanceOf(Point);
    });
  });
});

describe('distanceToPoint', () => {
  it('should return 0 for equal points', () => {
    const point = new Point(1, 1);

    expect(point.distanceToPoint(point)).toBe(0);
  });

  describe('same axis', () => {
    it('should calculate distance for point on x axis', () => {
      const pointA = new Point(1, 1);
      const pointB = new Point(3, 1);

      expect(pointA.distanceToPoint(pointB)).toBe(2);
    });

    it('should calculate distance for point on y axis', () => {
      const pointA = new Point(1, 1);
      const pointB = new Point(1, 3);

      expect(pointA.distanceToPoint(pointB)).toBe(2);
    });
  });

  describe('not same axis', () => {
    it('should calculate distance for points with positive coordinates', () => {
      const pointA = new Point(1, 1);
      const pointB = new Point(3, 3);

      expect(pointA.distanceToPoint(pointB)).toBe(2 * Math.sqrt(2));
    });

    it('should calculate distance for points with negative coordinates', () => {
      const pointA = new Point(-1, -1);
      const pointB = new Point(-3, -3);

      expect(pointA.distanceToPoint(pointB)).toBe(2 * Math.sqrt(2));
    });

    it('should calculate distance for points with mixed coordinates', () => {
      const pointA = new Point(-1, 3);
      const pointB = new Point(-3, 1);

      expect(pointA.distanceToPoint(pointB)).toBe(2 * Math.sqrt(2));
    });
  });
});

describe('toFormatted', () => {
  it('should return same point', () => {
    const point = new Point(1, 1);

    expect(point.toFormatted()).toBe(point);
  });
});

describe('toPlain', () => {
  it('should return plane object', () => {
    const point = new Point(1, 1);

    expect(point.toPlain()).toStrictEqual({x: 1, y: 1});
  });
});

describe('isEqual', () => {
  it('should return true for equal point', () => {
    const pointA = new Point(1, 1);
    const pointB = new Point(1, 1);

    expect(pointA.isEqual(pointB)).toBe(true);
  });

  it('should return false for unequal point', () => {
    const pointA = new Point(1, 1);
    const pointB = new Point(1, 2);

    expect(pointA.isEqual(pointB)).toBe(false);
  });
});

describe('static methods', () => {
  describe('fromPlain', () => {
    it('should create Point instance fro plain object', () => {
      expect(Point.fromPlain({x: 1, y: 1})).toBeInstanceOf(Point);
    });

    it('should be interconvertable with toPlain', () => {
      const plainPoint = {x: 1, y: 1};
      const reconvertedPoint = Point.fromPlain(plainPoint).toPlain();

      expect(reconvertedPoint).toStrictEqual(plainPoint);
    });
  });
});
