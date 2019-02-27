/* eslint-disable no-use-before-define */
import React from 'react';
import WordBox from './WordBox';
import ControlBox from './ControlBox';
import Prompt from './Prompt';
import PropTypes from 'prop-types';
import { Terminal } from 'xterm';
import TimeDue from './timedue.js'
import CheckSame from './checkSame.js';
import { connect } from 'react-redux';
// import * as attach from 'xterm/lib/addons/attach/attach';
import * as attach from './addons/attach';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as search from 'xterm/lib/addons/search/search';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

import * as actions from './actions';


var parser = require('./parseCom')
parser.init();

//import getId from '../helpers/getId';

Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);
Terminal.applyAddon(winptyCompat);

const HOST = process.env.REACT_APP_BACKEND || "mv2-dev.us-east-1.elasticbeanstalk.com";
const SOCKET_URL = `ws://${ HOST }/terminals/`;

const containerStyle ={
  position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    marginTop: '15px',
    transform: 'translate(-50%, -50%)',
    textAlign:'center'
}

const levels = []
const MAX_LEVEL = 31
const MAX_DISPLAY = 31
const MAX = Math.min(MAX_DISPLAY, MAX_LEVEL)



class ReactTerminal extends React.Component {
  constructor(props) {
    super(props);

    this.buffer = [];

    this.elementId = `terminal_1`;
    this.failures = 0;
    this.interval = null;
    this.fontSize = 16;

    let levels = []

    for(let i = 1; i <= MAX; i++){
      levels.push({name:`Level ${i}`,number:i, finished:false, selected:false})
    }

    this.state = {
      lastEntry:"",
      command: [],
      prompt:":",
      promptColor:'#202020',
      questions: [],
      levels:levels,
      nextQuestion:0,
      mode:'',
      score:0,
      userID:'',
      levelCompleted:'0'
    };
  }


  componentDidMount() {

    console.log("Props now are",this.props)

    this.term = new Terminal({
      cursorBlink: true,
      rows: 36,
      fontSize: this.fontSize
    });


    this.term.open(document.getElementById('terminal-container'));
    this.term.winptyCompatInit();
    this.term.fit();
    this.term.focus();
    
    
    this.term.on('key', (key) => {
      
      let command;
      

      if( key.charCodeAt(0) === 127){
        
        //implement backspace textarea input deletion
        let currentText = this.term.textarea.value;
        
        if(currentText.length > 0){
          currentText = currentText.slice(0,-1);
        }

        this.term.textarea.value = currentText;
        

      }

      if(key.charCodeAt(0) === 13){
        
        
        if(this.term.textarea.value === "next" && this.state.mode != ""){
          
          this.setState({nextQuestion:this.state.nextQuestion+1}, this.updatePrompt);
        }

        if(this.term.textarea.value === "hint" && this.state.mode!= ""){
          let hint = this.state.questions[this.state.nextQuestion].answer;
          
          this.term.write("  "+hint);
          this.setState({score:this.state.score -1});
         
        }

        if(this.state.mode === 'levels' || this.state.mode === 'srs'){
          //only check answer if there are questions loaded
          this.checkAnswer(this.term.textarea.value);
        }

        command = parser.check(this.term.textarea.value);
        
        

        if(command){
          this._makeCommand(command);
        }

        this.term.textarea.value ="";
        
      }
     
    });

    if(this.state.userID === ''){
      
      this._userInit();
    }
    
    this._connectToServer();

  }


  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  flashPrompt(correct){
    if(correct){
      this.setState({promptColor:'green'});
    }
    else{
      this.setState({promptColor:'red'});
    }

    setTimeout(() => { this.setState({promptColor:'#202020'} ) }, 250);
  }

  handleQuestions = (questionsArray) => {
    //this will be called from controlbox which does a db query to get questions
    //and load in a level
    let levelSelected;
    if(questionsArray){
      levelSelected = questionsArray[0].level;
    }
    
    let levels = this.state.levels.map(elem => {
      if (elem.number == levelSelected)
          elem.selected = true;
      else
          elem.selected = false;
      return elem;
    });
    if(questionsArray.length > 0){
      this.setState({levels:levels});

      this.setState({nextQuestion: 0});
      this.setState({questions:questionsArray, mode:"levels"}, this.updatePrompt);
    }
    
  }

  handleSRS = (questionsArray) => {

    if(questionsArray.length == 0){
      console.log("No questions due found")
      this.setState({prompt:"No questions due for review"},() => {setTimeout(() => this.setState({prompt:"prompt"}), 2000)})
      
    }else{
      this.setState({questions:questionsArray}, () => {this.updatePrompt(); this.setMode("srs")});
    }


  }

