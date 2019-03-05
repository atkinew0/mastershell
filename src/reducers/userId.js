import { USER} from '../actions/types';

const INITIAL_STATE = {
    userId:""
}

export default function(state = INITIAL_STATE, action){

    switch(action.type){

        case USER:
            //return {...state, userId:action.payload}
            return action.payload
        default:
            return state;
    }

}