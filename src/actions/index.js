import { AUTH_USER, AUTH_ERROR, WEBSOCKET } from './types';
import axios from 'axios';
const HOST = process.env.REACT_APP_BACKEND || "mv-dev.us-east-1.elasticbeanstalk.com";

export const signup = ({email, password}, callback) => async dispatch => {
    try{
    const response = await axios.post(`http://${HOST}/signup`, { email, password})
    

    dispatch({ type: AUTH_USER, payload: response.data.token } ); 
    localStorage.setItem('token', response.data.token);
    callback();
    }
    catch(e){
        dispatch({type:AUTH_ERROR, payload: "Err Email is in use"})
    }
};

export const signout = () => {
    localStorage.removeItem('token');

    return {
        type:AUTH_USER,
        payload:''
    }
}

export const signin = ({email, password}, callback) => async dispatch => {
    try{
    const response = await axios.post(`http://${HOST}/signin`, { email, password})
    

    dispatch({ type: AUTH_USER, payload: response.data.token } );
    localStorage.setItem('token', response.data.token);
    callback();
    }
    catch(e){
        console.log("error in signin action creator",e)
        dispatch({type:AUTH_ERROR, payload: "Invalid Login Credentials"})
    }
};

export const websocket = (websocket) => {

    return {
        type:WEBSOCKET,
        payload:websocket
    }

}
   
