import React from 'react';
import Signin from './auth/Signin';
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

        console.log("History props head in header are",this.props)

        return (
            <div>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <Signin history={this.props.history}/>
                </Modal>
    
            <div style={{margin:'50px'}}>
                <center><iframe width="560" height="315" src="https://www.youtube.com/embed/1mWlWLZFABY" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></center>
            </div>
            <center><button onClick={this.showModal} className="ui button primary massive">Start</button></center>
            <Footer />
            </div>
        )
        
    }
      

}

export default Welcome;