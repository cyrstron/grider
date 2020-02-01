import {PeakPoint} from './peak-point';
import {GridParams} from '../../grid-params';
import {GeoPoint} from '../geo-point';
import {GeoPolygon} from '../../polygons';

function createParams(config: Partial<grider.GridConfig> = {}): GridParams {
  return GridParams.fromConfig({
    type: 'rect',
    cellSize: 10000,
    correction: 'none',
    ...config,
  });
}

describe('constructor', () => {
  it('should return PeakPoint instance', () => {
    const gridParams = createParams();
    const point = new PeakPoint(gridParams, 1.5, 2.5);

    expect(point).toBeInstanceOf(PeakPoint);
  });
});

describe('get nearestPeaks', () => {
  it('should return array of peak points', () => {
    const params = createParams();
    const point = new PeakPoint(params, 0.5, 1.5);

    expect(point.nearestPeaks).toStrictEqual(
      expect.arrayContaining([
        expect.any(PeakPoint),
      ]),
    );
  });

  describe('when grid is rectagonal', () => {
    const params = createParams({cellSize: 1000});

    describe('when point is not near the anti-meridian', () => {
      const point = new PeakPoint(params, 0.5, 1.5);

      it('should return 4 points', () => {
        expect(point.nearestPeaks).toHaveLength(4);
      });

      it('should return all nearest peaks values', () => {
        const formattedPeaks = point.nearestPeaks.map((peak) => peak.toFormatted());

        expect(formattedPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: 1.5,
              j: 0.5,
            }),
            expect.objectContaining({
              i: 1.5,
              j: 2.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: 2.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: 0.5,
            }),
          ]),
        );
      });
    });

    describe('when point is near the anti-meridian', () => {
      const point = new PeakPoint(params, 0.5, 19999.5);

      it('should return valid nearest peaks values', () => {
        const formattedPeaks = point.nearestPeaks.map((peak) => peak.toFormatted());

        expect(formattedPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: 1.5,
              j: 19998.5,
            }),
            expect.objectContaining({
              i: 1.5,
              j: -19999.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: -19999.5,
            }),
            expect.objectContaining({
              i: -0.5,
              j: 19998.5,
            }),
          ]),
        );
      });
    });
  });

  describe('when grid is hexagonal', () => {
    const params = createParams({cellSize: 1000, type: 'hex'});

    describe('when point is neither on or near the anti-meridian', () => {
      const point = new PeakPoint(params, 1 - 2/3, 2 + 1/3, -3 + 1/3);

      it('should return 3 points', () => {
        expect(point.nearestPeaks).toHaveLength(3);
      });

      it('should return all nearest peaks values', () => {
        const formattedPeaks = point.nearestPeaks.map((peak) => peak.toFormatted());

        expect(formattedPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: -0.333,
              j: 2.667,
              k: -2.333,
            }),
            expect.objectContaining({
              i: 0.667,
              j: 1.667,
              k: -2.333,
            }),
            expect.objectContaining({
              i: 0.667,
              j: 2.667,
              k: -3.333,
            }),
          ]),
        );
      });
    });

    describe('when point is on the anti-meridian', () => {
      const params = createParams({cellSize: 1000, type: 'hex'});
      const point = new PeakPoint(params, 0 + 2/3, -20000 - 1/3, 20000 + 1/3);

      it('should return valid nearest peaks values', () => {
        const formattedPeaks = point.nearestPeaks.map((peak) => peak.toFormatted());

        expect(formattedPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: 1.333,
              j: -20000.667,
              k: 19999.333,
            }),
            expect.objectContaining({
              i: 0.333,
              j: -19999.667,
              k: 19999.333,
            }),
            expect.objectContaining({
              i: 0.333,
              j: 19999.333,
              k: -19999.667,
            }),
          ]),
        );
      });
    });

    describe('when point is near the anti-meridian', () => {
      const point = new PeakPoint(params, 1 - 2/3, 20000 + 1/3, -20000 + 1/3);

      it('should return valid nearest peaks values', () => {
        const formattedPeaks = point.nearestPeaks.map((peak) => peak.toFormatted());

        expect(formattedPeaks).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              i: -0.333,
              j: -19999.333,
              k: 19999.667,
            }),
            expect.objectContaining({
              i: 0.667,
              j: 19999.667,
              k: -20000.333,
            }),
            expect.objectContaining({
              i: 0.667,
              j: -19999.333,
              k: 19998.667,
            }),
          ]),
        );
      });
    });
  });
});

