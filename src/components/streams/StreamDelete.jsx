import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { deleteList } from "../../actions";
import history from "../../history";
import Modal from "../../Modal";
import { useEffectOnceWhen } from "rooks";

const StreamDelete = ({ id, deleteList, streams }) => {
  const [action, setAction] = useState(null);
  const { title, description } = streams;
  const handleDelete = () => {
    deleteList(id);
  };
  useEffectOnceWhen(() => {
    action ? handleDelete() : history.push("/");
  }, action !== null);
  return (
    <Modal header="Delete this stream" setAction={setAction}>
      <div class="ui list">
        <div class="item">
          <i class="large github middle aligned icon"></i>
          <div class="content">
            <a class="header">{title}</a>
            <div class="description">{description}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    streams: state.streams[ownProps.id],
  };
};

export default connect(mapStateToProps, { deleteList })(StreamDelete);
