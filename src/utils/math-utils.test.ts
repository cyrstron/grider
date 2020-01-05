import {degToRad, radToDeg} from './math-utils';

describe('math-utils:degToRag', () => {
  it('converts 720 degrees to 4PI', () => {
    expect(degToRad(720)).toBe(4 * Math.PI);
  });

  it('converts 360 degrees to 2PI', () => {
    expect(degToRad(360)).toBe(2 * Math.PI);
  });

  it('converts 180 degrees to PI', () => {
    expect(degToRad(180)).toBe(Math.PI);
  });

  it('converts 90 degrees to PI/2', () => {
    expect(degToRad(90)).toBe(Math.PI / 2);
  });

  it('converts 0 degrees to 0', () => {
    expect(degToRad(0)).toBe(0);
  });

  it('converts -180 degrees to -PI', () => {
    expect(degToRad(-180)).toBe(-Math.PI);
  });

  it('converts -360 degrees to -2PI', () => {
    expect(degToRad(-360)).toBe(-2 * Math.PI);
  });

  it('converts -720 degrees to -4PI', () => {
    expect(degToRad(-720)).toBe(-4 * Math.PI);
  });
});

describe('math-utils:radToDeg', () => {
  it('converts 4PI degrees to 720', () => {
    expect(radToDeg(4 * Math.PI)).toBe(720);
  });

  it('converts 2PI degrees to 360', () => {
    expect(radToDeg(2 * Math.PI)).toBe(360);
  });

  it('converts PI degrees to 180', () => {
    expect(radToDeg(Math.PI)).toBe(180);
  });

  it('converts PI/2 degrees to 90', () => {
    expect(radToDeg(Math.PI / 2)).toBe(90);
  });

  it('converts 0 degrees to 0', () => {
    expect(radToDeg(0)).toBe(0);
  });

  it('converts -PI degrees to -180', () => {
    expect(radToDeg(-Math.PI)).toBe(-180);
  });

  it('converts -2PI degrees to -360', () => {
    expect(radToDeg(-2 * Math.PI)).toBe(-360);
  });

  it('converts -4PI degrees to -720', () => {
    expect(radToDeg(-4 * Math.PI)).toBe(-720);
  });
});
