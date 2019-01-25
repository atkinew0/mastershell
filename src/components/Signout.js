import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions'


class Signout extends Component{
    constructor(props){
        super(props)
        this.state = {};
    }

    componentDidMount(){

        this.props.signout();
        console.log("state now",this.props.mySocket)
        this.props.mySocket.websocket.close()
    }

    render(){
        return <div>Goodbye</div>
    }
}

function mapStateToProps(state){
    
    console.log("State of now",state)
    return { mySocket : state.websocket}
}


export default connect(mapStateToProps, actions) (Signout);