import {
  degToRad,
  radToDeg,
  floorNumStrByOrder,
  calcClosestMultiple,
  cosDeg,
  sinDeg,
  findPrimeFactors,
  decRemain,
} from '../math-utils';

describe('degToRad', () => {
  it('should convert 720 degrees to 4PI', () => {
    expect(degToRad(720)).toBe(4 * Math.PI);
  });

  it('should convert 180 degrees to PI', () => {
    expect(degToRad(180)).toBe(Math.PI);
  });

  it('should convert 0 degrees to 0', () => {
    expect(degToRad(0)).toBe(0);
  });

  it('should convert -180 degrees to -PI', () => {
    expect(degToRad(-180)).toBe(-Math.PI);
  });

  it('should be almost interconvertable with radToDeg', () => {
    const rads = degToRad(99);
    const degs = +radToDeg(rads).toFixed(13);

    expect(degs).toBe(99);
  });
});

describe('radToDeg', () => {
  it('should convert 4PI degrees to 720', () => {
    expect(radToDeg(4 * Math.PI)).toBe(720);
  });

  it('should convert PI degrees to 180', () => {
    expect(radToDeg(Math.PI)).toBe(180);
  });

  it('should convert 0 degrees to 0', () => {
    expect(radToDeg(0)).toBe(0);
  });

  it('should convert -PI degrees to -180', () => {
    expect(radToDeg(-Math.PI)).toBe(-180);
  });

  it('should be almost interconvertable with degToRad', () => {
    const degs = radToDeg(1);
    const rads = +degToRad(degs).toFixed(15);

    expect(rads).toBe(1);
  });
});


describe('floorNumStrByOrder', () => {
  it('should return same value for 00', () => {
    expect(floorNumStrByOrder('00')).toBe('00');
  });

  describe('integer arguments', () => {
    it('should convert 10 degrees to 00', () => {
      expect(floorNumStrByOrder('20')).toBe('00');
    });

    it('should convert 11 degrees to 10', () => {
      expect(floorNumStrByOrder('22')).toBe('20');
    });
  });

  describe('decimal arguments', () => {
    it('should convert 0.22 degrees to 0.2', () => {
      expect(floorNumStrByOrder('0.22')).toBe('0.2');
    });

    it('should convert 0.2 degrees to 0', () => {
      expect(floorNumStrByOrder('0.2')).toBe('0');
    });
  });
});

describe('calcClosestMultiple', () => {
  it('should choose initial divider if it equals divident', () => {
    expect(calcClosestMultiple(3, 3)).toBe(3);
  });

  it('should choose initial divider if it is closest multiple', () => {
    expect(calcClosestMultiple(3, 12)).toBe(3);
  });

  describe('positive arguments', () => {
    it('should choose descending divider if it is closer', () => {
      expect(calcClosestMultiple(5, 33)).toBe(3);
    });

    it('should choose ascending divider if it is closer', () => {
      expect(calcClosestMultiple(8, 33)).toBe(11);
    });

    it('should choose ascending divident if divider bigger than divident', () => {
      expect(calcClosestMultiple(15, 10)).toBe(10);
    });
  });

  describe('negative arguments', () => {
    it('should choose ascending divident if divider less than divident', () => {
      expect(calcClosestMultiple(-15, -10)).toBe(-10);
    });
  });
});

describe('cosDeg', () => {
  it('should be almost 0 for 90 degrees', () => {
    const value = +cosDeg(90).toFixed(15);

    expect(value === 0).toBe(true);
  });

  it('should be almost 1 for 0 degrees', () => {
    const value = +cosDeg(0).toFixed(15);

    expect(value).toBe(1);
  });

  it('should be almost -1 for 180 degrees', () => {
    const value = +cosDeg(180).toFixed(15);

    expect(value).toBe(-1);
  });


  it('should be almost 0.5 for 60 degrees', () => {
    const value = +cosDeg(60).toFixed(15);

    expect(value).toBe(0.5);
  });

  it('should be almost √3/2 for 30 degrees', () => {
    const value = +cosDeg(30).toFixed(15);
    const result = +(Math.sqrt(3) / 2).toFixed(15);

    expect(value).toBe(result);
  });
});

describe('sinDeg', () => {
  it('should be almost 1 for 90 degrees', () => {
    const value = +sinDeg(90).toFixed(15);

    expect(value).toBe(1);
  });

  it('should be almost 0 for 0 degrees', () => {
    const value = +sinDeg(0).toFixed(15);

    expect(value).toBe(0);
  });

  it('should be almost 0 for 180 degrees', () => {
    const value = +sinDeg(180).toFixed(15);

    expect(value).toBe(0);
  });

  it('should be almost √3/2 for 60 degrees', () => {
    const value = +sinDeg(60).toFixed(15);
    const result = +(Math.sqrt(3) / 2).toFixed(15);

    expect(value).toBe(result);
  });

  it('should be almost 0.5 for 30 degrees', () => {
    const value = +sinDeg(30).toFixed(15);

    expect(value).toBe(0.5);
  });
});

describe('findPrimeFactors', () => {
  it('should return empty array for values less than 2', () => {
    expect(findPrimeFactors(1)).toStrictEqual([]);
  });

  it('should return array with single value for prime numbers', () => {
    expect(findPrimeFactors(13)).toStrictEqual([13]);
  });

  it('should find prime factors', () => {
    expect(findPrimeFactors(20)).toStrictEqual([2, 2, 5]);
  });
});

describe('decRemain', () => {
  it('should return 0 for integer', () => {
    expect(decRemain(1)).toBe(0);
  });

  it('should return same value for decimals less than 0', () => {
    expect(decRemain(0.1)).toBe(0.1);
  });

  it('should return decimal remain', () => {
    const value = +decRemain(1.1).toFixed(15);

    expect(value).toBe(0.1);
  });
});
