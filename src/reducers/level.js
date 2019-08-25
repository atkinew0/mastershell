import {SELECT_LEVEL} from '../actions/types';

const INITIAL_STATE = 1

export default function(state = INITIAL_STATE, action){


    switch(action.type){
        case SELECT_LEVEL:
            return action.payload
        default:
            return state;


    }



}