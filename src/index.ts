/// <reference types="../src/@types" />

import { CenterCalculator } from './center-calc';
import { Converter, createConverter } from './converter';
import { createFigureBuilder } from './figure-builder';
import { BorderRenderer, createGridRenderer } from './grid-renderer';
import { Grider } from './grider';
import { Neighborer } from './neighborer';
import { ParamsBuilder } from './params-builder';
import { ShapeBuilder } from './shape-builder';
import { StaticGrider } from './static-grider';
import { createGriderUtils, GriderUtils } from './utils';

export const utils: GriderUtils = createGriderUtils();

const builder: ShapeBuilder = new ShapeBuilder(utils);
const centerCalc: CenterCalculator = new CenterCalculator(utils);
const paramsBuilder: ParamsBuilder = new ParamsBuilder(utils);
const converter: Converter = createConverter(utils) ;

export const grider = new Grider({
  converter,
  builder,
  centerCalc,
});

export const neighbors: Neighborer = new Neighborer(grider);
export const figureBuilder = createFigureBuilder(grider, utils);

export const createBorderRenderer = (
  figure: grider.GeoPoint[],
  shape: grider.GeoPoint[],
): BorderRenderer => {
  return new BorderRenderer(figure, shape, utils.geography, utils.math, utils.shape, grider);
};

export const createStaticGrider = (
  config: grider.GridConfig,
): StaticGrider => {
  const params = paramsBuilder.build(config);
  const gridRenderer = createGridRenderer(grider, utils.geography, utils.math, neighbors);

  return new StaticGrider(grider, figureBuilder, neighbors, params, gridRenderer);
};

export {
  Grider,
  StaticGrider,
  BorderRenderer,
};
