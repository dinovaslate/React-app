import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
const renderInput = ({ input, id, label, placeholder, meta, defaultValue }) => {
  return (
    <>
      <div className={`field ${meta.touched && meta.error && "error"} `}>
        <label htmlFor={id}>{label}</label>
        <input type="text" id={id} placeholder={placeholder} {...input} />
        {meta.touched && meta.error && (
          <div className="ui message red">{meta.error}</div>
        )}
      </div>
    </>
  );
};

const StreamForm = ({ onSubmit, handleSubmit }) => {
  const submitForm = (formValues) => {
    onSubmit(formValues);
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} className="ui form">
        <Field
          name="title"
          id="title"
          defaultValue="hello"
          label="Enter Title"
          placeholder="Shimmy shimmy yeah yeah"
          component={renderInput}
        />
        <Field
          name="description"
          id="title"
          label="Enter Description"
          placeholder="Brother Falih"
          component={renderInput}
        />
        <button type="submit" className="ui button primary">
          Submit
        </button>
      </form>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};
  if (!formValues.title) {
    errors.title = "You must enter a title";
  }
  if (!formValues.description) {
    errors.description = "You must enter a description";
  }

  return errors;
};

export default reduxForm({
  form: "streamForm",
  validate,
  enableReinitialize: true,
  destroyOnUnmount: false,
})(StreamForm);
