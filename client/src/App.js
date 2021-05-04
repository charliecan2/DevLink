import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profiles from './components/profiles/Profiles';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path ='/' >
        <Landing />
      </Route>
      <Switch>
        <Route exact path='/register'>
          <Register />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route exact path='/profiles'>
          <Profiles />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
