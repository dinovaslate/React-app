import _ from 'lodash';

export default (
  state = {
    past: [],
    present: null,
    future: [],
  },
  action
) => {
  const changedState = _.cloneDeep(state);
  switch (action.type) {
    case 'FORM_CHANGED':
      if (Object.values(action.payload).length === 0) return state;
      if (changedState.present !== null)
        changedState.past = [...changedState.past, changedState.present];
      changedState.present = action.payload;
      if (changedState.future.length !== 0)
        changedState.future.splice(0, changedState.future.length);

      return changedState;
    case 'FORM_UNDO':
      if (changedState.past.length === 0) return changedState;
      changedState.future = [changedState.present, ...changedState.future];
      changedState.present = changedState.past.pop();
      return changedState;
    case 'FORM_REDO':
      if (changedState.future.length === 0) return changedState;
      changedState.past = [...changedState.past, changedState.present];
      changedState.present = changedState.future.shift();
      return changedState;
    case 'FORM_SAVE':
      localStorage.setItem(
        `form_state2_${action.payload}`,
        JSON.stringify(state)
      );
      return state;
    case 'INIT_FORM': {
      console.log(`form_state2_${action.payload}`);
      const savedState = localStorage.getItem(`form_state2_${action.payload}`);
      return savedState ? JSON.parse(savedState) : state;
    }
    case 'FORM_CLEAR':
      return {
        past: [],
        present: null,
        future: [],
      };
    case 'FORM_GO_TO': {
      const number = action.payload;
      if (number <= changedState.past.length) {
        const spliced = changedState.past.splice(number - 1);
        spliced.push(changedState.present);
        changedState.present = spliced.splice(0, 1)[0];
        if (spliced.length !== 0)
          changedState.future = [...spliced, ...changedState.future];
        return changedState;
      }

      if (number === changedState.past.length + 1) {
        return changedState;
      }
      if (number >= changedState.past.length + 2) {
        const spliced = changedState.future.splice(
          0,
          number - (changedState.past.length + 1)
        );
        spliced.unshift(changedState.present);
        changedState.present = spliced.pop();
        changedState.past = [...changedState.past, ...spliced];
        return changedState;
      }
    }
    default:
      return state;
  }
};
