import React from "react";
import { fetchAList, changeList } from "../../actions";
import { connect } from "react-redux";
import { useDidMount } from "rooks";
import StreamForm from "./StreamForm";

const StreamEdit = ({ fetchAList, changeList, match, initialValues }) => {
  useDidMount(() => {
    fetchAList(match.params.id);
  });
  const onSubmit = (formValues) => {
    changeList(match.params.id, formValues);
  };
  return (
    <>
      <h2 className="ui header">Edit Stream</h2>
      <StreamForm onSubmit={onSubmit} initialValues={initialValues} />
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.streams[ownProps.match.params.id],
  };
};
export default connect(mapStateToProps, { fetchAList, changeList })(StreamEdit);
