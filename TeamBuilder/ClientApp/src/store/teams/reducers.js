import {
    SET_TEAM
} from './actionTypes';

const initialState = {
    activeTeam: null
};

export const teamReducer = (state = initialState, action) => {
    console.log('REDUCER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', action.type)
    switch (action.type) {

        case SET_TEAM: {
            console.log('action.payload.team--------------', action.payload.activeTeam)
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
