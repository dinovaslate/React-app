import streams from '../API/streams';
import history from '../history';
export const signIn = (usr) => async (dispatch) => {
  const check = await streams.get(`/users/usr/${usr}`);
  if (Object.keys(check.data).length === 0) history.push(`/profile/${usr}`);
  console.log(check);
  dispatch({
    type: 'SIGN_IN',
    payload: usr,
  });
};

export const signOut = () => (dispatch) => {
  dispatch(formSave());
  dispatch({
    type: 'SIGN_OUT',
  });
};

export const createStreams = (params) => async (dispatch, getState) => {
  const { usr } = getState().auth;
  const response = await streams.post('/streams', { ...params, usr });
  dispatch({ type: 'CREATE_STREAM', payload: response.data });
  history.push('/');
};

export const fetchList = () => async (dispatch) => {
  dispatch({ type: 'LOADING_TRUE' });
  const streaming = await streams.get('/streams');
  dispatch({ type: 'FETCH_STREAMS', payload: streaming.data });
  dispatch({ type: 'LOADING_FALSE' });
};

export const fetchComments = () => async (dispatch) => {
  dispatch({ type: 'LOADING_TRUE' });
  const comments = await streams.get('/comments');
  dispatch({ type: 'FETCH_COMMENTS', payload: comments.data });
  dispatch({ type: 'LOADING_FALSE' });
};
export const changeComments = (id, params) => async (dispatch) => {
  const comments = await streams.patch(`/comments/${id}`, params);
  dispatch({ type: 'UPDATE_COMMENT', payload: comments.data });
  history.go(0);
};
export const createComments = (params) => async (dispatch, getState) => {
  const { usr } = getState().auth;
  const response = await streams.post('/comments', { ...params, usr });
  dispatch({ type: 'CREATE_COMMENT', payload: response.data });
  history.go(0);
};
export const deleteComments = (id, params) => async (dispatch, getState) => {
  const comments = await streams.patch(`/comments/${id}`, {
    ...params,
    usr: '[deleted]',
    comment: '[deleted]',
  });
  dispatch({ type: 'UPDATE_COMMENT', payload: comments.data });
  history.go(0);
};

export const fetchProfile = () => async (dispatch) => {
  dispatch({ type: 'LOADING_TRUE' });
  const profiles = await streams.get('/users');
  dispatch({ type: 'FETCH_PROFILE', payload: profiles.data });
  dispatch({ type: 'LOADING_FALSE' });
};
export const fetchAProfile = (usr) => async (dispatch) => {
  dispatch({ type: 'LOADING_TRUE' });
  const profiles = await streams.get(`/users/usr/${usr}`);
  dispatch({ type: 'FETCH_SINGLE_PROFILE', payload: profiles.data });
  dispatch({ type: 'LOADING_FALSE' });
};
export const createProfile = (params) => async (dispatch) => {
  const profiles = await streams.post(`/users`, params);
  dispatch({ type: 'CREATE_USER', payload: profiles.data });
  history.push('/');
};
export const updateProfile = (params) => async (dispatch) => {
  const profiles = await streams.patch(`/users/${params.id}`, params);
  dispatch({ type: 'UPDATE_USER', payload: profiles.data });
  history.go(0);
};
export const deleteProfile = (id) => async (dispatch, getState) => {
  const { usr } = getState().auth;
  const streaming = await streams.get(`/streams/usr/${usr}`);
  for (const stream of streaming.data) {
    dispatch(deleteList(stream.id, true));
  }
  const comments = await streams.get(`/comments/usr/${usr}`);
  for (const comment of comments.data) {
    dispatch(deleteComments(comment.id, comment));
  }

  await streams.delete(`/users/${id}`);
  dispatch({ type: 'DELETE_USER', payload: usr });
  dispatch(signOut());
};
export const fetchAList = (id) => async (dispatch) => {
  dispatch({ type: 'LOADING_TRUE' });
  const streaming = await streams.get(`/streams/${id}`);
  dispatch({ type: 'FETCH_STREAM', payload: streaming.data });
  dispatch({ type: 'LOADING_FALSE' });
};

export const changeList = (id, data) => async (dispatch) => {
  const streaming = await streams.put(`/streams/${id}`, data);
  dispatch({ type: 'EDIT_STREAM', payload: streaming.data });
  history.push('/');
};
export const deleteList =
  (id, called = false) =>
  async (dispatch) => {
    const comments = await streams.get(`/comments/streamId/${id}`);
    for (const comment of comments.data) {
      await streams.delete(`/comments/${comment.id}`);
    }
    await streams.delete(`/streams/${id}`);
    dispatch({ type: 'DELETE_STREAM', payload: id });
    if (!called) {
      dispatch(fetchList());
      history.push('/');
    }
  };

export const formChanged = (param) => {
  return {
    type: 'FORM_CHANGED',
    payload: param,
  };
};

export const formUndo = () => {
  return {
    type: 'FORM_UNDO',
  };
};
export const formRedo = () => {
  return {
    type: 'FORM_REDO',
  };
};
export const formSave = () => (dispatch, getState) => {
  const { usr } = getState().auth;
  if (usr === null) return;
  dispatch({
    type: 'FORM_SAVE',
    payload: usr,
  });
  dispatch(formClear());
};

export const formGoTo = (number) => {
  return {
    type: 'FORM_GO_TO',
    payload: number,
  };
};
export const formClear = () => {
  return {
    type: 'FORM_CLEAR',
  };
};

export const createStory = (params) => async (dispatch, getState) => {
  const { usr } = getState().auth;
  const response = await streams.post('/story', { ...params, usr });
  dispatch({ type: 'CREATE_STORY', payload: response.data });
  dispatch(formClear());
  history.push('/');
};

export const fetchStories = () => async (dispatch) => {
  const streaming = await streams.get('/story');
  dispatch({ type: 'FETCH_STORIES', payload: streaming.data });
};

export const fetchStory = (id) => async (dispatch) => {
  const streaming = await streams.get(`/story/${id}`);
  dispatch({ type: 'FETCH_STORY', payload: streaming.data });
};

export const changeStory = (id, data) => async (dispatch, getState) => {
  const { usr } = getState().auth;
  const streaming = await streams.put(`/story/${id}`, { ...data, usr });
  dispatch({ type: 'EDIT_STORY', payload: streaming.data });
  dispatch({ type: 'FORM_CLEAR' });
  history.push('/');
};
export const deleteStory = (id, title) => async (dispatch) => {
  const comments = await streams.get(`/comments/streamId/${title}`);
  for (const comment of comments.data) {
    await streams.delete(`/comments/${comment.id}`);
  }
  await streams.delete(`/story/${id}`);
  dispatch({ type: 'DELETE_STORY', payload: id });
  history.push('/');
};

export const initStory = (usrid) => (dispatch, getState) => {
  console.log(usrid);
  dispatch({
    type: 'INIT_FORM',
    payload: usrid,
  });
};
