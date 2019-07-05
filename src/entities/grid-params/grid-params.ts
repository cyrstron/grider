import {
  axesParams,
  calcAxesParams,
  initCoofs,
  calcInitialCellWidth,
  calcInitialCellHeight,
} from './utils';
import { TileMercPoint } from '../points/tile-merc-point';

export class GridParams {
  isHorizontal: boolean;
  type: grider.ShapeType;
  axes: grider.GridAxis[];
  geoAxes: grider.Axis[];
  initSize: number;
  initHeight: number;
  correction: grider.CorrectionType;

  constructor({
    isHorizontal = false,
    type,
    correction,
    cellSize,
  }: grider.GridConfig) {
    const orientation = isHorizontal ? 'horizontal' : 'vertical';
    const initSizeCoof: number = initCoofs[type][correction][orientation];

    this.isHorizontal = isHorizontal;
    this.type = type;
    this.axes = axesParams[type],
    this.geoAxes = calcAxesParams(isHorizontal, type),
    this.initSize = calcInitialCellWidth(cellSize, initSizeCoof),
    this.initHeight = calcInitialCellHeight(cellSize),
    this.correction = correction;
  }

  minCellSize(tilePoint: TileMercPoint) {
    const {initSize, initHeight, isHorizontal} = this;
    const cellSize = isHorizontal ? initSize : initHeight;
    const initSizeDeg = cellSize / 10000000;

    return initSizeDeg * tilePoint.zoomCoofX / 360;
  }
}