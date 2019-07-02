import isEqual from 'lodash/isEqual';
import { Grider } from '../grider';
import { GeographyUtils, MathUtils, ShapeUtils } from '../utils';

interface Indexation {
  isRipped: boolean;
  east: number;
  west: number;
  north: number;
  south: number;
  lngIndexes: {[key: string]: number[]};
  latIndexes: {[key: string]: number[]};
  lngKeysIndexation: {[key: string]: number[]};
  latKeysIndexation: {[key: string]: number[]};
}

interface ClosestConfig {
  intersect: grider.GeoPoint;
  from: number;
  to: number;
}

interface TileClosestConfig {
  east: ClosestConfig[];
  west: ClosestConfig[];
  north: ClosestConfig[];
  south: ClosestConfig[];
  [key: string]: ClosestConfig[];
}

export class BorderRenderer {
  simplifiedFigure: grider.GeoPoint[];
  indexations: Indexation[];

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

    console.log(this.simplifiedFigure.length);

    const distributedPoints = this.dispersePoints();

    this.indexations = distributedPoints.reduce((
      indexation: Indexation[],
      points,
    ): Indexation[] => {
      const pointIndexation = this.indexatePoints(points);
      indexation.push(pointIndexation);

      return indexation;
    }, []);

    console.log(this.indexations);
  }

  getIntersectedBorder(tileBounds: {
    north: number,
    east: number,
    south: number,
    west: number,
  }) {
    console.log('BOUNDS!');
    const tileConfig = this.indexations.reduce((
      result: TileClosestConfig,
      indexation,
    ): TileClosestConfig => {
      const config = this.getIntersectsWithSide(tileBounds, indexation);

      Object.keys(result).forEach((key) => {
        result[key] = [...result[key], ...config[key]];
      });

      return result;
    }, {
      east: [],
      west: [],
      north: [],
      south: [],
    });

    const tileConfigKeys = Object.keys(tileConfig);

    if (tileConfigKeys.every((key) => tileConfig[key].length === 0)) return [];

    tileConfigKeys.forEach((key) => {
      const isLat = key === 'north' || key === 'south';
      if (isLat) {
        tileConfig[key].sort((
          {intersect: {lat: latA}},
          {intersect: {lat: latB}}
        ) => latA - latB);
      } else {        
        tileConfig[key].sort((
          {intersect: {lng: lngA}},
          {intersect: {lng: lngB}}
        ) => {  
          const isRipped = Math.max(lngA, lngB) - Math.min(lngA, lngB) > 180;
  
          return isRipped ? lngB - lngA : lngA - lngB;            
        });
      }      
    });

    const tilePositions: Array<'included' | 'intersected' | 'excluded'> = tileConfigKeys.map((
      key
    ): 'included' | 'intersected' | 'excluded' => {
      const isLat = key === 'north' || key === 'south';
      const sidePosition = tileConfig[key].reduce((
        sidePosition: 'included' | 'intersected' | 'excluded', 
        closests, 
        index
        ): 'included' | 'intersected' | 'excluded' => {
          let minKey = isLat ? 'west' : 'south';
          let maxKey = isLat ? 'east' : 'north';

          return sidePosition;
        }, 'excluded');

        return sidePosition;
    })

    


    console.log(tileConfig);
  }

  getIntersectsWithSide(
    bounds: {
      north: number,
      east: number,
      south: number,
      west: number,
      [key: string]: number,
    },
    indexation: Indexation,
  ): TileClosestConfig {
    const {
      north,
      east,
      south,
      west,
    } = bounds;

    const tileConfig: TileClosestConfig = {
      east: [],
      west: [],
      north: [],
      south: [],
    };

    // if ((
    //   south > indexation.north
    // ) || (
    //   north < indexation.south
    // ) || (
    //   !indexation.isRipped && (east < indexation.west)
    // ) || (
    //   !indexation.isRipped && (west > indexation.east)
    // ) || (
    //   indexation.isRipped && east < indexation.west && west > indexation.east
    // )) {
    //   return tileConfig;
    // }

    Object.keys(bounds).forEach((key) => {
      const isLat = key === 'south' || key === 'north';

      const keys = isLat ?
        this.getClosestLatKeys(bounds[key], indexation) :
        this.getClosestLngKeys(bounds[key], indexation);
      
      if (!keys) return;

      const closests = this.getClosestKeys(bounds[key], keys);

      if (!closests) return;

      let lat: number | undefined;
      let lng: number | undefined;

      if (isLat) {
        lat = bounds[key];
      } else {
        lng = bounds[key];
      }

      const indexes = isLat ? indexation.latIndexes : indexation.lngIndexes;

      const toIndexes = indexes[closests.to];
      const fromIndexes = indexes[closests.from];

      if (toIndexes.length === 1 && fromIndexes.length === 1) {
        const [fromIndex] = fromIndexes;
        const [toIndex] = toIndexes;
        
        const config = this.calcClosestConfig(fromIndex, toIndex, lat, lng);

        if (config) {
          tileConfig[key] = [config];
        }

        return;
      }
      const toMin = Math.min(...toIndexes);
      const toMax = Math.max(...toIndexes);
      const fromMin = Math.min(...fromIndexes);
      const fromMax = Math.max(...fromIndexes);

      let resultClosest: {from: number, to: number} | undefined;

      if (Math.abs(toMin - fromMax)) {
        resultClosest = {
          to: toMin,
          from: fromMax,
        };
      } else if (Math.abs(toMax - fromMin)) {
        resultClosest = {
          to: toMax,
          from: fromMin,
        };
      } else {
        resultClosest = Math.abs(toMax - fromMin) > Math.abs(toMin - fromMax) ? {
          to: toMax,
          from: fromMin,
        } : {
          to: toMin,
          from: fromMax,
        };
      }

      const closestConfig = this.calcClosestConfig(resultClosest.from, resultClosest.to, lat, lng);

      if (closestConfig) {
        tileConfig[key] = [closestConfig];
      }

    });

    return tileConfig;
  }

  calcClosestConfig(
    fromIndex: number, 
    toIndex: number, 
    lat?:number, 
    lng?: number,
  ): ClosestConfig | undefined{
    if (lat == undefined && lng == undefined) return;

    const loxPoints: [grider.GeoPoint, grider.GeoPoint] = [
      this.simplifiedFigure[fromIndex],
      this.simplifiedFigure[toIndex],
    ];

    const resultLat = lat !== undefined ? 
      lat : 
      this.geography.calcLatByLngOnLox(lng as number, loxPoints);
    const resultLng = lng !== undefined ? 
      lng : 
      this.geography.calcLngByLatOnLox(lat as number, loxPoints);

      
    if (resultLat == undefined || resultLng == undefined) return;

    return {
      from: fromIndex,
      to: toIndex,
      intersect: {
        lat: resultLat,
        lng: resultLng
      }
    }
  }

  getClosestKeys(
    value: number,
    keys: number[],
  ): {from: number, to: number} | undefined {
    const min = keys[0];
    const max = keys[keys.length - 1];

    if (value < min || value > max) return;

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

  getClosestLatKeys(
    lat: number,
    indexation: Indexation,
  ): number[] | undefined {
    let latStr = lat + '';
    let keys: number[] | undefined;

    while (true) {
      keys = indexation.latKeysIndexation[latStr];

      if (keys) break;

      const nextStr = this.math.floorNumStrByOrder(latStr);

      if (nextStr === latStr) break;

      latStr = nextStr;
    }

    return keys;
  }

  getClosestLngKeys(
    lng: number,
    indexation: Indexation,
  ): number[] | undefined {
    let lngStr = lng + '';
    let keys: number[] | undefined;

    while (!keys) {
      keys = indexation.lngKeysIndexation[lngStr];

      if (keys) break;

      const nextStr = this.math.floorNumStrByOrder(lngStr);

      if (nextStr === lngStr) break;

      lngStr = nextStr;
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


  //done 
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

  //done
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

    return cleared;
  }

  dispersePoints(): Array<Array<{point: grider.GeoPoint, index: number}>> {
    const pointsBySide = this.simplifiedFigure.slice(0, -1)
      .reduce((
        pointsBySide: Array<Array<{point: grider.GeoPoint, index: number}>>,
        point,
        pointIndex,
        figure,
      ): Array<Array<{point: grider.GeoPoint, index: number}>> => {

        const points = pointsBySide[pointsBySide.length - 1];

        if (!points) {
          const lastPointIndex = figure.length - 1;
          const lastPoint = figure[lastPointIndex];

          return [[{
            index: lastPointIndex,
            point: lastPoint,
          }, {
            point,
            index: pointIndex,
          }]];
        }

        const {lat, lng} = point;
        const {
          point: {lat: firstLat, lng: firstLng},
        } = points[0];
        const {
          point: {lat: lastLat, lng: lastLng},
        } = points[points.length - 1];

        const latIsOK = lastLat > firstLat ? lat >= lastLat : lat <= lastLat;

        const isRipped = Math.max(firstLng, lastLng) - Math.min(firstLng, lastLng) > 180;
        const isNextRipped = Math.max(lng, lastLng) - Math.min(lng, lastLng) > 180;

        let lngIsOK = false;

        if (isRipped || isNextRipped) {
          lngIsOK = lastLng > firstLng ? lng <= lastLng : lng >= lastLng;
        } else {
          lngIsOK = lastLng > firstLng ? lng >= lastLng : lng <= lastLng;
        }

        if (latIsOK && lngIsOK) {
          points.push({
            index: pointIndex,
            point,
          });
        } else {
          pointsBySide.push([
            points[points.length - 1],
            {
              index: pointIndex,
              point,
            },
          ]);
        }

        return pointsBySide;

      }, []);

    return pointsBySide;
  }

  indexatePoints(
    points: Array<{index: number, point: grider.GeoPoint}>,
  ): Indexation {
    const lngIndexes: {[key: string]: number[]} = {};
    const latIndexes: {[key: string]: number[]} = {};

    points.forEach(({point: {lat, lng}, index}) => {
      if (!lngIndexes[lng]) {
        lngIndexes[lng] = [];
      }
      if (!latIndexes[lat]) {
        latIndexes[lat] = [];
      }

      lngIndexes[lng].push(index);
      latIndexes[lat].push(index);
    }, {});

    const lngKeys = Object.keys(lngIndexes).sort((a, b) => +a - +b);
    const latKeys = Object.keys(latIndexes).sort((a, b) => +a - +b);

    const lngKeysIndexation = this.indexateKeys(lngKeys);
    const latKeysIndexation = this.indexateKeys(latKeys);

    const south = +latKeys[0];
    const north = +latKeys[latKeys.length - 1];

    const minLng = +lngKeys[0];
    const maxLng = +lngKeys[lngKeys.length - 1];
    const isRipped = maxLng - minLng > 180;
    const east = isRipped ? minLng : maxLng;
    const west = isRipped ? maxLng : minLng;

    return {
      isRipped,
      south,
      north,
      east,
      west,
      lngIndexes,
      latIndexes,
      lngKeysIndexation,
      latKeysIndexation,
    };
  }
}
