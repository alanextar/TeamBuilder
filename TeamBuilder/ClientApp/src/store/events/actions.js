import {SET_EVENT, SET_TEAMS_EVENT_FILTER, CREATE_EVENT} from './actionTypes';

export const setEvent = (event) => {
    return {
        type: SET_EVENT,
            payload: {
            event: event
        }
    }
};
export const setTeamsEventFilter = (event) => {
    return {
        type: SET_TEAMS_EVENT_FILTER,
            payload: {
            teamsEventFilter: event
        }
    }
};

export const createEvent = () => {

    return {
        type: CREATE_EVENT,
            payload: {
        }
    }
};
