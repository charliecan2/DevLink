import React, { Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profiles from './components/profiles/Profiles';
import Dashboard from './components/layout/Dashboard';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token){
  setAuthToken(localStorage.token)
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser)
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
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
            <Route exact path='/dashboard'>
              <Dashboard />
            </Route>
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
