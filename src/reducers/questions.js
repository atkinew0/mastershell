import {QUESTIONS, QUESTIONS_ERROR,QUESTIONS_SET } from '../actions/types';


const INITIAL_STATE = {
    questions:[]
}

export default function(state = INITIAL_STATE, action){

    switch(action.type){
        case QUESTIONS:
            return {...state, questions:action.payload}
        case QUESTIONS_ERROR:
            return {...state, errorMessage:action.payload}

        case QUESTIONS_SET:
            return {...state, questions:action.payload}

        default:
            return state;


    }


}