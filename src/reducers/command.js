import { COMMAND } from '../actions/types';

const INITIAL_STATE = {
    command:[]
}


export default function(state = INITIAL_STATE, action){

    switch(action.type){

        case COMMAND:

            //check if entire command input is an exact repeat, ie already seen exact entry ls -al
            let repeat = action.currentCommands.some(commandObj => commandObj.typed === action.typed)

            if(repeat){
                return state;
            }else{
                //check if command has been used but in another way i.e. "ls" vs "ls -al"
                let seenCommand = action.currentCommands.some(commandObj => commandObj.command === action.command);

                if (!seenCommand) {
                    let commandObject = {
                      command: action.command,
                      typed: [action.typed]
                    };

                    let commands = [...action.currentCommands, commandObject]
            
                    return {...state, command:commands};
                }else{
                    let updatedCommands = action.currentCommands;

                    updatedCommands.forEach(commandObj => {
                        if(commandObj.command === action.command){
                            commandObj.typed.push(action.typed);
                        }
                    });

                    return {...state, command:updatedCommands};


                }

            }

        default:
            return state;



    }


}