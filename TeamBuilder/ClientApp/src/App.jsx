import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

import Panel1 from './panels/panel1'
import Panel2 from './panels/panel2'
import Panel3 from './panels/panel3'

const App = () => {

	const [activePanel, setActivePanel] = useState('panel1');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(null);

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
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
            <Panel1 id='panel1' fetchedUser={fetchedUser} go={go} />
            <Panel2 id='panel2' go={go} />
            <Panel3 id='panel3' go={go} />
        </View>
    );
}

export default App;