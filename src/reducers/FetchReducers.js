import _ from "lodash";
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_PROFILE": {
      return { ...state, ..._.mapKeys(action.payload, "userId") };
    }
    case "FETCH_SINGLE_PROFILE":
      if (!action.payload[0]) return state;
      return { ...state, [action.payload[0].userId]: action.payload[0] };

    case "CREATE_USER":
      return { ...state, [action.payload.userId]: action.payload };

    case "UPDATE_USER":
      return { ...state, [action.payload.userId]: action.payload };

    case "DELETE_USER":
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
