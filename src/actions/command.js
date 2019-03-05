import { COMMAND } from './types';

export const makeCommand = (command, typed, currentCommands) => {

    return {
        type:COMMAND,
        command,
        typed,
        currentCommands
    }


}