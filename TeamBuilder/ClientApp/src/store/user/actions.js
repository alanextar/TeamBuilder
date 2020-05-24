import {SET_USER, SET_PROFILE, GET_USER, SET_PROFILE_USER} from './actionTypes';

export const setUser = (user) => {

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

export const setProfileUser = (profileUser) => {

    return {
        type: SET_PROFILE_USER,
            payload: {
                profileUser: profileUser
        }
    }
};

export const getUser = () => {

    return {
        type: GET_USER,
            payload: {
        }
    }
};
