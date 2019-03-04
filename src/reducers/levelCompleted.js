import {SET_LEVEL_COMPLETED} from '../actions/types';

const INITIAL_STATE = {
    levelCompleted:0
}

export default function(state = INITIAL_STATE, action){

    switch(action.type){
        case SET_LEVEL_COMPLETED:
            return {...state, levelCompleted:action.payload}
        default:
            return state;
    }
}