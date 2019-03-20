import { GriderUtils } from '../../utils';
import { Corrector } from './corrector';
import { MercatorCorrector } from './mercator.corrector';
import { NoneCorrector } from './none.corrector';

export const createCorrector = (utils: GriderUtils): Corrector => {
   const none = new NoneCorrector(utils);
   const merc = new MercatorCorrector(utils);

   return new Corrector({
    none,
    merc,
   });
 };

export {
  Corrector,
  NoneCorrector,
  MercatorCorrector,
};
