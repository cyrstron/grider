import {Point} from '../points/point';
import {Segment} from '../segments/segment'

export class Polyline {
	constructor(
		public points: Point[],
	) {}

	sideByIndex(index: number): Segment {
		return new Segment(
			this.points[index],
			this.nextPointByIndex(index)
		);
	}

	nextPointByIndex(index: number): Point {
		const {length} = this.points;

		const nextIndex = index === length - 1 ? 0 : index + 1;

		return this.points[nextIndex];
	}

	prevPointByIndex(index: number): Point {
		const {length} = this.points;

		const prevIndex = index === 0 ? length - 1 : index - 1;

		return this.points[prevIndex];
	}

	forEachSide(
		callback: (side: Segment, index: number) => void
	): void {
		this.points.forEach((
			_point: Point,
			index: number,
		) => {
			const side = this.sideByIndex(index);

			callback(side, index);
		});
	}

	mapSides<ReturnedValue>(
		callback: (side: Segment, index: number) => ReturnedValue
	): ReturnedValue[] {
    return this.points.map((
      _point: Point,
      index: number,
    ) => {
			const side = this.sideByIndex(index);

      return callback(side, index);
    });
	}

	reduceSides<ReturnedValue>(
		callback: (prevValue: ReturnedValue, currValue: Segment, currIndex: number) => ReturnedValue,
		initValue: ReturnedValue
	): ReturnedValue {
    return this.points.reduce((
      result: ReturnedValue,
      _point: Point,
      index: number,
    ): ReturnedValue => {
			const side = this.sideByIndex(index);

      return callback(result, side, index);
    }, initValue);
	}

	forEachSidesPair(
		callback: (sideA: Segment, sideB: Segment) => void
	): void {
    this.forEachSide((sideA, indexA) => {
      this.forEachSide((sideB, indexB) => {
        if (indexB <= indexA) return;

        callback(sideA, sideB);
      });
    });
	}

	reduceSidesPairs<ReturnedValue>(
		callback: (prevValue: ReturnedValue, sideA: Segment, sideB: Segment) => ReturnedValue,
		initValue: ReturnedValue
	): ReturnedValue {
    return this.reduceSides((initValue, sideA, indexA) => {
      return this.reduceSides((initValue, sideB, indexB) => {
        if (indexB <= indexA) return initValue;

        return callback(initValue, sideA, sideB);
      }, initValue);
    }, initValue);
	}

	reduceOppositeSidesPairs<ReturnedValue>(
		callback: (prevValue: ReturnedValue, sideA: Segment, sideB: Segment) => ReturnedValue,
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