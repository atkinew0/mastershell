import React, {Component} from 'react';
import { reduxForm, Field} from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

const formStyle = {
  marginTop:"50px"
}

const instructionStyle = {
  width:"50%",
  border: "black solid 2px",
  margin: "auto",
  marginBottom: "50px",
  padding:"50px"
}

class Signup extends Component{

    onSubmit = (formProps) => {
        
        this.props.signup(formProps, () => {
            this.props.history.push('/feature');
        });
    }

    render(){
        

        const { handleSubmit } = this.props;

        return (
          <div style={formStyle}>
          <div style={instructionStyle}>
          <p>Instructions: To progress through levels mode begin by clicking on a level on the right
            side of the terminal and follow the prompt. To save a command to your spaced repetition collection click on the command on
            the left side of the terminal and add a prompt. To review your previously saved commands click the review button in the bottom left.
          </p>
          </div>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <fieldset>
              <label>First Name</label>
                <Field
                  name="firstname"
                  type="text"
                  component="input"
                  autoComplete="none"
                />
              <label>Last Name</label>
                <Field
                  name="lastname"
                  type="text"
                  component="input"
                  autoComplete="none"
                />
              </fieldset>
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
              <button>Sign Up!</button>
            </form>
            </div>
          );
        }
      
    
    

}

function mapStateToProps(state){
    return { errorMessage: state.auth.errorMessage}
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({form: 'signup'})
)(Signup);

