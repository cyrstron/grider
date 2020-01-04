import { Point } from '../points/point';
interface DefaultSegment<PointType = Point> {
    pointA: PointType;
    pointB: PointType;
    intersectionPoint(segment: DefaultSegment<PointType>): PointType | undefined;
}
interface DefaultPoint<PointType = Point> {
    isEqual(point: DefaultPoint<PointType>): boolean;
}
export declare class GenericPolygon<PointType extends DefaultPoint<PointType> = Point, SegmentType extends DefaultSegment<PointType> = DefaultSegment<PointType>> {
    points: PointType[];
    constructor(points: PointType[]);
    intersectsPoly(poly: GenericPolygon<PointType, SegmentType>): PointType[];
    intersectsSegment(segment: DefaultSegment<PointType>): boolean;
    intersectsWithSegment(segment: DefaultSegment<PointType>): PointType[];
    readonly selfIntersections: PointType[];
    sideByIndex(index: number): SegmentType;
    sideByIndexInversed(index: number): SegmentType;
    nextIndex(index: number): number;
    prevIndex(index: number): number;
    nextPointByIndex(index: number): PointType;
    prevPointByIndex(index: number): PointType;
    forEachSide(callback: (side: SegmentType, index: number) => void): void;
    mapSides<ReturnedValue>(callback: (side: SegmentType, index: number) => ReturnedValue): ReturnedValue[];
    reduceSides<ReturnedValue = SegmentType>(callback: (prevValue: ReturnedValue, currValue: SegmentType, currIndex: number) => ReturnedValue, initValue: ReturnedValue): ReturnedValue;
    forEachSidesPair(callback: (sideA: SegmentType, sideB: SegmentType) => void): void;
    reduceSidesPairs<ReturnedValue = SegmentType>(callback: (prevValue: ReturnedValue, sideA: SegmentType, sideB: SegmentType) => ReturnedValue, initValue: ReturnedValue): ReturnedValue;
    reduceNeighboringSidesPairs<ReturnedValue = SegmentType>(callback: (prevValue: ReturnedValue, prevSide: SegmentType, nextSide: SegmentType) => ReturnedValue, initValue: ReturnedValue): ReturnedValue;
    reduceOppositeSidesPairs<ReturnedValue = SegmentType>(callback: (prevValue: ReturnedValue, sideA: SegmentType, sideB: SegmentType) => ReturnedValue, initValue: ReturnedValue): ReturnedValue;
}
export {};
