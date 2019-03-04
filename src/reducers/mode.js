import {MODE} from '../actions/types';


let initialState = {
    mode:""
}

export default function(state= initialState, action){

    switch(action.type){
        case MODE:
            return {...state, mode:action.payload}
        default:
            return {...state}
    }


}