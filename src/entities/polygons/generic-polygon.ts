import {Point} from '../points/point';

interface DefaultSegment<PointType = Point> {
  pointA: PointType;
  pointB: PointType;
  intersectionPoint(segment: DefaultSegment<PointType>): PointType | undefined;
}

interface DefaultPoint<PointType = Point> {
  isEqual(point: DefaultPoint<PointType>): boolean;
}

export class GenericPolygon<
  PointType extends DefaultPoint<PointType> = Point,
  SegmentType extends DefaultSegment<PointType> = DefaultSegment<PointType>,
> {
  constructor(
    public points: PointType[],
  ) {}

  intersectsPoly(poly: GenericPolygon<PointType, SegmentType>): PointType[] {
    return this.reduceSides((intersects, sideA, indexA) => {
      return poly.reduceSides((intersects, sideB, indexB) => {
        const intersect = sideA.intersectionPoint(sideB);

        if (intersect) {
          intersects.push(intersect);
        }

        return intersects;
      }, intersects);
    }, [] as PointType[]);
  }

  intersectsSegment(segment: DefaultSegment<PointType>): boolean {
    return this.reduceSides((
      isIntersects: boolean,
      side,
    ): boolean => {
      if (isIntersects) return true;

      return !!side.intersectionPoint(segment);
    }, false);
  }

  intersectsWithSegment(segment: DefaultSegment<PointType>): PointType[] {
    return this.reduceSides<PointType[]>((
      intersects,
      side,
    ) => {
      const intersect = side.intersectionPoint(segment);

      if (intersect) {
        intersects.push(intersect);
      }

      return intersects;
    }, []);
  }

  get selfIntersections(): PointType[] {
    return this.reduceOppositeSidesPairs<PointType[]>((
      intersects,
      sideA,
      sideB,
    ) => {
      const intersect = sideA.intersectionPoint(sideB);

      if (intersect) {
        intersects.push(intersect);
      }

      return intersects;
    }, []);
  }

  sideByIndex(index: number): SegmentType {
    return {
      pointA: this.points[index],
      pointB: this.nextPointByIndex(index),
    } as SegmentType;
  }

  sideByIndexInversed(index: number): SegmentType {
    return {
      pointA: this.points[index],
      pointB: this.prevPointByIndex(index),
    } as SegmentType;
  }

  nextIndex(index: number) {
    return index === this.points.length - 1 ? 0 : index + 1;
  }

  prevIndex(index: number) {
    const {length} = this.points;

    return index === 0 ? length - 1 : index - 1;
  }

  nextPointByIndex(index: number): PointType {
    const nextIndex = this.nextIndex(index);

    return this.points[nextIndex];
  }

  prevPointByIndex(index: number): PointType {
    const prevIndex = this.prevIndex(index);

    return this.points[prevIndex];
  }

  forEachSide(
    callback: (side: SegmentType, index: number) => void,
  ): void {
    this.points.forEach((
      _point: PointType,
      index: number,
    ) => {
      const side = this.sideByIndex(index);

      callback(side, index);
    });
  }

  mapSides<ReturnedValue>(
    callback: (side: SegmentType, index: number) => ReturnedValue,
  ): ReturnedValue[] {
    return this.points.map((
      _point: PointType,
      index: number,
    ) => {
      const side = this.sideByIndex(index);

      return callback(side, index);
    });
  }

  reduceSides<ReturnedValue = SegmentType>(
    callback: (
      prevValue: ReturnedValue,
      currValue: SegmentType,
      currIndex: number,
    ) => ReturnedValue,
    initValue: ReturnedValue,
  ): ReturnedValue {
    return this.points.reduce((
      result: ReturnedValue,
      _point: PointType,
      index: number,
    ): ReturnedValue => {
      const side = this.sideByIndex(index);

      return callback(result, side, index);
    }, initValue);
  }

  forEachSidesPair(
    callback: (sideA: SegmentType, sideB: SegmentType) => void,
  ): void {
    this.forEachSide((sideA, indexA) => {
      this.forEachSide((sideB, indexB) => {
        if (indexB <= indexA) return;

        callback(sideA, sideB);
      });
    });
  }

  reduceSidesPairs<ReturnedValue = SegmentType>(
    callback: (
      prevValue: ReturnedValue,
      sideA: SegmentType,
      sideB: SegmentType,
    ) => ReturnedValue,
    initValue: ReturnedValue,
  ): ReturnedValue {
    return this.reduceSides((initValue, sideA, indexA) => {
      return this.reduceSides((initValue, sideB, indexB) => {
        if (indexB <= indexA) return initValue;

        return callback(initValue, sideA, sideB);
      }, initValue);
    }, initValue);
  }

  reduceNeighboringSidesPairs<ReturnedValue = SegmentType>(
    callback: (
      prevValue: ReturnedValue,
      prevSide: SegmentType,
      nextSide: SegmentType,
    ) => ReturnedValue,
    initValue: ReturnedValue,
  ) {
    return this.points.reduce((
      initValue,
      _point,
      index,
    ): ReturnedValue => {
      const prevSide = this.sideByIndexInversed(index);
      const nextSide = this.sideByIndex(index);

      return callback(initValue, prevSide, nextSide);
    }, initValue);
  }

  reduceOppositeSidesPairs<ReturnedValue = SegmentType>(
    callback: (
      prevValue: ReturnedValue,
      sideA: SegmentType,
      sideB: SegmentType,
    ) => ReturnedValue,
    initValue: ReturnedValue,
  ): ReturnedValue {
    const lastIndex = this.points.length - 1;

    return this.reduceSides((initValue, sideA, indexA) => {
      return this.reduceSides((initValue, sideB, indexB) => {
        if (
          (indexA === 0 && indexB === lastIndex) ||
          indexB - 1 <= indexA
        ) return initValue;

        return callback(initValue, sideA, sideB);
      }, initValue);
    }, initValue);
  }
}
