import { Map } from 'immutable'

export default function reducer(state = Map(), action) {
    switch (action.type) {
        case "SET_STATE":
            return state.merge(action.state);
        case "ADD_PHONE":
            return state.update("phones", (phones) => phones.push(action.phone));
        default:
            return state
    }
}
