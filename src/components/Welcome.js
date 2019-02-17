import React from 'react';
import Signin from './auth/Signin';

let contStyle ={
    display: "flex",
    flexDirection:"column",
    justifyContent:"center"
}

let SigninStyle = {
    margin:"auto"
}

let titleStyle={
    margin:"auto",
    padding:"20px"
}

export default (props) => {
    return (
        <div style={contStyle}>
        <h1 style={titleStyle}>Mastershell</h1>
        <h3 style={titleStyle}>Bash Command Line Trainer</h3>
        <Signin history={props.history} SigninStyle={SigninStyle} />
        </div>

    ) 
}