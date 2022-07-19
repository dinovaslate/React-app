import React from 'react';
import { useParams } from 'react-router-dom';
import { useDidMount, useEffectOnceWhen } from 'rooks';
import { connect } from 'react-redux/es/exports';
import { fetchStory, fetchAProfile } from '../actions';
import Comments from './Comments';
import CommentForm from './CommentForm';
import history from '../history';
const Story = ({ users, story, fetchStory, auth }) => {
  const { id } = useParams();
  useDidMount(() => {
    if (!id) history.push('/');
    fetchStory(id);
  });
  useEffectOnceWhen(() => {
    fetchAProfile(story[id].usr);
  }, Object.values(story).length > 0);
  return (
    <>
      <div className="ui segment raised">
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div className="ui header">{story[id]?.title}</div>
          <div className="ui text">
            Made by {users[story[id]?.usr]?.name || '[Deleted]'}
          </div>
        </div>
        <br />
        <br />
        {story[id]?.story}
      </div>
      <Comments streamId={story[id]?.title} />
      {auth && <CommentForm mode="Reply" streamId={story[id]?.title} />}
    </>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    story: state.story,
    auth: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, { fetchStory, fetchAProfile })(Story);
