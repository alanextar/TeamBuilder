import React, { useState, useEffect } from 'react';
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

const App = () => {
    const [activeTeamPanel, setActiveTeamPanel] = useState('teams');
    const [activeTeam, setActiveTeam] = useState('teams');
    const [activePanel, setActivePanel] = useState('teams');
    const [activeStory, setActiveStore] = useState('teams');
    const [fetchedUser, setUser] = useState(null);
    const [activeP, setActiveP] = useState('panel1');


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
        setActiveTeam(e.currentTarget.dataset.id);
    };

    const go = e => {
        setActivePanel(e.currentTarget.dataset.to);
    };

    const goP = e => {
        setActiveP(e.currentTarget.dataset.to);
    };

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
                    selected={activeStory === 'panel3'}
                    data-story="panel3"
                    text="Профиль"
                ><Icon28Profile /></TabbarItem>
            </Tabbar>}>
            <View id='teams' activePanel={ activeTeamPanel } >
                <Teams id='teams' go={goTeam} />
                <Teaminfo id='teaminfo' go={goTeam} teamId={ activeTeam } />
            </View>
            <View id='panel1' activePanel={ activeP }>
                <Panel1 id='panel1' fetchedUser={fetchedUser} go={goP} />
                <Panel2 id='panel2' go={goP} />
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