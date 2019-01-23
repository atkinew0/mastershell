import React, { Component } from 'react';
import Header from "./Header";


class App extends Component{
    

    render(){

        console.log(this.props.children)

        return (
            <div>
            <Header/>
            {this.props.children}
            </div>
        )
    }
}

export default App;