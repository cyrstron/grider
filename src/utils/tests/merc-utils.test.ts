import {
  yToLat,
  xToLng,
  yToSemiLat,
  xToSemiLng,
  reduceX,
} from '../merc-utils';

import {
  latToY,
  lngToX,
  semiLatToY,
  semiLngToX,
} from '../geo-utils';

describe('yToLat', () => {
  it('should return 0 degrees for 0.5', () => {
    expect(yToLat(0.5)).toBe(0);
  });

  it('should return near 66 degress for 0.25', () => {
    expect(Math.floor(yToLat(0.25))).toBe(66);
  });

  it('should return near -66 degress for 0.75', () => {
    expect(Math.ceil(yToLat(0.75))).toBe(-66);
  });

  it('should be almost interconvertable with latToY', () => {
    const value = +latToY(yToLat(0.2)).toFixed(15);

    expect(value).toBe(0.2);
  });
});

describe('xToLng', () => {
  it('should return 0 degrees for 0.5', () => {
    expect(xToLng(0.5)).toBe(0);
  });

  it('should return -180 degrees for 0', () => {
    expect(xToLng(0.5)).toBe(0);
  });

  it('should return 180 degrees for 1', () => {
    expect(xToLng(0.5)).toBe(0);
  });

  it('should be almost interconvertable with lngToX', () => {
    const value = +lngToX(xToLng(0.2)).toFixed(15);

    expect(value).toBe(0.2);
  });
});

describe('yToSemiLat', () => {
  it('should return 0 degrees for 0.5', () => {
    expect(yToSemiLat(0.5) === 0).toBe(true);
  });

  it('should return -90 degrees for 1', () => {
    expect(yToSemiLat(1)).toBe(-90);
  });

  it('should return 90 degrees for 0', () => {
    expect(yToSemiLat(0)).toBe(90);
  });

  it('should be almost interconvertable with semiLatToY', () => {
    const value = +semiLatToY(yToSemiLat(0.2)).toFixed(15);

    expect(value).toBe(0.2);
  });
});


describe('xToSemiLng', () => {
  it('should return 0 degrees for 0.5', () => {
    expect(xToSemiLng(0.5)).toBe(0);
  });

  it('should return -180 degrees for 0', () => {
    expect(xToSemiLng(0)).toBe(-180);
  });

  it('should return 180 degrees for 1', () => {
    expect(xToSemiLng(1)).toBe(180);
  });

  it('should be almost interconvertable with semiLngToX', () => {
    const value = +semiLngToX(xToSemiLng(0.2)).toFixed(15);

    expect(value).toBe(0.2);
  });
});

describe('reduceX', () => {
  it('should return same value for x less than 1', () => {
    expect(reduceX(0.5)).toBe(0.5);
  });

  it('should reduce x if it is more than 1', () => {
    expect(reduceX(2.5)).toBe(0.5);
  });

  it('should reduce negative x', () => {
    expect(reduceX(-0.6)).toBe(0.4);
  });
});
