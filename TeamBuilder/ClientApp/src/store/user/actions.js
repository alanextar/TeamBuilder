import {
    SET_USER, SET_PROFILE, SET_PROFILE_USER, SET_TEAM_USER, ADD_TEAM_TO_PROFILE, UPD_PROFILE_TEAM,
    SET_EVENT_USER, SET_PARTICIPANT_USER, SET_USER_SKILLS, SET_ALL_SKILLS, SET_RECRUIT_TEAMS
} from './actionTypes';

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

export const setEventUser = (eventUser) => {

    return {
        type: SET_EVENT_USER,
            payload: {
                eventUser: eventUser
        }
    }
};

export const setTeamUser = (teamUser) => {

    return {
        type: SET_TEAM_USER,
            payload: {
                teamUser: teamUser
        }
    }
};

export const setParticipantUser = (participantUser) => {

    return {
        type: SET_PARTICIPANT_USER,
            payload: {
                participantUser: participantUser
        }
    }
};

export const setUserSkills = (user, newSkills) => {

    return {
        type: SET_USER_SKILLS,
        payload: {
            user: user,
            newSkills: newSkills
        }
    }
};

export const setAllSkills = (allSkills) => {

    return {
        type: SET_USER_SKILLS,
        payload: {
            allSkills: allSkills,
        }
    }
};

export const setRecruitTeams = (recruitTeams) => {

    return {
        type: SET_RECRUIT_TEAMS,
        payload: {
            recruitTeams: recruitTeams,
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

export const updProfileTeam = (userTeam) => {

    return {
        type: UPD_PROFILE_TEAM,
        payload: {
            userTeam: userTeam,
        }
    }
};
