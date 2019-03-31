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
