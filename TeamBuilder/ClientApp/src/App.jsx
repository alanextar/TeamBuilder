import React, { useState, useEffect } from 'react';
import {
    View, Epic, Tabbar, TabbarItem, ModalRoot, ModalPage, ModalPageHeader,
    PanelHeaderButton, FormLayout, SelectMimicry, ANDROID, IOS, usePlatform
} from '@vkontakte/vkui';
import { connect } from 'react-redux';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import { bindActionCreators } from 'redux'
import { goBack, closeModal, setStory, setPage } from "./store/router/actions";
import { setTeam, setTeamsTeam, setEventsTeam, setUserTeam, setUsersTeam } from "./store/teams/actions";
import {
    setUser, setProfile, setProfileUser, setTeamUser,
    setEventUser, setParticipantUser
} from "./store/user/actions";
import { setEvent } from "./store/events/actions"
import { getActivePanel } from "./services/_functions";

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon28Users from '@vkontakte/icons/dist/28/users';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Events from './panels/events'
import EventCreate from './panels/eventCreate'
import EventInfo from './panels/eventInfo'
import EventEdit from './panels/eventEdit'

import Teams from './panels/teams'
import TeamInfo from './panels/teamInfo'
import TeamCreate from './panels/teamCreate'
import TeamEdit from './panels/teamEdit'
import EventsFilter from './panels/eventsFilter'

import Users from './panels/users'
import User from './panels/user'
import UserEdit from './panels/userEdit'
import SetUserTeam from './panels/setUserTeam'

import { Api } from './infrastructure/api';

const App = (props) => {
    let lastAndroidBackAction = 0;
    const platform = usePlatform();

    const { setStory, activeView, activeStory, panelsHistory, setProfile, setUser,
        setProfileUser, profileUser, teamUser, eventUser, participantUser, teamsTeam, setPage, setEvent, event,
        eventsTeam, userTeam, usersTeam, setTeam
    } = props;
    let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];

    const [events, setEvents] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        bridge.subscribe(({ detail: { type, data } }) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme');
                schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                document.body.attributes.setNamedItem(schemeAttribute);
                const paddingTop = document.createAttribute('padding-top');
                paddingTop.value = 'env(safe-area-inset-top)';
                document.body.attributes.setNamedItem(paddingTop);
            }
        });

        async function fetchData() {
            const profile = await bridge.send('VKWebAppGetUserInfo');
            setProfile(profile);
            Api.Users.get(profile.id).then(user => {
                setUser(user);
                setProfileUser(user);
            });
            
            setEvent(event);
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

        getEvents();
    }, []);

    const hideModal = () => {
        setActiveModal(null);
    };

    const getEvents = () => {
        Api.Events.getAll().then(result => setEvents(result))
    }

    return (
        <Epic activeStory={activeStory} tabbar={
            <Tabbar>
                <TabbarItem
                    onClick={() => {
                        setStory('teams', 'teams');
                        teamUser && setUser(teamUser);
                        teamsTeam && setTeam(teamsTeam);
                    }}
                    selected={activeStory === 'teams'}
                    text="Команды"
                ><Icon28Users3Outline /></TabbarItem>
                <TabbarItem
                    onClick={() => {
                        setStory('users', 'users');
                        participantUser && setUser(participantUser);
                        usersTeam && setTeam(usersTeam);
                    }}
                    selected={activeStory === 'users'}
                    text="Участники"
                ><Icon28Users /></TabbarItem>
                <TabbarItem
                    onClick={() => {
                        setStory('events', 'events');
                        eventUser && setUser(eventUser);
                        eventsTeam && setTeam(eventsTeam);
                    }}
                    selected={activeStory === 'events'}
                    text="События"
                ><Icon28FavoriteOutline /></TabbarItem>
                <TabbarItem
                    onClick={() => {
                        setStory('user', 'user');
                        setUser(profileUser);
                        userTeam && setTeam(userTeam)
                    }}
                    selected={activeStory === 'user'}
                    text="Профиль"
                ><Icon28Profile /></TabbarItem>
            </Tabbar>
        }>
            <View id='teams' activePanel={getActivePanel("teams")}
                history={history}
                modal={
                    <ModalRoot activeModal={activeModal}>
                        <ModalPage
                            id="filters"
                            onClose={hideModal}
                            header={
                                <ModalPageHeader
                                    left={<PanelHeaderButton onClick={e => {setEvent(null); hideModal();}}><Icon24Cancel /></PanelHeaderButton>}
                                    right={<PanelHeaderButton
                                        onClick={() => { hideModal(); }}>{platform === IOS ? 'Готово' : <Icon24Done />}</PanelHeaderButton>}
                                >
                                    Фильтры
                                </ModalPageHeader>
                            }>
                            {events &&
                                <FormLayout>
                                    <SelectMimicry top="Соревнования" placeholder="Не выбрано"
                                        onClick={() => {
                                            setPage('teams', 'eventsFilter');
                                            hideModal();
                                    }}>
                                    {props.event && props.event.name}
                                    </SelectMimicry>
                                </FormLayout>}
                        </ModalPage>
                    </ModalRoot>}
            >
                <Teams id='teams' activeStory={activeStory} onFiltersClick={(e) => { setActiveModal('filters'); }}/>
                <TeamInfo id='teaminfo' return='teams' />
                <TeamCreate id='teamCreate' />
                <TeamEdit id='teamEdit' />
                <User id='user' />
                <SetUserTeam id='setUserTeam' />
                <EventCreate id='eventCreate' />
                <EventInfo id='eventInfo' />
                <EventsFilter id='eventsFilter' openFilter={(e) => setActiveModal('filters')} />
                <EventEdit id='eventEdit' owner={props.profile} />
            </View>
            <View id='users' activePanel={getActivePanel("users")}
                history={history}
            >
                <Users id='users' />
                <User id='user' />
                <SetUserTeam id='setUserTeam' />
                <TeamInfo id='teaminfo' />
                <TeamEdit id='teamEdit' />
                <EventCreate id='eventCreate' owner={props.profile} />
                <EventInfo id='eventInfo' />
                <EventEdit id='eventEdit' owner={props.profile} />
            </View>
            <View id='events' activePanel={getActivePanel("events")}
                history={history}>
                <Events id='events' />
                <EventCreate id='eventCreate' owner={props.profile} />
                <EventInfo id='eventInfo' />
                <EventEdit id='eventEdit' owner={props.profile} />
                <TeamInfo id='teaminfo' />
                <TeamEdit id='teamEdit' />
                <User id='user' />
            </View>
            <View id='user' activePanel={getActivePanel("user")}
                history={history}
            >
                <User id='user' />
                <UserEdit id='userEdit' />
                <TeamInfo id='teaminfo' />
                <SetUserTeam id='setUserTeam' />
                <TeamEdit id='teamEdit' />
                <EventCreate id='eventCreate' owner={props.profile} />
                <EventInfo id='eventInfo' />
                <EventEdit id='eventEdit' owner={props.profile} />
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
        participantUser: state.user.participantUser,
        teamsTeam: state.team.teamsTeam,
        userTeam: state.team.userTeam,
        usersTeam: state.team.usersTeam,
        eventsTeam: state.team.eventsTeam,
        event: state.event.event
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            setStory, goBack, closeModal, setProfile, setUser, setProfileUser, setPage, setEvent,
            setEventUser, setTeamUser, setParticipantUser, setTeam, setTeamsTeam,
            setEventsTeam, setUsersTeam, setUserTeam
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);