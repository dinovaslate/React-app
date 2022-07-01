export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_COMMENTS":
      return action.payload.reduce((prev, curr) => {
        const { streamId, replyTo } = curr;
        if (!prev[streamId]) {
          prev[streamId] = new Object();
          prev[streamId][replyTo] = [curr];
          return prev;
        }
        if (!prev[streamId][replyTo]) {
          prev[streamId][replyTo] = [curr];
          return prev;
        }
        prev[streamId][replyTo] = [...prev[streamId][replyTo], curr];
        return prev;
      }, {});
    case "UPDATE_COMMENT": {
      const { streamId, replyTo } = action.payload;
      const index = state[streamId][replyTo].findIndex(
        (elem) => elem.id === action.payload.id
      );
      state[streamId][replyTo][index] = action.payload;
      return state;
    }
    case "CREATE_COMMENT": {
      const { streamId, replyTo } = action.payload;
      if (!state[streamId]) {
        state[streamId] = new Object();
        state[streamId][replyTo] = [action.payload];
        return state;
      }
      if (!state[streamId][replyTo]) {
        state[streamId][replyTo] = [action.payload];
        return state;
      }
      state[streamId][replyTo].push(action.payload);
      return state;
    }
    default:
      return state;
  }
};
