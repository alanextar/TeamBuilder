﻿import React, { useState, useEffect } from 'react';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

import Icon28Users from '@vkontakte/icons/dist/28/users';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';

import Panel1 from './panels/panel1'
import Panel2 from './panels/panel2'
import Panel3 from './panels/panel3'
import Teams from './panels/teams'
import Teaminfo from './panels/teaminfo' 
import TeamCreate from './panels/teamCreate'
import TeamEdit from './panels/teamEdit'
import User from './panels/user'
import UserEdit from './panels/userEdit'

const App = () => {
    const [activeTeamPanel, setActiveTeamPanel] = useState('teams');
    const [activeTeam, setActiveTeam] = useState(null);
    const [teamHref, setTeamNextHref] = useState(null);

    const [activePanel, setActivePanel] = useState('teams');
    const [activeUserPanel, setActiveUserPanel] = useState('user');
    const [activeStory, setActiveStore] = useState('teams');
	const [fetchedUser, setUser] = useState(null);
    const [activeP, setActiveP] = useState('panel1');
    const [activeUser, setActiveUser] = useState(null);
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

    const go = e => {
        setActivePanel(e.currentTarget.dataset.to);
        setActiveTeam(e.currentTarget.dataset.id);
    };

    const goTeam = e => {
        setActiveTeamPanel(e.currentTarget.dataset.to);
        if (e.currentTarget.dataset.href)
            setTeamNextHref(e.currentTarget.dataset.href);
        setActiveTeam(e.currentTarget.dataset.id);

        console.log(`dataset.href: ${e.currentTarget.dataset.href}`);
    };

    const goP = e => {
        setActiveP(e.currentTarget.dataset.to);
    };

    const goFoot = e => {
        setActiveStore(e.currentTarget.dataset.story);
    }

    const goUserEdit = e => {
        console.log('into go', e.currentTarget.dataset.to, e.currentTarget.dataset.id);
        let user = e.currentTarget.dataset.user && JSON.parse(e.currentTarget.dataset.user);
        setActiveTeam(e.currentTarget.dataset.id);
        setActiveUserPanel(e.currentTarget.dataset.to);
        setActiveUser(user);
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
                    selected={activeStory === 'panel1'}
                    data-story="panel1"
                    text="Участники"
                ><Icon28Users /></TabbarItem>
                <TabbarItem
                    onClick={goFoot}
                    selected={activeStory === 'panel2'}
                    data-story="panel2"
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
                <Teaminfo id='teaminfo' go={goTeam} teamId={activeTeam} return='teams' />
                <TeamCreate id='teamCreate' go={goTeam} />
            </View>
            <View id='user' activePanel={activeUserPanel}>
                <User id='user' fetchedUser={fetchedUser} goUserEdit={goUserEdit} />
                <UserEdit id='userEdit' goUserEdit={goUserEdit} fetchedUser={fetchedUser} user={activeUser} />
                <Teaminfo id='teaminfo' go={goUserEdit} teamId={activeTeam} return='user' />
            </View>
            <View id='panel2' activePanel='panel2'>
                <Panel2 id='panel2' go={go} />
            </View>
            <View id='panel3' activePanel='panel3'>
                <Panel3 id='panel3' go={go} />
            </View>
        </Epic>

    );
}

export default App;