  updatePrompt(){
    //sets the top prompt to be whatever the next question in this.state.questions is
    let questions = this.state.questions;
    
    if(this.state.questions.length == 0){
      return;
    }
    

    if(this.state.nextQuestion >= questions.length && questions.length > 0){

      let level = this.state.questions[0].level;
      this.setState({prompt:"Level Complete!",questions:[],nextQuestion:0, mode:''},()=>{

        //on completing a level update users level in both App state and DB
        this.updateLevelCompleted(this.state.userID, level);
      });

      let currentLevel = this.state.questions[0].level;
      let levels = this.state.levels.map(elem =>{
        if(elem.number == currentLevel)
          elem.finished = true;

        return elem;
      });
      this.setState({levels:levels});
      
    }else{

      this.setState({prompt:questions[this.state.nextQuestion].prompt});
    }

  }

  checkAnswer(answer){

    if(this.state.mode !== 'levels' && this.state.mode !== 'srs') return;
   
    console.log("Console logging textarea", this.term.textarea.value);
    //answer = answer.replace(pattern," ");
    
    let questions = this.state.questions;
    let correct = false;

    let correct1 = questions[this.state.nextQuestion].answer;
    let correct2 = questions[this.state.nextQuestion].answer2 ? questions[this.state.nextQuestion] : "@@@@@"; //fix a bug where alt answer is the empty string so users can answer correctly with nothing

    if(CheckSame.checkSame(correct1,answer) || CheckSame.checkSame(correct2,answer)){

      correct = true;
      questions[this.state.nextQuestion].answered = true;
      
      if(this.state.mode === 'srs'){
        this.updateDue(questions[this.state.nextQuestion], correct, this.state.userID);
      }

      this.setState({questions:questions, nextQuestion: this.state.nextQuestion + 1, score:this.state.score + 5}, this.updatePrompt);
    }else{
      if(this.state.mode === 'levels'){
        this.setState({score:this.state.score -1});
      }

      if(this.state.mode === 'srs'){
        
        this.updateDue(questions[this.state.nextQuestion], correct, this.state.userID);
      }
    }
    
    this.flashPrompt(correct);

  }

  updateDue(question, correct, uid){

    
    let dueObj = TimeDue.update(question,correct);
    let repetitions = correct ? question.repetitions + 1 : 0;


    let theBody = {
      id:question.id,
      due:dueObj.timeDue,
      daysTillDue:dueObj.futureDays,
      repetitions: repetitions,
      uid:uid
    }

    let theReq = `http://${HOST}/api/srs`;

    fetch(theReq, {
      body: JSON.stringify(theBody), // data can be `string` or {object}!
      headers:{
      'Content-Type': 'application/json'
      },
      method:'PUT'}).then( res => {
      if(!res.ok) console.log(res.status);

      res.text().then(resText => {
          console.log(resText);
          
      });

    })

  }

  updateLevelCompleted(uid, levelJustCompleted){

    if(this.state.levelCompleted < levelJustCompleted){

      let newLevel = this.state.levelCompleted + 1;

      this.setState({levelCompleted:newLevel});

      const myHeaders = new Headers();
      myHeaders.append('Authorization',localStorage.getItem('token'));

      fetch(`http://${HOST}/api/user?uid=${uid}&level=${newLevel}`,{method:'POST', headers:myHeaders})
      .then(response => console.log(response));

    }
    
  }

  focusTerm =() => {
    this.term.focus();
  }

  locked = () => {

    let oldPrompt = this.state.prompt;

    this.setState({prompt:"Locked"}, () => { setTimeout(() => this.setState({prompt:oldPrompt}), 500)})
  }

  stop = () => {
    console.log("Stopping reviewing")
    //to quit a level or srs reviewing
    this.setState({mode:"",questions:"",nextQuestion:0,prompt:":"})
  }

  setMode = (mode) => {
    if(this.state.mode === mode){
      console.log("Attempting to set state to",mode, " it is already in");
    }
    if(this.state.questions.length === 0){
      console.log("Attempting to review 0 questions");
      return;
    }

    this.setState({mode:mode});
  }

  completed(){
    return {done: this.state.nextQuestion, total:this.state.questions.length }
  }

  _userInit(){
    //1) query backend auth server passing in JWT Token to get back a user ID
    //2) then when we have user ID use that to get user's level completed
    //3) finally set levels finished in the app to the users levelCompleted
    let uid, level;
    const myHeaders = new Headers();
    myHeaders.append('Authorization',localStorage.getItem('token'));
  
    fetch(`http://${HOST}/userid`, {headers:myHeaders})
    .then( response => {
             return response.json() })
    .then (text =>  {
             uid = text;
             this.setState({userID:text.userId });})
    .then ( () => {

      fetch(`http://${HOST}/api/user?uid=${uid.userId}`)
      .then ( response => {
          return response.json()})
      .then( text => {
          level = text.levelCompleted;
          this.setState({levelCompleted:text.levelCompleted});
      })
      .then( () => {

        let levels = this.state.levels.map(elem => {
          if (elem.number <= level)
              elem.finished = true;
          else
              elem.finished = false;
          return elem;
        });

        this.setState({levels:levels});


      })
  });

}
 
