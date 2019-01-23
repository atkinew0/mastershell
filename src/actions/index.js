import { AUTH_USER, AUTH_ERROR, WEBSOCKET } from './types';
import axios from 'axios';
const HOST = '127.0.0.1';
const PORT = 8081;

export const signup = ({email, password}, callback) => async dispatch => {
    try{
    const response = await axios.post(`http://${HOST}:${PORT}/signup`, { email, password})
    

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
    const response = await axios.post(`http://${HOST}:${PORT}/signin`, { email, password})
    

    dispatch({ type: AUTH_USER, payload: response.data.token } );
    localStorage.setItem('token', response.data.token);
    callback();
    }
    catch(e){
        dispatch({type:AUTH_ERROR, payload: "Invalid Login Credentials"})
    }
};

export const websocket = (websocket) => {

    return {
        type:WEBSOCKET,
        payload:websocket
    }

}
   
