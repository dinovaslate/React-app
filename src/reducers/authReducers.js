const INIT_STATE = {
  isSignedIn: null,
  usr: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, isSignedIn: true, usr: action.payload };
    case "SIGN_OUT":
      return { ...state, isSignedIn: false, usr: null };
    default:
      return state;
  }
};
