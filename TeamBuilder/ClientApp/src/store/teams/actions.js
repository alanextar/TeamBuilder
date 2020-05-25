import {SET_TEAM} from './actionTypes';

export const setTeam = (activeTeam) => {
    console.log('setTeam activeTeam', activeTeam);

    return {
        type: SET_TEAM,
            payload: {
            activeTeam: activeTeam
        }
    }
};
