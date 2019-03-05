import { MODE } from './types';

export const setMode = (mode) => {

    console.log("Action setting mode to", mode)

    return {
        type: MODE,
        payload: mode
    };


}
