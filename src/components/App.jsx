import React, { useState, useCallback } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import StreamCreate from './streams/StreamCreate';
import StreamEdit from './streams/StreamEdit';
import StreamList from './streams/StreamList';
import StreamShow from './streams/StreamShow';
import Profile from './Profile';
import Header from './header';
import history from '../history';
import Context from '../context/Context';
import Error from '../context/Error';
import CreateStory from './createStory';
import Story from './Story';
import Loader from './Loader';
const App = ({ loading }) => {
  const [replying, setReplying] = useState(0);
  const [globalError, setGlobalError] = useState('');

  return (
    <>
      <Error.Provider value={{ globalError, setGlobalError }}>
        <Context.Provider value={{ replying, setReplying }}>
          <Router history={history}>
            <Loader active={loading} />
            <Header />
            <div className="ui container" style={{ paddingBottom: '2rem' }}>
              <Switch>
                <Route path="/" exact component={StreamList} />
                <Route path="/streams/new" exact component={StreamCreate} />
                <Route path="/streams/edit/:id" exact component={StreamEdit} />
                <Route
                  path="/streams/delete/:id"
                  exact
                  component={StreamList}
                />
                <Route path="/streams/:id" exact component={StreamShow} />
                <Route path="/profile/:id?" exact component={Profile} />
                <Route path="/CreateStory" exact component={CreateStory} />
                <Route path="/ShowStory/:id" exact component={Story} />
              </Switch>
            </div>
          </Router>
        </Context.Provider>
      </Error.Provider>
    </>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.loading,
  };
};
export default connect(mapStateToProps, null)(App);
