import React, {Component} from 'react';
import { reduxForm, Field} from 'redux-form';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import terminal from '../../assets/terminal.ico';

const buttonStyle = {
  display:"block",
  width:"100%"
}

const nStyle = {

  margin: "50px",
  display: "flex"

}

class Signin extends Component{

    onSubmit = (formProps) => {
        
        this.props.signin(formProps, () => {
            this.props.history.push('/feature');
        });
    }

    render(){
        

        const { handleSubmit } = this.props;
      
        return (
          <div style={this.props.SigninStyle}>
            <img alt="terminal" src={terminal} />
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <fieldset>
                <label>Email</label>
                <Field
                  name="email"
                  type="text"
                  component="input"
                  autoComplete="none"
                />
              </fieldset>
              <fieldset>
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  component="input"
                  autoComplete="none"
                />
              </fieldset>
              <div>{this.props.errorMessage}</div>
              <button style={buttonStyle}>Sign In!</button>
            </form>


            <div style={nStyle}>
              <p>New User?  </p><Link to="/signup"><button>Sign Up</button></Link>
            </div>

            </div>
          );
          
        }
      

}

function mapStateToProps(state){
    return { errorMessage: state.auth.errorMessage}
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({form: 'signin'})
)(Signin);

