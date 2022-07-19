import _ from "lodash";
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_STORIES":
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case "EDIT_STORIES":
      return { ...state, [action.payload.id]: action.payload };
    case "FETCH_STORY":
      return { ...state, [action.payload.id]: action.payload };
    case "CREATE_STORY":
      return { ...state, [action.payload.id]: action.payload };
    case "DELETE_STORY":
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
