import {TileMercPoint} from '../tile-merc-point';
import {Point} from '../point';
import {GeoSegment} from '../../segments';
import {GeoPolygon} from '../../polygons';
import {GeoPoint} from '../geo-point';
import {MercPoint} from '../merc-point';

describe('constructor', () => {
  it('should create TileMercPoint instance', () => {
    expect(new TileMercPoint(0, 0, 0, 0, 256, 256, 0)).toBeInstanceOf(TileMercPoint);
  });
});

describe('northTile', () => {
  it('should be TileMercPoint instance', () => {
    const {northTile} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(northTile).toBeInstanceOf(TileMercPoint);
  });

  it('should be one tile point nothern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {northTile} = tilePoint;

    expect(northTile.tileY).toBe(0);
  });

  it('should be nothern on mercator', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {northTile} = tilePoint;

    expect(northTile.y).toBe(0);
  });

  it('should not change other props', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {northTile} = tilePoint;
    const {y, tileY, ...propsA} = tilePoint.toPlain();
    const {y: _y, tileY: _tileY, ...propsB} = northTile.toPlain();

    expect(propsA).toStrictEqual(propsB);
  });
});

describe('southTile', () => {
  it('should be TileMercPoint instance', () => {
    const {southTile} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(southTile).toBeInstanceOf(TileMercPoint);
  });

  it('should be one tile point southern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {southTile} = tilePoint;

    expect(southTile.tileY).toBe(2);
  });

  it('should be nothern on southern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {southTile} = tilePoint;

    expect(southTile.y).toBe(0.5);
  });

  it('should not change other props', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {southTile} = tilePoint;
    const {y, tileY, ...propsA} = tilePoint.toPlain();
    const {y: _y, tileY: _tileY, ...propsB} = southTile.toPlain();

    expect(propsA).toStrictEqual(propsB);
  });
});

describe('eastTile', () => {
  it('should be TileMercPoint instance', () => {
    const {eastTile} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(eastTile).toBeInstanceOf(TileMercPoint);
  });

  it('should be one tile point eastern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {eastTile} = tilePoint;

    expect(eastTile.tileX).toBe(2);
  });

  it('should be nothern on eastern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {eastTile} = tilePoint;

    expect(eastTile.x).toBe(0.5);
  });

  it('should not change other props', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {eastTile} = tilePoint;
    const {x, tileX, ...propsA} = tilePoint.toPlain();
    const {x: _x, tileX: _tileX, ...propsB} = eastTile.toPlain();

    expect(propsA).toStrictEqual(propsB);
  });
});

describe('westTile', () => {
  it('should be TileMercPoint instance', () => {
    const {westTile} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(westTile).toBeInstanceOf(TileMercPoint);
  });

  it('should be one tile point eastern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {westTile} = tilePoint;

    expect(westTile.tileX).toBe(0);
  });

  it('should be nothern on eastern', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {westTile} = tilePoint;

    expect(westTile.x).toBe(0);
  });

  it('should not change other props', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const {westTile} = tilePoint;
    const {x, tileX, ...propsA} = tilePoint.toPlain();
    const {x: _x, tileX: _tileX, ...propsB} = westTile.toPlain();

    expect(propsA).toStrictEqual(propsB);
  });
});

