import {correctForGeo, correctForGrid} from '../corrector';
import {GridParams} from '../../../../grid-params';
import {GeoPoint} from '../../../geo-point';

describe('correctForGrid', () => {
  describe('when correction is none', () => {
    const gridParams = GridParams.fromConfig({
      correction: 'none',
      cellSize: 10000,
      type: 'rect',
    });

    it('should return same point', () => {
      const result = correctForGrid(new GeoPoint(50, 60), gridParams);

      expect(result.toPlain()).toStrictEqual({lat: 50, lng: 60});
    });
  });

  describe('when correction is mercator', () => {
    const gridParams = GridParams.fromConfig({
      correction: 'merc',
      cellSize: 10000,
      type: 'rect',
    });

    it('should return semisphere equivalent point', () => {
      const result = correctForGrid(new GeoPoint(50, 60), gridParams);

      expect(result.toPlain()).toStrictEqual({
        lat: 28.95394056818067,
        lng: 29.999999999999993,
      });
    });
  });
});

describe('correctForGeo', () => {
  describe('when correction is none', () => {
    const gridParams = GridParams.fromConfig({
      correction: 'none',
      cellSize: 10000,
      type: 'rect',
    });

    it('should return same point', () => {
      const result = correctForGeo(new GeoPoint(50, 60), gridParams);

      expect(result.toPlain()).toStrictEqual({lat: 50, lng: 60});
    });
  });

  describe('when correction is mercator', () => {
    const gridParams = GridParams.fromConfig({
      correction: 'merc',
      cellSize: 10000,
      type: 'rect',
    });

    it('should return sphere equivalent point', () => {
      const result = correctForGeo(new GeoPoint(50, 60), gridParams);

      expect(result.toPlain()).toStrictEqual({
        lat: 70.193377,
        lng: 120,
      });
    });
  });
});
