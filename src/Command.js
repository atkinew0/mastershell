//@ts-check
import React from 'react';
import Popup from './Popup';

const style = {

    margin: '2px'
}


export default class Command extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            renderPop:false
        };

        
    }

    onClose = () => {
        this.setState({renderPop:false});
    }

    renderPop(){
        
        if(this.state.renderPop){
            return <Popup userID={this.props.userID} close ={this.onClose} data={this.props.data} />
        }
    }
    
    handleClick = (element) => {
        
        this.setState( {renderPop:true} );
        //rendering a Popup when clicked that allows user to save to database
    }

    render(){
        return (
        <div>
            <div style={style} className="ui fluid button large" onClick={this.handleClick} > {this.props.data.command} </div>
            {this.renderPop()}
            </div>
        );
    }

}