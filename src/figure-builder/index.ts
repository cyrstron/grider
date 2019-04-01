import { Grider } from '../grider';
import { GriderUtils } from '../utils';
import { CellFinder } from './cell-finder';
import { FigureBuilder } from './figure-builder';
import { FigureCleaner } from './figure-cleaner';

export const createFigureBuilder = (grider: Grider, utils: GriderUtils) => {
  const cellFinder = new CellFinder(utils.geography, utils.shape, grider);
  const figureCleaner = new FigureCleaner();

  return new FigureBuilder(grider, utils, cellFinder, figureCleaner);
};

export {
  FigureBuilder,
};
