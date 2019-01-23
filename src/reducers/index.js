import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import websocket from './websocket';

export default combineReducers({
    auth,
    form:formReducer,
    websocket:websocket,
});