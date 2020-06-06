import {
    SET_USER, SET_PROFILE, SET_PROFILE_USER, SET_EVENT_USER,
    SET_TEAM_USER, SET_PARTICIPANT_USER, SET_USER_SKILLS, SET_ALL_SKILLS,
    SET_RECRUIT_TEAMS, ADD_TEAM_TO_PROFILE
} from './actionTypes';

const initialState = {
    user: null
};

export const userReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
                user: action.payload.user
            };
        }
        case SET_PROFILE: {
            return {
                ...state,
                profile: action.payload.profile
            };
        }
        case SET_PROFILE_USER: {
            return {
                ...state,
                profileUser: action.payload.profileUser
            };
        }
        case SET_EVENT_USER: {
            return {
                ...state,
                eventUser: action.payload.eventUser
            };
        }
        case SET_TEAM_USER: {
            return {
                ...state,
                teamUser: action.payload.teamUser
            };
        }
        case SET_PARTICIPANT_USER: {
            return {
                ...state,
                participantUser: action.payload.participantUser
            };
        }
        case SET_USER_SKILLS: {
            var User = action.payload.user;
            User.userSkills = action.payload.newSkills;

            return {
                ...state,
                user: User
            };
        }
        case SET_ALL_SKILLS: {
            var AllSkills = action.payload.allSkills;

            return {
                ...state,
                allSkills: AllSkills
            };
        }
        case SET_RECRUIT_TEAMS: {

            return {
                ...state,
                recruitTeams: action.payload.recruitTeams
            };
        }
        case ADD_TEAM_TO_PROFILE: {
            let ut = action.payload.userTeam;

            return {
                ...state,
                profileUser: {
                    ...state.profileUser,
                    userTeams: [...state.profileUser.userTeams, ut]
                }
            };
        }

        default: {
            return state;
        }
    }
};
