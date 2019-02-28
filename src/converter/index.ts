import { GriderUtils } from './../utils';
import { AxisTransformer, createAxisTransformer } from './axis-transformer';
import { Converter } from './converter';
import { Corrector, createCorrector } from './corrector';

export const createConverter = (utils: GriderUtils) => {
  const axisTransformer: AxisTransformer = createAxisTransformer(utils);
  const corrector: Corrector = createCorrector(utils);

  return new Converter(axisTransformer, corrector);
};

export {Converter};
