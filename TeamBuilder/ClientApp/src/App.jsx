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
import Panel2 from './panels/panel2'
import Panel3 from './panels/panel3'

import Teams from './panels/teams'
import Teaminfo from './panels/teaminfo' 
import TeamCreate from './panels/teamCreate'
import TeamEdit from './panels/teamEdit'

import User from './panels/user'
import UserEdit from './panels/userEdit'
import SetUserTeam from './panels/setUserTeam'

const App = () => {
    const [activeStory, setActiveStore] = useState('events');
    const [back, setBack] = useState(null);

    const [activeTeamPanel, setActiveTeamPanel] = useState('teams');
    const [activeTeam, setActiveTeam] = useState(null);
    const [teamHref, setTeamNextHref] = useState(null);

    const [activeUserPanel, setActiveUserPanel] = useState('user');
    const [vkProfile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    const [activeEventPanel, setActiveEventPanel] = useState('events');


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
            setProfile(user);
            setUser(user);
        }
		fetchData();
	}, []);

    const goTeam = e => {
        setActiveTeamPanel(e.currentTarget.dataset.to);
        if (e.currentTarget.dataset.href)
            setTeamNextHref(e.currentTarget.dataset.href);
        setActiveTeam(e.currentTarget.dataset.id);

        let user = e.currentTarget.dataset.user && JSON.parse(e.currentTarget.dataset.user);
        console.log('user*******************', user);
        setUser(user);

        console.log(`dataset.href: ${e.currentTarget.dataset.href}`);
    };

    const goEvent = e => {
        setActiveEventPanel(e.currentTarget.dataset.to);
        setBack(e.currentTarget.dataset.from);
    };

    const goFoot = e => {
        setActiveStore(e.currentTarget.dataset.story);
    }

    const goUserEdit = e => {
        console.log('into go', e.currentTarget.dataset.to, e.currentTarget.dataset.id);
        let user = e.currentTarget.dataset.user && JSON.parse(e.currentTarget.dataset.user);
        setActiveTeam(e.currentTarget.dataset.id);
        setActiveUserPanel(e.currentTarget.dataset.to);
        setUser(user);
    }

    const goSetUserTeam = e => {
        let user = e.currentTarget.dataset.user && JSON.parse(e.currentTarget.dataset.user);
        console.log('goSetUserTeam', user);
        setUser(user);
        setActiveUserPanel(e.currentTarget.dataset.to);
    }

    console.log('into app', user);

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
                <Teaminfo id='teaminfo' go={goTeam} teamId={activeTeam} return='teams' vkProfile={vkProfile}/>
                <TeamCreate id='teamCreate' go={goTeam} />
                <TeamEdit id='teamEdit' go={goTeam} teamId={activeTeam} />
                <User id='user' vkProfile={vkProfile} user={user} goUserEdit={goTeam} activeStory={activeStory} goSetUserTeam={goSetUserTeam} return='teaminfo' />
            </View>
            {/*<View id='users' activePanel='panel2'>
                 <Panel2 id='panel2' go={go}/>
             </View>*/}
            <View id='events' activePanel={activeEventPanel}>
                <Events id='events' go={goEvent}/>
                <EventCreate id='eventCreate' go={goEvent} back={back}/>
                <EventInfo id='eventInfo' go={goEvent} back={back}/>
            </View>
            <View id='user' activePanel={activeUserPanel}>
                <User id='user' vkProfile={vkProfile} user={user} goUserEdit={goUserEdit} activeStory={activeStory} goSetUserTeam={goSetUserTeam} />
                <UserEdit id='userEdit' goUserEdit={goUserEdit} vkProfile={vkProfile} user={user} />
                <Teaminfo id='teaminfo' go={goUserEdit} teamId={activeTeam} return='user' />
                <SetUserTeam id='setUserTeam' goSetUserTeam={goSetUserTeam} user={user} />
            </View>
        </Epic>

    );
}

export default App;