import { QUESTIONS, QUESTIONS_ERROR, QUESTIONS_SET } from './types';

const HOST = process.env.REACT_APP_BACKEND || "mv2-dev.us-east-1.elasticbeanstalk.com";

export const getQuestions = (level) => (dispatch) => new Promise((resolve,reject) => {

    
        const theReq = `https://${ HOST }/api/level/${level}`;
        const myHeaders = new Headers();
        myHeaders.append('Authorization',localStorage.getItem('token'))


        fetch(theReq, { method:'GET', headers:myHeaders }).then ( response => {

            if(!response.ok){
                dispatch({
                    type:QUESTIONS_ERROR,
                    payload:"Error could not get questions"
                });
                reject();
            }

                return response
            }).then(response => response.json())
            .then( response => {
                dispatch({type:QUESTIONS,
                    payload:response});

                resolve();
            });
            
            
});

export const setQuestions = (questions) => (dispatch) => new Promise((resolve, reject) => {

    dispatch( {
        type:QUESTIONS_SET,
        payload:questions
    });

    resolve();

});