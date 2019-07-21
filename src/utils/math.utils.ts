export function floorNumStrByOrder(str: string): string {
  const strLen = str.length;

  if (str.split('').every((dig) => dig === '0')) {
    return str;
  } else if (str.lastIndexOf('.') === strLen - 2) {
    return Math.floor(+str) + '';
  } else if (str.indexOf('.') !== -1) {
    return str.slice(0, -1);
  } else if (str.indexOf('0') === -1) {
    return str.slice(0, -1) + '0';
  } else {
    const zeroIndex = str.lastIndexOf('0');

    return str.slice(0, zeroIndex - 1) + '0'.repeat(strLen - zeroIndex + 1);
  }
}

export function calcClosestMultiple(divider: number, dividend: number): number {
  let ascDivider: number = divider;
  let descDivider: number = divider;

  while (
    !(dividend % ascDivider === 0) &&
    !(dividend % descDivider === 0)
  ) {
    ascDivider += 1;
    descDivider -= 1;
  }

  const result: number = dividend % ascDivider === 0 ?
    ascDivider :
    descDivider;

  return result;
}

export function cosDeg(deg: number): number {
  const rad: number = degToRad(deg);
  const result: number = Math.cos(rad);

  return result;
}

export function sinDeg(deg: number): number {
  const rad: number = degToRad(deg);
  const result: number = Math.sin(rad);

  return result;
}

export function findPrimeFactors(value: number): number[] {
  if (value < 2) return [];

  let tempValue: number = value;
  let checker: number = 2;
  const result: number[] = [];

  while (checker * checker <= tempValue) {
    if (tempValue % checker === 0) {
      result.push(checker);
      tempValue /= checker;
    } else {
      checker += 1;
    }
  }

  if (tempValue !== 1) {
    result.push(tempValue);
  }

  return result;
}

export function degToRad(deg: number): number {
  return deg * Math.PI / 180;
}

export function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

export function decRemain(value: number): number {
  return value - Math.floor(value);
}
