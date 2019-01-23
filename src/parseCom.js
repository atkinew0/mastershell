const commandsJson = require('./cObj.json');


module.exports = {
    
    

    score: 0,
    commands: {},
    
    
    init: function(){
        
        this.commands = commandsJson
        
    },
    
    
    

    check: function(textInput){

        let tokens = textInput.split(" ");
        console.log("Got tokens of ",tokens," in check");

        //returns the first matching linux command in tokens array
        for(let i =0; i < tokens.length; i++){
            if (this.commands[tokens[i]]){
                return tokens[i];
            }
        }

        return false;

    }
    
    
    
    
};


