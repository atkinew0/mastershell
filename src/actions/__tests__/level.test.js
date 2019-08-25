import { SELECT_LEVEL } from '../types';
import { selectLevel } from '../level';
describe('setLevel',() => {

 it('should set the level',() => {
     const level = 5;

     const res = selectLevel(5);
     const expectation = {
         type:SELECT_LEVEL,
         payload:5
     }

     expect(res).toEqual(expectation);

 })

})