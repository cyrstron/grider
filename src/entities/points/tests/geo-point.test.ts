import {GeoPoint} from '../geo-point';
import {MercPoint} from '../merc-point';


describe('instance', () => {
  describe('instance creation', () => {
    it('should create Point instance', () => {
      expect(new GeoPoint(0, 0)).toBeInstanceOf(GeoPoint);
    });
  });
});


describe('isEqual', () => {
  it('should return true for equal point', () => {
    const pointA = new GeoPoint(50, 50);
    const pointB = new GeoPoint(50, 50);

    expect(pointA.isEqual(pointB)).toBe(true);
  });

  it('should return true for almost equal point', () => {
    const pointA = new GeoPoint(50.000000000000001, 50);
    const pointB = new GeoPoint(50, 50);

    expect(pointA.isEqual(pointB)).toBe(true);
  });

  it('should return false for unequal point', () => {
    const pointA = new GeoPoint(50, 50);
    const pointB = new GeoPoint(40, 50);

    expect(pointA.isEqual(pointB)).toBe(false);
  });
});

describe('isCloserThroughAntiMeridian', () => {
  it('should return false if point closer directly', () => {
    const pointA = new GeoPoint(50, 50);
    const pointB = new GeoPoint(50, 60);

    expect(pointA.isCloserThroughAntiMeridian(pointB)).toBe(false);
  });

  it('should return true if point closer through antimeridian', () => {
    const pointA = new GeoPoint(50, 170);
    const pointB = new GeoPoint(50, -170);

    expect(pointA.isCloserThroughAntiMeridian(pointB)).toBe(true);
  });
});

describe('toOppositeHemisphere', () => {
  it('should return point from opposite hemisphere', () => {
    const point = new GeoPoint(50, 50).toOppositeHemisphere();

    expect(point.lng).toBe(-130);
  });
});

describe('calcMercDistance', () => {
  it('should return mercator distance between MercPoints', () => {
    const pointA = new GeoPoint(10, 10);
    const pointB = new GeoPoint(20, 20);

    expect(pointA.calcMercDistance(pointB)).toBe(0.04001270885895247);
  });

  it('should return minimal distance between MercPoints', () => {
    const pointA = new GeoPoint(10, 170);
    const pointB = new GeoPoint(10, -170);

    const distance = pointA.calcMercDistance(pointB);

    expect(distance).toBe(0.05555555555555558);
  });
});

describe('toMerc', () => {
  it('should return mercator point', () => {
    const point = new GeoPoint(0, 0).toMerc();

    expect(point).toBeInstanceOf(MercPoint);
  });

  it('should return valid mercator point', () => {
    const point = new GeoPoint(66, 90).toMerc().toPlain();

    expect(point).toStrictEqual({x: 0.75, y: 0.2535410659142879});
  });
});

describe('toSemiSphere', () => {
  it('should return instance of GeoPoint', () => {
    const point = new GeoPoint(0, 0).toSemiSphere();

    expect(point).toBeInstanceOf(GeoPoint);
  });

  it('should return point in semisphere coordinates', () => {
    const point = new GeoPoint(66, 90).toSemiSphere().toPlain();

    expect(point).toStrictEqual({lng: 90, lat: 44.36260813542818});
  });
});

describe('fromSemiSphere', () => {
  it('should return instance of GeoPoint', () => {
    const point = new GeoPoint(0, 0).fromSemiSphere();

    expect(point).toBeInstanceOf(GeoPoint);
  });

  it('should return point in sperical coordinates', () => {
    const point = new GeoPoint(44.36260813542816, 90).fromSemiSphere().toPlain();

    expect(point).toStrictEqual({lng: 90, lat: 66});
  });
});

describe('toFormatted', () => {
  it('should remove unnecessary decimal digits', () => {
    const point = new GeoPoint(
      45.0000000000000001,
      90,
    ).toFormatted();

    expect(point.lat).toBe(45);
  });
});

