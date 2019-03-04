import {SCORE} from './types';


export const setScore = (score) => {


    return{
        type:SCORE,
        payload:score
    }

}