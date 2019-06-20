import {GeometryUtils} from './geometry.utils';
import {MathUtils} from './math.utils';

export class ShapeUtils {
  constructor(
    public math: MathUtils,
    public geometry: GeometryUtils,
  ) {}

  // done
  forEachShapeSide<PointType>(
    shape: PointType[],
    callback: (side: [PointType, PointType], index: number) => void,
  ): void {
    shape.forEach((
      _point: PointType,
      index: number,
    ) => {
      const side = this.sideByIndex<PointType>(shape, index);
      callback(side, index);
    });
  }

  // done
  mapEachShapeSide<PointType, ReturnedValue>(
    shape: PointType[],
    callback: (side: [PointType, PointType], index: number) => ReturnedValue,
  ): ReturnedValue[] {
    return shape.map((
      _point: PointType,
      index: number,
    ) => {
      const side = this.sideByIndex<PointType>(shape, index);
      return callback(side, index);
    });
  }

  //done
  reduceEachShapeSide<PointType, ReturnedValue>(
    shape: PointType[],
    callback: (result: ReturnedValue, side: [PointType, PointType], index: number) => ReturnedValue,
    initialValue: ReturnedValue,
  ): ReturnedValue {
    return shape.reduce((
      result: ReturnedValue,
      _point: PointType,
      index: number,
    ): ReturnedValue => {
      const side = this.sideByIndex<PointType>(shape, index);

      return callback(result, side, index);
    }, initialValue);
  }

  //done
  forEachShapeSidePair<PointType>(
    shape: PointType[],
    callback: (
      sideA: [PointType, PointType],
      sideB: [PointType, PointType],
    ) => void,
  ): void {
    this.forEachShapeSide(shape, (sideA, indexA) => {
      this.forEachShapeSide(shape, (sideB, indexB) => {
        if (indexB <= indexA) return;

        callback(sideA, sideB);
      });
    });
  }

  //done
  reduceShapeSidePair<PointType, ReturnedValue>(
    shape: PointType[],
    callback: (
      result: ReturnedValue,
      sideA: [PointType, PointType],
      sideB: [PointType, PointType],
    ) => ReturnedValue,
    initialValue: ReturnedValue,
  ): ReturnedValue {
    return this.reduceEachShapeSide(shape, (initialValue, sideA, indexA) => {
      return this.reduceEachShapeSide(shape, (initialValue, sideB, indexB) => {
        if (indexB <= indexA) return initialValue;

        return callback(initialValue, sideA, sideB);
      }, initialValue);
    }, initialValue);
  }

  // done
  reduceShapeOppositeSides<PointType, ReturnedValue>(
    shape: PointType[],
    callback: (
      result: ReturnedValue,
      sideA: [PointType, PointType],
      sideB: [PointType, PointType],
    ) => ReturnedValue,
    initialValue: ReturnedValue,
  ): ReturnedValue {
    const lastIndex = shape.length - 1;

    return this.reduceEachShapeSide(shape, (initialValue, sideA, indexA) => {
      return this.reduceEachShapeSide(shape, (initialValue, sideB, indexB) => {
        if (
          (indexA === 0 && indexB === lastIndex) ||
          indexB - 1 <= indexA
        ) return initialValue;

        return callback(initialValue, sideA, sideB);
      }, initialValue);
    }, initialValue);
  }

  // done
  sideByIndex<PointType>(
    shape: PointType[],
    index: number,
  ): [PointType, PointType] {
    return [
      shape[index],
      shape[index + 1] || shape[0],
    ];
  }

  // done
  getPrevPoint<Item>(shape: Item[], index: number): Item {
    return shape[index - 1] || shape[shape.length - 1];
  }

  // done
  getNextPoint<Item>(shape: Item[], index: number): Item {
    return shape[index + 1] || shape[0];
  }
}
