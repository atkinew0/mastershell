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

import {flashCorrect, flashWrong, setNeutral, setPrompt, flashPrompt } from './actions/prompt';
import { setMode } from './actions/mode';
import { getQuestions, setQuestions } from './actions/questions';
import { setNextQuestion} from './actions/nextQuestion';
import { selectLevel } from './actions/level';
import { setScore } from './actions/score';
import { makeLevels, setLevelFinished, setLevelSelected } from './actions/levels';
import { setLevelCompleted } from './actions/levelCompleted';
import { makeCommand } from './actions/command';
import { getUserId } from './actions/userId';

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
    marginTop: '80px',
    transform: 'translate(-50%, -50%)',
    textAlign:'center'
}

const MAX_LEVEL = 31


class ReactTerminal extends React.Component {
  constructor(props) {
    super(props);

    this.elementId = `terminal_1`;
    this.failures = 0;
    this.interval = null;
    this.fontSize = 16;

    this.props.makeLevels(MAX_LEVEL);

  }


  componentDidMount() {

    this.term = new Terminal({
      cursorBlink: true,
      rows: 37,
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
        
        
        if(this.term.textarea.value === "next" && this.props.mode !== ""){
          this.next();
          
        }

        if(this.term.textarea.value === "hint" && this.props.mode !== ""){
          
          this.hint();
         
        }

        if(this.props.mode === 'levels' || this.props.mode === 'srs'){
          //only check answer if there are questions loaded
          this.checkAnswer(this.term.textarea.value);
        }

        command = parser.check(this.term.textarea.value);
        
        

        if(command){

          let typed = this.term.textarea.value;

          this._makeCommand(command, typed);
        }

        this.term.textarea.value ="";
        
      }
     
    });

    if(this.props.userId === ''){
      
      this._userInit();
    }
    
