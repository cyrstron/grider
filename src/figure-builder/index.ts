import { Grider } from '../grider';
import { GriderUtils } from '../utils';
import { CellFinder } from './cell-finder';
import { FigureBuilder } from './figure-builder';

export const createFigureBuilder = (grider: Grider, utils: GriderUtils) => {
  const cellFinder = new CellFinder(utils.geography, utils.shape, grider);
  return new FigureBuilder(grider, utils, cellFinder);
};

export {
  FigureBuilder,
};
