import {SET_LEVEL_COMPLETED} from './types';


export const setLevelCompleted = (completed) => {

    return {
        type:SET_LEVEL_COMPLETED,
        payload:completed
    }
}