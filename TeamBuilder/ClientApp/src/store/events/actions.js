import {SET_EVENT, CREATE_EVENT} from './actionTypes';

export const setEvent = (event) => {

    return {
        type: SET_EVENT,
            payload: {
            event: event
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
