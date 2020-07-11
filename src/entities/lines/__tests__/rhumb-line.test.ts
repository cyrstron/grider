import {RhumbLine} from '../rhumb-line';
import {GeoPoint} from '../../points';

describe('rhumb line', () => {
  describe('constructor', () => {
    it('should return instance of RhumbLine', () => {
      const rhumbLine = new RhumbLine(1, 2, 0.05, false);

      expect(rhumbLine).toBeInstanceOf(RhumbLine);
    });
  });

  describe('lngByLat', () => {
    it('should return proper lng for given lat', () => {
      const rhumb = new RhumbLine(0.04, 0.03, -0.02, false);
      const lng = rhumb.lngByLat(40);

      expect(lng).toBe(-102.21637259009184);
    });

    describe('when rhumb line is parallel', () => {
      it('should return undefined', () => {
        const rhumb = new RhumbLine(0, 0.03, -0.02, false);
        const lng = rhumb.lngByLat(40);

        expect(lng).toBeUndefined();
      });
    });

    describe('when rhumb line is meridian', () => {
      it('should return proper lng for given lat', () => {
        const rhumb = new RhumbLine(0.04, 0, -0.02, false);
        const lng = rhumb.lngByLat(40);

        expect(lng).toBe(0);
      });
    });

    describe('when rhumb line goes through anti-meridian', () => {
      it('should return proper lng for given lat', () => {
        const rhumb = new RhumbLine(0.04, -0.05, 0, true);
        const lng = rhumb.lngByLat(40);

        expect(lng).toBe(170.36062098348643);
      });
    });
  });


  describe('latByLng', () => {
    it('should return proper lat for given lng', () => {
      const rhumb = new RhumbLine(0.04, 0.03, -0.02, false);
      const lat = rhumb.latByLng(40);

      expect(lat).toBe(88.04802340763335);
    });

    describe('when rhumb line is parallel', () => {
      it('should return proper lat for given lng', () => {
        const rhumb = new RhumbLine(0, 0.03, -0.02, false);
        const lat = rhumb.latByLng(40);

        expect(lat).toBe(-51.32603504991972);
      });
    });

    describe('when rhumb line is meridian', () => {
      it('should return undefined', () => {
        const rhumb = new RhumbLine(0.04, 0, -0.02, false);
        const lat = rhumb.latByLng(40);

        expect(lat).toBeUndefined();
      });
    });

    describe('when rhumb line goes through anti-meridian', () => {
      it('should return proper lat for given lng', () => {
        const rhumb = new RhumbLine(0.04, -0.05, 0, true);
        const lng = rhumb.latByLng(40);

        expect(lng).toBe(81.360113717588);
      });
    });
  });

  describe('static fromTwoGeoPoints', () => {
    it('should return instance of RhumbLine', () => {
      const rhumb = RhumbLine.fromTwoGeoPoints(
        new GeoPoint(40, -50),
        new GeoPoint(50, -40),
      );

      expect(rhumb).toBeInstanceOf(RhumbLine);
    });

    it('should return proper rhumb line', () => {
      const rhumb = RhumbLine.fromTwoGeoPoints(
        new GeoPoint(40, -50),
        new GeoPoint(50, -40),
      );

      expect(rhumb).toMatchObject({
        a: 0.039434383119862415,
        b: 0.02777777777777779,
        c: -0.024756281619424808,
        isAntiMeridian: false,
      });
    });

    describe('when points are closer through anti-meridian', () => {
      it('should return proper rhumb line', () => {
        const rhumb = RhumbLine.fromTwoGeoPoints(
          new GeoPoint(40, -170),
          new GeoPoint(50, 170),
        );
        expect(rhumb).toMatchObject({
          a: 0.039434383119862415,
          b: -0.05555555555555558,
          c: 0.00021958433902158347,
          isAntiMeridian: true,
        });
      });
    });
  });
});
