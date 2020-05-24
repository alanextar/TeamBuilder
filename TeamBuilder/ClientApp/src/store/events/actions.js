import {SET_EVENT} from './actionTypes';

export const setEvent = (event) => {

    return {
        type: SET_EVENT,
            payload: {
            event: event
        }
    }
};