describe('isEasternTo', () => {
  describe('when point is closer directly', () => {
    it('should return false when point is on the same meridian', () => {
      const pointA = new GeoPoint(10, 10);
      const pointB = new GeoPoint(10, 10);

      expect(pointA.isEasternTo(pointB)).toBe(false);
    });

    it('should return true when point is eastern', () => {
      const pointA = new GeoPoint(10, 10);
      const pointB = new GeoPoint(10, -10);

      expect(pointA.isEasternTo(pointB)).toBe(true);
    });

    it('should return false when point is not eastern', () => {
      const pointA = new GeoPoint(10, 10);
      const pointB = new GeoPoint(10, 20);

      expect(pointA.isEasternTo(pointB)).toBe(false);
    });
  });

  describe('when point is closer through anti-meridian', () => {
    it('should return true when point is eastern', () => {
      const pointA = new GeoPoint(10, -170);
      const pointB = new GeoPoint(10, 170);

      expect(pointA.isEasternTo(pointB)).toBe(true);
    });

    it('should return false when point is not eastern', () => {
      const pointA = new GeoPoint(10, 170);
      const pointB = new GeoPoint(10, -170);

      expect(pointA.isEasternTo(pointB)).toBe(false);
    });
  });
});

describe('isWesternTo', () => {
  describe('when point is closer directly', () => {
    it('should return false when point is on the same meridian', () => {
      const pointA = new GeoPoint(10, 10);
      const pointB = new GeoPoint(10, 10);

      expect(pointA.isWesternTo(pointB)).toBe(false);
    });

    it('should return true when point is western', () => {
      const pointA = new GeoPoint(10, 10);
      const pointB = new GeoPoint(10, 20);

      expect(pointA.isWesternTo(pointB)).toBe(true);
    });

    it('should return false when point is not western', () => {
      const pointA = new GeoPoint(10, 10);
      const pointB = new GeoPoint(10, -10);

      expect(pointA.isWesternTo(pointB)).toBe(false);
    });
  });

  describe('when point is closer through anti-meridian', () => {
    it('should return true when point is western', () => {
      const pointA = new GeoPoint(10, 170);
      const pointB = new GeoPoint(10, -170);

      expect(pointA.isWesternTo(pointB)).toBe(true);
    });

    it('should return false when point is not western', () => {
      const pointA = new GeoPoint(10, -170);
      const pointB = new GeoPoint(10, 170);

      expect(pointA.isWesternTo(pointB)).toBe(false);
    });
  });
});

describe('isNorthernTo', () => {
  it('should return false when point is on the same parallel', () => {
    const pointA = new GeoPoint(10, 10);
    const pointB = new GeoPoint(10, 10);

    expect(pointA.isNorthernTo(pointB)).toBe(false);
  });

  it('should return true when point is northern', () => {
    const pointA = new GeoPoint(60, 10);
    const pointB = new GeoPoint(50, 10);

    expect(pointA.isNorthernTo(pointB)).toBe(true);
  });

  it('should return false when point is not northern', () => {
    const pointA = new GeoPoint(60, 10);
    const pointB = new GeoPoint(70, 10);

    expect(pointA.isNorthernTo(pointB)).toBe(false);
  });
});

describe('isSouthernTo', () => {
  it('should return false when point is on the same parallel', () => {
    const pointA = new GeoPoint(10, 10);
    const pointB = new GeoPoint(10, 10);

    expect(pointA.isSouthernTo(pointB)).toBe(false);
  });

  it('should return true when point is southern', () => {
    const pointA = new GeoPoint(60, 10);
    const pointB = new GeoPoint(70, 10);

    expect(pointA.isSouthernTo(pointB)).toBe(true);
  });

  it('should return false when point is not southern', () => {
    const pointA = new GeoPoint(60, 10);
    const pointB = new GeoPoint(50, 10);

    expect(pointA.isSouthernTo(pointB)).toBe(false);
  });
});

describe('toPlain', () => {
  it.todo('should return plain geo-point');
});
