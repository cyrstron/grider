import { GeographyUtils, GriderUtils } from '../utils';
import {
  axesParams,
  calcAxesParams,
  initCoofs,
} from './utils';

export class ParamsBuilder {
  geography: GeographyUtils;
  initCoofs = initCoofs;
  axesParams = axesParams;
  calcAxesParams = calcAxesParams;

  constructor({geography}: GriderUtils) {
    this.geography = geography;
  }

  build({
    isHorizontal = false,
    type,
    correction,
    cellSize,
  }: grider.GridConfig): grider.GridParams {
    const orientation: grider.OrientType = isHorizontal ? 'horizontal' : 'vertical';
    const initSizeCoof: number = this.initCoofs[type][correction][orientation];
    const gridParams: grider.GridParams = {
      isHorizontal,
      type,
      axes: this.axesParams[type],
      geoAxes: this.calcAxesParams(isHorizontal, type),
      initSize: this.geography.calcInitialCellWidth(cellSize, initSizeCoof),
      initHeight: this.geography.calcInitialCellHeight(cellSize),
      correction,
    };
    return gridParams;
  }
}
