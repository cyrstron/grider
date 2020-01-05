import {degToRad} from './';

describe('math-utils:degToRag', () => {
  it('converts degrees to radians', () => {
    expect(degToRad(180)).toBe(Math.PI);
  });
});