describe('get nearestPeaksGeo', () => {
  it('should return array of geo points', () => {
    const params = createParams();
    const point = new PeakPoint(params, 0.5, 1.5);

    expect(point.nearestPeaksGeo).toStrictEqual(
      expect.arrayContaining([
        expect.any(GeoPoint),
      ]),
    );
  });

  describe('when grid is rectagonal', () => {
    const params = createParams();
    const point = new PeakPoint(params, 0.5, 1.5);

    it('should return 4 points', () => {
      expect(point.nearestPeaks).toHaveLength(4);
    });

    it('should return valid geo points', () => {
      expect(point.nearestPeaksGeo).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lat: 0.135,
            lng: 0.045,
          }),
          expect.objectContaining({
            lat: 0.135,
            lng: 0.225,
          }),
          expect.objectContaining({
            lat: -0.045,
            lng: 0.225,
          }),
          expect.objectContaining({
            lat: -0.045,
            lng: 0.045,
          }),
        ]),
      );
    });
  });

  describe('when grid is hexagonal', () => {
    const params = createParams({type: 'hex'});
    const point = new PeakPoint(params, 1 - 2/3, 2 + 1/3, -3 + 1/3);

    it('should return 3 points', () => {
      expect(point.nearestPeaks).toHaveLength(3);
    });

    it('should return valid geo points', () => {
      expect(point.nearestPeaksGeo).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lat: -0.0259808,
            lng: 0.225,
          }),
          expect.objectContaining({
            lat: 0.0519615,
            lng: 0.18,
          }),
          expect.objectContaining({
            lat: 0.0519615,
            lng: 0.27,
          }),
        ]),
      );
    });
  });
});

describe('toFormatted', () => {
  it('should return instance of peak point', () => {
    const gridParams = createParams();
    const point = new PeakPoint(gridParams, 1.5, 2.5).toFormatted();

    expect(point).toBeInstanceOf(PeakPoint);
  });

  it('should remove redundant decimals', () => {
    const gridParams = createParams();
    const pointA = new PeakPoint(gridParams, 1.5, 2.5).toFormatted();
    const pointB = new PeakPoint(gridParams, 1.5000000000001, 2.5).toFormatted();

    expect(pointA.isEqual(pointB)).toBe(true);
  });
});

describe('nearestNotSeparatedByPoly', () => {
  it('should return peak points array', () => {
    const gridParams = createParams();
    const point = new PeakPoint(gridParams, 0.5, 0.5);
    const poly = GeoPolygon.fromPlain([
      {lat: 45, lng: -90},
      {lat: 45, lng: 90},
      {lat: -45, lng: 90},
      {lat: -45, lng: -90},
    ]);

    const peaks = point.nearestNotSeparatedByPoly(poly);

    expect(peaks).toStrictEqual(
      expect.arrayContaining([
        expect.any(PeakPoint),
      ]),
    );
  });

  describe('when all peaks are not separated by poly', () => {
    const gridParams = createParams();
    const point = new PeakPoint(gridParams, 0.5, 0.5);

    describe('when all peaks inside the poly', () => {
      it('should return all nearest peaks', () => {
        const poly = GeoPolygon.fromPlain([
          {lat: 45, lng: -90},
          {lat: 45, lng: 90},
          {lat: -45, lng: 90},
          {lat: -45, lng: -90},
        ]);

        const peaks = point.nearestNotSeparatedByPoly(poly);

        expect(peaks).toHaveLength(4);
      });
    });

    describe('when all peaks outside the poly', () => {
      it('should return all nearest peaks', () => {
        const poly = GeoPolygon.fromPlain([
          {lat: 45, lng: -90},
          {lat: 45, lng: -180},
          {lat: -45, lng: -180},
          {lat: -45, lng: -90},
        ]);

        const peaks = point.nearestNotSeparatedByPoly(poly);

        expect(peaks).toHaveLength(4);
      });
    });
  });

  describe('when all peaks are separated by poly', () => {
    it('should return empty array', () => {
      const gridParams = createParams();
      const point = new PeakPoint(gridParams, 0.5, 0.5);
      const poly = GeoPolygon.fromPlain([
        {lat: 0.02, lng: 0.02},
        {lat: 0.06, lng: 0.02},
        {lat: 0.06, lng: 0.06},
        {lat: 0.02, lng: 0.06},
      ]);

      const peaks = point.nearestNotSeparatedByPoly(poly);

      expect(peaks).toHaveLength(0);
    });
  });

  describe('when some peaks are separated by poly', () => {
    it.todo('should return array with not separated ones', () => {
      const gridParams = createParams();
      const point = new PeakPoint(gridParams, 0.5, 0.5);
      const poly = GeoPolygon.fromPlain([
        {lat: 0.02, lng: 0.02},
        {lat: 0.06, lng: 0.02},
        {lat: 0.06, lng: 0.06},
        {lat: 0.02, lng: 0.06},
      ]);
    });
  });
});
