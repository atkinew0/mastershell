import React from 'react';
import Signin from './auth/Signin';
import { isAbsolute } from 'path';
import Modal from './Modal'
import Footer from './Footer'

let contStyle ={
    position:'relative',
    top:'30px',
    display: "flex",
    flexDirection:"column",
    justifyContent:"center"
}

let frameStyle = {
   margin:'100px'

}

let SigninStyle = {
    margin:"auto"
}

let titleStyle={
    margin:"auto",
    padding:"20px"
}

class Welcome extends React.Component {

    state = { show: false };

    showModal = () => {
        console.log("Clicked show");
        this.setState({ show: true });
      };
    
      hideModal = () => {
        this.setState({ show: false });
      };

    render(){

        return (
            <div>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <Signin history={this.props.history}/>
                </Modal>
    
            <div style={{margin:'50px'}}>
                <center><iframe style={{frameStyle}} width="600" height="400" src="https://www.youtube.com/embed/9YffrCViTVk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>
            </div>
            <center><button onClick={this.showModal} className="ui button large">open</button></center>
            <Footer />
            </div>
        )
        
    }
      

}

export default Welcome;