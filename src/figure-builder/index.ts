import { Grider } from '../grider';
import { GriderUtils } from '../utils';
import { CellFinder } from './cell-finder';
import { FigureBuilder } from './figure-builder';
import { FigureCleaner } from './figure-cleaner';
import { ShapeValidator } from './shape-validator';

export const createFigureBuilder = (grider: Grider, utils: GriderUtils) => {
  const cellFinder = new CellFinder(utils.geography, utils.shape, grider);
  const figureCleaner = new FigureCleaner();
  const validator = new ShapeValidator(utils.geography, utils.shape, grider, cellFinder);

  return new FigureBuilder(grider, utils, cellFinder, figureCleaner, validator);
};

export {
  FigureBuilder,
};
