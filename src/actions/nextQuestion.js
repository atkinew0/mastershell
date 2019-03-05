import {SET_NEXTQ} from './types';


export const setNextQuestion = (question) => (dispatch) => new Promise((resolve, reject) => {

    dispatch({
        type:SET_NEXTQ,
        payload:question
    })

    resolve();
 

});