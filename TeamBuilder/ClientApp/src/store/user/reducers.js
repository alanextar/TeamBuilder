import {
    SET_USER
} from './actionTypes';

const initialState = {
    user: null
};

export const userReducer = (state = initialState, action) => {
    console.log('@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', action)
    switch (action.type) {

        case SET_USER: {
            console.log('action.payload.user--------------', action.payload.user)
            let User = action.payload.user;

            return {
                ...state,
                user: User
            };
        }

        default: {
            return state;
        }
    }
};
