import React from 'react';

import Command from './Command';
import EditCommands from './EditCommands';

const style = {
    float:'left',
    position:'relative',
    width:"200px",
    height:"680px",
    border:"black solid 2px"
}

const HOST = process.env.REACT_APP_BACKEND || "mv-dev.us-east-1.elasticbeanstalk.com";

const titleStyle ={
    border:'2px solid black',
    background: '#e7e4e4'
}

class WordBox extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showEdit:false
        }

        this.index = 0;
    }

    handleClick = () =>{

        this.props.focus();


        const myHeaders = new Headers();
        myHeaders.append('Authorization',localStorage.getItem('token'));

        
        const theRequest = `https://${HOST}/api/srs/?uid=${this.props.userID}`;

        fetch(theRequest,{ method:'GET', headers:myHeaders}).then( response => {

            response.text().then( (resText, err) => {
                if(err)
                    console.log(err)

                console.log(resText);
                let resJSON = JSON.parse(resText)
                this.props.questionsCall(resJSON);
            })
        })
    }

    handleClick2 = () => {

        this.setState({showEdit:this.state.showEdit? false : true})
    }


    renderReviewButton(){
        if(this.props.mode === "srs"){
            return (
                 <div className="ui red button" onClick={this.props.stopReview} style={{position:'absolute',bottom:'0', border:'2px solid black'}}>
                    
                    <span >Stop Reviewing</span>
                 </div>
                )
        }else{
            return (
                <div className="ui primary button large" onClick={this.handleClick} style={{ border:'2px solid black'}}>
                    <span >Review My Commands</span>
                 </div>
            )
            
        }
    }

    renderEditButton(){
        return (
            
            <div className="ui fluid button large" style={{ border:'2px solid black'}}>
                
                <span onClick={this.handleClick2}>Edit Commands</span>
            </div>
            
            )
    }

    renderEdit(){

        if(this.state.showEdit){
            return (
                <div>
                    <EditCommands userID={this.props.userID} close={this.handleClick2}/>
                </div>
            )
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
            <div style={style}> 
                <div style={ titleStyle }>Commands</div>
                <div style={{height:'600px', overflow:'scroll'}}>
                    <ul style={{width:"80%",margin:"auto", paddingInlineStart:"0"}}>
                    {this.renderWords()}
                    </ul>
                </div>
                <div style={{display:'flex',position:'absolute',bottom:'0'}}>
                    {this.renderReviewButton()}
                    {this.renderEditButton()}
                </div>
                    {this.renderEdit()}
            </div>
        );
    }

}


export default WordBox;