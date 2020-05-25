import {
    SET_EVENT
} from './actionTypes';

const initialState = {
    event: null
};

export const eventReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_EVENT: {

            return {
                ...state,
                event: action.payload.event
            };
        }

        default: {
            return state;
        }
    }
};
