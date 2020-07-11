import {Line} from '../line';
import {Point} from '../../points';
import {Vector} from '../../vectors/vector';

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

  describe('hasPoint', () => {
    describe('when point is on line', () => {
      it('should return true', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        expect(line.hasPoint(point)).toBe(true);
      });

      describe('when line is parallel to X', () => {
        it('should return true', () => {
          const line = new Line(0, 3, 2);
          const point = new Point(-2, -2/3);

          expect(line.hasPoint(point)).toBe(true);
        });
      });

      describe('when line is parallel to Y', () => {
        it('should return true', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-2, 4);

          expect(line.hasPoint(point)).toBe(true);
        });
      });
    });

    describe('when point is not on line', () => {
      it('should return false', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 2);

        expect(line.hasPoint(point)).toBe(false);
      });

      describe('when line is parallel to X', () => {
        it('should return false', () => {
          const line = new Line(0, 3, 2);
          const point = new Point(-3, -2);

          expect(line.hasPoint(point)).toBe(false);
        });
      });

      describe('when line is parallel to Y', () => {
        it('should return false', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-3, 4);

          expect(line.hasPoint(point)).toBe(false);
        });
      });
    });
  });

  describe('distanceToPoint', () => {
    it('should return shortest distance from line to a point', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(-2, 2);

      expect(line.distanceToPoint(point)).toBe(2.280350850198276);
    });

    describe('when point is on the line', () => {
      it('should return 0', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        expect(line.distanceToPoint(point)).toBe(0);
      });
    });
  });

  describe('getNormalVector', () => {
    it('should return a Vector', () => {
      const line = new Line(1, 3, 2);
      const normalVector = line.getNormalVector();

      expect(normalVector).toBeInstanceOf(Vector);
    });

    it('should return proper normal vector', () => {
      const line = new Line(1, 3, 2);
      const normalVector = line.getNormalVector();

      expect(normalVector).toMatchObject({x: 1, y: 3});
    });
  });


  describe('perpendicularByPoint', () => {
    it('should return Line', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(2, 4);

      const perpedicular = line.perpendicularByPoint(point);

      expect(perpedicular).toBeInstanceOf(Line);
    });

    it('should return proper perendicular', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(2, 4);

      const perpedicular = line.perpendicularByPoint(point);

      expect(perpedicular).toMatchObject({a: 1, b: -1/3, c: -3.333333333333333});
    });
  });

  describe('closestToPoint', () => {
    it('should return a Point', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(2, 4);

      const closestPoint = line.closestToPoint(point);

      expect(closestPoint).toBeInstanceOf(Point);
    });

    it('should return closest point on the line', () => {
      const line = new Line(1, 3, 2);
      const point = new Point(2, 4);

      const closestPoint = line.closestToPoint(point);

      expect(closestPoint).toMatchObject({x: 2.8000000000000003, y: -1.5999999999999999});
    });

    describe('when point is on the line', () => {
      it('should return equivalent point', () => {
        const line = new Line(1, 3, 2);
        const point = new Point(-2, 0);

        const closestPoint = line.closestToPoint(point);

        expect(closestPoint).toMatchObject({x: -2, y: 0});
      });
    });

    describe('when line is parallel to x', () => {
      it('should return closest point on the line', () => {
        const line = new Line(0, 3, 2);
        const point = new Point(2, -4);

        const closestPoint = line.closestToPoint(point);

        expect(closestPoint).toMatchObject({x: 2, y: -2/3});
      });

      describe('when point is on the line', () => {
        it('should return equivalent point', () => {
          const line = new Line(0, 3, 2);
          const point = new Point(-2, -2/3);

          const closestPoint = line.closestToPoint(point);

          expect(closestPoint).toMatchObject({x: -2, y: -2/3});
        });
      });
    });

    describe('when line is parallel to y', () => {
      it('should return closest point on the line', () => {
        const line = new Line(1, 0, 2);
        const point = new Point(2, -4);

        const closestPoint = line.closestToPoint(point);

        expect(closestPoint).toMatchObject({x: -2, y: -4});
      });

      describe('when point is on the line', () => {
        it('should return equivalent point', () => {
          const line = new Line(1, 0, 2);
          const point = new Point(-2, -4);

          const closestPoint = line.closestToPoint(point);

          expect(closestPoint).toMatchObject({x: -2, y: -4});
        });
      });
    });
  });

  describe('intersectionX', () => {
    it('should return proper x for intersection point of two lines', () => {
      const lineA = new Line(1, 3, 2);
      const lineB = new Line(2, -3, 1);

      expect(lineA.intersectionX(lineB)).toBe(-1);
    });

    describe('when lines are parallel', () => {
      it('should return undefined', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(1, 3, 5);

        expect(lineA.intersectionX(lineB)).toBeUndefined();
      });

      describe('when lines are parallel to x', () => {
        it('should return undefined', () => {
          const lineA = new Line(0, 3, 2);
          const lineB = new Line(0, 2, 5);

          expect(lineA.intersectionX(lineB)).toBeUndefined();
        });
      });

      describe('when lines are parallel to y', () => {
        it('should return undefined', () => {
          const lineA = new Line(2, 0, 2);
          const lineB = new Line(3, 0, 5);

          expect(lineA.intersectionX(lineB)).toBeUndefined();
        });
      });
    });

    describe('when lineA is parallel to x', () => {
      it('should return proper x for intersection point of two lines', () => {
        const lineA = new Line(0, 3, 2);
        const lineB = new Line(2, -3, 1);

        expect(lineA.intersectionX(lineB)).toBe(-1.5);
      });
    });

    describe('when lineB is parallel to x', () => {
      it('should return proper x for intersection point of two lines', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(0, -3, 1);

        expect(lineA.intersectionX(lineB)).toBe(-3);
      });
    });

    describe('when lineA is parallel to y', () => {
      it('should return proper x for intersection point of two lines', () => {
        const lineA = new Line(1, 0, 2);
        const lineB = new Line(2, -3, 1);

        expect(lineA.intersectionX(lineB)).toBe(-2);
      });
    });

    describe('when lineB is parallel to y', () => {
      it('should return proper x for intersection point of two lines', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(2, 0, 1);

        expect(lineA.intersectionX(lineB)).toBe(-0.5);
      });
    });
  });

  describe('intersectionY', () => {
    it('should return proper y for intersection point of two lines', () => {
      const lineA = new Line(1, 3, 2);
      const lineB = new Line(2, -3, 1);

      expect(lineA.intersectionY(lineB)).toBe(-0.3333333333333333);
    });

    describe('when lines are parallel', () => {
      it('should return undefined', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(1, 3, 5);

        expect(lineA.intersectionY(lineB)).toBeUndefined();
      });

      describe('when lines are parallel to x', () => {
        it('should return undefined', () => {
          const lineA = new Line(0, 3, 2);
          const lineB = new Line(0, 2, 5);

          expect(lineA.intersectionY(lineB)).toBeUndefined();
        });
      });

      describe('when lines are parallel to y', () => {
        it('should return undefined', () => {
          const lineA = new Line(2, 0, 2);
          const lineB = new Line(3, 0, 5);

          expect(lineA.intersectionY(lineB)).toBeUndefined();
        });
      });
    });

    describe('when lineA is parallel to x', () => {
      it('should return proper y for intersection point of two lines', () => {
        const lineA = new Line(0, 3, 2);
        const lineB = new Line(2, -3, 1);

        expect(lineA.intersectionY(lineB)).toBe(-0.6666666666666666);
      });
    });

    describe('when lineB is parallel to x', () => {
      it('should return proper y for intersection point of two lines', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(0, -3, 1);

        expect(lineA.intersectionY(lineB)).toBe(0.3333333333333333);
      });
    });

    describe('when lineA is parallel to y', () => {
      it('should return proper y for intersection point of two lines', () => {
        const lineA = new Line(1, 0, 2);
        const lineB = new Line(2, -3, 1);

        expect(lineA.intersectionY(lineB)).toBe(-1);
      });
    });

    describe('when lineB is parallel to y', () => {
      it('should return proper y for intersection point of two lines', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(2, 0, 1);

        expect(lineA.intersectionY(lineB)).toBe(-0.5);
      });
    });
  });

  describe('intersectionPoint', () => {
    it('should return a Point', () => {
      const lineA = new Line(1, 3, 2);
      const lineB = new Line(2, -3, 1);

      const intersection = lineA.intersectionPoint(lineB);

      expect(intersection).toBeInstanceOf(Point);
    });

    it('should return proper intersection point', () => {
      const lineA = new Line(1, 3, 2);
      const lineB = new Line(2, -3, 1);

      const intersection = lineA.intersectionPoint(lineB);

      expect(intersection).toMatchObject({x: -1, y: -0.3333333333333333});
    });

    describe('when lines are parallel', () => {
      it('should return undefined', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(1, 3, -5);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toBeUndefined();
      });
    });

    describe('when lineA is parallel to x', () => {
      it('should return proper intersection point', () => {
        const lineA = new Line(0, 3, 2);
        const lineB = new Line(2, -3, 1);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toMatchObject({x: -1.5, y: -0.6666666666666666});
      });
    });

    describe('when lineB is parallel to x', () => {
      it('should return proper intersection point', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(0, -3, 1);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toMatchObject({x: -3, y: 0.3333333333333333});
      });
    });

    describe('when lineA is parallel to y', () => {
      it('should return proper intersection point', () => {
        const lineA = new Line(1, 0, 2);
        const lineB = new Line(2, -3, 1);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toMatchObject({x: -2, y: -1});
      });
    });

    describe('when lineB is parallel to y', () => {
      it('should return proper intersection point', () => {
        const lineA = new Line(1, 3, 2);
        const lineB = new Line(2, 0, 1);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toMatchObject({x: -0.5, y: -0.5});
      });
    });

    describe('when one line is parallel to x and anouther is parallel to y', () => {
      it('should return proper intersection point', () => {
        const lineA = new Line(0, 3, 2);
        const lineB = new Line(2, 0, 1);

        const intersection = lineA.intersectionPoint(lineB);

        expect(intersection).toMatchObject({x: -0.5, y: -0.6666666666666666});
      });
    });
  });

  describe('static fromTwoPoints', () => {
    it('should return a line', () => {
      const pointA = new Point(2, 4);
      const pointB = new Point(5, -7);

      const line = Line.fromTwoPoints(pointA, pointB);

      expect(line).toBeInstanceOf(Line);
    });

    it('should return proper line', () => {
      const pointA = new Point(2, 4);
      const pointB = new Point(5, -7);

      const line = Line.fromTwoPoints(pointA, pointB);

      expect(line).toMatchObject({a: 11, b: 3, c: -34});
    });

    describe('when point has same x', () => {
      it('should return line that is parallel to y', () => {
        const pointA = new Point(2, 4);
        const pointB = new Point(2, -7);

        const line = Line.fromTwoPoints(pointA, pointB);

        expect(line.isParallelToAxisY).toBe(true);
      });
    });

    describe('when point has same y', () => {
      it('should return line that is parallel to x', () => {
        const pointA = new Point(2, 4);
        const pointB = new Point(5, 4);

        const line = Line.fromTwoPoints(pointA, pointB);

        expect(line.isParallelToAxisX).toBe(true);
      });
    });
  });
});
