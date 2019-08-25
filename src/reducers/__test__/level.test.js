import { SELECT_LEVEL } from '../../actions/types';
import level from '../level';

describe('returns the new level set',() => {

    it('returns the new level set',() => {
        const action = {
            type:SELECT_LEVEL,
            payload:5
        }

        let res = level({},action);

        expect(res).toEqual(5);


    })


})