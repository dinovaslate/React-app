import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { deleteList } from "../../actions";
import history from "../../history";
import Modal from "../../Modal";
import { useEffectOnceWhen, useDidMount } from "rooks";
import { fetchList } from "../../actions";

const StreamDelete = ({ id, deleteList, streams, usr, fetchList }) => {
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
    if (streams[STREAM_ID].usr !== usr) {
      history.push("/");
    }
  }, streams[STREAM_ID] !== undefined && usr !== undefined && usr !== null);
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
    usr: state.auth.usr,
  };
};

export default connect(mapStateToProps, { deleteList, fetchList })(
  StreamDelete
);
