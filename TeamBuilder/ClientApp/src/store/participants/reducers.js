import {
    SET_PARTICIPANT
} from './actionTypes';

const initialState = {
    participant: null
};

export const participantReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_PARTICIPANT: {

            return {
                ...state,
                participant: action.payload.participant
            };
        }

        default: {
            return state;
        }
    }
};
