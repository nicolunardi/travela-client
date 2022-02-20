import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import {
  EditListing,
  HostedListings,
  Login,
  NewListing,
  Register,
  Landing,
  ListingInfo,
  HostedListingInfo,
} from './pages';
import { NavBarTop } from './components/nav';
import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Router>
        <NavBarTop />
        <Switch>
          <Route path="/login">{user.token ? <Redirect to="/"></Redirect> : <Login></Login>}</Route>
          <Route path="/register">
            {user.token ? <Redirect to="/"></Redirect> : <Register></Register>}
          </Route>
          <Route path="/user/listings" exact>
            {user.token ? <HostedListings></HostedListings> : <Redirect to="/"></Redirect>}
          </Route>
          <Route path="/user/listings/edit/:id">
            {user.token ? <EditListing></EditListing> : <Redirect to="/"></Redirect>}
          </Route>
          <Route path="/user/listings/info/:id">
            {user.token ? <HostedListingInfo></HostedListingInfo> : <Redirect to="/"></Redirect>}
          </Route>
          <Route path="/user/listings/newListing">
            {user.token ? <NewListing></NewListing> : <Redirect to="/"></Redirect>}
          </Route>
          <Route path="/listings/:id/:start?/:end?">
            <ListingInfo></ListingInfo>
          </Route>
          <Route path="/">
            <Landing></Landing>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
