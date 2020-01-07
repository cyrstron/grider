import {TileMercPoint} from '../tile-merc-point';
import {Point} from '../point';
import {GeoSegment} from '../../segments';

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

    console.log(tilePoint.startPointDiff(startTilePoint));

    expect(tilePoint.startPointDiff(startTilePoint)).toBeInstanceOf(Point);
  });
});
