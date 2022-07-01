import streams from "../API/streams";
import history from "../history";
export const signIn = (userId) => async (dispatch) => {
  const check = await streams.get(`/users/userId/${userId}`);
  if (Object.keys(check.data).length === 0) history.push("/profile");
  dispatch({
    type: "SIGN_IN",
    payload: userId,
  });
};

export const signOut = () => (dispatch) => {
  dispatch({ type: "SIGN_OUT" });
  history.push("/");
};

export const createStreams = (params) => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await streams.post("/streams", { ...params, userId });
  dispatch({ type: "CREATE_STREAM", payload: response.data });
  history.push("/");
};

export const fetchList = () => async (dispatch) => {
  const streaming = await streams.get("/streams");
  dispatch({ type: "FETCH_STREAMS", payload: streaming.data });
};

export const fetchComments = () => async (dispatch) => {
  const comments = await streams.get("/comments");
  dispatch({ type: "FETCH_COMMENTS", payload: comments.data });
};
export const changeComments = (id, params) => async (dispatch) => {
  const comments = await streams.patch(`/comments/${id}`, params);
  dispatch({ type: "UPDATE_COMMENT", payload: comments.data });
  history.replace(`/streams/${params.streamId}?view=yes`);
};
export const createComments = (params) => async (dispatch, getState) => {
  const { userId } = getState().auth;
  const response = await streams.post("/comments", { ...params, userId });
  dispatch({ type: "CREATE_COMMENT", payload: response.data });
  history.replace(`/streams/${params.streamId}?view=yes`);
};
export const deleteComments = (id, params) => async (dispatch, getState) => {
  const comments = await streams.patch(`/comments/${id}`, {
    ...params,
    userId: "[deleted]",
    comment: "[deleted]",
  });
  dispatch({ type: "UPDATE_COMMENT", payload: comments.data });
  history.replace(`/streams/${params.streamId}?view=yes`);
};

export const fetchProfile = () => async (dispatch) => {
  const profiles = await streams.get("/users");
  dispatch({ type: "FETCH_PROFILE", payload: profiles.data });
};
export const fetchAProfile = (userId) => async (dispatch) => {
  const profiles = await streams.get(`/users/userId/${userId}`);
  dispatch({ type: "FETCH_SINGLE_PROFILE", payload: profiles.data });
};
export const createProfile = (params) => async (dispatch) => {
  const profiles = await streams.post(`/users`, params);
  dispatch({ type: "CREATE_USER", payload: profiles.data });
  history.push("/");
};
export const updateProfile = (params) => async (dispatch) => {
  const profiles = await streams.patch(`/users/${params.id}`, params);
  dispatch({ type: "UPDATE_USER", payload: profiles.data });
  history.go(0);
};
export const deleteProfile = () => async (dispatch, getState) => {
  const { userId } = getState().auth;
  await streams.delete(`/users/${params.id}`);
  dispatch({ type: "DELETE_USER", payload: userId });
  dispatch(signOut());
  history.push("/");
};
export const fetchAList = (id) => async (dispatch) => {
  const streaming = await streams.get(`/streams/${id}`);
  dispatch({ type: "FETCH_STREAM", payload: streaming.data });
};

export const changeList = (id, data) => async (dispatch) => {
  const streaming = await streams.put(`/streams/${id}`, data);
  dispatch({ type: "EDIT_STREAM", payload: streaming.data });
  history.push("/");
};
export const deleteList = (id) => async (dispatch) => {
  await streams.delete(`/streams/${id}`);
  dispatch({ type: "DELETE_STREAM", payload: id });
  history.push("/");
};
