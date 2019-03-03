import { Grider } from '../grider';
import { FigureBuilder } from './figure-builder';

export const createFigureBuilder = (grider: Grider) => {
  return new FigureBuilder(grider);
};

export {
  FigureBuilder,
};
