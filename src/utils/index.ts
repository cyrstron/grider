import { GeographyUtils } from './geography';
import { GeometryUtils } from './geometry';
import { MathUtils } from './math';
import { PointUtils } from './point';
import { ShapeUtils } from './shape.utils';

export interface GriderUtils {
  math: MathUtils;
  geometry: GeometryUtils;
  point: PointUtils;
  geography: GeographyUtils;
  shape: ShapeUtils;
}

export const createGriderUtils = (): GriderUtils => {
  const math = new MathUtils();
  const geometry = new GeometryUtils(math);
  const shape = new ShapeUtils(math, geometry);
  const geography = new GeographyUtils(math, geometry, shape);
  const point = new PointUtils(geometry);

  return {
    math,
    geometry,
    shape,
    point,
    geography,
  };
};

export {
  GeographyUtils,
  GeometryUtils,
  MathUtils,
  PointUtils,
  ShapeUtils,
};
