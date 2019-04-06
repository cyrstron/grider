import isEqual from 'lodash/isEqual';
import { Grider } from '../grider';
import { GriderUtils } from '../utils';
import {CellFinder} from './cell-finder';
import { FigureCleaner } from './figure-cleaner';
import { ShapeValidator } from './shape-validator';

export class FigureBuilder {
  constructor(
    public grider: Grider,
    public utils: GriderUtils,
    public cellFinder: CellFinder,
    public figureCleaner: FigureCleaner,
    public validator: ShapeValidator,
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
    if (!this.validator.validate(shape, gridParams)) {
      return [];
    }

    const figure = shape.reduce((
      figure: grider.GeoPoint[],
      point: grider.GeoPoint,
      index: number,
    ): grider.GeoPoint[] => {
      const nextPoint = shape[index + 1] || shape[0];

      return this.addFigureSidePoints([point, nextPoint], shape, figure, gridParams, isInner);
    }, []);

    // return figure;

    return this.figureCleaner.cleanFigure(figure);
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
    let isSideStartPointFound = false;
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
      if (figure.length > 10000) break;
      const lastPoint = figure[figure.length - 1];
      let startPoint = startCell.find((point) => isEqual(point, lastPoint));

      if (!startPoint && !isSideStartPointFound) {

        while (!startPoint && !isEqual(endCellCenter, startCellCenter)) {

          startCellCenter = this.cellFinder.calcNextCellCenter(startCellCenter, section, gridParams);

          if (!startCellCenter) continue;

          startCell = this.grider.buildPolyByCenterGridPoint(startCellCenter, gridParams);

          const preLastPoint = figure[figure.length - 2];
          const isCellHasPrelast = !!startCell.find((point) => isEqual(point, preLastPoint));

          if (isCellHasPrelast) continue;

          startPoint = startCell.find((point) => isEqual(point, lastPoint));
        }
      }

      if (!startPoint) break;

      if (!isSideStartPointFound && startPoint) {
        isSideStartPointFound = true;
      }

      let index = startCell.indexOf(startPoint);
      let nextPoint = this.utils.shape.getNextPoint(startCell, index);
      let intersect = this.utils.geography.calcSectionsIntersect(
        [startCell[index], nextPoint],
        section,
      );
      let isNextContained = this.utils.geography.polyContainsPoint(shape, nextPoint);

      const isReversed = !!intersect || isNextContained !== isInner;

      if (isReversed) {
        nextPoint = this.utils.shape.getPrevPoint(startCell, index);
        isNextContained = this.utils.geography.polyContainsPoint(shape, nextPoint);
        intersect = this.utils.geography.calcSectionsIntersect(
          [startCell[index], nextPoint],
          section,
        );
      }

      while (!intersect && isNextContained === isInner) {
        if (figure.length > 10000) break;

        if (!isEqual(figure[figure.length - 1], startCell[index])) {
          figure.push(startCell[index]);
        }

        const pointA = startCell[index];

        if (isReversed) {
          index = startCell[index - 1] ? index - 1 : startCell.length - 1;
        } else {
          index = startCell[index + 1] ? index + 1 : 0;
        }

        nextPoint = startCell[index];
        const cellSide = [pointA, nextPoint] as [grider.GeoPoint, grider.GeoPoint];
        intersect = this.utils.geography.calcSectionsIntersect(
          cellSide,
          section,
        );
        isNextContained = this.utils.geography.polyContainsPoint(shape, nextPoint);
      }

      startCellCenter = this.cellFinder.calcNextCellCenter(startCellCenter, section, gridParams);

      if (!startCellCenter) break;

      startCell = this.grider.buildPolyByCenterGridPoint(startCellCenter, gridParams);
    }

    return figure;
  }
}