describe('northBound', () => {
  it('should return north bound latitude', () => {
    const {northBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(Math.floor(northBound)).toBe(66);
  });
});

describe('southBound', () => {
  it('should return south bound latitude', () => {
    const {southBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(southBound).toBe(0);
  });
});

describe('eastBound', () => {
  it('should return east bound longitude', () => {
    const {eastBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(eastBound).toBe(0);
  });
});

describe('westBound', () => {
  it('should return west bound longitude', () => {
    const {westBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(westBound).toBe(-90);
  });
});

describe('north', () => {
  it('should be instance of GeoSegment', () => {
    const {north} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(north).toBeInstanceOf(GeoSegment);
  });

  describe('segment points', () => {
    it('should have latitudes equal to northBound', () => {
      const {north, northBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(north.pointA.lat).toBe(northBound);
      expect(north.pointB.lat).toBe(northBound);
    });

    it('should have eastern point longitude equal to eastBound', () => {
      const {north, eastBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(north.easternPoint.lng).toBe(eastBound);
    });

    it('should have western point longitude equal to westBound', () => {
      const {north, westBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(north.westernPoint.lng).toBe(westBound);
    });
  });
});

describe('south', () => {
  it('should be instance of GeoSegment', () => {
    const {south} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(south).toBeInstanceOf(GeoSegment);
  });

  describe('segment points', () => {
    it('should have latitudes equal to southBound', () => {
      const {south, southBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(south.pointA.lat).toBe(southBound);
      expect(south.pointB.lat).toBe(southBound);
    });

    it('should have eastern point longitude equal to eastBound', () => {
      const {south, eastBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(south.easternPoint.lng).toBe(eastBound);
    });

    it('should have western point longitude equal to westBound', () => {
      const {south, westBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(south.westernPoint.lng).toBe(westBound);
    });
  });
});

describe('east', () => {
  it('should be instance of GeoSegment', () => {
    const {east} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(east).toBeInstanceOf(GeoSegment);
  });

  describe('segment points', () => {
    it('should have longitudes equal to eastBound', () => {
      const {east, eastBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(east.pointA.lng).toBe(eastBound);
      expect(east.pointB.lng).toBe(eastBound);
    });

    it('should have northern point latitude equal to northBound', () => {
      const {east, northBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(east.northernPoint.lat).toBe(northBound);
    });

    it('should have southern point latitude equal to southBound', () => {
      const {east, southBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(east.southernPoint.lat).toBe(southBound);
    });
  });
});

describe('west', () => {
  it('should be instance of GeoSegment', () => {
    const {west} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

    expect(west).toBeInstanceOf(GeoSegment);
  });

  describe('segment points', () => {
    it('should have longitudes equal to westBound', () => {
      const {west, westBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(west.pointA.lng).toBe(westBound);
      expect(west.pointB.lng).toBe(westBound);
    });

    it('should have northern point latitude equal to northBound', () => {
      const {west, northBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(west.northernPoint.lat).toBe(northBound);
    });

    it('should have southern point latitude equal to southBound', () => {
      const {west, southBound} = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);

      expect(west.southernPoint.lat).toBe(southBound);
    });
  });
});

describe('gridPatternStartPoint', () => {
  it.todo('should return pattern start point');
});

describe('startPointDiff', () => {
  it('should return instance of Point', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const startTilePoint = TileMercPoint.fromTile(1.1, 1.1, 256, 256, 2);

    expect(tilePoint.startPointDiff(startTilePoint)).toBeInstanceOf(Point);
  });

  it('should return diff point', () => {
    const tilePoint = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2);
    const startTilePoint = TileMercPoint.fromTile(0.9, 0.9, 256, 256, 2);

    const point = tilePoint.startPointDiff(startTilePoint)
      .toPlain();

    expect(+point.x.toFixed(15)).toBe(-0.1);
    expect(+point.y.toFixed(15)).toBe(-0.1);
  });

  it('should return valid diff point for points through anti-meridian', () => {
    const tilePoint = TileMercPoint.fromTile(0, 1, 256, 256, 2);
    const startTilePoint = TileMercPoint.fromTile(3.9, 0.9, 256, 256, 2);

    const point = tilePoint.startPointDiff(startTilePoint)
      .toPlain();

    expect(+point.x.toFixed(15)).toBe(-0.1);
    expect(+point.y.toFixed(15)).toBe(-0.1);
  });
});

describe('toPoly', () => {
  it('should return instance of GeoPolygon', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    expect(tilePoint.toPoly()).toBeInstanceOf(GeoPolygon);
  });

  describe('polygon point', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const poly = tilePoint.toPoly();

    it('should has north-west point equal to tile point', () => {
      const northWestPoint = poly.points.reduce((northWest, point) => {
        if (!northWest) return point;

        return !northWest.isSouthernTo(point) && !northWest.isEasternTo(point) ?
          northWest :
          point;
      });

      const standard = GeoPoint.fromMerc(tilePoint).toPlain();

      expect(northWestPoint.toPlain()).toStrictEqual(standard);
    });

    it('should has north-east point equal to tile east tile point', () => {
      const northEastPoint = poly.points.reduce((northEast, point) => {
        if (!northEast) return point;

        return !northEast.isSouthernTo(point) && !northEast.isWesternTo(point) ?
          northEast :
          point;
      });

      const standard = GeoPoint.fromMerc(tilePoint.eastTile).toPlain();

      expect(northEastPoint.toPlain()).toStrictEqual(standard);
    });

    it('should has south-east point equal to tile south-east tile point', () => {
      const southEastPoint = poly.points.reduce((southEast, point) => {
        if (!southEast) return point;

        return !southEast.isNorthernTo(point) && !southEast.isWesternTo(point) ?
          southEast :
          point;
      });

      const standard = GeoPoint.fromMerc(tilePoint.eastTile.southTile).toPlain();

      expect(southEastPoint.toPlain()).toStrictEqual(standard);
    });

    it('should has south-west point equal to tile south tile point', () => {
      const southWestPoint = poly.points.reduce((southWest, point) => {
        if (!southWest) return point;

        return !southWest.isNorthernTo(point) && !southWest.isEasternTo(point) ?
          southWest :
          point;
      });

      const standard = GeoPoint.fromMerc(tilePoint.southTile).toPlain();

      expect(southWestPoint.toPlain()).toStrictEqual(standard);
    });
  });
});

describe('containsPoint', () => {
  it('should return true if point contained by tile', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const isContained = tilePoint.containsPoint({lat: 50, lng: -50});

    expect(isContained).toBe(true);
  });

  it('should return false if point northern of tile', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const isContained = tilePoint.containsPoint({lat: 80, lng: -50});

    expect(isContained).toBe(false);
  });

  it('should return false if point southern of tile', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const isContained = tilePoint.containsPoint({lat: -20, lng: -50});

    expect(isContained).toBe(false);
  });

  it('should return false if point eastern of tile', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const isContained = tilePoint.containsPoint({lat: 50, lng: 20});

    expect(isContained).toBe(false);
  });

  it('should return false if point western of tile', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const isContained = tilePoint.containsPoint({lat: 50, lng: -100});

    expect(isContained).toBe(false);
  });
});

describe('projectGeoPoints', () => {
  it('should return projected point relative to the tile pixels', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const [point] = tilePoint.projectGeoPoints([
      new GeoPoint(0, -45),
    ]);

    expect(point.toPlain()).toStrictEqual({x: 128, y: 256});
  });
});

describe('fromTile', () => {
  it('should return instance of TileMercPoint', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    expect(tilePoint).toBeInstanceOf(TileMercPoint);
  });

  it('should return valid tile point', () => {
    const tilePoint = TileMercPoint.fromTile(1, 1, 256, 256, 2);

    const standard = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2).toPlain();

    expect(tilePoint.toPlain()).toStrictEqual(standard);
  });
});

describe('fromPlain', () => {
  const tilePoint = TileMercPoint.fromPlain({
    x: 0.25,
    y: 0.25,
    tileX: 1,
    tileY: 1,
    tileWidth: 256,
    tileHeight: 256,
    zoom: 2,
  });

  it('should return instance of TileMercPoint', () => {
    expect(tilePoint).toBeInstanceOf(TileMercPoint);
  });

  it('should return valid tile point', () => {
    const standard = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2).toPlain();

    expect(tilePoint.toPlain()).toStrictEqual(standard);
  });
});

describe('fromMerc', () => {
  const tilePoint = TileMercPoint.fromMerc(
    new MercPoint(0.25, 0.25),
    256,
    256,
    2,
  );

  it('should return instance of TileMercPoint', () => {
    expect(tilePoint).toBeInstanceOf(TileMercPoint);
  });

  it('should return valid tile point', () => {
    const standard = new TileMercPoint(0.25, 0.25, 1, 1, 256, 256, 2).toPlain();

    expect(tilePoint.toPlain()).toStrictEqual(standard);
  });
});
