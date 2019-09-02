import React, {Component} from 'react';
import { reduxForm, Field} from 'redux-form';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import terminal from '../../assets/terminal.ico';


const nStyle = {

  margin: "50px",
  display: "flex",
  flexDirection:'column',
  justifyContent:'center',
  marginLeft:'40%'

}

const imgStyle = {
  width:'30%',
  height:'30%',
  margin:'auto'
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
          <>
          <center><img alt="terminal" style={imgStyle} src={terminal} /></center>
          <div className="ui stacked segment" style={this.props.SigninStyle}>
            
            <form className="ui large form"  onSubmit={handleSubmit(this.onSubmit)}>
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
              <center><button className="ui large button" style={{margin:'15px'}}>Sign In!</button></center>
            </form>


            <div style={nStyle}>
              <label style={{fontSize:'inherit',fontFamily:'inherit'}}>New User? </label>
              <Link to="/signup"><button className="ui large button">Sign Up</button></Link>
            </div>

            </div>
            </>
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

