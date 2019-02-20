import React from 'react';

const HOST = process.env.REACT_APP_BACKEND || "mv2-dev.us-east-1.elasticbeanstalk.com";

const style = {
    float:'left',
    width:"200px",
    height:"680px",
    border:"black solid 2px"
}

const titleStyle ={
    border:'2px solid black',
    background: '#e7e4e4'
}

export default class ControlBox extends React.Component {
    constructor(props){
        super(props);

        this.index = 0;
    }

    handleClick = (event) => {
       
        //when you click on Level x load in questions for that level
        //if the user has completed previous levels
        let levelClicked = event.target.value;

        let nextLevel = 1;

        this.props.levels.forEach(level => {
            if(level.finished){
                nextLevel = level.number + 1;
            }
        })
        
        if(levelClicked <= nextLevel){

            const theReq = `http://${ HOST }/api/level/${levelClicked}`;
            const myHeaders = new Headers();
            myHeaders.append('Authorization',localStorage.getItem('token'))


            fetch(theReq, { method:'GET', headers:myHeaders }).then( res => {
                if(!res.ok) console.log(res.status);

                res.text().then(resText => {
                    
                    let resjson = JSON.parse(resText);
                    this.props.questionsCall(resjson);
                });

                this.props.focus();
            })
        }else{
            this.props.locked();
        }
    }

    renderStyle = (elem) => {

        let style = { border: 'solid black 2px',
                      borderRadius: '10px',
                     };

        if(elem.finished){
            style.border = 'solid green 3px';
            style.background = '#66ff66'
    
        }else if(elem.selected){
            style.border = 'solid red 3px';
            style.background = 'lightblue';
        }

        return style;
    }


    renderWords(){

        if(!this.props.words) return <p>loading</p>;

        return this.props.words.map((elem, index) => {

            let completed = elem.selected ? <span style={{fontSize:12}}> {this.props.completed.done}/{this.props.completed.total}</span> : "";
           
            return <li value={index+1} style={this.renderStyle(elem)} onClick={this.handleClick} key={this.index++}>{elem.name}{completed}</li>;
        })
    }

    render(){
        return (
            <div style={style}>
            <div style={ titleStyle }>Levels</div>
            
            <span>Score:{this.props.score}</span>
            <ul style={{width:'80%',margin:'auto',paddingInlineStart:"0"}}>
            {this.renderWords()}
            </ul>
            </div>
        );
    }


}