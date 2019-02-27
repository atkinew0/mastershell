import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App'
import Welcome from './components/Welcome';
import Signup from './components/auth/Signup';
import reducers from './reducers';
import Signout from './components/Signout'
import Signin from './components/auth/Signin';
import ReactXterm from './ReactXterm';

import './index.css';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

const store = createStore(reducers,
     { auth: { authenticated: localStorage.getItem('token')}
       },
      applyMiddleware(reduxThunk) );

ReactDOM.render(
<Provider store ={store} >
    <BrowserRouter>
    <App>
        <Route path ='/' exact component={Welcome}/>
        <Route path='/signup' component={Signup} />
        <Route path='/feature' component={ReactXterm}/>
        <Route path='/signout' component={Signout}/>
        <Route path='/signin' component={Signin}/>
    </App>
    </BrowserRouter>
</Provider>, document.getElementById("root"));
