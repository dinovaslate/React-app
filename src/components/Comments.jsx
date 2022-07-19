import React, { useRef, useState } from 'react';
import { useDidMount } from 'rooks';
import { useEffectOnceWhen } from 'rooks';
import { connect } from 'react-redux';
import Commentar from './Comment';
import { fetchComments } from '../actions';

const Comments = ({ streamId, replyTo = 'none', comments, fetchComments }) => {
  useDidMount(() => {
    replyTo === 'none' && fetchComments();
  });

  const renderComment = () => {
    return (
      <>
        {replyTo === 'none' && <h3 className="ui dividing header">Comments</h3>}
        <div
          className={`${replyTo === 'none' && 'ui threaded'} comments`}
          style={{ maxWidth: '100%', marginBottom: '2rem' }}
        >
          {comments[replyTo]?.map((comment) => (
            <>
              <div className="comment">
                <Commentar comment={comment} />
                {comment.id in comments && (
                  <>
                    <ChildOfComments streamId={streamId} replyTo={comment.id} />
                  </>
                )}
              </div>
            </>
          ))}
        </div>
      </>
    );
  };
  return (
    <>
      {comments === undefined ? (
        <h3 className="ui dividing header">No Comments</h3>
      ) : (
        renderComment()
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    comments: state.comment[ownProps.streamId],
  };
};
const ChildOfComments = connect(mapStateToProps, { fetchComments })(Comments);
export default ChildOfComments;
