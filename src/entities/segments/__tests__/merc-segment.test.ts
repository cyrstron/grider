import {MercSegment} from '../merc-segment';
import {MercPoint} from '../../points';

describe('merc segment', () => {
  describe('constructor', () => {
    it('should return instance of MercSegment', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment).toBeInstanceOf(MercSegment);
    });
  });

  describe('toOppositeHemisphere', () => {
    it('should return instance of MercSegment', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment.toOppositeHemisphere()).toBeInstanceOf(MercSegment);
    });

    it('should return merc segment moved to opposite hemisphere', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment.toOppositeHemisphere()).toMatchObject({
        pointA: {x: 0, y: 0.5},
        pointB: {x: 0.0050000000000000044, y: 0.495},
      });
    });
  });

  describe('intersectionPoint', () => {
    it('should return instance of MercPoint', () => {
      const segmentA = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );
      const segmentB = new MercSegment(
        new MercPoint(0.505, 0.5),
        new MercPoint(0.5, 0.495),
      );

      expect(segmentA.intersectionPoint(segmentB)).toBeInstanceOf(MercPoint);
    });

    describe('when segments have intersection point', () => {
      it('should return proper intersection point', () => {
        const segmentA = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );
        const segmentB = new MercSegment(
          new MercPoint(0.505, 0.5),
          new MercPoint(0.5, 0.495),
        );

        expect(segmentA.intersectionPoint(segmentB)).toMatchObject({
          x: 0.5024999999999997,
          y: 0.4975000000000003,
        });
      });
    });

    describe('when segments doesn\'t have intersection point', () => {
      it('should return undefined', () => {
        const segmentA = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );
        const segmentB = new MercSegment(
          new MercPoint(0.6, 0.605),
          new MercPoint(0.4, 0.405),
        );

        expect(segmentA.intersectionPoint(segmentB)).toBeUndefined();
      });
    });

    describe('when one of the segments is on anti-meridian', () => {
      describe('when segments have intersection point', () => {
        it('should return proper intersection point', () => {
          const segmentA = new MercSegment(
            new MercPoint(0.995, 0.5),
            new MercPoint(0.005, 0.495),
          );
          const segmentB = new MercSegment(
            new MercPoint(0.004, 0.5),
            new MercPoint(0.001, 0.495),
          );

          expect(segmentA.intersectionPoint(segmentB)).toMatchObject({
            x: 0.001923076923075806,
            y: 0.4965384615384624,
          });
        });
      });

      describe('when segments doesn\'t have intersection point', () => {
        it('should return undefined', () => {
          const segmentA = new MercSegment(
            new MercPoint(0.995, 0.5),
            new MercPoint(0.005, 0.495),
          );
          const segmentB = new MercSegment(
            new MercPoint(0.004, 0.6),
            new MercPoint(0.001, 0.595),
          );

          expect(segmentA.intersectionPoint(segmentB)).toBeUndefined();
        });
      });
    });
  });

  describe('closestToPoint', () => {
    it('should return instance of MercPoint', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );
      const point = new MercPoint(0.505, 0.5);

      expect(segment.closestToPoint(point)).toBeInstanceOf(MercPoint);
    });

    it('should return proper closest point', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );
      const point = new MercPoint(0.505, 0.5);

      expect(segment.closestToPoint(point)).toMatchObject({
        x: 0.5025,
        y: 0.4975,
      });
    });

    describe('when one of the segments is on anti-meridian', () => {
      it('should return proper closest point', () => {
        const segment = new MercSegment(
          new MercPoint(0.995, 0.5),
          new MercPoint(0.005, 0.495),
        );
        const point = new MercPoint(0.003, 0.505);

        expect(segment.closestToPoint(point)).toMatchObject({
          x: 0.9994000000000001,
          y: 0.4978,
        });
      });
    });
  });

  describe('get isAntiMeridian', () => {
    describe('when segment is antimeridian', () => {
      it('should return true', () => {
        const segment = new MercSegment(
          new MercPoint(0.995, 0.5),
          new MercPoint(0.005, 0.495),
        );

        expect(segment.isAntiMeridian).toBe(true);
      });
    });

    describe('when segment is not antimeridian', () => {
      it('should return false', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.isAntiMeridian).toBe(false);
      });
    });
  });

  describe('get isParallelToAxisX', () => {
    describe('when segment is on parallel', () => {
      it('should return true', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.5),
        );

        expect(segment.isParallelToAxisX).toBe(true);
      });
    });

    describe('when segment is not on parallel', () => {
      it('should return false', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.isParallelToAxisX).toBe(false);
      });
    });
  });

  describe('get isParallelToAxisY', () => {
    describe('when segment is on meridian', () => {
      it('should return true', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.5, 0.495),
        );

        expect(segment.isParallelToAxisY).toBe(true);
      });
    });

    describe('when segment is not on meridian', () => {
      it('should return false', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.isParallelToAxisY).toBe(false);
      });
    });
  });

  describe('get easternPoint', () => {
    it('should return instance of MercPoint', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment.easternPoint).toBeInstanceOf(MercPoint);
    });

    describe('when pointA is eastern', () => {
      it('should return proper eastern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.505, 0.495),
          new MercPoint(0.5, 0.5),
        );

        expect(segment.easternPoint).toMatchObject({
          x: 0.505,
          y: 0.495,
        });
      });
    });

    describe('when pointB is eastern', () => {
      it('should return proper eastern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.easternPoint).toMatchObject({
          x: 0.505,
          y: 0.495,
        });
      });
    });

    describe('when segment on meridian', () => {
      it('should return eather point', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.5, 0.495),
        );

        expect(segment.easternPoint).toMatchObject({
          x: 0.5,
        });
      });
    });

    describe('when point is on anti-meridian', () => {
      it('should return proper eastern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.995, 0.495),
          new MercPoint(0.005, 0.5),
        );

        expect(segment.easternPoint).toMatchObject({
          x: 0.005,
          y: 0.5,
        });
      });
    });
  });

  describe('get westernPoint', () => {
    it('should return instance of MercPoint', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment.westernPoint).toBeInstanceOf(MercPoint);
    });

    describe('when pointA is western', () => {
      it('should return proper western point', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.westernPoint).toMatchObject({
          x: 0.5,
          y: 0.5,
        });
      });
    });

    describe('when pointB is western', () => {
      it('should return proper western point', () => {
        const segment = new MercSegment(
          new MercPoint(0.505, 0.495),
          new MercPoint(0.5, 0.5),
        );

        expect(segment.westernPoint).toMatchObject({
          x: 0.5,
          y: 0.5,
        });
      });
    });

    describe('when segment on meridian', () => {
      it('should return eather point', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.5, 0.495),
        );

        expect(segment.westernPoint).toMatchObject({
          x: 0.5,
        });
      });
    });

    describe('when point is on anti-meridian', () => {
      it('should return proper western point', () => {
        const segment = new MercSegment(
          new MercPoint(0.995, 0.495),
          new MercPoint(0.005, 0.5),
        );

        expect(segment.westernPoint).toMatchObject({
          x: 0.995,
          y: 0.495,
        });
      });
    });
  });

  describe('get northernPoint', () => {
    it('should return instance of MercPoint', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment.northernPoint).toBeInstanceOf(MercPoint);
    });

    describe('when pointA is northern', () => {
      it('should return proper northern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.northernPoint).toMatchObject({
          x: 0.505,
          y: 0.495,
        });
      });
    });

    describe('when pointB is northern', () => {
      it('should return proper northern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.505, 0.495),
          new MercPoint(0.5, 0.5),
        );

        expect(segment.northernPoint).toMatchObject({
          x: 0.505,
          y: 0.495,
        });
      });
    });

    describe('when segment on parallel', () => {
      it('should return eather point', () => {
        const segment = new MercSegment(
          new MercPoint(0.505, 0.5),
          new MercPoint(0.5, 0.5),
        );

        expect(segment.northernPoint).toMatchObject({
          y: 0.5,
        });
      });
    });
  });

  describe('get southernPoint', () => {
    it('should return instance of MercPoint', () => {
      const segment = new MercSegment(
        new MercPoint(0.5, 0.5),
        new MercPoint(0.505, 0.495),
      );

      expect(segment.southernPoint).toBeInstanceOf(MercPoint);
    });

    describe('when pointA is southern', () => {
      it('should return proper southern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.5, 0.5),
          new MercPoint(0.505, 0.495),
        );

        expect(segment.southernPoint).toMatchObject({
          x: 0.5,
          y: 0.5,
        });
      });
    });

    describe('when pointB is southern', () => {
      it('should return proper southern point', () => {
        const segment = new MercSegment(
          new MercPoint(0.505, 0.495),
          new MercPoint(0.5, 0.5),
        );

        expect(segment.southernPoint).toMatchObject({
          x: 0.5,
          y: 0.5,
        });
      });
    });

    describe('when segment on parallel', () => {
      it('should return eather point', () => {
        const segment = new MercSegment(
          new MercPoint(0.505, 0.5),
          new MercPoint(0.5, 0.5),
        );

        expect(segment.southernPoint).toMatchObject({
          y: 0.5,
        });
      });
    });
  });
});
