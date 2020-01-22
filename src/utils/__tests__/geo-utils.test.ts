import {
  semiLatToY,
  semiLngToX,
  latToY,
  lngToX,
  reduceLat,
  reduceLng,
  formatLat,
  formatLng,
} from '../geo-utils';

import {
  yToSemiLat,
  xToSemiLng,
  yToLat,
  xToLng,
} from '../merc-utils';

describe('semiLatToY', () => {
  it('should be 0 for 90 degrees', () => {
    expect(semiLatToY(90)).toBe(0);
  });

  it('should be 0.5 for 0 degrees', () => {
    expect(semiLatToY(0)).toBe(0.5);
  });

  it('should be 1 for -90 degrees', () => {
    expect(semiLatToY(-90)).toBe(1);
  });

  it('should be almost interconvertable with yToSemiLat', () => {
    const value = +yToSemiLat(semiLatToY(49)).toFixed(13);

    expect(value).toBe(49);
  });
});

describe('semiLngToX', () => {
  it('should be 0 for -180 degrees', () => {
    expect(semiLngToX(-180)).toBe(0);
  });

  it('should be 0.5 for 0 degrees', () => {
    expect(semiLngToX(0)).toBe(0.5);
  });

  it('should be 1 for 180 degrees', () => {
    expect(semiLngToX(180)).toBe(1);
  });

  it('should be almost interconvertable with xToSemiLng', () => {
    const value = +xToSemiLng(semiLngToX(49)).toFixed(13);

    expect(value).toBe(49);
  });
});

describe('latToY', () => {
  it('should be almost 0.25 for 66 degrees', () => {
    const value = +latToY(66).toFixed(2);

    expect(value).toBe(0.25);
  });

  it('should be 0.5 for 0 degrees', () => {
    expect(latToY(0)).toBe(0.5);
  });

  it('should be almost 0.75 for -66 degrees', () => {
    const value = +latToY(-66).toFixed(2);

    expect(value).toBe(0.75);
  });

  it('should be almost interconvertable with yToLat', () => {
    const value = +yToLat(latToY(49)).toFixed(13);

    expect(value).toBe(49);
  });
});

describe('lngToX', () => {
  it('should be 0 for -180 degrees', () => {
    expect(lngToX(-180)).toBe(0);
  });

  it('should be 0.5 for 0 degrees', () => {
    expect(lngToX(0)).toBe(0.5);
  });

  it('should be 1 for 180 degrees', () => {
    expect(lngToX(180)).toBe(1);
  });

  it('should be almost interconvertable with xToLng', () => {
    const value = +xToLng(lngToX(49)).toFixed(13);

    expect(value).toBe(49);
  });
});

describe('reduceLat', () => {
  describe('valid values', () => {
    it('should return same value for 90', () => {
      expect(reduceLat(90)).toBe(90);
    });

    it('should return same value for 0', () => {
      expect(reduceLat(90)).toBe(90);
    });

    it('should return same value for -90', () => {
      expect(reduceLat(90)).toBe(90);
    });
  });

  describe('invalid values', () => {
    it('should return 0 value for 180', () => {
      expect(reduceLat(180)).toBe(0);
    });

    it('should return 80 value for 100', () => {
      expect(reduceLat(100)).toBe(80);
    });

    it('should return -80 value for -100', () => {
      expect(reduceLat(-100)).toBe(-80);
    });
  });
});

describe('reduceLng', () => {
  describe('valid values', () => {
    it('should return same value for 0', () => {
      expect(reduceLng(0)).toBe(0);
    });

    it('should return same value for -180', () => {
      expect(reduceLng(-180)).toBe(-180);
    });

    it('should return same value for 179', () => {
      expect(reduceLng(179)).toBe(179);
    });
  });

  describe('invalid values', () => {
    it('should return -180 value for 180', () => {
      expect(reduceLng(180)).toBe(-180);
    });

    it('should return -160 value for 200', () => {
      expect(reduceLng(200)).toBe(-160);
    });

    it('should return 160 value for -200', () => {
      expect(reduceLng(-200)).toBe(160);
    });
  });
});

describe('formatLat', () => {
  describe('valid values', () => {
    it('should return same value for 90', () => {
      expect(formatLat(90)).toBe(90);
    });

    it('should return same value for 0', () => {
      expect(formatLat(0)).toBe(0);
    });

    it('should return same value for -90', () => {
      expect(formatLat(-90)).toBe(-90);
    });
  });

  describe('invalid values', () => {
    it('should return 90 value for 100', () => {
      expect(formatLat(100)).toBe(90);
    });

    it('should return -90 value for -100', () => {
      expect(formatLat(-100)).toBe(-90);
    });
  });

  describe('rounding values', () => {
    it('should round to precision 7', () => {
      const value = 50.00000001;

      expect(formatLat(value)).toBe(50);
    });

    it('should not round decimals with precision 7', () => {
      const value = 50.0000001;

      expect(formatLat(value)).toBe(value);
    });
  });
});

describe('formatLng', () => {
  describe('valid values', () => {
    it('should return same value for -180', () => {
      expect(formatLng(-180)).toBe(-180);
    });

    it('should return same value for 0', () => {
      expect(formatLng(0)).toBe(0);
    });

    it('should return same value for 179', () => {
      expect(formatLng(179)).toBe(179);
    });
  });

  describe('invalid values', () => {
    it('should return 160 value for -200', () => {
      expect(formatLng(-200)).toBe(160);
    });

    it('should return -160 value for 200', () => {
      expect(formatLng(200)).toBe(-160);
    });
  });

  describe('rounding values', () => {
    it('should round to precision 7', () => {
      const value = 50.00000001;

      expect(formatLng(value)).toBe(50);
    });

    it('should not round decimals with precision 7', () => {
      const value = 50.0000001;

      expect(formatLng(value)).toBe(value);
    });
  });
});
