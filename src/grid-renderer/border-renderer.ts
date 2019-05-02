import isEqual from 'lodash/isEqual';
import { Grider } from '../grider';
import { GeographyUtils, MathUtils, ShapeUtils } from '../utils';

export class BorderRenderer {
  simplifiedFigure: grider.GeoPoint[];
  lngIndexes: {[key: string]: number[]};
  latIndexes: {[key: string]: number[]};
  lngKeysIndexation: {[key: string]: number[]};
  latKeysIndexation: {[key: string]: number[]};
  isRipped: boolean;
  east: number;
  north: number;
  west: number;
  south: number;

  constructor(
    public gridParams: grider.GridParams,
    public figure: grider.GeoPoint[],
    public shape: grider.GeoPoint[],
    public math: MathUtils,
    public geography: GeographyUtils,
    public shapeUtils: ShapeUtils,
    public grider: Grider,
  ) {
    this.simplifiedFigure = this.simplifyFigure(figure, shape, gridParams);

    const {
      lngIndexes,
      latIndexes,
      lngKeysIndexation,
      latKeysIndexation,
    } = this.indexateFigure(this.simplifiedFigure);

    this.lngIndexes = lngIndexes;
    this.latIndexes = latIndexes;
    this.lngKeysIndexation = lngKeysIndexation;
    this.latKeysIndexation = latKeysIndexation;

    const latKeys = Object.keys(latIndexes).sort((a, b) => +a - +b);
    const lngKeys = Object.keys(lngIndexes).sort((a, b) => +a - +b);

    this.south = +latKeys[0];
    this.north = +latKeys[latKeys.length - 1];

    const minLng = lngKeys[0];
    const maxLng = lngKeys[lngKeys.length - 1];

    this.isRipped = +maxLng - +minLng > 180;

    this.east = this.isRipped ? +minLng : +maxLng;
    this.west =  this.isRipped ? +maxLng : +minLng;
  }

  getIntersectedBorder({
    south,
    north,
    east,
    west,
  }: {
    north: number,
    east: number,
    south: number,
    west: number,
  }) {
    if ((
      south > this.north
    ) || (
      north < this.south
    ) || (
      !this.isRipped && east < this.west
    ) || (
      !this.isRipped && west > this.east
    ) || (
      this.isRipped && east < this.west && west > this.east
    )) {
      return [];
    }

    const northKeys = this.getClosestLatKeys(north);
    const {from: northClosestKey} = this.getClosestKeys(north, northKeys);
    const southKeys = this.getClosestLatKeys(south);
    const {to: southClosestKey} = this.getClosestKeys(south, southKeys);

    const northPoints = this.latIndexes[northClosestKey].map((index) => this.simplifiedFigure[index]);
    const southPoints = this.latIndexes[southClosestKey].map((index) => this.simplifiedFigure[index]);

    console.log('north:', north, northClosestKey);
    console.log(northPoints);
    console.log('south:', south, southClosestKey);
    console.log(southPoints);

    const eastKeys = this.getClosestLngKeys(east);
    const {from: eastClosestKey} = this.getClosestKeys(east, eastKeys);
    const westKeys = this.getClosestLngKeys(west);
    const {to: westClosestKey} = this.getClosestKeys(west, westKeys);

    const eastPoints = this.lngIndexes[eastClosestKey].map((index) => this.simplifiedFigure[index]);
    const westPoints = this.lngIndexes[westClosestKey].map((index) => this.simplifiedFigure[index]);

    console.log('east:', east, eastClosestKey);
    console.log(eastPoints);
    console.log('west:', west, westClosestKey);
    console.log(westPoints);

    return [];
  }

  getClosestKeys(
    value: number,
    keys: number[],
  ): {from: number, to: number} {
    const min = keys[0];
    const max = keys[keys.length - 1];
    return keys.reduce((closests, key) => {
      if (key > value && key < closests.to) {
        closests.to = key;
      }

      if (key < value && key > closests.from) {
        closests.from = key;
      }

      return closests;
    }, {from: min, to: max});
  }

  getClosestLatKeys(lat: number): number[] {
    let latStr = lat + '';
    let keys: number[] | undefined;

    while (!keys) {
      keys = this.latKeysIndexation[latStr];

      if (!keys) {
        latStr = this.math.floorNumStrByOrder(latStr);
      }
    }

    return keys;
  }

