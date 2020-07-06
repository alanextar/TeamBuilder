import {
    SET_TEAMS_EVENT_FILTER
} from './actionTypes';

const initialState = {
    teamsEventFilter: null
};

export const eventReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_TEAMS_EVENT_FILTER: {

            return {
                ...state,
                teamsEventFilter: action.payload.teamsEventFilter
            };
        }

        default: {
            return state;
        }
    }
};
