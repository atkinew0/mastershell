import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';
import websocket from './websocket';
import prompt from './prompt';
import mode from './mode';
import questions from './questions'
import level from './level';
import nextQuestion from './nextQuestion';
import score from './score';
import levels from './levels';
import levelCompleted from './levelCompleted'
import command from './command';
import userId from './userId';


export default combineReducers({
    auth,
    form:formReducer,
    websocket:websocket,
    prompt,
    mode,
    questions,
    level,
    nextQuestion,
    score,
    levels,
    levelCompleted,
    command,
    userId
});