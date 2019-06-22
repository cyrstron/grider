import {Point} from '../points/point';

interface DefaultSegment<PointType = Point> {
	pointA: PointType;
	pointB: PointType;
}

export class GenericPolygon<PointType = Point> {
	constructor(
		public points: PointType[],
	) {}

	sideByIndex(index: number): DefaultSegment<PointType> {
		return {
			pointA: this.points[index],
			pointB: this.nextPointByIndex(index)
		};
	}

	nextPointByIndex(index: number): PointType {
		const {length} = this.points;

		const nextIndex = index === length - 1 ? 0 : index + 1;

		return this.points[nextIndex];
	}

	prevPointByIndex(index: number): PointType {
		const {length} = this.points;

		const prevIndex = index === 0 ? length - 1 : index - 1;

		return this.points[prevIndex];
	}

	forEachSide(
		callback: (side: DefaultSegment<PointType>, index: number) => void
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
		callback: (side: DefaultSegment<PointType>, index: number) => ReturnedValue
	): ReturnedValue[] {
    return this.points.map((
      _point: PointType,
      index: number,
    ) => {
			const side = this.sideByIndex(index);

      return callback(side, index);
    });
	}

	reduceSides<ReturnedValue = DefaultSegment<PointType>>(
		callback: (
			prevValue: ReturnedValue, 
			currValue: DefaultSegment<PointType>, 
			currIndex: number
		) => ReturnedValue,
		initValue: ReturnedValue
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
		callback: (sideA: DefaultSegment<PointType>, sideB: DefaultSegment<PointType>) => void
	): void {
    this.forEachSide((sideA, indexA) => {
      this.forEachSide((sideB, indexB) => {
        if (indexB <= indexA) return;

        callback(sideA, sideB);
      });
    });
	}

	reduceSidesPairs<ReturnedValue = DefaultSegment<PointType>>(
		callback: (
			prevValue: ReturnedValue, 
			sideA: DefaultSegment<PointType>, 
			sideB: DefaultSegment<PointType>
		) => ReturnedValue,
		initValue: ReturnedValue
	): ReturnedValue {
    return this.reduceSides((initValue, sideA, indexA) => {
      return this.reduceSides((initValue, sideB, indexB) => {
        if (indexB <= indexA) return initValue;

        return callback(initValue, sideA, sideB);
      }, initValue);
    }, initValue);
	}

	reduceOppositeSidesPairs<ReturnedValue = DefaultSegment<PointType>>(
		callback: (
			prevValue: ReturnedValue, 
			sideA: DefaultSegment<PointType>, 
			sideB: DefaultSegment<PointType>
		) => ReturnedValue,
		initValue: ReturnedValue
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