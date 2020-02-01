import {Vector} from '../vector';

describe('instance', () => {
  describe('instance creation', () => {
    it('should create Vector instance', () => {
      expect(new Vector(1, 1)).toBeInstanceOf(Vector);
    });
  });
});