    this._connectToServer();

  }

  next() {

    console.log("getting a ntxt")
    this.props.setNextQuestion(this.props.nextQuestion + 1)
    .then(() => {
      console.log("action setNext resolved")
      this.updatePrompt()
    });
  }

  hint(){

    let hint = this.props.questions[this.props.nextQuestion].answer;
          
    this.term.write("  "+hint);

    this.props.setScore(this.props.score -1)

  }


  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  flashPrompt(correct){
    if(correct){
      
      this.props.flashCorrect(300);
    }
    else{
      
      this.props.flashWrong(400);
    }

  }

  handleQuestions = (questionsArray, level) => {
    //this will be called from controlbox which does a db query to get questions
    //and load in a level

    
    this.props.setLevelSelected(this.props.levels, level);

    if(questionsArray.length > 0){

      this.props.getQuestions(level)
        .then(() => {

          this.props.selectLevel(level);
          this.props.setNextQuestion(0);

          this.setMode("levels");
          this.updatePrompt();
        });
      
    }
    
  }

  handleSRS = (questionsArray) => {

    console.log("Handlsrs got back qustions array of",questionsArray);

    if(questionsArray.length === 0){
      console.log("No questions due found")

      this.props.flashPrompt("No questions due for review", this.props.prompt, 1500);
  
      
    }else{

      this.props.setQuestions(questionsArray)
      .then( () => {
        this.props.setMode("srs");
        this.updatePrompt();
      })

    }

  }

  updatePrompt(){
    //sets the top prompt to be whatever the next question in this.props.questions is
    let questions = this.props.questions;

    
    
    if(questions.length === 0){
      return;
    }
    

    if(this.props.nextQuestion >= questions.length && questions.length > 0){

      if(this.props.mode === 'srs'){
        //user has finished or skipped through all srs questions so we call stop automatically to update the database accordingly
        this.stop();
      }

      let level = this.props.questions[0].level;
      this.props.setPrompt("Level Complete");

      this.setMode("");

      this.props.setQuestions("");
      this.props.setNextQuestion(0);

      //on completing a level update user's level in both App state and DB
      this.updateLevelCompleted(this.props.userId, level);
      
    }else{

      //this if test designed to skip srs questions which are not due yet and recursively calls updatePrompt again
      let now = new Date().getTime();
      
      if(this.props.mode === 'srs' && questions[this.props.nextQuestion].due > now){

        

          this.props.setNextQuestion(this.props.nextQuestion + 1);
          this.updatePrompt();
      }else{
        this.props.setPrompt(questions[this.props.nextQuestion].prompt);
      }
      
    }

  }

  checkAnswer(answer){

    if(this.props.mode !== 'levels' && this.props.mode !== 'srs') return;
   
    console.log("Console logging textarea", this.term);
    //answer = answer.replace(pattern," ");
    
    let questions = this.props.questions;
    let correct = false;

    let correct1 = questions[this.props.nextQuestion].answer;
    let correct2 = questions[this.props.nextQuestion].answer2 ? questions[this.props.nextQuestion].answer2 : "@@@@@"; //fix a bug where alt answer is the empty string so users can answer correctly with nothing

    if(CheckSame.checkSame(correct1,answer) || CheckSame.checkSame(correct2,answer)){

      correct = true;
      questions[this.props.nextQuestion].answered = true;
      
      if(this.props.mode === 'srs'){
        this.updateDue(questions[this.props.nextQuestion], correct, this.props.userId);
        

      }

      this.props.setNextQuestion(this.props.nextQuestion + 1);

      this.props.setScore(this.props.score + 2)
      this.updatePrompt();
    }else{
      if(this.props.mode === 'levels'){
        this.props.setScore(this.props.score - 1);
        
      }

      if(this.props.mode === 'srs'){
        
        this.updateDue(questions[this.props.nextQuestion], correct, this.props.userId);
      }
    }
    
    this.flashPrompt(correct);

  }

  updateDue(question, correct, uid){

    
    let dueObj = TimeDue.update(question,correct);
    let repetitions = correct ? question.repetitions + 1 : 0;

    for(let i = 0; i < this.props.questions.length; i++){
      
      if(this.props.questions[i].id === question.id){
        this.props.questions[i].due = dueObj.timeDue;
        this.props.questions[i].daysTillDue = dueObj.futureDays;
        this.props.questions[i].repetitions = repetitions;

      }
    }

    this.props.setQuestions(this.props.questions);


    // let theBody = {
    //   id:question.id,
    //   due:dueObj.timeDue,
    //   daysTillDue:dueObj.futureDays,
    //   repetitions: repetitions,
    //   uid:uid
    // }

    // let theReq = `http://${HOST}/api/srs`;

    // fetch(theReq, {
    //   body: JSON.stringify(theBody), // data can be `string` or {object}!
    //   headers:{
    //   'Content-Type': 'application/json'
    //   },
    //   method:'PUT'}).then( res => {
    //   if(!res.ok) console.log(res.status);

    //   res.text().then(resText => {
    //       console.log(resText);
          
    //   });

    //})

  }

  updateLevelCompleted(uid, levelJustCompleted){

    if(this.props.levelCompleted < levelJustCompleted){

      let newLevel = this.props.levelCompleted + 1;

      this.props.setLevelFinished(this.props.levels,newLevel)

      this.props.setLevelCompleted(newLevel);

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

    let oldPrompt = this.props.prompt;

    this.props.flashPrompt("Locked",oldPrompt,500);
  
  }

  stop = () => {
    
    //to quit a level or srs reviewing
    this.props.setMode("");

    //update due that updates all due times based on questions currently in memory
    let theBody = {
      uid:this.props.userId,
      questions:this.props.questions
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



    this.props.setQuestions("");
    this.props.setNextQuestion(0);
    this.props.setPrompt(":");

    
  }

  setMode = (mode) => {
    if(this.props.mode === mode){
      console.log("Attempting to set state to",mode, " it is already in");
      return;
    }
    if(this.props.questions.length === 0){
      console.log("Attempting to review 0 questions");
      return;
    }
    
  
    this.props.setMode(mode);
  }

  completed(){
    return {done: this.props.nextQuestion, total:this.props.questions.length }
  }

  _userInit(){
    //1) query backend auth server passing in JWT Token to get back a user ID
    //2) then when we have user ID use that to get user's level completed
    //3) finally set levels finished in the app to reflect the user's levelCompleted
    let level;
    let token = localStorage.getItem('token');

    this.props.getUserId(token)
    .then ( () => {
      console.log("userID here is",this.props.userId)

      fetch(`http://${HOST}/api/user?uid=${this.props.userId}`)
      .then ( response => {
          return response.json()})
      .then( text => {
          level = text.levelCompleted;
          this.props.setLevelCompleted(text.levelCompleted);
    
      })
      .then( () => {

        this.props.setLevelFinished(this.props.levels, level);

      })
      .catch((err) => console.log("Could not init user",err)
        
      )

    });
}
 
  render() {

    return (
      <div style={containerStyle}>
        <Prompt color={this.props.promptColor} prompt={this.props.prompt}/>

        <WordBox 
         userID={this.props.userId}
         stopReview={this.stop}
         mode={this.props.mode} 
         completed={this.completed()} 
         focus={this.focusTerm} 
         questionsCall={this.handleSRS} 
         words={this.props.command}/>

        <div id={"terminal-container"}></div>

        <ControlBox 
         completed={this.completed()}
         score={this.props.score} 
         locked={this.locked} 
         levels={this.props.levels} 
         focus={this.focusTerm} 
         questionsCall={this.handleQuestions} 
         words={this.props.levels}/>

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

  _makeCommand(command, typed) {
    //if command is new command make a new entry for that, otherwise update its typed array to hold its exact
    //input ie ls, ls-al, ls /temp etc etc...

    this.props.makeCommand(command, typed, this.props.command);
    
  }
}

ReactTerminal.propTypes = {
  options: PropTypes.object
};


function mapStateToProps(state){

  console.log("In MSTP state is",state)

  return {
    promptColor: state.prompt.promptColor,
    prompt: state.prompt.message,
    mode: state.mode.mode,
    questions: state.questions.questions,
    level: state.level,
    nextQuestion: state.nextQuestion.nextQuestion,
    score:state.score.score,
    levels:state.levels.levels,
    levelCompleted:state.levelCompleted.levelCompleted,
    command:state.command.command,
    userId:state.userId.userId
  }
}

export default connect(mapStateToProps,{getUserId,makeCommand, setLevelCompleted, makeLevels, setLevelFinished, setLevelSelected,setScore, flashCorrect, flashWrong, setNeutral, setPrompt, flashPrompt, setMode, getQuestions, setQuestions, setNextQuestion, selectLevel} )(ReactTerminal);

