import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { deleteList } from "../../actions";
import history from "../../history";
import Modal from "../../Modal";
import { useEffectOnceWhen, useDidMount } from "rooks";
import { fetchList } from "../../actions";

const StreamDelete = ({ id, deleteList, streams, userID, fetchList }) => {
  const [action, setAction] = useState(null);
  const STREAM_ID = id;
  const handleDelete = () => {
    deleteList(STREAM_ID);
  };
  useDidMount(() => {
    if (streams === undefined) {
      fetchList();
    }
  });
  useEffectOnceWhen(() => {
    action ? handleDelete() : history.push("/");
  }, action !== null);
  useEffectOnceWhen(() => {
    if (streams[STREAM_ID].userId !== userID) {
      history.push("/");
    }
  }, streams[STREAM_ID] !== undefined && userID !== undefined && userID !== null);
  return (
    <Modal header="Delete this stream" setAction={setAction}>
      <div class="ui list">
        <div class="item">
          <i class="large github middle aligned icon"></i>
          <div class="content">
            <a class="header">{streams[STREAM_ID]?.title}</a>
            <div class="description">{streams[STREAM_ID]?.description}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    streams: state.streams,
    userID: state.auth.userId,
  };
};

export default connect(mapStateToProps, { deleteList, fetchList })(
  StreamDelete
);
