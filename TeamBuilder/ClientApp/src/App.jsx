import React, { useState, useEffect } from 'react';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

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

const App = () => {
    const [activeStory, setActiveStore] = useState('events');
    const [back, setBack] = useState(null);

    const [activeTeamPanel, setActiveTeamPanel] = useState('teams');
    const [activeTeam, setActiveTeam] = useState(null);
    const [teamHref, setTeamNextHref] = useState(null);

    const [activeUserPanel, setActiveUserPanel] = useState('user');
    const [fetchedUser, setUser] = useState(null);
    const [activeUser, setActiveUser] = useState(null);

    const [activeEventPanel, setActiveEventPanel] = useState('events');
    const [event, setEvent] = useState(null);

    const [activeUsersPanel, setActiveUsersPanel] = useState('users');

    const [city, setCity] = useState(null);
    const [about, setAbout] = useState(null);


	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
        }
		fetchData();
	}, []);

    const goTeam = e => {
        setActiveTeamPanel(e.currentTarget.dataset.to);
        if (e.currentTarget.dataset.href)
            setTeamNextHref(e.currentTarget.dataset.href);
        setActiveTeam(e.currentTarget.dataset.id);

        console.log(`dataset.href: ${e.currentTarget.dataset.href}`);
    };

    const goUsers = e => {
        setActiveUsersPanel(e.currentTarget.dataset.to);
        setBack(e.currentTarget.dataset.from);
    };

    const goEvent = e => {
        setEvent(e.currentTarget.dataset.event && JSON.parse(e.currentTarget.dataset.event));
        setActiveEventPanel(e.currentTarget.dataset.to);
        setBack(e.currentTarget.dataset.from);
    };

    const goUserEdit = e => {
        console.log('into go', e.currentTarget.dataset.to, e.currentTarget.dataset.id);
        let user = e.currentTarget.dataset.user && JSON.parse(e.currentTarget.dataset.user);
        setActiveTeam(e.currentTarget.dataset.id);
        setActiveUserPanel(e.currentTarget.dataset.to);
        setActiveUser(user);
    }

    const goFoot = e => {
        setActiveStore(e.currentTarget.dataset.story);
    }

	return (
        <Epic activeStory={activeStory} tabbar={
            <Tabbar>
                <TabbarItem
                    onClick={goFoot}
                    selected={activeStory === 'teams'}
                    data-story="teams"
                    text="Команды"
                ><Icon28Users3Outline /></TabbarItem>
                <TabbarItem
                    onClick={goFoot}
                    selected={activeStory === 'users'}
                    data-story="users"
                    text="Участники"
                ><Icon28Users /></TabbarItem>
                <TabbarItem
                    onClick={goFoot}
                    selected={activeStory === 'events'}
                    data-story="events"
                    text="События"
                ><Icon28FavoriteOutline /></TabbarItem>
                <TabbarItem
                    onClick={goFoot}
                    selected={activeStory === 'user'}
                    data-story="user"
                    text="Профиль"
                ><Icon28Profile /></TabbarItem>
            </Tabbar>
        }>
            <View id='teams' activePanel={activeTeamPanel} >
                <Teams id='teams' go={goTeam} href={teamHref} />
                <TeamInfo id='teaminfo' go={goTeam} teamId={activeTeam} return='teams' fetchedUser={fetchedUser}/>
                <TeamCreate id='teamCreate' go={goTeam} back={back}/>
                <TeamEdit id='teamEdit' go={goTeam} teamId={activeTeam} back={back}/>
                <User id='user' fetchedUser={fetchedUser} goUserEdit={goTeam} activeStory={activeStory} return='teaminfo' />
                <EventCreate id='eventCreate' go={goEvent} back={back} owner={fetchedUser} />
            </View>
            <View id='users' activePanel={activeUsersPanel}>
                <Users id='users' go={goUsers} />
            </View>
            <View id='events' activePanel={activeEventPanel}>
                <Events id='events' go={goEvent} />
                <EventCreate id='eventCreate' go={goEvent} back={back} owner={fetchedUser} />
                <EventInfo id='eventInfo' event={event} go={goEvent} back={back} />
                <EventEdit id='eventEdit' event={event} go={goEvent} back={back} owner={fetchedUser} />
            </View>
            <View id='user' activePanel={activeUserPanel}>
                <User id='user' fetchedUser={fetchedUser} goUserEdit={goUserEdit} activeStory={activeStory} />
                <UserEdit id='userEdit' goUserEdit={goUserEdit} fetchedUser={fetchedUser} user={activeUser} />
                <TeamInfo id='teaminfo' go={goUserEdit} teamId={activeTeam} return='user' />
            </View>
        </Epic>

    );
}

export default App;