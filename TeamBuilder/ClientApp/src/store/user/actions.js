import {SET_USER} from './actionTypes';

export const setUser = (user) => {
    console.log('!!!!!!!!!!!!!!!setUser user', user);

    return {
        type: SET_USER,
            payload: {
            user: user
        }
    }
};
