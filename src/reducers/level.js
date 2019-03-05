import {SELECT_LEVEL} from '../actions/types';

const INITIAL_STATE = {
    level:-1
}

export default function(state = INITIAL_STATE, action){

    switch(action.type){
        case SELECT_LEVEL:
            return {...state, level:action.payload}
        default:
            return state;


    }



}