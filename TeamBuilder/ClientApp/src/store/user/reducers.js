import {
    SET_USER, SET_PROFILE, GET_USER
} from './actionTypes';

const initialState = {
    user: null
};

export const userReducer = (state = initialState, action) => {
    console.log('action.type', action.type);
    switch (action.type) {
        case GET_USER: {
            //заглушка

            return {
                ...state,
            }
        }
        case SET_USER: {
            let User = action.payload.user;

            console.log('SET USER', User);
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
