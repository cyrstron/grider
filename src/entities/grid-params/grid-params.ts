import { TileMercPoint } from '../points/tile-merc-point';
import {
  axesParams,
  calcAxesParams,
  calcInitialCellHeight,
  calcInitialCellWidth,
  initCoofs,
} from './utils';

export class GridParams {

  static fromConfig({
    isHorizontal = false,
    type,
    correction,
    cellSize,
  }: grider.GridConfig): GridParams {
    const orientation = isHorizontal ? 'horizontal' : 'vertical';
    const initSizeCoof: number = initCoofs[type][correction][orientation];

    const axes = axesParams[type];
    const geoAxes = calcAxesParams(isHorizontal, type);
    const initSize = calcInitialCellWidth(cellSize, initSizeCoof);
    const initHeight = calcInitialCellHeight(cellSize);

    return new GridParams({
      isHorizontal,
      type,
      axes,
      geoAxes,
      initSize,
      initHeight,
      correction,
    });
  }
  isHorizontal: boolean;
  type: grider.ShapeType;
  axes: grider.GridAxis[];
  geoAxes: grider.Axis[];
  initSize: number;
  initHeight: number;
  correction: grider.CorrectionType;

  constructor({
    isHorizontal,
    type,
    axes,
    geoAxes,
    initSize,
    initHeight,
    correction,
  }: grider.GridParams) {
    this.isHorizontal = isHorizontal;
    this.type = type;
    this.axes = axes;
    this.geoAxes = geoAxes;
    this.initSize = initSize;
    this.initHeight = initHeight;
    this.correction = correction;
  }

  minCellSize(tilePoint: TileMercPoint): number {
    const {tileWidth, zoomCoofX} = tilePoint;
    const {initSize, initHeight, isHorizontal} = this;
    const cellSize = isHorizontal ? initSize : initHeight;
    const initSizeDeg = cellSize / 10000000;

    return initSizeDeg * tileWidth * zoomCoofX / 360;
  }

  isEqual(params: GridParams) {
    return this.isHorizontal === params.isHorizontal &&
      this.type === params.type &&
      this.correction === params.correction &&
      this.initSize === params.initSize;
  }

  toPlain(): grider.GridParams {
    const {
      isHorizontal,
      type,
      axes,
      geoAxes,
      initSize,
      initHeight,
      correction,
    } = this;

    return ({
      isHorizontal,
      type,
      axes,
      geoAxes,
      initSize,
      initHeight,
      correction,
    });
  }

  static fromPlain(params: grider.GridParams): GridParams {
    return new GridParams(params);
  }
}
