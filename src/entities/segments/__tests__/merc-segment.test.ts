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
});
