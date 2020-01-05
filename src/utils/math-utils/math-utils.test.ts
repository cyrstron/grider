import {degToRad} from './';

describe('math-utils:degToRag', () => {
  it('converts 180 degrees to PI', () => {
    expect(degToRad(180)).toBe(Math.PI);
  });

  it('converts 0 degrees to 0', () => {
    expect(degToRad(0)).toBe(0);
  });
});
