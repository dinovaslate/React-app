import streams from "../API/streams";
import history from "../history";
export const signIn = (userId) => {
  return {
    type: "SIGN_IN",
    payload: userId,
  };
};

export const signOut = () => {
  return {
    type: "SIGN_OUT",
  };
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
