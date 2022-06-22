import { combineReducers } from "redux";
import authReducers from "./authReducers";
import { reducer as formReducer } from "redux-form";
import StreamReducers from "./StreamReducers";
export default combineReducers({
  auth: authReducers,
  form: formReducer,
  streams: StreamReducers,
});
