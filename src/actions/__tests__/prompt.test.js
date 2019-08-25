import { CORRECT_ANSWER, WRONG_ANSWER, NEUTRAL,SET} from '../types.js';
import { flashCorrect, setPrompt } from '../prompt.js';

describe('set the prompt until changed', () => {

    it('sets the prompt until changed',() => {

        let res = setPrompt('message test');

        const expectation = {
            type:SET,
            payload:"message test"
        }

        expect(res).toEqual(expectation);

    })

});

