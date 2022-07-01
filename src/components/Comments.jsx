import React, { useRef, useState } from "react";
import { useDidMount } from "rooks";
import { useEffectOnceWhen } from "rooks";
import { connect } from "react-redux";
import Commentar from "./Comment";
import { fetchComments } from "../actions";
import { useLocation } from "react-router-dom";

const Comments = ({ streamId, replyTo = "none", comments, fetchComments }) => {
  const [viewReply, setViewReply] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  useDidMount(() => {
    replyTo === "none" && fetchComments();
    if (query.get("view") === "yes") setViewReply(true);
  });

  const renderComment = () => {
    return (
      <>
        {replyTo === "none" && <h3 className="ui dividing header">Comments</h3>}
        <div
          className={`${replyTo === "none" && "ui threaded"} comments`}
          style={{ maxWidth: "100%", marginBottom: "2rem" }}
        >
          {comments[replyTo].map((comment) => (
            <>
              <div className="comment">
                <Commentar comment={comment} />
                {comment.id in comments && (
                  <>
                    {viewReply && (
                      <ChildOfComments
                        streamId={streamId}
                        replyTo={comment.id}
                      />
                    )}
                    {!viewReply && (
                      <b
                        className="ui blue text"
                        style={{ marginLeft: "50px", color: "blue" }}
                        onClick={() => setViewReply(!viewReply)}
                      >
                        View Reply
                      </b>
                    )}
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
