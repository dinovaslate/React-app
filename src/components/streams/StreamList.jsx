import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchList } from '../../actions';
import { Link } from 'react-router-dom';
import StreamDelete from './StreamDelete';
import Context from '../../context/Error';
import Story from '../ShowStory';
import { fetchProfile } from '../../actions';
import ActionList from '../ActionList';
class StreamList extends Component {
  componentDidMount() {
    const { fetchList, fetchProfile } = this.props;
    fetchList();
    fetchProfile();
  }
  render() {
    const { streams, currentusr, isSignedIn, location, users } = this.props;
    const { globalError, setGlobalError } = this.context;
    return (
      <>
        {globalError && (
          <div class="ui message">
            <i class="close icon" onClick={() => setGlobalError('')}></i>
            <div class="header">{globalError.split(':')[0]}</div>
            <p>{globalError.split(':')[1]}</p>
          </div>
        )}
        <h1>Streams</h1>
        <div className="ui relaxed celled list">
          {streams.map(({ title, description, usr, id }, index) => (
            <div
              className="item"
              style={{
                display: 'grid',
                gridTemplateColumns: '30px 80%',
                position: 'relative',
              }}
              key={id}
            >
              {usr === currentusr && (
                <div
                  className="right floated content"
                  style={{
                    position: 'absolute',
                    inset: '50% 10px auto auto',
                    transform: 'translateY(-50%)',
                    zIndex: '9999',
                    cursor: 'pointer',
                  }}
                >
                  <i
                    className="ellipsis vertical icon"
                    id={`actionStream@${index}`}
                  ></i>
                  <ActionList id={`actionStream@${index}`}>
                    <Link to={`/streams/delete/${id}`}>Delete</Link>
                    <Link to={`streams/edit/${id}`}>Update</Link>
                  </ActionList>
                </div>
              )}
              <img class="ui avatar image" src={users[usr]?.avatar} />
              <div className="content">
                <Link to={`/streams/${id}`} className="header">
                  {title}
                </Link>
                <div className="description">{description}</div>
              </div>
            </div>
          ))}
        </div>
        {isSignedIn && (
          <Link
            to="/streams/new"
            className="right floated content ui button primary"
          >
            Create Stream
          </Link>
        )}

        {location.pathname.indexOf('/streams/delete') != -1 && (
          <StreamDelete id={this.props.match.params.id} />
        )}
        <Story />
      </>
    );
  }
}
StreamList.contextType = Context;
const mapStateToProps = (state) => {
  return {
    streams: Object.values(state.streams),
    currentusr: state.auth.usr,
    isSignedIn: state.auth.isSignedIn,
    users: state.users,
  };
};
export default connect(mapStateToProps, { fetchList, fetchProfile })(
  StreamList
);
