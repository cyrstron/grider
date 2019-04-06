import isEqual from 'lodash/isEqual';

export class FigureCleaner {
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
        let indexValue = indexes[key];

        if (!Array.isArray(indexValue)) return repeatedPointIndexes;

        if (indexValue.length > 2) {
          indexValue = this.pickIndexes(indexValue, figure.length);
        }

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
    ]
      .sort((a, b) => a - b)
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

    const circumsizedFigure = sliceIndexes.reduce((
      cleanedFigure: grider.GeoPoint[],
      [sliceStart, sliceEnd]: [number, number],
    ) => [...cleanedFigure, ...figure.slice(sliceStart, sliceEnd)], []);

    if (!isEqual(circumsizedFigure[0], circumsizedFigure[circumsizedFigure.length - 1])) {
      circumsizedFigure.push(circumsizedFigure[0]);
    }

    const cleanedFigure = this.removeRedundantPoints(circumsizedFigure);

    return cleanedFigure;
  }

  pickIndexes(indexes: number[], figureLength: number) {
    const picked = indexes.reduce((
      result: [number, number],
      indexValue,
      index,
    ): [number, number] => {
      const nextIndexValue = indexes[index + 1] || indexes[0];

      const resultMax = Math.max(result[0], result[1]);
      const resultMin = Math.min(result[0], result[1]);

      const resultDelta = Math.min(resultMax - resultMin, figureLength + resultMin - resultMax);

      const maxIndex = Math.max(indexValue, nextIndexValue);
      const minIndex = Math.min(indexValue, nextIndexValue);

      const indexDelta = Math.min(maxIndex - minIndex, figureLength + minIndex - maxIndex);

      return resultDelta > indexDelta ? result : [indexValue, nextIndexValue];
    }, [indexes[0], indexes[1]]);

    return picked;
  }

  removeRedundantPoints(figure: grider.GeoPoint[]): grider.GeoPoint[] {
    return figure.filter((point, index) => {
      const prevPoint: grider.GeoPoint | undefined = figure[index - 1];
      const nextPoint: grider.GeoPoint | undefined  = figure[index + 1];

      if (!prevPoint || !nextPoint) return true;

      const arePointsAlike = [
        point.lat === prevPoint.lat || point.lng === prevPoint.lng,
        point.lat === nextPoint.lat || point.lng === nextPoint.lng,
        nextPoint.lat === prevPoint.lat || nextPoint.lng === prevPoint.lng,
      ];

      return !arePointsAlike.every((areAlike) => areAlike);
    });
  }
}