  getClosestLngKeys(lng: number): number[] {
    let lngStr = lng + '';
    let keys: number[] | undefined;

    while (!keys) {
      keys = this.lngKeysIndexation[lngStr];

      if (!keys) {
        lngStr = this.math.floorNumStrByOrder(lngStr);
      }
    }

    return keys;
  }

  indexateKeys(keys: string[]): {[key: string]: number[]} {
    const indexation: {[key: string]: number[]} = keys.reduce((
      indexation: {[key: string]: number[]},
      key,
    ): {[key: string]: number[]} => {
      let keyIndex = key;
      while (true) {
        if (!indexation[keyIndex]) {
          indexation[keyIndex] = [];
        }

        indexation[keyIndex].push(+key);

        const newKeyIndex = this.math.floorNumStrByOrder(keyIndex);

        if (newKeyIndex === keyIndex) break;

        keyIndex = newKeyIndex;
      }

      return indexation;
    }, {});

    Object.keys(indexation).forEach((key) => {
      const indexes = indexation[key];
      const min = Math.min(...indexes);
      const max = Math.max(...indexes);

      const indexMin = keys.indexOf(min + '');
      const indexMax = keys.indexOf(max + '');

      const closestToMin = keys[indexMin - 1];
      const closestToMax = keys[indexMax + 1];

      if (closestToMin) {
        indexes.push(+closestToMin);
      }

      if (closestToMax) {
        indexes.push(+closestToMax);
      }

      indexes.sort((a, b) => a - b);
    });

    return indexation;
  }

  calcTileBounds(
    tileCoord: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
  ): {
    north: number,
    east: number,
    south: number,
    west: number,
  } {
    const bottomRightTile = {
      x: tileCoord.x + 1,
      y: tileCoord.y + 1,
    };
    const northWest = this.geography.mercToSpherMap({
      x: tileCoord.x / zoomCoofX,
      y: tileCoord.y / zoomCoofY,
    });
    const southEast = this.geography.mercToSpherMap({
      x: bottomRightTile.x / zoomCoofX,
      y: bottomRightTile.y / zoomCoofY,
    });

    return {
      north: northWest.lat,
      east: southEast.lng,
      south: southEast.lat,
      west: northWest.lng,
    };
  }

  checkPoint(
    figure: grider.GeoPoint[],
    distances: number[],
    index: number,
    segmentIndexes: number[],
    gridParams: grider.GridParams,
    isInner: boolean,
  ): boolean {
    const pointDistance = distances[index];

    let segment = segmentIndexes.map((index) => figure[index]);

    const lngs = segment.map(({lng}) => lng);
    const lngMin = Math.min(...lngs);
    const lngMax = Math.max(...lngs);
    const isRipped = lngMax - lngMin > 180;

    if (isRipped) {
      segment = segment.map(({lat, lng}) => ({
        lng: this.geography.reduceLng(lng - 180),
        lat,
      }));
    }

    const gridSegment = segment.map((point) => this.grider.calcGridPointByGeoPoint(point, gridParams));

    const pointsInRow = gridSegment.reduce((pointsInRow: number[][], pointA, indexA) => {
      return gridSegment.reduce((pointsInRow: number[][], pointB, indexB) => {
        if (indexA >= indexB) return pointsInRow;

        const startPoint = pointA;
        const endPoint = pointB;

        gridSegment.forEach((point, index) => {
          if (index === indexA || index === indexB) return;

          const testPoint = point;

          const diff = Math.round((
            (startPoint.i - testPoint.i) * (endPoint.j - testPoint.j) -
            (endPoint.i - testPoint.i) * (startPoint.j - testPoint.j)
          ) * 3);

          if (diff === 0) {
            pointsInRow.push(
              [indexA, indexB, index]
              .sort((a, b) => a - b)
              .map((index) => segmentIndexes[index]),
            );
          }
        });

        return pointsInRow;

      }, pointsInRow);
    }, []);

    let toBeAdded;

    if (pointsInRow.length === 0) {
      toBeAdded = true;
    } else if (pointsInRow.length > 1 && pointsInRow.every((row) => row.includes(index))) {
      const outOfRowIndexes = segmentIndexes.filter((index) => pointsInRow.every((row) => !row.includes(index)));

      if (outOfRowIndexes.length !== 1) return true;

      const isPointFurther = pointDistance < distances[outOfRowIndexes[0]];

      return isPointFurther === isInner;
    } else {
      toBeAdded = pointsInRow
        .reduce((toBeAdded: boolean, row): boolean => {
          if (toBeAdded) return toBeAdded;

          if (row.includes(index)) {
            return false;
          }

          const testPointIndex = row[1];
          const isPointFurther = pointDistance < distances[testPointIndex];

          return isPointFurther === isInner;
        }, false);
    }

    return toBeAdded;
  }

