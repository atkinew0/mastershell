import { SCORE } from '../actions/types';

const INITIAL_STATE = {
    score:0
}

export default function(state = INITIAL_STATE, action){

    switch(action.type){

        case SCORE:
            return {...state, score: Math.max(0, action.payload)}

        default:
            return state;
    }



}