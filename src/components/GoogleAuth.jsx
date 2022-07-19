import React from 'react';

import { connect } from 'react-redux/es/exports';
import { signIn, signOut } from '../actions';
import { fetchAProfile } from '../actions';
import history from '../history';
import ActionList from './ActionList';
import { Link } from 'react-router-dom';
class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          clientId:
            '129235200710-fmujgvvof7otr0d18hcp23pjk63ksggn.apps.googleusercontent.com',
          scope: 'email',
          plugin_name: 'streamy',
        })
        .then(() => {
          console.log('hello');
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    const { signIn, signOut, fetchAProfile } = this.props;
    if (isSignedIn) {
      console.log('here');
      signIn(this.auth.currentUser.get().getId());
      fetchAProfile(this.auth.currentUser.get().getId());
    }
  };

  componentDidUpdate() {
    const { isSignedIn } = this.props;
    if ((isSignedIn !== null) & !isSignedIn) {
      this.auth.signOut();
      history.push('/');
    }
  }

  renderAuthButton = () => {
    const { isSignedIn } = this.props;
    if (isSignedIn) {
      const { avatar } = this.props;
      return (
        <>
          {avatar && (
            <div
              style={{ position: 'relative', borderLeft: '1px solid #eee' }}
              className="item"
              id="avatar@googleAuth"
            >
              <img className="ui avatar image" src={avatar?.avatar} />
              <span>{avatar?.name}</span>
              <ActionList
                hover
                start
                id="avatar@googleAuth"
                style={{ width: '150px', top: '35px' }}
              >
                <div
                  style={{ display: 'flex', gap: '5px' }}
                  onClick={() => this.props.signOut()}
                >
                  <i className="google icon"></i>Sign Out
                </div>
                <Link to={`/profile/${this.props.usr}`}>Show Profile</Link>
              </ActionList>
            </div>
          )}
        </>
      );
    }
    return (
      <div
        className="item"
        style={{ position: 'relative', borderLeft: '1px solid #eee' }}
      >
        <div
          style={{ display: 'flex', gap: '5px' }}
          onClick={() => this.auth.signIn()}
        >
          <i className="google icon"></i>Sign In with Google
        </div>
      </div>
    );
  };
  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    avatar: state.users[state.auth.usr],
    usr: state.auth.usr,
  };
};
export default connect(mapStateToProps, {
  signIn,
  signOut,
  fetchAProfile,
})(GoogleAuth);
