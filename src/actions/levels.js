import {MAKE_LEVELS, SET_LEVEL_FINISHED,SET_LEVEL_SELECTED } from './types';


export const makeLevels = (max) => {

    return {
        type:MAKE_LEVELS,
        payload:max
    }
}


export const setLevelFinished = (levels,finished) => {

    return {
        type:SET_LEVEL_FINISHED,
        finished,
        levels
    }

}

export const setLevelSelected = (levels,selected) => {

    return {
        type:SET_LEVEL_SELECTED,
        selected,
        levels
    }


}

