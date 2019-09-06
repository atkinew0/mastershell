import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import './HeaderStyle.css'

export default  class About extends Component {

    render() {

        return (
            <div className="ui container">
                <p>This terminal in browser was created as a learning tool to help users who have a basic familiarity with a Linux terminal environment familiarize themselves with some often used commands.</p>
                <p>The system monitors valid Linux commands entered and lists commands used in the area on the left side. Those commands can then be clicked to store them in the user's database to be reviewed at a later time using a simple spaced repetition algorithm. If the command is recalled correctly then the interval until which when it will next be asked is increased (approximately doubled). If the command is answered incorrectly then the interval is reset. The edit command button can also be used to see or delete stored commands.</p>
                <p>The area on the right provides pre-made levels which attempt to go from a basic to intermediate level of common Linux commands. Levels are locked until previous levels are completed, but users can see correct answers by typing "hint" or skip questions by typing "next".</p>
                <p>Technologies Used:
                    <ul>
<li>Xterm js - used to show the frontend terminal in the browser</li>
<li>React - the other parts of the frontend UI are build with React</li>
<li>Nodejs - the backend server API uses Nodejs for the database and auth routes and also orchestrates the containers. Hosted on AWS.</li>
<li>Docker - Xterm connects to a container running Bash in Ubuntu over a websocket. A new enviroment can be quickly spun up each time a user connects and discarded when the user disconnects. Only levels completed and questions saved to the database are permanent.</li>
<li>MongoDB - questions and user information are stored on a MongoDB database</li>
</ul>
</p>
            </div>
        )
    }


}