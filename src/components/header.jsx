import React from 'react';
import { Link } from 'react-router-dom';
import { useDidMount } from 'rooks';
const GoogleAuth = React.lazy(() => import('./GoogleAuth'));

const Header = ({ avatar, fetchAProfile, usr }) => {
  useDidMount(() => {
    if (usr && usr !== null) fetchAProfile(usr);
  });
  return (
    <>
      <div className="ui menu" style={{ marginTop: '-3px' }}>
        <Link to="/" className="item header">
          Streamy
        </Link>
        <div className="right menu">
          <Link to="/" className="item d-none-small">
            All Streams
          </Link>

          <React.Suspense
            fallback={<button className="ui button yellow">Loading</button>}
          >
            <GoogleAuth />
          </React.Suspense>
        </div>
      </div>
    </>
  );
};

export default Header;
