import _ from 'lodash';
export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_STREAMS':
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case 'EDIT_STREAMS':
      return { ...state, [action.payload.id]: action.payload };
    case 'FETCH_STREAM':
      return { ...state, [action.payload.id]: action.payload };
    case 'CREATE_STREAM':
      return { ...state, [action.payload.id]: action.payload };
    case 'DELETE_STREAM':
      _.unset(state, action.payload);
      return state;
    default:
      return state;
  }
};
