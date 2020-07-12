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

    describe('when pointA has min x value', () => {
      it('should return pointA', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, -4);

        const segment = new Segment(pointA, pointB);

        expect(segment.minXPoint).toMatchObject({
          x: -1,
          y: 2,
        });
      });
    });

    describe('when pointB has min x value', () => {
      it('should return pointB', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(-4, -4);

        const segment = new Segment(pointA, pointB);

        expect(segment.minXPoint).toMatchObject({
          x: -4,
          y: -4,
        });
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


    describe('when pointA has max y value', () => {
      it('should return pointA', () => {
        const pointA = new Point(3, -4);
        const pointB = new Point(-1, -7);

        const segment = new Segment(pointA, pointB);

        expect(segment.maxYPoint).toMatchObject({
          x: 3,
          y: -4,
        });
      });
    });

    describe('when pointB has max y value', () => {
      it('should return pointB', () => {
        const pointA = new Point(-4, -4);
        const pointB = new Point(-1, 2);

        const segment = new Segment(pointA, pointB);

        expect(segment.maxYPoint).toMatchObject({
          x: -1,
          y: 2,
        });
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
        x: -0.8461538461538463,
        y: 1.7692307692307694,
      });
    });

    describe('when closest point on the line is outside the segment', () => {
      it('should return proper point', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, -4);
        const pointC = new Point(6, -5);

        const segment = new Segment(pointA, pointB);

        expect(segment.closestToPoint(pointC)).toMatchObject({
          x: 3,
          y: -4,
        });
      });

      describe('when segment is parallel to x', () => {
        it('should return proper point', () => {
          const pointA = new Point(-1, 2);
          const pointB = new Point(3, 2);
          const pointC = new Point(1, 3);

          const segment = new Segment(pointA, pointB);

          expect(segment.closestToPoint(pointC)).toMatchObject({
            x: 1,
            y: 2,
          });
        });

        describe('when closest point on the line has x smaller than segment\'s min x', () => {
          it('should return proper point', () => {
            const pointA = new Point(-1, 2);
            const pointB = new Point(3, 2);
            const pointC = new Point(-4, 3);

            const segment = new Segment(pointA, pointB);

            expect(segment.closestToPoint(pointC)).toMatchObject({
              x: -1,
              y: 2,
            });
          });
        });

        describe('when closest point on the line has x bigger than segment\'s max x', () => {
          it('should return proper point', () => {
            const pointA = new Point(-1, 2);
            const pointB = new Point(3, 2);
            const pointC = new Point(5, 3);

            const segment = new Segment(pointA, pointB);

            expect(segment.closestToPoint(pointC)).toMatchObject({
              x: 3,
              y: 2,
            });
          });
        });
      });
    });

    describe('when segment is parallel to y', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(-1, -3);

      const segment = new Segment(pointA, pointB);

      it('should return proper point', () => {
        const pointC = new Point(3, 1);

        expect(segment.closestToPoint(pointC)).toMatchObject({
          x: -1,
          y: 1,
        });
      });

      describe('when closest point on the line has y smaller than segment\'s min y', () => {
        it('should return proper point', () => {
          const pointC = new Point(1, -5);

          expect(segment.closestToPoint(pointC)).toMatchObject({
            x: -1,
            y: -3,
          });
        });
      });

      describe('when closest point on the line has y bigger than segment\'s max y', () => {
        it('should return proper point', () => {
          const pointC = new Point(1, 5);

          expect(segment.closestToPoint(pointC)).toMatchObject({
            x: -1,
            y: 2,
          });
        });
      });
    });
  });

  describe('hasPoint', () => {
    const pointA = new Point(-1, 2);
    const pointB = new Point(3, -2);

    const segment = new Segment(pointA, pointB);

    describe('when point is on the segment', () => {
      it('should return true', () => {
        const point = new Point(2, -1);

        expect(segment.hasPoint(point)).toBe(true);
      });
    });

    describe('when point is not on the segment', () => {
      it('should return true', () => {
        const point = new Point(3, 1);

        expect(segment.hasPoint(point)).toBe(false);
      });
    });

    describe('when segment is parallel to x', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, 2);

      const segment = new Segment(pointA, pointB);

      describe('when point is on the segment', () => {
        it('should return true', () => {
          const point = new Point(2, 2);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return true', () => {
          const point = new Point(3, 1);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });

      describe('when closest point on the line has x smaller than segment\'s min x', () => {
        it('should return proper point', () => {
          const point = new Point(-4, 2);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });

      describe('when closest point on the line has x bigger than segment\'s max x', () => {
        it('should return proper point', () => {
          const point = new Point(6, 2);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });
    });

    describe('when segment is parallel to y', () => {
      const pointA = new Point(-1, 1);
      const pointB = new Point(-1, 5);

      const segment = new Segment(pointA, pointB);

      describe('when point is on the segment', () => {
        it('should return true', () => {
          const point = new Point(-1, 4);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return true', () => {
          const point = new Point(3, 1);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });

      describe('when closest point on the line has y smaller than segment\'s min y', () => {
        it('should return proper point', () => {
          const point = new Point(-1, -2);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });

      describe('when closest point on the line has y bigger than segment\'s max y', () => {
        it('should return proper point', () => {
          const point = new Point(-1, 8);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });
    });
  });

  describe('intersectionPoint', () => {
    describe('when segments have intersection point', () => {
      it('should return instance of Point', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, -4);

        const segmentA = new Segment(pointA, pointB);

        const pointC = new Point(3, 1);
        const pointD = new Point(-1, -3);

        const segmentB = new Segment(pointC, pointD);

        expect(segmentA.intersectionPoint(segmentB)).toBeInstanceOf(Point);
      });
    });

    describe('when segments don\'t have intersection point', () => {
      it('should return undefined', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, -4);

        const segmentA = new Segment(pointA, pointB);

        const pointC = new Point(3, 1);
        const pointD = new Point(5, 4);

        const segmentB = new Segment(pointC, pointD);

        expect(segmentA.intersectionPoint(segmentB)).toBeUndefined();
      });
    });

    describe('when segments are parallel', () => {
      it('should return undefined', () => {
        const pointA = new Point(-1, 2);
        const pointB = new Point(3, -4);

        const segmentA = new Segment(pointA, pointB);

        const pointC = new Point(3, 1);
        const pointD = new Point(5, -2);

        const segmentB = new Segment(pointC, pointD);

        expect(segmentA.intersectionPoint(segmentB)).toBeUndefined();
      });
    });
  });
});
