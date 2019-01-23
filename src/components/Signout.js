import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions'


class Signout extends Component{

    componentDidMount(){

        this.props.signout();
    }

    render(){
        return <div>Goodbye</div>
    }
}

function mapStateToProps(state){
    
    console.log("State of now",state)
    return { websocket: state.websocket}
}


export default connect(mapStateToProps, actions) (Signout);