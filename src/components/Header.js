import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import './HeaderStyle.css'

class Header extends Component {

    renderLinks(){
        
        if(this.props.authenticated){
            return(
                <div>
                     <Link to="/signout"><button>Sign Out</button></Link>
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
        <div className="header">
            <p >BETA: 'hint' for a hint or 'next' to skip question</p>
            {this.renderLinks()}
        </div>
        )
    }

}

function mapStateToProps(state){
    return { authenticated: state.auth.authenticated}
}

export default connect(mapStateToProps)(Header);