import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  useDebounce,
  useDidMount,
  useEffectOnceWhen,
  useWillUnmount,
} from 'rooks';
import { connect } from 'react-redux';
import { createStory, changeStory } from '../actions';
import makeRegex from '../utils/arrayOfPrep';
import {
  formUndo,
  formRedo,
  formChanged,
  formSave,
  formGoTo,
  fetchStory,
  initStory,
} from '../actions';

import _, { omit } from 'lodash';
import { useLocation } from 'react-router-dom';
const CreateStory = ({
  form,
  formRedo,
  formUndo,
  formChanged,
  formSave,
  formGoTo,
  createStory,
  fetchStory,
  story,
  changeStory,
  initStory,
  auth,
}) => {
  const [formValue, setFormValue] = useState({});
  const [collapsed, setCollapsed] = useState(true);
  const [ActiveVersion, setActiveVersion] = useState(0);
  const setFormValueDebounced = useDebounce(setFormValue, 700);
  const query = new URLSearchParams(useLocation().search);
  const regexCheckIfDigit = /[A-Za-z]+\d+/;
  const regexCheckCapitalization = /\. ?[a-z]+/;
  const regexCheckTitle = /^[A-Z]{1}[^aieou]?[^0-9]*$/;
  const regexException = new RegExp(makeRegex.join('|'));
  const regexDigit = /^\d+$/;
  const preload = useRef('');

  const validateTitle = () => {
    const value = formValue['title'];
    const element = document.querySelector(`input[name="title"]`);
    const checkString = value.split(' ');
    if (checkString.length < 2) {
      element.setCustomValidity('You must have 2 or more words in the title');
      element.reportValidity();
      return false;
    }
    for (const string of checkString) {
      if (!regexCheckTitle.test(string)) {
        if (!regexException.test(string)) {
          if (!regexDigit.test(string)) {
            element.setCustomValidity(
              'The title must have correct capitalization and we prohibit any words with digit in it'
            );
            element.reportValidity();
            return false;
          }
        }
      }
    }

    return true;
  };
  const validateOthers = () => {
    let ret = true;
    const values = _.omit({ ...formValue }, 'title');

    for (const [key, val] of Object.entries(values)) {
      const element = document.querySelector(
        `${key !== 'story' ? 'input' : 'textarea'}[name="${key}"]`
      );
      if (regexCheckIfDigit.test(val)) {
        ret = false;
        element.setCustomValidity(
          "Check if there are words with digit in it, it's prohibited"
        );
      }
      if (regexCheckCapitalization.test(val)) {
        ret = false;
        element.setCustomValidity('Check the Capitalization');
      }
      if (!ret) {
        element.reportValidity();
        return false;
      }
    }
    return true;
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (validateTitle() && validateOthers()) {
      const ID = query.get('id');
      ID ? changeStory(ID, formValue) : createStory(formValue);
    }
  };
  const handleChange = (e, debounce = true) => {
    e.setCustomValidity('');
    const change = (prevValue) => ({
      ...prevValue,
      [e.name]: e.value,
    });
    debounce ? setFormValueDebounced(change) : setFormValue(change);
  };

  const keyEvent = useCallback((e) => {
    if (e.ctrlKey && e.keyCode === 89) {
      formRedo();
      e.preventDefault();
    } else if (e.ctrlKey && e.keyCode === 90) {
      handleUndo();
      e.preventDefault();
    }
  }, []);

  useEffectOnceWhen(() => {
    initStory(auth);
    if (query.get('id')) {
      fetchStory(query.get('id'));
    }

    const inputs = document.querySelectorAll('input, textarea');
    for (const input of inputs) {
      handleChange(input, false);
    }
  }, auth);
  useDidMount(() => {
    window.addEventListener('beforeunload', () => {
      formSave();
    });
    document.body.addEventListener('keydown', keyEvent);
  });
  useWillUnmount(() => {
    document.body.removeEventListener('keydown', keyEvent);
  });
  useEffectOnceWhen(() => {
    preload.current = story[query.get('id')];
    const inputs = document.querySelectorAll('input, textarea');
    for (const input of inputs) {
      input.value = preload.current[input.name];
      handleChange(input, false);
    }
  }, Object.values(story).length !== 0 && query.get('id'));
  useEffect(() => {
    if (!_.isEqual(form.present, formValue)) formChanged(formValue);
  }, [formValue]);

  const handleUndo = () => {
    formUndo();
  };
  const handleRedo = () => {
    formRedo();
  };

  useEffect(() => {
    if (form.present !== null && !_.isEqual(form.present, formValue)) {
      const inputs = document.querySelectorAll('input, textarea');
      for (const input of inputs) {
        input.value = form.present[input.name];
        handleChange(input, false);
      }
    }
    const forms = [...form.past, form.present, ...form.future];
    const currentForm = forms.indexOf(form.present);
    currentForm > 0 && setCollapsed(false);
    setActiveVersion(currentForm);
  }, [form.present]);

  return (
    <>
      <h1 className="ui header">Create Story</h1>
      <form class="ui form" onSubmit={submitHandler}>
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            onChange={(e) => handleChange(e.currentTarget)}
          />
        </div>
        <div class="field">
          <label>Description</label>
          <input
            type="text"
            name="description"
            onChange={(e) => handleChange(e.currentTarget)}
            required
            placeholder="Description"
          />
        </div>
        <div class="field">
          <label>The story</label>
          <textarea
            name="story"
            onChange={(e) => handleChange(e.currentTarget)}
            required
            placeholder="The story"
          ></textarea>
        </div>

        <button
          class={`ui button ${query.get('id') && 'yellow'}`}
          type="submit"
        >
          {query.get('id') ? 'Update' : 'Submit'}
        </button>
        {form.past.length !== 0 && (
          <button className="ui blue button" type="button" onClick={handleUndo}>
            Undo
          </button>
        )}
        {form.future.length !== 0 && (
          <button className="ui blue button" type="button" onClick={handleRedo}>
            Redo
          </button>
        )}
      </form>
      <br />
      <div class="ui stacked segment">
        <div
          class="ui relaxed divided list"
          style={{
            maxHeight: `${collapsed ? '237px' : 'max-content'}`,
            transition: '1.1s ease-out',
            overflow: 'hidden',
          }}
        >
          {[...form.past, form.present, ...form.future].length > 1 && (
            <div style={{ width: '100%', textAlign: 'right' }}>
              {collapsed ? 'Expand' : 'Collapse'}
              <i
                className={`ui angle ${collapsed ? 'down' : 'up'} icon`}
                onClick={() => setCollapsed(!collapsed)}
              ></i>
            </div>
          )}

          {form.present !== null &&
            [...form.past, form.present, ...form.future].map(
              (version, index) => (
                <>
                  <div
                    class={`item ${ActiveVersion === index && 'active'} `}
                    onClick={() => formGoTo(index + 1)}
                  >
                    <div class="content">
                      <div class="header">Version {index + 1}</div>
                      {Object.entries(version).map(([key, val]) => (
                        <div className="ui segment ">
                          <span>
                            <b>{key}:</b> {val}
                          </span>
                          <br />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            )}
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    form: state.myForm,
    story: state.story,
    auth: state.auth.usr,
  };
};
export default connect(mapStateToProps, {
  formRedo,
  formUndo,
  formChanged,
  formSave,
  formGoTo,
  createStory,
  fetchStory,
  changeStory,
  initStory,
})(CreateStory);
