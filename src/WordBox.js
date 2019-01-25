import React from 'react';
import Command from './Command';

const style = {
    float:'left',
    position:'relative',
    width:"200px",
    height:"800px",
    border:"black solid 2px"
}

//const PORT = '3001';
//const HOST = `mv2-dev.us-east-1.elasticbeanstalk.com`;
const HOST = "localhost:8081";

const titleStyle ={
    border:'2px solid black',
    background: '#e7e4e4'
}

class WordBox extends React.Component {
    constructor(props){
        super(props);

        
        this.index = 0;
    }

    handleClick = () =>{

        this.props.setmode("srs");
        this.props.focus();


        const myHeaders = new Headers();
        myHeaders.append('Authorization',localStorage.getItem('token'));
        console.log("My props now",this.props)
        
        const theRequest = `http://${HOST}/api/srs/?uid=${this.props.userID}`;

        fetch(theRequest,{ method:'GET', headers:myHeaders}).then( response => {

            response.text().then( resText => {
                console.log(resText);
                let resJSON = JSON.parse(resText)
                this.props.questionsCall(resJSON);
            })
        })



    }
    renderButton(){
        if(this.props.mode === "srs"){
            return <p onClick={this.props.stopReview}>Stop Reviewing </p>
        }else{
            return <p onClick={this.handleClick}>Review Commands</p>
        }
    }
    
    renderWords(){

        if(!this.props.words) return <p>loading</p>;

        return this.props.words.map(elem => {
            return <Command userID={this.props.userID} key={this.index++} data={elem}/>;
        })
    }

    render(){
        
        return (
            <div style={style}><div style={ titleStyle }>Commands</div>
            <ul style={{width:"80%",margin:"auto", paddingInlineStart:"0"}}>
            {this.renderWords()}
            </ul >
            <div style={{position:'absolute',bottom:'0', border:'2px solid black',background:'rgb(231, 228, 228)'}}>
                <span>{this.props.completed.done}/{this.props.completed.total}</span>
                {this.renderButton()}
            </div>
            </div>
        );
    }

}


export default WordBox;;