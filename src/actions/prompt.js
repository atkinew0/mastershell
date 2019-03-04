import { CORRECT_ANSWER, WRONG_ANSWER, NEUTRAL,SET } from './types.js';

export const flashCorrect = (duration) => async (dispatch) => {

  
    setTimeout(() => {
        dispatch({type:NEUTRAL})
    }, duration)

    dispatch({type:CORRECT_ANSWER})

}

export const flashWrong= (duration) => async (dispatch) => {

    setTimeout(() => {
        dispatch({type:NEUTRAL})
    }, duration)

    dispatch({type:WRONG_ANSWER})

}

export const setNeutral = () => {

    return { type:NEUTRAL};
}

export const setPrompt = (message) => {
    console.log("Running a setprompt",message)
    return {type:SET,
            payload:message};

}

export const flashPrompt = (message, oldPrompt, timeout) => async (dispatch) => {


    setTimeout( () => {
        
        dispatch({type:SET,payload:oldPrompt})
    }, timeout );

    dispatch({type:SET,payload:message})

}