  simplifyFigure(
    figure: grider.GeoPoint[],
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    if (gridParams.type === 'rect') return figure;

    const len = figure.length;
    const isInner = this.geography.polyContainsPoint(shape, figure[0]);

    const distances = figure.map((point): number =>
      this.shapeUtils.reduceEachShapeSide<grider.GeoPoint, number>(shape,
        (minDistance, side): number => {
          const closestPoint = this.geography.closestPointOnSection(point, side);

          if (!closestPoint) return minDistance;

          const distance = this.geography.calcMercDistance(point, closestPoint);

          return Math.min(distance, minDistance);
        }, Infinity),
    );

    const simplified = figure.reduce((result: grider.GeoPoint[], point, index) => {
      const prevIndex3: number = index - 3 < 0 ? index - 5 + len : index - 3;
      const prevIndex2: number = index - 2 < 0 ? index - 4 + len : index - 2;
      const prevIndex: number = index - 1 < 0 ? len - 2 : index - 1;

      const nextIndex: number = index + 1 > len - 1 ? 1 : index + 1;
      const nextIndex2: number = (index + 2) > (len - 1) ? index + 3 - len : index + 2;
      const nextIndex3: number = (index + 3) > (len - 1) ? index + 4 - len : index + 3;

      const segmentIndexes = [
        prevIndex2,
        prevIndex,
        index,
        nextIndex,
        nextIndex2,
        nextIndex3,
      ];

      let toBeAdded = this.checkPoint(figure, distances, index, segmentIndexes, gridParams, isInner);

      if (!toBeAdded) {
        const segmentIndexesEnsure = [
          nextIndex2,
          nextIndex,
          index,
          prevIndex,
          prevIndex2,
          prevIndex3,
        ];

        toBeAdded = this.checkPoint(figure, distances, index, segmentIndexesEnsure, gridParams, isInner);
      }

      if (toBeAdded) {
        result.push(point);
      }

      return result;
    }, []);

    const simpleLen = simplified.length;
    const simplifiedGrid = simplified.map((point) => this.grider.calcGridPointByGeoPoint(point, gridParams));

    const cleared = simplifiedGrid.reduce((
      cleared: grider.GeoPoint[],
      point,
      index,
    ): grider.GeoPoint[] => {
      const prevIndex = index === 0 ? simpleLen - 2 : index - 1;
      const nextIndex = index + 1 === simpleLen ? 1 : index + 1;
      const prevPoint = simplifiedGrid[prevIndex];
      const nextPoint = simplifiedGrid[nextIndex];

      const diff = Math.round((
        (prevPoint.i - point.i) * (nextPoint.j - point.j) -
        (nextPoint.i - point.i) * (prevPoint.j - point.j)
      ) * 3);

      if (diff !== 0) {
        cleared.push(simplified[index]);
      }

      return cleared;
    }, []);

    const clearedLen = cleared.length;

    if (!isEqual(cleared[0], cleared[clearedLen - 1])) {
      cleared.push(cleared[0]);
    }

    this.indexateFigure(cleared);

    return cleared;
  }

  indexateFigure(
    figure: grider.GeoPoint[],
  ): {
    lngIndexes: {[key: string]: number[]},
    latIndexes: {[key: string]: number[]},
    lngKeysIndexation: {[key: string]: number[]},
    latKeysIndexation: {[key: string]: number[]},
  } {
    const lngIndexes: {[key: string]: number[]} = {};
    const latIndexes: {[key: string]: number[]} = {};

    figure.forEach(({lng, lat}, index) => {
      if (!lngIndexes[lng]) {
        lngIndexes[lng] = [];
      }
      if (!latIndexes[lat]) {
        latIndexes[lat] = [];
      }

      lngIndexes[lng].push(index);
      latIndexes[lat].push(index);
    }, {});

    const lngKeysIndexation = this.indexateKeys(Object.keys(lngIndexes).sort((a, b) => +a - +b));
    const latKeysIndexation = this.indexateKeys(Object.keys(latIndexes).sort((a, b) => +a - +b));

    return {
      lngIndexes,
      latIndexes,
      lngKeysIndexation,
      latKeysIndexation,
    };
  }
}
