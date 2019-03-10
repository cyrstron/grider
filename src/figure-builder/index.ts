import { Grider } from '../grider';
import { FigureBuilder } from './figure-builder';
import { GriderUtils } from '../utils';

export const createFigureBuilder = (grider: Grider, utils: GriderUtils) => {
  return new FigureBuilder(grider, utils);
};

export {
  FigureBuilder,
};
