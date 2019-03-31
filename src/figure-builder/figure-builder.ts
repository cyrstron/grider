import isEqual from 'lodash/isEqual';
import { Grider } from '../grider';
import { GriderUtils } from '../utils';
import {CellFinder} from './cell-finder';

export class FigureBuilder {
  constructor(
    public grider: Grider,
    public utils: GriderUtils,
    public cellFinder: CellFinder,
  ) {}

  buildOuterFigure(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    return this.buildFigure(shape, gridParams, false);
  }

  buildInnerFigure(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    return this.buildFigure(shape, gridParams);
  }

  buildFigure(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
    isInner: boolean = true,
  ): grider.GeoPoint[] {
    // if (!this.validateShape(shape)) {
    //   return [];
    // }

    const figure = shape.reduce((
      figure: grider.GeoPoint[],
      point: grider.GeoPoint,
      index: number,
    ): grider.GeoPoint[] => {
      const nextPoint = shape[index + 1] || shape[0];

      return this.addFigureSidePoints([point, nextPoint], shape, figure, gridParams, isInner);
    }, []);

    // return figure;

    return this.cleanFigure(figure);
  }

  validateShape(shape: grider.GeoPoint[]): boolean {
    const itselfIntersects = this.utils.geography.calcPolyItselfIntersections(shape);

    if (itselfIntersects.length > 0) return false;

    return true;
  }

  addFigureSidePoints(
    section: [grider.GeoPoint, grider.GeoPoint],
    shape: grider.GeoPoint[],
    figure: grider.GeoPoint[],
    gridParams: grider.GridParams,
    isInner: boolean = true,
  ): grider.GeoPoint[] {
    const endCellCenter = this.grider.calcGridCenterPointByGeoPoint(section[1], gridParams);

    let startCellCenter: grider.GridPoint | undefined;
    startCellCenter = this.grider.calcGridCenterPointByGeoPoint(section[0], gridParams);

    let startCell = this.grider.buildPolyByCenterGridPoint(startCellCenter, gridParams);

    if (figure.length === 0) {
      let firstPoint: grider.GeoPoint | undefined;

      while (startCellCenter && !firstPoint || !isEqual(endCellCenter, startCellCenter)) {

        firstPoint = this.cellFinder.findStartPoint(startCellCenter, startCell, shape, gridParams, isInner);

        if (firstPoint) break;

        startCellCenter = this.cellFinder.calcNextCellCenter(startCellCenter, section, gridParams);

        if (!startCellCenter) break;

        startCell = this.grider.buildPolyByCenterGridPoint(startCellCenter, gridParams);
      }

      if (!firstPoint) return [];

      figure.push(firstPoint);
    }

    while (!isEqual(endCellCenter, startCellCenter)) {
      const lastPoint = figure[figure.length - 1];
      let startPoint = startCell.find((point) => isEqual(point, lastPoint));

      if (!startPoint) {
        while (!startPoint && !isEqual(endCellCenter, startCellCenter)) {
          startCellCenter = this.cellFinder.calcNextCellCenter(startCellCenter, section, gridParams);

          if (!startCellCenter) continue;

          startCell = this.grider.buildPolyByCenterGridPoint(startCellCenter, gridParams);
          startPoint = startCell.find((point) => isEqual(point, lastPoint));
        }
      }

      if (!startPoint) break;

      let index = startCell.indexOf(startPoint);
      let isContained = this.utils.geography.polyContainsPoint(shape, startCell[index]);
      const isNextContained = this.utils.geography.polyContainsPoint(shape, startCell[index + 1] || startCell[0]);

      const isReversed = isNextContained !== isInner;

      while (isContained === isInner) {
        if (!isEqual(figure[figure.length - 1], startCell[index])) {
          figure.push(startCell[index]);
        }

        if (isReversed) {
          index = startCell[index - 1] ? index - 1 : startCell.length - 1;
        } else {
          index = startCell[index + 1] ? index + 1 : 0;
        }

        isContained = this.utils.geography.polyContainsPoint(shape, startCell[index]);
      }

      startCellCenter = this.cellFinder.calcNextCellCenter(startCellCenter, section, gridParams);

      if (!startCellCenter) break;

      startCell = this.grider.buildPolyByCenterGridPoint(startCellCenter, gridParams);
    }

    return figure;
  }

  cleanFigure(figure: grider.GeoPoint[]): grider.GeoPoint[] {
    const figureLength = figure.length;

    const indexes = figure.reduce((
      indexes: {[key: string]: number | number[]},
      {lat, lng}: grider.GeoPoint,
      index: number,
    ): {[key: string]: number | number[]} => {
      const key = `${lat} ${lng}`;

      const value = indexes[key];

      if (value === undefined) {
        indexes[key] = index;
      } else if (Array.isArray(value)) {
        value.push(index);
      } else {
        indexes[key] = [value, index];
      }
      return indexes;
    }, {}) as {[key: string]: number | number[]};

    const {inner, outer} = Object.keys(indexes)
      .reduce((
        repeatedPointIndexes: {
          inner: number[][],
          outer: [number, number],
        },
        key: string,
      ): {
        inner: number[][],
        outer: [number, number],
      } => {
        const indexValue = indexes[key];

        if (!Array.isArray(indexValue)) return repeatedPointIndexes;

        const min = Math.min(...indexValue);
        const max = Math.max(...indexValue);

        const isOuter = (max - min > figureLength + min - max) &&
          repeatedPointIndexes.outer[0] <= min &&
          repeatedPointIndexes.outer[1] >= max;

        if (isOuter) {
          repeatedPointIndexes.outer = [min, max];
          return repeatedPointIndexes;
        }

        let isNew = true;

        repeatedPointIndexes.inner.forEach((
          innerIndexes: number[],
          index: number,
        ) => {
          if (!isNew) return;

          const minInner = Math.min(...innerIndexes);
          const maxInner = Math.max(...innerIndexes);

          if (minInner > min && maxInner < max) {
            repeatedPointIndexes.inner[index] = [min, max];
          } else if (minInner < min && maxInner > max) {
            isNew = false;
          }
        });

        if (isNew) {
          repeatedPointIndexes.inner.push([min, max]);
        }

        return repeatedPointIndexes;
      }, {
        inner: [],
        outer: [0, figureLength],
      });

    const sliceIndexes = [
      ...outer,
      ...inner.reduce((
          indexes: number[],
          innerIndexes: number[],
        ): number[] => [...indexes, ...innerIndexes], []),
    ].sort((a, b) => a - b)
      .reduce((
        sliceIndexes: Array<[number, number]>,
        sliceIndex: number,
        index: number,
        sortedIndexes: number[],
      ): Array<[number, number]> => {
        if (index % 2) return sliceIndexes;
        const nextIndex = sortedIndexes[index + 1];
        const startIndex = index === 0 ? sliceIndex : sliceIndex + 1;
        const endIndex = nextIndex + 1;

        sliceIndexes.push([startIndex, endIndex]);

        return sliceIndexes;
      }, []);

    const cleanedFigure = sliceIndexes.reduce((
      cleanedFigure: grider.GeoPoint[],
      [sliceStart, sliceEnd]: [number, number],
    ) => [...cleanedFigure, ...figure.slice(sliceStart, sliceEnd)], []);

    if (!isEqual(cleanedFigure[0], cleanedFigure[cleanedFigure.length - 1])) {
      cleanedFigure.push(cleanedFigure[0]);
    }

    return cleanedFigure;
  }
}
