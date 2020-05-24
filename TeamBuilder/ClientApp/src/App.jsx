import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import { bindActionCreators } from 'redux'
import { goBack, closeModal, setStory } from "./store/router/actions";
import { setParticipant } from "./store/participants/actions";
import {
    setUser, setProfile, getUser,
    setProfileUser, setTeamUser, setEventUser, setParticipantsUser
} from "./store/user/actions";
import { getActivePanel } from "./services/_functions";
 import * as VK from './services/VK';

import Icon28Users from '@vkontakte/icons/dist/28/users';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';

import Events from './panels/events'
import EventCreate from './panels/eventCreate'
import EventInfo from './panels/eventInfo'
import EventEdit from './panels/eventEdit'

import Teams from './panels/teams'
import TeamInfo from './panels/teamInfo' 
import TeamCreate from './panels/teamCreate'
import TeamEdit from './panels/teamEdit'

import Users from './panels/users'
import User from './panels/user'
import UserEdit from './panels/userEdit'
import SetUserTeam from './panels/setUserTeam'

const App = (props) => {
    let lastAndroidBackAction = 0;
    const [teamHref, setTeamNextHref] = useState(null);

    const { goBack, setStory, activeView, activeStory, panelsHistory, setProfile, setUser,
        setProfileUser, setEventUser, setTeamUser, setParticipant, profile, profileUser,
        teamUser, eventUser, participant, user
    } = props;
    let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

        async function fetchData() {
            const profile = await bridge.send('VKWebAppGetUserInfo');
            setProfile(profile);

            let response = await fetch(`/api/user/get/?id=${profile.id}`);
            let user = await response.json();
            setUser(user);
            setProfileUser(user);
        }
        fetchData();

        const { activeView, activeStory, activePanel } = props;
        const { goBack, dispatch } = props;

        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - this.lastAndroidBackAction > 500) {
                lastAndroidBackAction = timeNow;

                goBack();
            } else {
                window.history.pushState(null, null);
            }
        };
	}, []);

    const goTeam = e => {
        if (e.currentTarget.dataset.href)
            setTeamNextHref(e.currentTarget.dataset.href);

        console.log(`dataset.href: ${e.currentTarget.dataset.href}`);
    };

	return (
        <Epic activeStory={activeStory} tabbar={
            <Tabbar>
                <TabbarItem
                    onClick={() => { console.log('go teams', teamUser); setUser(teamUser); setStory('teams', 'teams') }}
                    selected={activeStory === 'teams'}
                    text="Команды"
                ><Icon28Users3Outline /></TabbarItem>
                <TabbarItem
                    onClick={() => { setStory('users', 'users'); setUser(participant) }}
                    selected={activeStory === 'users'}
                    text="Участники"
                ><Icon28Users /></TabbarItem>
                <TabbarItem
                    onClick={() => { setStory('events', 'events'); setUser(eventUser) } }
                    selected={activeStory === 'events'}
                    text="События"
                ><Icon28FavoriteOutline /></TabbarItem>
                <TabbarItem
                    onClick={() =>
                    {
                        setStory('user', 'user');
                        setUser(profileUser);
                    }}
                    selected={activeStory === 'user'}
                    text="Профиль"
                ><Icon28Profile /></TabbarItem>
            </Tabbar>
        }>
            <View id='teams' activePanel={getActivePanel("teams")}
                history={history} >
                <Teams id='teams' activeStory={activeStory} href={teamHref} />
                <TeamInfo id='teaminfo' return='teams' profile={props.profile} />
                <TeamCreate id='teamCreate'/>
                <TeamEdit id='teamEdit' />
                <User id='user' activeStory={activeStory} />
                <SetUserTeam id='setUserTeam' />
                <EventCreate id='eventCreate' owner={props.profile} />
            </View>
            <View id='users' activePanel={getActivePanel("users")}
                history={history}
            >
                <Users id='users' />
                <User id='user' activeStory={activeStory} />
            </View>
            <View id='events' activePanel={getActivePanel("events")}
                history={history}>
                <Events id='events' />
                <EventCreate id='eventCreate' owner={props.profile} />
                <EventInfo id='eventInfo' />
                <EventEdit id='eventEdit' owner={props.profile} />
            </View>
            <View id='user' activePanel={getActivePanel("user")}
                history={history}
            >
                <User id='user' activeStory={activeStory} />
                <UserEdit id='userEdit' />
                <TeamInfo id='teaminfo' />
                <SetUserTeam id='setUserTeam' />
            </View>
        </Epic>

    );
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        scrollPosition: state.router.scrollPosition,
        profile: state.user.profile,
        user: state.user.user,
        profileUser: state.user.profileUser,
        eventUser: state.user.eventUser,
        teamUser: state.user.teamUser,
        participant: state.participant.participant
        // colorScheme: state.vkui.colorScheme
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            setStory, goBack, closeModal, setProfile,
            setUser, setProfileUser, setEventUser, setTeamUser, setParticipant
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);