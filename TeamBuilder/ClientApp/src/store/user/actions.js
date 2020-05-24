import {SET_USER, SET_PROFILE} from './actionTypes';

export const setUser = (user) => {
    console.log('!!!!!!!!!!!!!!!setUser user', user);

    return {
        type: SET_USER,
            payload: {
            user: user
        }
    }
};

export const setProfile = (profile) => {

    return {
        type: SET_PROFILE,
            payload: {
            profile: profile
        }
    }
};

export const GET_USER = (id) => {
    return {
        type: GET_USER,
            payload: {
            user: user
        }
    }
};
