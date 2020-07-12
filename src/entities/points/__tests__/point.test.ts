import {Point} from '../point';
import {Line} from '../../lines';
import {Segment} from '../../segments';

describe('point', () => {
  describe('constructor', () => {
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

  describe('containedByLine', () => {
    describe('when point is on line', () => {
      it('should return true', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        expect(point.containedByLine(line)).toBe(true);
      });

      describe('when line is parallel to X', () => {
        it('should return true', () => {
          const line = new Line(0, 3, 2);
          const point = new Point(-2, -2/3);

          expect(point.containedByLine(line)).toBe(true);
        });
      });

      describe('when line is parallel to Y', () => {
        it('should return true', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-2, 4);

          expect(point.containedByLine(line)).toBe(true);
        });
      });
    });

    describe('when point is not on line', () => {
      it('should return false', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 2);

        expect(point.containedByLine(line)).toBe(false);
      });

      describe('when line is parallel to X', () => {
        it('should return false', () => {
          const line = new Line(0, 3, 2);
          const point = new Point(-3, -2);

          expect(point.containedByLine(line)).toBe(false);
        });
      });

      describe('when line is parallel to Y', () => {
        it('should return false', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-3, 4);

          expect(point.containedByLine(line)).toBe(false);
        });
      });
    });
  });


  describe('containedBySegment', () => {
    const pointA = new Point(-1, 2);
    const pointB = new Point(3, -2);

    const segment = new Segment(pointA, pointB);

    describe('when point is on the segment', () => {
      it('should return true', () => {
        const point = new Point(2, -1);

        expect(point.containedBySegment(segment)).toBe(true);
      });
    });

    describe('when point is not on the segment', () => {
      it('should return true', () => {
        const point = new Point(3, 1);

        expect(point.containedBySegment(segment)).toBe(false);
      });
    });

    describe('when segment is parallel to x', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, 2);

      const segment = new Segment(pointA, pointB);

      describe('when point is on the segment', () => {
        it('should return true', () => {
          const point = new Point(2, 2);

          expect(point.containedBySegment(segment)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return true', () => {
          const point = new Point(3, 1);

          expect(point.containedBySegment(segment)).toBe(false);
        });
      });

      describe('when closest point on the line has x smaller than segment\'s min x', () => {
        it('should return proper point', () => {
          const point = new Point(-4, 2);

          expect(point.containedBySegment(segment)).toBe(false);
        });
      });

      describe('when closest point on the line has x bigger than segment\'s max x', () => {
        it('should return proper point', () => {
          const point = new Point(6, 2);

          expect(point.containedBySegment(segment)).toBe(false);
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

          expect(point.containedBySegment(segment)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return true', () => {
          const point = new Point(3, 1);

          expect(point.containedBySegment(segment)).toBe(false);
        });
      });

      describe('when closest point on the line has y smaller than segment\'s min y', () => {
        it('should return proper point', () => {
          const point = new Point(-1, -2);

          expect(point.containedBySegment(segment)).toBe(false);
        });
      });

      describe('when closest point on the line has y bigger than segment\'s max y', () => {
        it('should return proper point', () => {
          const point = new Point(-1, 8);

          expect(point.containedBySegment(segment)).toBe(false);
        });
      });
    });
  });

  describe('distanceToLine', () => {
    it('should return shortest distance from line to a point', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(-2, 2);

      expect(point.distanceToLine(line)).toBe(1.8973665961010275);
    });

    describe('when point is on the line', () => {
      it('should return 0', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        expect(point.distanceToLine(line)).toBe(0);
      });
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

  describe('static fromPlain', () => {
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

  describe('closestOnLine', () => {
    it('should return a Point', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(2, 4);

      const closestPoint = point.closestOnLine(line);

      expect(closestPoint).toBeInstanceOf(Point);
    });

    it('should return closest point on the line', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(2, 4);

      const closestPoint = point.closestOnLine(line);

      expect(closestPoint).toMatchObject({x: 0.4, y: -0.8});
    });

    describe('when point is on the line', () => {
      it('should return equivalent point', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        const closestPoint = point.closestOnLine(line);

        expect(closestPoint).toMatchObject({x: -2, y: 0});
      });
    });

    describe('when line is parallel to x', () => {
      it('should return closest point on the line', () => {
        const line = new Line(0, 3, 2);
        const point = new Point(2, -4);

        const closestPoint = point.closestOnLine(line);

        expect(closestPoint).toMatchObject({x: 2, y: -2/3});
      });

      describe('when point is on the line', () => {
        it('should return equivalent point', () => {
          const line = new Line(0, 3, 2);
          const point = new Point(-2, -2/3);

          const closestPoint = point.closestOnLine(line);

          expect(closestPoint).toMatchObject({x: -2, y: -2/3});
        });
      });
    });

    describe('when line is parallel to y', () => {
      it('should return closest point on the line', () => {
        const line = new Line(1, 0, 2);
        const point = new Point(2, -4);

        const closestPoint = point.closestOnLine(line);

        expect(closestPoint).toMatchObject({x: -2, y: -4});
      });

      describe('when point is on the line', () => {
        it('should return equivalent point', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-2, -4);

          const closestPoint = point.closestOnLine(line);

          expect(closestPoint).toMatchObject({x: -2, y: -4});
        });
      });
    });
  });


  describe('closestOnSegment', () => {
    it('should return instance of Point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);
      const pointC = new Point(1, 4);

      const segment = new Segment(pointA, pointB);

      expect(pointC.closestOnSegment(segment)).toBeInstanceOf(Point);
    });

    it('should return proper point', () => {
      const pointA = new Point(-1, 2);
      const pointB = new Point(3, -4);
      const pointC = new Point(1, 3);

      const segment = new Segment(pointA, pointB);

      expect(pointC.closestOnSegment(segment)).toMatchObject({
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

        expect(pointC.closestOnSegment(segment)).toMatchObject({
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

          expect(pointC.closestOnSegment(segment)).toMatchObject({
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

            expect(pointC.closestOnSegment(segment)).toMatchObject({
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

            expect(pointC.closestOnSegment(segment)).toMatchObject({
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

        expect(pointC.closestOnSegment(segment)).toMatchObject({
          x: -1,
          y: 1,
        });
      });

      describe('when closest point on the line has y smaller than segment\'s min y', () => {
        it('should return proper point', () => {
          const pointC = new Point(1, -5);

          expect(pointC.closestOnSegment(segment)).toMatchObject({
            x: -1,
            y: -3,
          });
        });
      });

      describe('when closest point on the line has y bigger than segment\'s max y', () => {
        it('should return proper point', () => {
          const pointC = new Point(1, 5);

          expect(pointC.closestOnSegment(segment)).toMatchObject({
            x: -1,
            y: 2,
          });
        });
      });
    });
  });
});
