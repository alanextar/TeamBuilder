import React, { useState, useEffect } from 'react';
import {
    View, Epic, Tabbar, TabbarItem, ModalRoot, ModalPage, ModalPageHeader,
    PanelHeaderButton, FormLayout, SelectMimicry, ConfigProvider, Root
} from '@vkontakte/vkui';
import { connect } from 'react-redux';
import '@vkontakte/vkui/dist/vkui.css';
import { bindActionCreators } from 'redux'
import { goBack, closeModal, setStory, setPage } from "./store/router/actions";
import { setTeam, setTeamsTeam, setEventsTeam, setUserTeam, setUsersTeam } from "./store/teams/actions";
import {
    setUser, setProfile, setProfileUser, setTeamUser,
    setEventUser, setParticipantUser
} from "./store/user/actions";
import { setEvent, setTeamsEventFilter } from "./store/events/actions"
import { getActivePanel } from "./services/_functions";

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon28Users from '@vkontakte/icons/dist/28/users';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Events from './panels/events/events'
import EventCreate from './panels/events/eventCreate'
import EventInfo from './panels/events/eventInfo'
import EventEdit from './panels/events/eventEdit'

import Teams from './panels/teams/teams'
import TeamInfo from './panels/teams/teamInfo'
import TeamCreate from './panels/teams/teamCreate'
import TeamEdit from './panels/teams/teamEdit'
import EventsFilter from './panels/teams/eventsFilter'

import Users from './panels/users'
import User from './panels/user'
import UserEdit from './panels/userEdit'
import SetUserTeam from './panels/setUserTeam'

import { Api } from './infrastructure/api';

const App = (props) => {
    const [lastAndroidBackAction, setLastAndroidBackButton] = useState(0);
    const [history, setHistory] = useState(null);
    const [popout, setPopout] = useState(null);

    const { setStory, activeView, activeStory, setProfile, setUser,
        setProfileUser, profileUser, teamUser, eventUser, participantUser, teamsTeam, setPage, setEvent, event,
        eventsTeam, userTeam, usersTeam, setTeam, setTeamsEventFilter, colorScheme
    } = props;

	const [isNewUser, setIsNewUser] = useState(false);
	
    const [events, setEvents] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
		const { goBack } = props;
		
		getEvents();
		
        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - lastAndroidBackAction > 500) {
                setLastAndroidBackButton(timeNow);

                goBack();
            } else {
                window.history.pushState(null, null);
            }
        };
	}, []);

    useEffect(() => {
        const { activeView, panelsHistory, activeModals, popouts } = props;
        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
        //let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];
        //setActiveModal(activeModal);
        //console.log('history popout active modal', history, popout, activeModal);
        setHistory(history);
        setPopout(popout);
    });

    const hideModal = () => {
        setActiveModal(null);
    };

    const getEvents = () => {
        Api.Events.getAll().then(result => setEvents(result))
    }

    return (
        <ConfigProvider isWebView={true} scheme={colorScheme}>
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
                    <TabbarItem style={{ color: !props.profileUser ? "red" : "" }}
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
                <Root id="teams" activeView={activeView} popout={popout}>
                    <View id='teams' activePanel={getActivePanel("teams")}
                        history={history}
                        onSwipeBack={() => goBack()}
                        modal={
                            <ModalRoot activeModal={activeModal}>
                                <ModalPage
                                    id="filters"
                                    onClose={() => hideModal()}
                                    header={
                                        <ModalPageHeader
                                            left={<PanelHeaderButton onClick={e => { setTeamsEventFilter(null); hideModal(); }}>Сбросить</PanelHeaderButton>}
                                            right={<PanelHeaderButton
                                                onClick={() => { hideModal(); }}>Готово</PanelHeaderButton>}
                                        >
                                            Фильтры
                                </ModalPageHeader>
                                    }>
                                    {events &&
                                        <FormLayout>
                                            <SelectMimicry top="События" placeholder="Не выбрано"
                                                onClick={() => {
                                                    setPage('teams', 'eventsFilter');
                                                    hideModal();
                                                }}>
                                                {props.teamsEventFilter && props.teamsEventFilter.name}
                                            </SelectMimicry>
                                        </FormLayout>}
                                </ModalPage>
                            </ModalRoot>}
                    >
                        <Teams id='teams' activeStory={activeStory} onFiltersClick={(e) => { setActiveModal('filters'); }} />
                        <TeamInfo id='teaminfo' />
                        <TeamCreate id='teamCreate' />
                        <TeamEdit id='teamEdit' />
                        <User id='user' />
                        <SetUserTeam id='setUserTeam' />
                        <EventCreate id='eventCreate' />
                        <EventInfo id='eventInfo' />
                        <EventsFilter id='eventsFilter' openFilter={(e) => setActiveModal('filters')} />
                        <EventEdit id='eventEdit' owner={props.profile} />
                    </View>
                </Root>
                <Root id="users" activeView={activeView} popout={popout}>
                    <View id="users" activePanel={getActivePanel("users")}
                        history={history}
                        onSwipeBack={() => goBack()}
                    >
                        <Users id="users" />
                        <User id="user" />
                        <SetUserTeam id="setUserTeam" />
                        <TeamInfo id="teaminfo" />
                        <TeamEdit id="teamEdit" />
                        <EventCreate id='eventCreate' owner={props.profile} />
                        <EventInfo id='eventInfo' />
                        <EventEdit id='eventEdit' owner={props.profile} />
                    </View>
                </Root>
                <Root id="events" activeView={activeView} popout={popout}>
                    <View id='events' activePanel={getActivePanel("events")}
                        history={history}
                        onSwipeBack={() => goBack()}
                    >
                        <Events id='events' />
                        <EventCreate id='eventCreate' owner={props.profile} />
                        <EventInfo id='eventInfo' />
                        <EventEdit id='eventEdit' owner={props.profile} />
                        <TeamInfo id='teaminfo' />
                        <TeamEdit id='teamEdit' />
                        <User id='user' />
                    </View>
                </Root>
                <Root id="user" activeView={activeView} popout={popout}>
                    <View id='user' activePanel={getActivePanel("user")}
                        history={history}
                        onSwipeBack={() => goBack()}
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
                </Root>
            </Epic>
        </ConfigProvider>
    );
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        popouts: state.router.popouts,
        activeModals: state.router.activeModals,
        colorScheme: state.vkui.colorScheme,
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
        event: state.event.event,
        teamsEventFilter: state.event.teamsEventFilter,
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            setStory, goBack, closeModal, setProfile, setUser, setProfileUser, setPage, setEvent,
            setEventUser, setTeamUser, setParticipantUser, setTeam, setTeamsTeam,
            setEventsTeam, setUsersTeam, setUserTeam, setTeamsEventFilter
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);