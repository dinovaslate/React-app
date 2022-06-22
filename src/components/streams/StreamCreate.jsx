import React from "react";
import { connect } from "react-redux";
import { createStreams } from "../../actions";
import StreamForm from "./StreamForm";

class StreamCreate extends React.Component {
  onSubmit = (formValues) => {
    const { createStreams } = this.props;
    createStreams(formValues);
  };

  render() {
    return (
      <>
        <h2 className="ui header">Create Stream</h2>
        <StreamForm onSubmit={this.onSubmit} />
      </>
    );
  }
}

export default connect(null, { createStreams })(StreamCreate);
