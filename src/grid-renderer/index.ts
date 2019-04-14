import {Grider} from '../grider';
import {Neighborer} from '../neighborer';
import {GeographyUtils} from '../utils';
import {GridRenderer} from './renderer';
import {TileBuilder} from './tile-builder';

export const createGridRenderer = (
  grider: Grider,
  geography: GeographyUtils,
  neighbors: Neighborer,
): GridRenderer => {
  const tileBuilder = new TileBuilder(grider, neighbors);
  const gridRenderer = new GridRenderer(grider, tileBuilder, geography, neighbors);

  return gridRenderer;
};

export {
  GridRenderer,
  TileBuilder,
};
