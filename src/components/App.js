import React, { Component } from 'react';
import Header from "./Header";

const AppStyle = {
    textAlign:"center"
}

class App extends Component{
    

    render(){

        return (
            <div style={AppStyle}>
            <Header/>
            {this.props.children}
            </div>
        )
    }
}

export default App;