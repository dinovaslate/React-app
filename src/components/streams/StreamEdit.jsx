import React from "react";
import { fetchAList, changeList } from "../../actions";
import { connect } from "react-redux";
import { useDidMount, useEffectOnceWhen } from "rooks";
import StreamForm from "./StreamForm";
import history from "../../history";

const StreamEdit = ({
  fetchAList,
  changeList,
  match,
  initialValues,
  userID,
}) => {
  useDidMount(() => {
    fetchAList(match.params.id);
  });
  useEffectOnceWhen(() => {
    if (initialValues.userId !== userID) {
      history.push("/");
    }
  }, initialValues !== undefined && userID !== undefined && userID !== null);
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
    userID: state.auth.userId,
  };
};
export default connect(mapStateToProps, { fetchAList, changeList })(StreamEdit);
