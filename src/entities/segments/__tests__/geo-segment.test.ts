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
    describe('when segment intersects lat', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.containsLat(2.5)).toBe(true);
      });
    });

    describe('when segment does not intersect lat', () => {
      it('should return false', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.containsLat(7.5)).toBe(false);
      });
    });

    describe('when segment is on parallel', () => {
      describe('when segment is on given lat', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );

          expect(segment.containsLat(0)).toBe(true);
        });
      });

      describe('when segment is not on given lat', () => {
        it('should return false', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );

          expect(segment.containsLat(7.5)).toBe(false);
        });
      });
    });
  });

  describe('containsLng', () => {
    describe('when segment intersects lng', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.containsLng(2.5)).toBe(true);
      });
    });

    describe('when segment does not intersect lng', () => {
      it('should return false', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.containsLng(7.5)).toBe(false);
      });
    });

    describe('when segment is on meridian', () => {
      describe('when segment is on given lng', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );

          expect(segment.containsLng(0)).toBe(true);
        });
      });

      describe('when segment is not on given lng', () => {
        it('should return false', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );

          expect(segment.containsLng(7.5)).toBe(false);
        });
      });
    });

    describe('when segment intersects anti-meridian', () => {
      describe('when segment intersects lng', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 177.5),
            new GeoPoint(5, -177.5),
          );

          expect(segment.containsLng(-180)).toBe(true);
        });
      });

      describe('when segment does not intersect lng', () => {
        it('should return false', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 177.5),
            new GeoPoint(5, -177.5),
          );

          expect(segment.containsLng(-175)).toBe(false);
        });
      });
    });
  });

  describe('hasPoint', () => {
    describe('when point is on the segment', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const point = new GeoPoint(2.502383227706767, 2.499999999999991);

        expect(segment.hasPoint(point)).toBe(true);
      });
    });

    describe('when point is barely on the segment', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const point = new GeoPoint(2.502383227706767, 2.500000000000004);

        expect(segment.hasPoint(point)).toBe(true);
      });
    });

    describe('when point is not on the segment', () => {
      it('should return false', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const point = new GeoPoint(2.502383227706767, 5);

        expect(segment.hasPoint(point)).toBe(false);
      });
    });

    describe('when segment intersects anti-meridian', () => {
      describe('when point is on the segment', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, -177.5),
            new GeoPoint(5, 177.5),
          );
          const point = new GeoPoint(2.502383227706767, -180.00000000000004);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return false', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, -177.5),
            new GeoPoint(5, 177.5),
          );
          const point = new GeoPoint(2.502383227706767, 175);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });
    });

    describe('when segment is on parallel', () => {
      describe('when point is on the segment', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );
          const point = new GeoPoint(0, 2.499999999999991);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is barely on the segment', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );
          const point = new GeoPoint(0.000000000000005, 2.500000000000004);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return false', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );
          const point = new GeoPoint(7.502383227706767, 0);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });

      describe('when segment intersects anti-meridian', () => {
        describe('when point is on the segment', () => {
          it('should return true', () => {
            const segment = new GeoSegment(
              new GeoPoint(0, -177.5),
              new GeoPoint(0, 177.5),
            );
            const point = new GeoPoint(0, -180.00000000000004);

            expect(segment.hasPoint(point)).toBe(true);
          });
        });

        describe('when point is not on the segment', () => {
          it('should return false', () => {
            const segment = new GeoSegment(
              new GeoPoint(0, -177.5),
              new GeoPoint(5, 177.5),
            );
            const point = new GeoPoint(0, 175);

            expect(segment.hasPoint(point)).toBe(false);
          });
        });
      });
    });

    describe('when segment is on meridian', () => {
      describe('when point is on the segment', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );
          const point = new GeoPoint(2.499999999999991, 0);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is barely on the segment', () => {
        it('should return true', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );
          const point = new GeoPoint(2.500000000000004, 0.000000000000005);

          expect(segment.hasPoint(point)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return false', () => {
          const segment = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );
          const point = new GeoPoint(0, 7.502383227706767);

          expect(segment.hasPoint(point)).toBe(false);
        });
      });
    });
  });

  describe('containsSegment', () => {
    describe('when contains segment', () => {
      it('should return true', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(5, 177.5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(2.502383227706767, -180),
        );

        expect(segmentA.containsSegment(segmentB)).toBe(true);
      });
    });

    describe('when does not contain segment', () => {
      it('should return false', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(5, 177.5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(2.502383227706767, -179.00000000000004),
        );

        expect(segmentA.containsSegment(segmentB)).toBe(false);
      });
    });
  });

  describe('overlapsSegment', () => {
    describe('when point is on the segment', () => {
      it('should return true', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(2.502383227706767, 2.499999999999991),
          new GeoPoint(5, 5),
        );

        expect(segmentA.overlapsSegment(segmentB)).toBe(true);
      });
    });

    describe('when point is not on the segment', () => {
      it('should return false', () => {
        const segmentA = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );
        const segmentB = new GeoSegment(
          new GeoPoint(2.502383227706767, 5),
          new GeoPoint(5, 5),
        );

        expect(segmentA.overlapsSegment(segmentB)).toBe(false);
      });
    });

    describe('when segments are on meridian', () => {
      describe('when point is on the segment', () => {
        it('should return true', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(0, 2.499999999999991),
            new GeoPoint(0, 7),
          );

          expect(segmentA.overlapsSegment(segmentB)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return false', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(0, 5),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(0, 20),
            new GeoPoint(0, 30),
          );

          expect(segmentA.overlapsSegment(segmentB)).toBe(false);
        });
      });
    });

    describe('when segments are on parallel', () => {
      describe('when point is on the segment', () => {
        it('should return true', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(-15, 0),
            new GeoPoint(4, 0),
          );

          expect(segmentA.overlapsSegment(segmentB)).toBe(true);
        });
      });

      describe('when point is not on the segment', () => {
        it('should return false', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, 0),
            new GeoPoint(5, 0),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(-15, 0),
            new GeoPoint(-10, 0),
          );

          expect(segmentA.overlapsSegment(segmentB)).toBe(false);
        });
      });


      describe('when one of segments intersects anti-meridian', () => {
        describe('when segmentA overlaps segmentB', () => {
          it('should return true', () => {
            const segmentA = new GeoSegment(
              new GeoPoint(-175, 0),
              new GeoPoint(175, 0),
            );
            const segmentB = new GeoSegment(
              new GeoPoint(-179, 0),
              new GeoPoint(-170, 0),
            );

            expect(segmentA.overlapsSegment(segmentB)).toBe(true);
          });
        });

        describe('when segmentA does not overlap segmentB', () => {
          it('should return true', () => {
            const segmentA = new GeoSegment(
              new GeoPoint(-175, 0),
              new GeoPoint(175, 0),
            );
            const segmentB = new GeoSegment(
              new GeoPoint(174, 0),
              new GeoPoint(170, 0),
            );

            expect(segmentA.overlapsSegment(segmentB)).toBe(false);
          });
        });
      });
    });

    describe('when one of segments is on anti-meridian', () => {
      describe('when segmentA overlaps segmentB', () => {
        it('should return true', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, -177.5),
            new GeoPoint(5, 177.5),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(0, -177.5),
            new GeoPoint(2.502383227706767, -180),
          );

          expect(segmentA.overlapsSegment(segmentB)).toBe(true);
        });
      });

      describe('when segmentA does not overlap segmentB', () => {
        it('should return true', () => {
          const segmentA = new GeoSegment(
            new GeoPoint(0, -177.5),
            new GeoPoint(5, 177.5),
          );
          const segmentB = new GeoSegment(
            new GeoPoint(0, -177.5),
            new GeoPoint(2.502383227706767, -170),
          );

          expect(segmentA.overlapsSegment(segmentB)).toBe(false);
        });
      });
    });
  });

  describe('get points', () => {
    const segment = new GeoSegment(
      new GeoPoint(0, -177.5),
      new GeoPoint(5, 177.5),
    );

    it('should return geo-points', () => {
      expect(segment.points).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining(GeoPoint.prototype),
        ]),
      );
    });

    it('should return two points', () => {
      expect(segment.points).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lat: 0,
            lng: -177.5,
          }),
          expect.objectContaining({
            lat: 5,
            lng: 177.5,
          }),
        ]),
      );
    });

    it('should return points of a segment', () => {
      expect(segment.points).toHaveLength(2);
    });
  });

  describe('get isAntiMeridian', () => {
    describe('when segment intersects anti-meridian', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(5, 177.5),
        );

        expect(segment.isAntiMeridian).toBe(true);
      });
    });

    describe('when segment deos not intersect anti-meridian', () => {
      it('should return false', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.isAntiMeridian).toBe(false);
      });
    });
  });

  describe('get isParallel', () => {
    describe('when segment is on parallel', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(0, 177.5),
        );

        expect(segment.isParallel).toBe(true);
      });
    });

    describe('when segment is not on parallel', () => {
      it('should return false', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.isParallel).toBe(false);
      });
    });
  });

  describe('get isMeridian', () => {
    describe('when segment is on meridian', () => {
      it('should return true', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 177.5),
          new GeoPoint(0, 177.5),
        );

        expect(segment.isMeridian).toBe(true);
      });
    });

    describe('when segment is not on meridian', () => {
      it('should return false', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.isMeridian).toBe(false);
      });
    });
  });

  describe('get easternPoint', () => {
    it('should return instance of GeoPoint', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.easternPoint).toBeInstanceOf(GeoPoint);
    });

    describe('when pointA is eastern', () => {
      it('should return proper eastern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.easternPoint).toMatchObject({
          lat: 5,
          lng: 5,
        });
      });
    });

    describe('when pointB is eastern', () => {
      it('should return proper eastern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 5),
          new GeoPoint(0, 0),
        );

        expect(segment.easternPoint).toMatchObject({
          lat: 5,
          lng: 5,
        });
      });
    });

    describe('when segment on meridian', () => {
      it('should return eather point', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 0),
          new GeoPoint(0, 0),
        );

        expect(segment.easternPoint).toMatchObject({
          lng: 0,
        });
      });
    });

    describe('when point is on anti-meridian', () => {
      it('should return proper eastern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(0, 177.5),
        );

        expect(segment.easternPoint).toMatchObject({
          lat: 0,
          lng: -177.5,
        });
      });
    });
  });

  describe('get westernPoint', () => {
    it('should return instance of GeoPoint', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.westernPoint).toBeInstanceOf(GeoPoint);
    });

    describe('when pointA is western', () => {
      it('should return proper western point', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 5),
          new GeoPoint(0, 0),
        );

        expect(segment.westernPoint).toMatchObject({
          lat: 0,
          lng: 0,
        });
      });
    });

    describe('when pointB is western', () => {
      it('should return proper western point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.westernPoint).toMatchObject({
          lat: 0,
          lng: 0,
        });
      });
    });

    describe('when segment on meridian', () => {
      it('should return western point', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 0),
          new GeoPoint(0, 0),
        );

        expect(segment.westernPoint).toMatchObject({
          lng: 0,
        });
      });
    });

    describe('when point is on anti-meridian', () => {
      it('should return proper western point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, -177.5),
          new GeoPoint(0, 177.5),
        );

        expect(segment.westernPoint).toMatchObject({
          lat: 0,
          lng: 177.5,
        });
      });
    });
  });

  describe('get northernPoint', () => {
    it('should return instance of GeoPoint', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.northernPoint).toBeInstanceOf(GeoPoint);
    });

    describe('when pointA is northern', () => {
      it('should return proper northern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 5),
          new GeoPoint(0, 0),
        );

        expect(segment.northernPoint).toMatchObject({
          lat: 5,
          lng: 5,
        });
      });
    });

    describe('when pointB is northern', () => {
      it('should return proper northern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.northernPoint).toMatchObject({
          lat: 5,
          lng: 5,
        });
      });
    });

    describe('when segment on parallel', () => {
      it('should return eather point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(0, 5),
        );

        expect(segment.northernPoint).toMatchObject({
          lat: 0,
        });
      });
    });
  });

  describe('get southernPoint', () => {
    it('should return instance of GeoPoint', () => {
      const segment = new GeoSegment(
        new GeoPoint(0, 0),
        new GeoPoint(5, 5),
      );

      expect(segment.southernPoint).toBeInstanceOf(GeoPoint);
    });

    describe('when pointA is southern', () => {
      it('should return proper southern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(5, 5),
        );

        expect(segment.southernPoint).toMatchObject({
          lat: 0,
          lng: 0,
        });
      });
    });

    describe('when pointB is southern', () => {
      it('should return proper southern point', () => {
        const segment = new GeoSegment(
          new GeoPoint(5, 5),
          new GeoPoint(0, 0),
        );

        expect(segment.southernPoint).toMatchObject({
          lat: 0,
          lng: 0,
        });
      });
    });

    describe('when segment on parallel', () => {
      it('should return eather point', () => {
        const segment = new GeoSegment(
          new GeoPoint(0, 0),
          new GeoPoint(0, 5),
        );

        expect(segment.southernPoint).toMatchObject({
          lat: 0,
        });
      });
    });
  });

  describe('segmentsFromPointsByLat', () => {
    it('should return segments ordered by lat from array of points', () => {
      const points = [
        new GeoPoint(2, 5),
        new GeoPoint(-4, 5),
        new GeoPoint(7, 5),
        new GeoPoint(13, 5),
      ];

      expect(GeoSegment.segmentsFromPointsByLat(points)).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            pointA: {lat: 2, lng: 5},
            pointB: {lat: -4, lng: 5},
          }),
          expect.objectContaining({
            pointA: {lat: 13, lng: 5},
            pointB: {lat: 7, lng: 5},
          }),
        ]),
      );
    });

    describe('when point number is odd', () => {
      it('should throw an error', () => {
        const points = [
          new GeoPoint(2, 5),
          new GeoPoint(-4, 5),
          new GeoPoint(7, 5),
        ];

        expect(() => {
          GeoSegment.segmentsFromPointsByLat(points);
        }).toThrow(new Error('Even points number needed!'));
      });
    });
  });

  describe('segmentsFromPointsByLng', () => {
    it('should return segments ordered by lng from array of points', () => {
      const points = [
        new GeoPoint(0, 2),
        new GeoPoint(0, -4),
        new GeoPoint(0, 7),
        new GeoPoint(0, 13),
      ];

      expect(GeoSegment.segmentsFromPointsByLng(points)).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            pointA: {lat: 0, lng: 2},
            pointB: {lat: 0, lng: -4},
          }),
          expect.objectContaining({
            pointA: {lat: 0, lng: 13},
            pointB: {lat: 0, lng: 7},
          }),
        ]),
      );
    });

    describe('when points are around anti-meridian', () => {
      it('should return segments ordered by lng from array of points', () => {
        const points = [
          new GeoPoint(0, 177),
          new GeoPoint(0, 170),
          new GeoPoint(0, -178),
          new GeoPoint(0, 179),
        ];

        expect(GeoSegment.segmentsFromPointsByLng(points)).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              pointA: {lat: 0, lng: 177},
              pointB: {lat: 0, lng: 170},
            }),
            expect.objectContaining({
              pointA: {lat: 0, lng: -178},
              pointB: {lat: 0, lng: 179},
            }),
          ]),
        );
      });
    });

    describe('when point number is odd', () => {
      it('should throw an error', () => {
        const points = [
          new GeoPoint(0, 2),
          new GeoPoint(0, -4),
          new GeoPoint(0, 7),
        ];

        expect(() => {
          GeoSegment.segmentsFromPointsByLng(points);
        }).toThrow(new Error('Even points number needed!'));
      });
    });
  });
});
