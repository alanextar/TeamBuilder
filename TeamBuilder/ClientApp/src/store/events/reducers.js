import {
    SET_EVENT, SET_EVENTS_EVENT, SET_TEAMS_EVENT_FILTER, CREATE_EVENT
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
        case SET_TEAMS_EVENT_FILTER: {

            return {
                ...state,
                teamsEventFilter: action.payload.teamsEventFilter
            };
        }
        case CREATE_EVENT: {

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
