import React, { useState, useContext, useEffect } from "react";
import CommentForm from "./CommentForm";
import Context from "../context/Context";
import { useDidMount } from "rooks";
import { connect } from "react-redux";
import { deleteComments, fetchProfile } from "../actions";

import Modal from "../Modal";
const Commentar = ({
  comment,
  deleteComments,
  usr,
  avatar,
  fetchProfile,
  name,
  isSignedIn,
}) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState(null);
  const { replying, setReplying } = useContext(Context);

  useDidMount(() => {
    fetchProfile();
  });
  const reply = () => {
    setOpen(true);
    setMode("Reply");
    setReplying(comment.id);
  };
  const updateComment = () => {
    setOpen(true);
    setMode("update");
    setReplying(comment.id);
  };
  const deleteComment = () => {
    setOpenModal(true);
  };
  useEffect(() => {
    action && deleteComments(comment.id, comment);
    setAction(null);
    setOpenModal(false);
  }, [action]);
  useEffect(() => {
    if (replying !== comment.id) {
      setOpen(false);
    }
  }, [replying]);
  return (
    <>
      <a class="avatar">
        <img src={avatar} />
      </a>
      <div class="content">
        <a class="author">{name}</a>
        <div class="metadata">
          <span class="date">{comment.date}</span>
        </div>
        <div class="text">{comment.comment}</div>
        <div class="actions">
          {isSignedIn && (
            <a class="reply" onClick={reply}>
              Reply
            </a>
          )}

          {comment.usr === usr && (
            <>
              <a class="reply" href="#" onClick={deleteComment}>
                Delete
              </a>
              <a class="reply" onClick={updateComment}>
                Edit
              </a>
            </>
          )}
        </div>
        {open && (
          <CommentForm
            comment={comment}
            mode={mode}
            streamId={comment.streamId}
            setOpen={setOpen}
          />
        )}
        {openModal && (
          <Modal header="Delete this comment" setAction={setAction}>
            <div class="ui comments">
              <div class="comment">
                <a class="avatar">
                  <img src={avatar} />
                </a>
                <div class="content">
                  <a class="author">{name}</a>
                  <div class="metadata">
                    <div class="date">{comment.date}</div>
                  </div>
                  <div class="text">{comment.comment}</div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};
const mapStateToProps = (state, ownProps) => {
  const currentUser = state.users[ownProps.comment.usr];
  const avatar = currentUser
    ? currentUser.avatar
    : "https://cdn2.iconfinder.com/data/icons/profile-basic/32/03_-_User_Deleted-512.png";
  const name = currentUser ? currentUser.name : ownProps.comment.usr;
  return {
    usr: state.auth.usr,
    avatar,
    name,
    isSignedIn: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, { deleteComments, fetchProfile })(
  Commentar
);
