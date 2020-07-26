import {
    SET_PROFILE, SET_PROFILE_USER
} from './actionTypes';

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
