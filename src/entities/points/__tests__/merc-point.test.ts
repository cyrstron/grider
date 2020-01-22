import {MercPoint} from '../merc-point';

describe('constructor', () => {
  it('should create MercPoint instance', () => {
    expect(new MercPoint(0.5, 0.5)).toBeInstanceOf(MercPoint);
  });

  it('should reduce x value to valid', () => {
    expect(new MercPoint(1.5, 0.5).x).toBe(0.5);
  });
});

describe('toFormatted', () => {
  it('should remove unnecessary decimal digits', () => {
    const point = new MercPoint(
      0.1 + 0.2,
      0.5,
    ).toFormatted();

    expect(point.x).toBe(0.3);
  });
});

describe('toOppositeHemisphere', () => {
  it('should return point from opposite hemisphere', () => {
    const point = new MercPoint(0.4, 0.5).toOppositeHemisphere();

    expect(point.x).toBe(0.9);
  });
});

describe('isCloserThroughAntiMeridian', () => {
  it('should return false if point closer directly', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.3, 0.1);

    expect(pointA.isCloserThroughAntiMeridian(pointB)).toBe(false);
  });

  it('should return true if point closer through antimeridian', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.8, 0.1);

    expect(pointA.isCloserThroughAntiMeridian(pointB)).toBe(true);
  });
});

describe('calcMercDistance', () => {
  it('should return mercator distance between MercPoints', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.2, 0.2);

    expect(pointA.calcMercDistance(pointB)).toBe(0.1 * Math.sqrt(2));
  });

  it('should return minimal distance between MercPoints', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.9, 0.3);

    const distance = pointA.calcMercDistance(pointB).toFixed(15);
    const assertedDistance = (0.2 * Math.sqrt(2)).toFixed(15);

    expect(distance).toBe(assertedDistance);
  });
});

describe('toSphereLiteral', () => {
  it('should return plain spherical point', () => {
    const {lat, lng} = new MercPoint(0.25, 0.25).toSphereLiteral();

    expect(Math.floor(lat)).toBe(66);
    expect(lng).toBe(-90);
  });
});

describe('toSemiSphereLiteral', () => {
  it('should return plain semi-spherical point', () => {
    const {lat, lng} = new MercPoint(0.25, 0.25).toSemiSphereLiteral();

    expect(lat).toBe(45);
    expect(lng).toBe(-90);
  });
});

describe('isEasternTo', () => {
  describe('when point is closer directly', () => {
    it('should return false when point is on the same meridian', () => {
      const pointA = new MercPoint(0.1, 0.1);
      const pointB = new MercPoint(0.1, 0.1);

      expect(pointA.isEasternTo(pointB)).toBe(false);
    });

    it('should return true when point is eastern', () => {
      const pointA = new MercPoint(0.2, 0.1);
      const pointB = new MercPoint(0.1, 0.1);

      expect(pointA.isEasternTo(pointB)).toBe(true);
    });

    it('should return false when point is not eastern', () => {
      const pointA = new MercPoint(0.1, 0.1);
      const pointB = new MercPoint(0.2, 0.1);

      expect(pointA.isEasternTo(pointB)).toBe(false);
    });
  });

  describe('when point is closer through anti-meridian', () => {
    it('should return true when point is eastern', () => {
      const pointA = new MercPoint(0.1, 0.1);
      const pointB = new MercPoint(0.9, 0.1);

      expect(pointA.isEasternTo(pointB)).toBe(true);
    });

    it('should return false when point is not eastern', () => {
      const pointA = new MercPoint(0.9, 0.1);
      const pointB = new MercPoint(0.1, 0.1);

      expect(pointA.isEasternTo(pointB)).toBe(false);
    });
  });
});

describe('isWesternTo', () => {
  describe('when point is closer directly', () => {
    it('should return false when point is on the same meridian', () => {
      const pointA = new MercPoint(0.1, 0.1);
      const pointB = new MercPoint(0.1, 0.1);

      expect(pointA.isWesternTo(pointB)).toBe(false);
    });

    it('should return true when point is western', () => {
      const pointA = new MercPoint(0.1, 0.1);
      const pointB = new MercPoint(0.2, 0.1);

      expect(pointA.isWesternTo(pointB)).toBe(true);
    });

    it('should return false when point is not western', () => {
      const pointA = new MercPoint(0.2, 0.1);
      const pointB = new MercPoint(0.1, 0.1);

      expect(pointA.isWesternTo(pointB)).toBe(false);
    });
  });

  describe('when point is closer through anti-meridian', () => {
    it('should return true when point is western', () => {
      const pointA = new MercPoint(0.9, 0.1);
      const pointB = new MercPoint(0.1, 0.1);

      expect(pointA.isWesternTo(pointB)).toBe(true);
    });

    it('should return false when point is not western', () => {
      const pointA = new MercPoint(0.1, 0.1);
      const pointB = new MercPoint(0.9, 0.1);

      expect(pointA.isWesternTo(pointB)).toBe(false);
    });
  });
});

describe('isNorthernTo', () => {
  it('should return false when point is on the same parallel', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.1, 0.1);

    expect(pointA.isNorthernTo(pointB)).toBe(false);
  });

  it('should return true when point is northern', () => {
    const pointA = new MercPoint(0.1, 0.2);
    const pointB = new MercPoint(0.1, 0.1);

    expect(pointA.isNorthernTo(pointB)).toBe(true);
  });

  it('should return false when point is not northern', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.1, 0.2);

    expect(pointA.isNorthernTo(pointB)).toBe(false);
  });
});

describe('isSouthernTo', () => {
  it('should return false when point is on the same parallel', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.1, 0.1);

    expect(pointA.isSouthernTo(pointB)).toBe(false);
  });

  it('should return true when point is southern', () => {
    const pointA = new MercPoint(0.1, 0.1);
    const pointB = new MercPoint(0.1, 0.2);

    expect(pointA.isSouthernTo(pointB)).toBe(true);
  });

  it('should return false when point is not southern', () => {
    const pointA = new MercPoint(0.1, 0.2);
    const pointB = new MercPoint(0.1, 0.1);

    expect(pointA.isSouthernTo(pointB)).toBe(false);
  });
});
