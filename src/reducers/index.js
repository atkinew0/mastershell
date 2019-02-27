import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import websocket from './websocket';
import prompt from './prompt';

export default combineReducers({
    auth,
    form:formReducer,
    websocket:websocket,
    promptColor:prompt
});