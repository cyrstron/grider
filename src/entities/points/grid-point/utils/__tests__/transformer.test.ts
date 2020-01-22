import {
  rotateToGrid,
  rotateToGeo,
  toGridScale,
  toGeoScale,
  toGrid,
  toGeo,
} from '../transformer';
import {GridParams} from '../../../../grid-params';
import {GeoPoint} from '../../../geo-point';
import {GridPoint} from '../../grid-point';

describe('rotateToGrid', () => {
  describe('when grid config type is rectangular', () => {
    const point = new GeoPoint(50, 60);

    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
      });

      it('should rotate to i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(iValue).toBe(50);
      });

      it('should rotate to j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(jValue).toBe(60);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      it('should rotate to i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(iValue).toBe(60);
      });

      it('should rotate to j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(jValue).toBe(50.00000000000001);
      });
    });
  });

  describe('when grid config type is hexagonal', () => {
    const point = new GeoPoint(50, 60);

    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
      });

      it('should rotate to i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(iValue).toBe(50);
      });

      it('should rotate to j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(jValue).toBe(26.96152422706633);
      });

      it('should rotate to k axis', () => {
        const axisConfig = gridParams.axes[2];

        const kValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(kValue).toBe(-76.96152422706632);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      it('should rotate to i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(iValue).toBe(60);
      });

      it('should rotate to j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(jValue).toBe(13.301270189221952);
      });

      it('should rotate to k axis', () => {
        const axisConfig = gridParams.axes[2];

        const kValue = rotateToGrid(point, axisConfig, gridParams.isHorizontal);

        expect(kValue).toBe(-73.30127018922195);
      });
    });
  });
});

describe('rotateToGeo', () => {
  describe('when grid config type is rectangular', () => {
    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should rotate to latitude axis', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lat = rotateToGeo(point, axisConfig);

        expect(lat).toBe(10);
      });

      it('should rotate to longitude axis', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lng = rotateToGeo(point, axisConfig);

        expect(lng).toBe(20);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should rotate to longitude axis', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lng = rotateToGeo(point, axisConfig);

        expect(lng).toBe(10);
      });

      it('should rotate to latitude axis', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lat = rotateToGeo(point, axisConfig);

        expect(lat).toBe(20);
      });
    });
  });

  describe('when grid config type is hexagonal', () => {
    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should rotate to latitude axis', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lat = rotateToGeo(point, axisConfig);

        expect(lat).toBe(10);
      });

      it('should rotate to longitude axis', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lng = rotateToGeo(point, axisConfig);

        expect(lng).toBe(28.867513459481287);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should rotate to longitude axis', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lng = rotateToGeo(point, axisConfig);

        expect(lng).toBe(10);
      });

      it('should rotate to latitude axis', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lat = rotateToGeo(point, axisConfig);

        expect(lat).toBe(28.867513459481287);
      });
    });
  });
});

describe('toGridScale', () => {
  it('should rescale axis value to grid scale', () => {
    const gridParams = GridParams.fromConfig({
      type: 'rect',
      cellSize: 10000,
      correction: 'none',
    });

    const value = toGridScale(10, gridParams);

    expect(value).toBe(111.11111111111111);
  });
});

describe('toGeoScale', () => {
  it('should rescale axis value to geo scale', () => {
    const gridParams = GridParams.fromConfig({
      type: 'rect',
      cellSize: 10000,
      correction: 'none',
    });

    const value = toGeoScale(10, gridParams);

    expect(value).toBe(0.9);
  });
});

describe('toGrid', () => {
  describe('when grid config type is rectangular', () => {
    const point = new GeoPoint(50, 60);

    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
      });

      it('should compute i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = toGrid(point, axisConfig, gridParams);

        expect(iValue).toBe(555.5555555555555);
      });

      it('should compute j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = toGrid(point, axisConfig, gridParams);

        expect(jValue).toBe(666.6666666666666);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      it('should compute i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = toGrid(point, axisConfig, gridParams);

        expect(iValue).toBe(666.6666666666666);
      });

      it('should compute j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = toGrid(point, axisConfig, gridParams);

        expect(jValue).toBe(555.5555555555557);
      });
    });
  });

  describe('when grid config type is hexagonal', () => {
    const point = new GeoPoint(50, 60);

    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
      });

      it('should compute i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = toGrid(point, axisConfig, gridParams);

        expect(iValue).toBe(641.5002990995843);
      });

      it('should compute j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = toGrid(point, axisConfig, gridParams);

        expect(jValue).toBe(345.9165171168748);
      });

      it('should compute k axis', () => {
        const axisConfig = gridParams.axes[2];

        const kValue = toGrid(point, axisConfig, gridParams);

        expect(kValue).toBe(-987.416816216459);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      it('should compute i axis', () => {
        const axisConfig = gridParams.axes[0];

        const iValue = toGrid(point, axisConfig, gridParams);

        expect(iValue).toBe(666.6666666666666);
      });

      it('should compute j axis', () => {
        const axisConfig = gridParams.axes[1];

        const jValue = toGrid(point, axisConfig, gridParams);

        expect(jValue).toBe(147.79189099135502);
      });

      it('should compute k axis', () => {
        const axisConfig = gridParams.axes[2];

        const kValue = toGrid(point, axisConfig, gridParams);

        expect(kValue).toBe(-814.4585576580217);
      });
    });
  });
});

describe('toGeo', () => {
  describe('when grid config type is rectangular', () => {
    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should compute latitude', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lat = toGeo(point, axisConfig);

        expect(lat).toBe(0.9);
      });

      it('should compute longitude', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lng = toGeo(point, axisConfig);

        expect(lng).toBe(1.8);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'rect',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should compute longitude', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lng = toGeo(point, axisConfig);

        expect(lng).toBe(0.9);
      });

      it('should compute latitude', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lat = toGeo(point, axisConfig);

        expect(lat).toBe(1.8);
      });
    });
  });

  describe('when grid config type is hexagonal', () => {
    describe('when grid is vertical', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should compute latitude', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lat = toGeo(point, axisConfig);

        expect(lat).toBe(0.7794228634059946);
      });

      it('should compute longitude', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lng = toGeo(point, axisConfig);

        expect(lng).toBe(2.2499999999999996);
      });
    });

    describe('when grid is horizontal', () => {
      const gridParams = GridParams.fromConfig({
        type: 'hex',
        cellSize: 10000,
        correction: 'none',
        isHorizontal: true,
      });

      const point = new GridPoint(gridParams, 10, 20);

      it('should compute longitude', () => {
        const axisConfig = gridParams.geoAxes[0];

        const lng = toGeo(point, axisConfig);

        expect(lng).toBe(0.9);
      });

      it('should compute latitude', () => {
        const axisConfig = gridParams.geoAxes[1];

        const lat = toGeo(point, axisConfig);

        expect(lat).toBe(2.5980762113533156);
      });
    });
  });
});
