import { GriderUtils } from '../../utils';
import { AxisRotator } from './rotator';
import { AxisScaler } from './scaler';
import { AxisTransformer } from './transformer';

export const createAxisTransformer = (utils: GriderUtils) => {
  const axisScaler = new AxisScaler();
  const axisRotator = new AxisRotator(utils);

  return new AxisTransformer(axisRotator, axisScaler);
};

export {
  AxisRotator,
  AxisScaler,
  AxisTransformer,
};
