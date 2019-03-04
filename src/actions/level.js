import { SELECT_LEVEL } from './types';


export const selectLevel = (level) => {

    return {
        type:SELECT_LEVEL,
        payload:level
    }

}