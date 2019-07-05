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



}
