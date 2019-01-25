import React, {Component} from 'react';
import { reduxForm, Field} from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

const formStyle = {
  marginTop:"50px"
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

