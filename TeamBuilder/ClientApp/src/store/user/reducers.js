import {
    SET_USER, SET_PROFILE
} from './actionTypes';

const initialState = {
    user: null
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_USER: {
            let User = action.payload.user;

            return {
                ...state,
                user: User
            };
        }
        case SET_PROFILE: {
            console.log('!!!SET_PROFILE', action.payload.profile)
            return {
                ...state,
                profile: action.payload.profile
            };
        }

        default: {
            return state;
        }
    }
};
