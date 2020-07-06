import {
    SET_USER, SET_PROFILE, SET_PROFILE_USER, SET_TEAM_USER, ADD_TEAM_TO_PROFILE, UPD_PROFILE_TEAM,
    SET_EVENT_USER, SET_PARTICIPANT_USER, SET_USER_SKILLS, SET_ALL_SKILLS, SET_RECRUIT_TEAMS
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

export const addTeamToProfile = (userTeam) => {

    return {
        type: ADD_TEAM_TO_PROFILE,
        payload: {
            userTeam: userTeam,
        }
    }
};

// TODO Не используется
export const updProfileTeam = (userTeam) => {

    return {
        type: UPD_PROFILE_TEAM,
        payload: {
            userTeam: userTeam,
        }
    }
};
