import { combineReducers } from "redux";
import authReducers from "./authReducers";
import { reducer as formReducer } from "redux-form";
import StreamReducers from "./StreamReducers";
import CommentReducers from "./CommentReducers";
import FetchReducers from "./FetchReducers";
export default combineReducers({
  auth: authReducers,
  form: formReducer,
  streams: StreamReducers,
  comment: CommentReducers,
  users: FetchReducers,
});
