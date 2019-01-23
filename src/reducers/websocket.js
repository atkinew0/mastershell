import { WEBSOCKET } from '../actions/types';

export default function(state={}, action){

    if(action.type === WEBSOCKET){
        return {...state, websocket:action.payload}
    }

    return state;
}