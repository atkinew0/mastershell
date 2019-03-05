import {MAKE_LEVELS, SET_LEVEL_FINISHED, SET_LEVEL_SELECTED } from '../actions/types';

const INITIAL_STATE = {
    levels:[]
}

export default function(state = INITIAL_STATE, action){

    let levels, selected, finished;

    switch(action.type){


        case MAKE_LEVELS:

            let max = action.payload;
            levels = []

            for(let i = 1; i <= max; i++){
            levels.push({name:`Level ${i}`,number:i, finished:false, selected:false})
            }

            return {...state, levels:levels}

        case SET_LEVEL_SELECTED:

            levels = action.levels;
            selected = action.selected;
            
            levels = levels.map(elem => {
                if (elem.number === selected)
                    elem.selected = true;
                else
                    elem.selected = false;
                return elem;
            });

            return {...state, levels:levels}


        case SET_LEVEL_FINISHED:

            console.log("Running setlevelfinishd to", action.finished)
            levels = action.levels;
            finished = action.finished;
                
            levels = levels.map(elem => {
                if (elem.number <= finished)
                    elem.finished = true;
                else
                    elem.finished = false;
                return elem;
            });

            return {...state, levels:levels}

        default:
            return state;
    }


}