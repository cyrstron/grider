import {floorNumStrByOrder} from '../../../../../../../utils/math.utils';

export function indexateKeys(keys: string[]): {[key: string]: number[]} {
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

      const newKeyIndex = floorNumStrByOrder(keyIndex);

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
