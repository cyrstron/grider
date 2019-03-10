import { GeographyUtils } from './geography.utils';
import { GeometryUtils } from './geometry.utils';
import { MathUtils } from './math.utils';
import { PointUtils } from './point.utils';

export interface GriderUtils {
  math: MathUtils;
  geometry: GeometryUtils;
  point: PointUtils;
  geography: GeographyUtils;
}

export const createGriderUtils = (): GriderUtils => {
  const math = new MathUtils();
  const geometry = new GeometryUtils(math);
  const geography = new GeographyUtils(math, geometry);
  const point = new PointUtils(geometry);

  return {
    math,
    geometry,
    point,
    geography,
  };
};

export {
  GeographyUtils,
  GeometryUtils,
  MathUtils,
  PointUtils,
};
