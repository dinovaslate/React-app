import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchList } from "../../actions";
import { Link } from "react-router-dom";
import StreamDelete from "./StreamDelete";
import Context from "../../context/Error";
class StreamList extends Component {
  componentDidMount() {
    const { fetchList } = this.props;
    fetchList();
  }
  render() {
    const { streams, currentUserId, isSignedIn, location } = this.props;
    const { globalError, setGlobalError } = this.context;
    return (
      <>
        {globalError && (
          <div class="ui message">
            <i class="close icon" onClick={() => setGlobalError("")}></i>
            <div class="header">{globalError.split(":")[0]}</div>
            <p>{globalError.split(":")[1]}</p>
          </div>
        )}
        <h1>Streams</h1>
        <div className="ui relaxed celled list">
          {streams.map(({ title, description, userId, id }) => (
            <div className="item" key={id}>
              {userId === currentUserId && (
                <div className="right floated content">
                  <Link to={`/streams/delete/${id}`} className="ui button red">
                    Delete
                  </Link>
                  <Link to={`streams/edit/${id}`} className="ui button yellow">
                    Update
                  </Link>
                </div>
              )}
              <i className="large github middle aligned icon"></i>
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

        {location.pathname.indexOf("/streams/delete") != -1 && (
          <StreamDelete id={this.props.match.params.id} />
        )}
      </>
    );
  }
}
StreamList.contextType = Context;
const mapStateToProps = (state) => {
  return {
    streams: Object.values(state.streams),
    currentUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, { fetchList })(StreamList);
