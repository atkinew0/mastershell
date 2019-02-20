import React from 'react';

const HOST = process.env.REACT_APP_BACKEND || "mv2-dev.us-east-1.elasticbeanstalk.com";

const style = {
    border: '2px black solid',
    background: 'pink',
    position: 'fixed',
    height:'80%',
    width:'60%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '100',
    borderRadius:'10px'
    }

const askStyle = {
    position: 'fixed',
    height:'30%',
    width:'40%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '101',
    borderRadius:'10px',
    border:'solid red 2px',
    background:'lightgrey'
}
const tableI ={
    border:'solid black 1px',
    textAlign:'center'
}

const checkStyle = {
    height:'2rem',
    width:'2rem'
}

const tableStyle = {
    margin:'auto',
    width:'90%',
    height:'90&'
}

class EditCommands extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            commands:[],
            confirmDelete:false,
            askDelete:false
        
        }
    }

    componentDidMount(){
        this.getCommands();
    }

    setDelete = (event, id) => {

        let checked = event.target.checked ? true: false;

        let commands = this.state.commands.map(command => {
            if(command.id === id){

                return {...command, delete: checked}
            }else{
                return {...command}
            }
        });

        this.setState({commands:commands});

    }

    myCommands = (commands) => {

        let now = new Date().getTime();

        return this.state.commands.map( command => {
            return (<tr style={tableI} key={command.id}>
                        <td style={tableI}>{command.id}</td>
                        <td style={tableI}>{command.answer}</td>
                        <td style={tableI}>{command.prompt}</td>
                        <td style={tableI}>{Math.round(Math.max((command.due - now)/(24*60*60*1000),0))} days</td>
                        <td style={tableI}><input style={checkStyle} onClick={(event) => this.setDelete(event, command.id)} type="checkbox"/></td>
                    </tr>)
        })

    }

    getCommands = () => {

        const myHeaders = new Headers();
        
        myHeaders.append('Authorization',localStorage.getItem('token'));
        myHeaders.append('Content-Type', 'application/json');

        const theReq = `http://${ HOST }/api/srs/all?uid=${this.props.userID}`;

        fetch(theReq, {method:'GET', headers:myHeaders}).then( (res,err) => {
            if(err)
                console.log(err)
            else
                return res.json()
        }).then(text =>{
            console.log("My commands are",text)

            let commands = text.map(command => {
                return {...command, delete:false}
            });

            this.setState({commands:commands})
        })

    }

    renderAsk(){

        let toDelete = this.state.commands.filter(command => command.delete).map(command => <p>{command.answer}</p>);

        if(this.state.askDelete){
            return (
                <div style={askStyle}>
                <p>Are you sure you want to delete these comands?<br/>{toDelete}</p>
                <button onClick={() => {this.setState({confirmDelete:true}, () => {
                    this.delete()
                });
                    } }>Delete</button>
                <button onClick={() => this.setState({askDelete:false}) }>Cancel</button>
                </div>
                )
        }
    }

    delete = () => {

        let toDelete = this.state.commands.filter(command => command.delete).map(command => command.id);
        console.log("Todelete is here", toDelete)

        if(!this.state.confirmDelete){
            this.setState({askDelete:true})
        }else{
            console.log("carrying out delete operation")
            this.setState({askDelete:false, confirmDelete:false})

            const theReq = `http://${ HOST }/api/srs/delete`;

            const theBody = {
                user:this.props.userID,
                deleteItems:toDelete
            }

            fetch(theReq, {
                body: JSON.stringify(theBody), // data can be `string` or {object}!
                headers:{
                'Content-Type': 'application/json',
                'Authorization':localStorage.getItem('token')
                },
                method:'POST'}).then( res => {
                if(!res.ok) console.log(res.status);

                this.getCommands();
    
                });

        }
        

    }





    render(){

        return (
        
        <div style={style}>
            <h2>Edit Commands</h2>
            <table style={tableStyle}>
            <tbody>
            <tr style={tableI}>
                <th style={tableI}>ID</th>
                <th style={tableI}>Command</th>
                <th style={tableI}>Prompt</th>
                <th style={tableI}>Due</th>
                <th style={tableI}>Delete</th>
            </tr>
                {this.myCommands()}
                </tbody>
            </table>
            <button onClick={this.delete}>Delete</button>
            <button onClick={this.props.close}>Close</button>
            {this.renderAsk()}
        </div>
        )
    }
}

export default EditCommands;