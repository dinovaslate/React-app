import React, { useRef } from "react";
import { connect } from "react-redux";
import { changeComments, createComments } from "../actions";
import { useDidMount } from "rooks";

const CommentForm = ({
  comment,
  mode,
  streamId,
  createComments,
  changeComments,
  setOpen,
}) => {
  const textareaRef = useRef();
  useDidMount(() => {
    if (mode === "update") {
      textareaRef.current.defaultValue = comment.comment;
    }
  });
  const submit = () => {
    const message = textareaRef.current.value;
    const replyTo =
      mode === "Reply" ? (!comment ? "none" : comment.id) : comment.replyTo;

    if (mode === "Reply") {
      createComments({
        streamId,
        comment: message,
        replyTo,
        date: new Date().toLocaleString(),
      });
      if (setOpen !== undefined) setOpen(false);
    } else if (mode === "update") {
      changeComments(comment.id, {
        streamId,
        comment: message,
        replyTo,
        date: new Date().toLocaleString(),
      });
      if (setOpen !== undefined) setOpen(false);
    }
  };
  return (
    <>
      <form className="ui reply form">
        <div className="field">
          <textarea ref={textareaRef}></textarea>
        </div>
        <div
          className={`ui ${
            mode === "Reply" ? "blue" : "orange"
          } labeled submit icon button`}
          onClick={submit}
        >
          <i className="icon edit"></i>{" "}
          {mode === "Reply" ? "Add Reply" : "Edit Comment"}
        </div>
      </form>
    </>
  );
};

export default connect(null, { changeComments, createComments })(CommentForm);
