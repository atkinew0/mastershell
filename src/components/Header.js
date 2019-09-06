import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import './HeaderStyle.css'
import Modal from './Modal'
import Signin from './auth/Signin';

let headerStyle = {
    
    height:'auto',
    zIndex:'9999',
    width:'100%',
    backgroundColor: 'rgba(10,3,3,.26)',
    margin:'0',
    padding:'0'

}

let spanStyle = {
    fontFamily:'Electrolize',
    fontSize:'32px',
    fontWeight:'400',
    color:'black',
    textDecoration:'none',
    letterSpacing:'4.3px',
    padding:"35px",
    verticalAlign:'baseline',
    display:'inline-block'
}

let navStyle = {
    display:'inline-block',
    float:'right',
    marginRight:'50px'

}

let linkStyle = {

    display:'inline-block',
    padding:'20px 20px'

}

class Header extends Component {

    state = { show: false };

    showModal = () => {
        console.log("Clicked show");
        this.setState({ show: true });
      };
    
      hideModal = () => {
        this.setState({ show: false });
      };

    renderLinks(){
        
        if(this.props.authenticated){
            return(
                <div>
                  
                </div>
            )
        }else{
            return (
                <div>
                     <Link to="/signup"><button>Signup</button></Link>
                     <Link to="/"><button>Sign In</button></Link>
                </div>
            )
        }

    }

    render(){

        

        return (
        <div>
            <div>
           
            </div>
        <div className="header">
            <header style={headerStyle}>
                <a href="/" style={spanStyle}> Mastershell</a>

                <nav style={navStyle}>
                    <ul >
                        <Link to="/Signin" style={linkStyle}>login</Link>
                        <Link to="/about" style={linkStyle}>about</Link>
                        
                       
                    </ul>

                </nav>
            </header>

           
        </div>
        {this.renderLinks()}
         
         </div>
        )
    }

}

function mapStateToProps(state){
    return { authenticated: state.auth.authenticated}
}

export default connect(mapStateToProps)(Header);