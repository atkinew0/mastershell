import {SET_NEXTQ} from '../actions/types';

const INITIAL_STATE ={
    nextQuestion:0
}

export default (state= INITIAL_STATE, action) => {

    switch(action.type){
        case SET_NEXTQ:
            return {...state, nextQuestion: action.payload};
        default:
            return state;
    }


}