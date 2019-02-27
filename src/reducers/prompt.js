import { CORRECT_ANSWER, WRONG_ANSWER, NEUTRAL, SET } from '../actions/types';

const INITIAL_STATE = {
    promptColor:"#202020"
}

export default function( state = INITIAL_STATE, action){

    switch(action.type){

        case CORRECT_ANSWER:
            
            return {...state, promptColor:'green'};
        case WRONG_ANSWER:
            
            return {...state, promptColor:'red'};
        case NEUTRAL:
        
            return {...state, promptColor:"#202020"};

        case SET:
            return {...state, message:action.payload}
        
        default:
            
            return state;



    }



}