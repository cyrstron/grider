import {Segment} from '../segment';
import {Point} from '../../points';

describe('segment', () => {
  describe('constructor', () => {
    it('should return instance of Segment', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment).toBeInstanceOf(Segment);
    });
  });

  describe('get minX', () => {
    it('should return min value of x among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.minX).toBe(-1);
    });

    describe('when segment is parallel to y', () => {
      it('should return either of x', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(-1, -4);

        const segment = new Segment(pointA, pointB);

        expect(segment.minX).toBe(-1);
      });
    });
  });

  describe('get maxX', () => {
    it('should return max value of x among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.maxX).toBe(3);
    });

    describe('when segment is parallel to y', () => {
      it('should return either of x', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(-1, -4);

        const segment = new Segment(pointA, pointB);

        expect(segment.maxX).toBe(-1);
      });
    });
  });

  describe('get minY', () => {
    it('should return min value of y among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.minY).toBe(-4);
    });

    describe('when segment is parallel to x', () => {
      it('should return either of y', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, 2);

        const segment = new Segment(pointA, pointB);

        expect(segment.minY).toBe(2);
      });
    });
  });

  describe('get maxY', () => {
    it('should return max value of y among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.maxY).toBe(2);
    });

    describe('when segment is parallel to x', () => {
      it('should return either of y', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, 2);

        const segment = new Segment(pointA, pointB);

        expect(segment.maxY).toBe(2);
      });
    });
  });

  describe('get minXPoint', () => {
    it('should return instance of Point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.minXPoint).toBeInstanceOf(Point);
    });

    it('should return points with min x value among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.minXPoint).toMatchObject({
        x: -1,
        y: 2,
      });
    });

    describe('when segment is parallel to y', () => {
      it('should return either of points', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(-1, -4);

        const segment = new Segment(pointA, pointB);

        expect(segment.minXPoint).toMatchObject({
          x: -1,
        });
      });
    });
  });

  describe('get maxXPoint', () => {
    it('should return instance of Point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.maxXPoint).toBeInstanceOf(Point);
    });

    it('should return point with max x value among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.maxXPoint).toMatchObject({
        x: 3,
        y: -4,
      });
    });

    describe('when segment is parallel to y', () => {
      it('should return either of points', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(-1, -4);

        const segment = new Segment(pointA, pointB);

        expect(segment.maxXPoint).toMatchObject({
          x: -1,
        });
      });
    });
  });

  describe('get minYPoint', () => {
    it('should return instance of Point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.minYPoint).toBeInstanceOf(Point);
    });

    it('should return point with min y value among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.minYPoint).toMatchObject({
        x: 3,
        y: -4,
      });
    });

    describe('when segment is parallel to x', () => {
      it('should return either of points', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, 2);

        const segment = new Segment(pointA, pointB);

        expect(segment.minYPoint).toMatchObject({
          y: 2,
        });
      });
    });
  });

  describe('get maxYPoint', () => {
    it('should return instance of Point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.maxYPoint).toBeInstanceOf(Point);
    });

    it('should return point with max y value among two points', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);

      const segment = new Segment(pointA, pointB);

      expect(segment.maxYPoint).toMatchObject({
        x: -1,
        y: 2,
      });
    });

    describe('when segment is parallel to x', () => {
      it('should return either of y', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, 2);

        const segment = new Segment(pointA, pointB);

        expect(segment.maxYPoint).toMatchObject({
          y: 2,
        });
      });
    });
  });

  describe('closestToPoint', () => {
    it('should return instance of Point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);
      const pointC = new Point(1, 4);

      const segment = new Segment(pointA, pointB);

      expect(segment.closestToPoint(pointC)).toBeInstanceOf(Point);
    });

    it('should return proper point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);
      const pointC = new Point(1, 3);

      const segment = new Segment(pointA, pointB);

      expect(segment.closestToPoint(pointC)).toMatchObject({
        x: 1,
        y: -2,
      });
    });
  });
});
