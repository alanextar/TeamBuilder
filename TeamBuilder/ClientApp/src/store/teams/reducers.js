import {
    SET_TEAM
} from './actionTypes';

const initialState = {
    activeTeam: null
};

export const teamReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_TEAM: {
            let Team = action.payload.activeTeam;

            return {
                ...state,
                activeTeam: Team
            };
        }

        default: {
            return state;
        }
    }
};
