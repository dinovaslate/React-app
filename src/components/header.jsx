import React from "react";
import { Link } from "react-router-dom";
const GoogleAuth = React.lazy(() => import("./GoogleAuth"));
import { connect } from "react-redux";
import { useDidMount } from "rooks";
import { fetchAProfile } from "../actions";

const Header = ({ avatar, fetchAProfile, userId }) => {
  useDidMount(() => {
    if (userId && userId !== null) fetchAProfile(userId);
  });
  return (
    <>
      <div className="ui menu">
        <Link to="/" className="item header">
          Streamy
        </Link>
        <div className="right menu">
          <Link to="/" className="item">
            All Streams
          </Link>
          {avatar && (
            <Link to="/profile" className="item">
              <img className="ui avatar image" src={avatar?.avatar} />
              <span>{avatar?.name}</span>
            </Link>
          )}

          <div className="item">
            <React.Suspense
              fallback={<button className="ui button yellow">Loading</button>}
            >
              <GoogleAuth />
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    avatar: state.users[state.auth.userId],
    userId: state.auth.userId,
  };
};
export default connect(mapStateToProps, { fetchAProfile })(Header);
