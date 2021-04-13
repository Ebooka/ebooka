import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Compose from './components/Compose';
import Register from './components/auth/Register';
import Landing from './components/Landing';
import Read from './components/Read';
import Edit from './components/Edit';
import Profile from './components/Profile';
import Drafts from './components/Drafts';
import Search from './components/Search';
import User from './components/User';
import Genre from './components/Genre';
import Subgenre from './components/Subgenre';
import Configuration from './components/Configuration';
import store from './store';
import './style/mainStyle.min.css'
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { loadUser } from './actions/authActions';
import PreComposeData from './components/PreComposeData';
import TermsAndConditions from './components/TermsAndConditions';
import AboutUs from './components/AboutUs';
import Validate from "./components/auth/Validate";
import FourOFour from './components/FourOFour';
import EditCompose from './components/EditCompose';
import PasswordChange from './components/auth/PasswordChange';
import Cookies from './components/Cookies';

class App extends Component {

  componentDidMount() {
    store.dispatch(loadUser());
    const route = window.location.href;
    if(!route.includes('edit') && !route.includes('pre-compose') && !route.includes('compose') && !route.includes('edit-compose')) {
      document.cookie = 'writingData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // delete unnecesary cookie
      localStorage.removeItem('coverData');
    }
  };

  render() {
    return (
      <Router>
        <Provider store={store}>
          <Navbar/>
          <Switch>
            <Route exact path="/cookies" component={Cookies}/>
            <Route exact path="/validate/:id" component={Validate}/>
            <Route exact path="/about-us" component={AboutUs}/>
            <Route exact path="/terms-and-conditions" component={TermsAndConditions}/>
            <Route exact path="/genre/:genre/subgenre/:subgenre" component={Subgenre}/>
            <Route exact path="/genre/:genre" component={Genre}/>
            <Route exact path="/search/:term" component={Search}/>
            <Route exact path="/user/:username" component={User}/>
            <Route exact path="/profile/:username/configuration" component={Configuration}/>
            <Route exact path="/profile/:username" component={Profile}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/pre-compose" component={PreComposeData}/>
            <Route exact path="/compose" component={Compose}/>
            <Route exact path="/drafts" component={Drafts}/>
            <Route exact path="/read/:id" component={Read}/>
            <Route exact path="/edit/:id" component={Edit}/>
            <Route exact path="/edit-compose/:id" component={EditCompose}/>
            <Route exact path="/password/:token" component={PasswordChange}/>
            <Route exact path={["/filter:genre?", "/"]} component={Landing}/>
            <Route component={FourOFour}/>
          </Switch>
        </Provider>
      </Router>
    );
  };
}

export default App;
