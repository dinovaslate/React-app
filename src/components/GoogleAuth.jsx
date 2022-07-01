import React from "react";

import { connect } from "react-redux/es/exports";
import { signIn, signOut } from "../actions";
import { fetchAProfile } from "../actions";
import history from "../history";
class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "129235200710-fmujgvvof7otr0d18hcp23pjk63ksggn.apps.googleusercontent.com",
          scope: "email",
          plugin_name: "streamy",
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    const { signIn, signOut, fetchAProfile } = this.props;
    if (isSignedIn) {
      signIn(this.auth.currentUser.get().getId());
      fetchAProfile(this.auth.currentUser.get().getId());
    } else {
      signOut();
    }
  };
  renderAuthButton = () => {
    const { isSignedIn } = this.props;
    if (isSignedIn === null) {
      return (
        <div className="ui button blue" onClick={() => this.auth.signIn()}>
          <i className="google icon"></i>Sign In with Google
        </div>
      );
    } else if (isSignedIn) {
      return (
        <div className="ui button red" onClick={() => this.auth.signOut()}>
          <i className="google icon"></i>Sign Out
        </div>
      );
    } else {
      return (
        <div className="ui button blue" onClick={() => this.auth.signIn()}>
          <i className="google icon"></i>Sign In with Google
        </div>
      );
    }
  };
  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, {
  signIn,
  signOut,
  fetchAProfile,
})(GoogleAuth);
