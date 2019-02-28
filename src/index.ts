/// <reference types="./@types" />

import { CenterCalculator } from './center-calc';
import { Converter, createConverter } from './converter';
import { Grider } from './grider';
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

export const createStaticGrider = (
  config: grider.GridConfig,
): StaticGrider => {
  const params = paramsBuilder.build(config);

  return new StaticGrider(grider, params);
};

export {
  Grider,
  StaticGrider,
};
