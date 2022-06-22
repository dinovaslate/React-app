import React from "react";
import { connect } from "react-redux";
import { fetchAList } from "../../actions";
import { useDidMount } from "rooks";
const StreamShow = ({ stream, fetchAList, match }) => {
  const STREAM_ID = match.params.id;
  useDidMount(() => {
    fetchAList(STREAM_ID);
  });
  const { title, description } = stream;
  return (
    <>
      {!stream ? (
        <div>Loading</div>
      ) : (
        <div>
          <h1 style={{ textTransform: "capitalize" }}>{title}</h1>
          <p>{description}</p>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    stream: state.streams[ownProps.match.params.id],
  };
};
export default connect(mapStateToProps, { fetchAList })(StreamShow);
