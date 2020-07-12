import {GeoPoint} from '../../points';
import {GeoSegment} from '../geo-segment';
import {MercSegment} from '../merc-segment';
import {GeoPolygon} from '../../polygons';

describe('geo segment', () => {
  describe('constructor', () => {
    it('should return GeoSegment', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment).toBeInstanceOf(GeoSegment);
    });
  });

  describe('toMerc', () => {
    it('should return MercSegment', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.toMerc()).toBeInstanceOf(MercSegment);
    });

    it('should return proper MercSegment', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.toMerc()).toMatchObject({
        pointA: {x: 0.5, y: 0.5},
        pointB: {x: 0.5138888888888888, y: 0.48609344915194685},
      });
    });
  });

  describe('toOppositeHemisphere', () => {
    it('should return GeoSegment', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.toOppositeHemisphere()).toBeInstanceOf(GeoSegment);
    });

    it('should move segment to opposite hemisphere', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.toOppositeHemisphere()).toMatchObject({
        pointA: {lat: 0, lng: -180},
        pointB: {lat: 5, lng: -175},
      });
    });
  });

  describe('intersectsWithPoly', () => {
    it('should return array of geo-points', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );
      const poly = new GeoPolygon([
        new GeoPoint(5, 2.5),
        new GeoPoint(2.5, 5),
        new GeoPoint(0, 2.5),
        new GeoPoint(2.5, 0),
      ]);

      expect(segment.intersectsWithPoly(poly)).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(GeoPoint.prototype),
        ]),
      );
    });

    it('should return array of intersections of segment and poly', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );
      const poly = new GeoPolygon([
        new GeoPoint(5, 2.5),
        new GeoPoint(2.5, 5),
        new GeoPoint(0, 2.5),
        new GeoPoint(2.5, 0),
      ]);

      expect(segment.intersectsWithPoly(poly)).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({lat: 3.7514892688799253, lng: 3.7494046660118396}),
          expect.objectContaining({lat: 1.2508935329791535, lng: 1.2494040983955745}),
        ]),
      );
    });
  });

  describe('intersects', () => {
    describe('when segments are intersected', () => {
      it('should return true', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, 5),
          new GeoPoint(5, 0),
        );

        expect(segmentA.intersects(segmentB)).toBe(true);
      });
    });

    describe('when segments are not intersected', () => {
      it('should return false', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, 5),
          new GeoPoint(5, 10),
        );

        expect(segmentA.intersects(segmentB)).toBe(false);
      });
    });
  });

  describe('intersectionPoint', () => {
    it('should return instance of GeoPoint', () => {
      const segmentA = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );
      const segmentB = new GeoSegment(
        new GeoPoint(0, 5),
        new GeoPoint(5, 0),
      );

      expect(segmentA.intersectionPoint(segmentB)).toBeInstanceOf(GeoPoint);
    });

    describe('when segments are intersected', () => {
      it('should return intersection geo-point', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, 5),
          new GeoPoint(5, 0),
        );

        expect(segmentA.intersectionPoint(segmentB)).toMatchObject({
          lat: 2.502383227706767,
          lng: 2.499999999999991,
        });
      });
    });

    describe('when segments are not intersected', () => {
      it('should return undefined', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, 5),
          new GeoPoint(5, 10),
        );

        expect(segmentA.intersectionPoint(segmentB)).toBeUndefined();
      });
    });

    describe('when one of the segments is on the anti-meridian', () => {
      describe('when segments are intersected', () => {
        it('should return intersection geo-point', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(2.5, -175),
            new GeoPoint(-2.5, 175),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(5, 175),
            new GeoPoint(-5, -180),
          );

          expect(segmentA.intersectionPoint(segmentB)).toMatchObject({
            lat: -1.0004573122991876,
            lng: 177.9996187320283,
          });
        });
      });

      describe('when segments are not intersected', () => {
        it('should return undefined', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(2.5, -175),
            new GeoPoint(-2.5, 175),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(5, 175),
            new GeoPoint(-5, 174),
          );

          expect(segmentA.intersectionPoint(segmentB)).toBeUndefined();
        });
      });
    });
  });

  describe('closestToPoint', () => {
    it('should return instance of GeoPoint', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );
      const point = new GeoPoint(0, 5);

      expect(segment.closestToPoint(point)).toBeInstanceOf(GeoPoint);
    });

    it('should return proper closest geo-point', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );
      const point = new GeoPoint(0, 5);

      expect(segment.closestToPoint(point)).toMatchObject({
        lat: 2.4992050727641026,
        lng: 2.4968228759999844,
      });
    });

    describe('when segment is on the anti-meridian', () => {
      describe('when segments are intersected', () => {
        it('should return intersection geo-point', () => {
          const segment = new GeoSegment(
            new GeoPoint(2.5, -175),
            new GeoPoint(-2.5, 175),
          );
          const point = new GeoPoint(0, -179);

          expect(segment.closestToPoint(point)).toMatchObject({
            lat: 0.4000729209305294,
            lng: -179.2001016,
          });
        });
      });
    });
  });

  describe('isEqual', () => {
    describe('when segments are equal', () => {
      it('should return true', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segmentA.isEqual(segmentB)).toBe(true);
      });

      describe('when points added in different order', () => {
        it('should return true', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 5),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(5, 5),
            new GeoPoint(0, 0),
          );

          expect(segmentA.isEqual(segmentB)).toBe(true);
        });
      });
    });

    describe('when segments are not equal', () => {
      it('should return false', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, 1),
          new GeoPoint(5, 5),
        );

        expect(segmentA.isEqual(segmentB)).toBe(false);
      });
    });
  });

  describe('mercDistanceToPoint', () => {
    it('should return closest mercator distance to a point', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );
      const point = new GeoPoint(0, 5);

      expect(segment.mercDistanceToPoint(point)).toBe(0.00982716597010656);
    });
  });

  describe('latByLng', () => {
    it('should return proper lat by lng on the segment', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.latByLng(2.5)).toBe(2.502383227706754);
    });

    describe('when lng is out of the segment', () => {
      it('should return undefined', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.latByLng(15)).toBeUndefined();
      });
    });

    describe('when segment is a parallel', () => {
      it('should return proper lat by lng on the segment', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(0, 5),
        );

        expect(segment.latByLng(2.5)).toBe(0);
      });
    });

    describe('when segment is a meridian', () => {
      it('should return undefined', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 0),
        );

        expect(segment.latByLng(0)).toBeUndefined();
      });
    });

    describe('when lat is out of the segment', () => {
      it('should return undefined', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.latByLng(15)).toBeUndefined();
      });
    });
  });

  describe('lngByLat', () => {
    it('should return proper lng by lat on the segment', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.lngByLat(2.5)).toBe(2.4976175293558622);
    });

    describe('when lat is out of the segment', () => {
      it('should return undefined', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.lngByLat(15)).toBeUndefined();
      });
    });

    describe('when segment is a parallel', () => {
      it('should return undefined', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(0, 5),
        );

        expect(segment.lngByLat(2.5)).toBeUndefined();
      });
    });

    describe('when segment is a meridian', () => {
      it('should return proper lng by lat on the segment', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 0),
        );

        expect(segment.lngByLat(0)).toBe(0);
      });
    });

    describe('when lng is out of the segment', () => {
      it('should return undefined', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(0, 5),
        );

        expect(segment.lngByLat(15)).toBeUndefined();
      });
    });
  });

  describe('containsLat', () => {
    describe('when segment contains lat', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.containsLat(2.5)).toBe(true);
      });
    });
  });
});