  render() {

    return (
      <div style={containerStyle}>
        <Prompt color={this.props.promptColor} prompt={this.state.prompt}/>

        <WordBox 
         userID={this.state.userID}
         stopReview={this.stop}
         mode={this.state.mode} 
         completed={this.completed()} 
         focus={this.focusTerm} 
         setmode={this.setMode} 
         questionsCall={this.handleSRS} 
         lastEntry={this.state.lastEntry} 
         words={this.state.command}/>

        <div id={"terminal-container"}  style={{
        float:'left', top: 0, left: 0, width: '80', height: '100%'
        }}></div>

        <ControlBox 
         completed={this.completed()}
         score={this.state.score} 
         locked={this.locked} 
         levels={this.state.levels} 
         setmode={this.setMode} 
         focus={this.focusTerm} 
         questionsCall={this.handleQuestions} 
         words={this.state.levels}/>

    </div>
    )
  }




  _connectToServer() {

    const theReq = `http://${ HOST }/terminals/?cols=${ this.term.cols }&rows=${ this.term.rows }`;
    const myHeaders = new Headers();
    myHeaders.append('Authorization',localStorage.getItem('token'))

    fetch(
      theReq,
      { method: 'POST',
      headers:myHeaders
     }
    ).then(
      res => {
        if (!res.ok) {
          this.failures += 1;
          if (this.failures === 2) {
            this.term.writeln(
              'There is back-end server found but it returns "' +
              res.status + ' ' + res.statusText + '".'
            );
          }
          this._tryAgain();
          return;
        }
        res.text().then(processId => {
          this.pid = processId;
          this.socket = new WebSocket(SOCKET_URL + processId);
          
          
          this.socket.onopen = () => {
            this.term.attach(this.socket, true , false, (comp) => { console.log("Callback" ,comp)} );
            this.term.writeln("Beginning mastershell...");

            //Note Redux action creator to allow the signout component access to close websocket
            this.props.websocket(this.socket);
          };
          this.socket.onclose = () => {
            this.term.writeln('Server disconnected!');
            this.term.writeln('Auto reconnect disabled, refresh page to restart')
            //setInterval(() => this._connectToServer(), 2500);
          };
          this.socket.onerror = () => {
            this.term.writeln('Socket error, disconnected!');
            this.term.writeln('Auto reconnect disabled, refresh page to restart')
            //setInterval(() => this._connectToServer(), 2500);
          };
        });
      },
      error => {
        this.failures += 1;
        if (this.failures === 2) {
          this.term.writeln('It looks like there is no backend. You have to:');
          this.term.writeln('> npm install evala -g');
          this.term.writeln('> evala --shell=$SHELL');
        }
        console.error(error);
        this._tryAgain();
      }
    );
  }
  
  _tryAgain() {
    clearTimeout(this.interval);
    this.interval = setTimeout(() => {
      this._connectToServer();
    }, 2000);
  }

  _makeCommand(command) {
    //if command is new command make a new entry for that, otherwise update its typed array to hold its exact
    //input ie ls, ls-al, ls /temp etc etc...

    let typed = this.term.textarea.value;

    //check if entire command input is a repeat, ie already seen exact entry ls -al
    let repeat = this.state.command.some(commandObj => commandObj.typed === typed);

    if (!repeat) {
      let seenCommand = this.state.command.some(commandObj => commandObj.command === command);

      if (!seenCommand) {
        let commandObject = {
          command: command,
          typed: [this.term.textarea.value]
        };

        this.setState({ command: [...this.state.command, commandObject] });
      }
      else {
        let updateCommands = this.state.command;

        updateCommands.forEach(commandObj => {
          if (commandObj.command === command) {
            commandObj.typed.push(typed);
          }
        });

        // let update = this.state.command.find(commandObj => commandObj.command === command );
        // update.typed.push(typed);
        this.setState({ command: [...updateCommands] });
      }
    }

  }
};

ReactTerminal.propTypes = {
  options: PropTypes.object
};

function listenToWindowResize(callback) {
  var resizeTimeout;

  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        callback();
      }, 66);
    }
  }

  window.addEventListener('resize', resizeThrottler, false);
}

function mapStateToProps(state){

  return { promptColor: state.promptColor }
}

export default connect(mapStateToProps,actions)(ReactTerminal);

