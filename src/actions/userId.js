import { USER } from './types';

const HOST = process.env.REACT_APP_BACKEND || "mv-dev.us-east-1.elasticbeanstalk.com";

export const getUserId = (token) => (dispatch) => new Promise ((resolve,reject) => {

    const myHeaders = new Headers();
    myHeaders.append('Authorization',token);

    fetch(`https://${HOST}/userid`, {headers:myHeaders})
    .then( response => {
        return response.json();
    })
        .then((text) => {
            dispatch(
                {
                    type: USER,
                    payload: text
                }
            )
            resolve();
        })



});