import React, { useState, useEffect } from 'react';
import {
	Epic, Tabbar, TabbarItem, ConfigProvider, Root
} from '@vkontakte/vkui';
import { connect } from 'react-redux';
import '@vkontakte/vkui/dist/vkui.css';
import { bindActionCreators } from 'redux'
import { goBack, closeModal, setStory } from "./store/router/actions";
import { getActivePanel } from "./services/_functions";
import { initHubConnection } from "./services/notificationHub";

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import Events from './panels/events/events';
import Teams from './panels/teams/teams';
import TeamsFilters from './panels/teams/teamsFilters';
import Users from './panels/users/users';

import IconIndicator from './panels/components/IconIndicator';
import { CommonError } from './panels/components/commonError';

import CommonView from './CommonView';

const App = (props) => {
	const [lastAndroidBackAction, setLastAndroidBackButton] = useState(0);
	const [history, setHistory] = useState(null);
	const [popout, setPopout] = useState(null);

	const { setStory, activeView, activeStory, profileUser, colorScheme, notifications } = props;

	const [activeModal, setActiveModal] = useState(null);

	useEffect(() => {
		const { goBack } = props;

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
		if (profileUser?.id) {
			initHubConnection();
		}

	}, [profileUser?.id]);

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


	const isNewNotice = () => {
		return notifications.filter(n => n.isNew === true).length !== 0;
	}

	return (
		<ConfigProvider isWebView={true} scheme={colorScheme}>
			<Epic activeStory={activeStory} tabbar={
				<Tabbar>
					<TabbarItem
						className="pointer"
						onClick={() => setStory('teams', 'teams')}
						selected={activeStory === 'teams'}
						text="Команды"
					><Icon28Users3Outline /></TabbarItem>
					<TabbarItem
						className="pointer"
						onClick={() => setStory('users', 'users')}
						selected={activeStory === 'users'}
						text="Участники"
					><Icon28UsersOutline /></TabbarItem>
					<TabbarItem
						className="pointer"
						onClick={() => setStory('events', 'events')}
						selected={activeStory === 'events'}
						text="События"
					><Icon28FavoriteOutline /></TabbarItem>
					<TabbarItem
						className="pointer"
						onClick={() => setStory('profile', 'user')}
						selected={activeStory === 'profile'}
						text="Профиль"
						style={{ color: profileUser === null ? "red" : "" }}>
						<IconIndicator isShow={isNewNotice()} style={{ height: "7px", width: "7px" }}>
							<Icon28Profile />
						</IconIndicator>
					</TabbarItem>
				</Tabbar>
			}>
				<Root id="teams" activeView={activeView} popout={popout}>
					<CommonView id='teams' activePanel={getActivePanel('teams').panel}
						history={history}
						modal={<TeamsFilters activeModal={activeModal} setActiveModal={setActiveModal} />}
						setActiveModal={setActiveModal}>
						<Teams id='teams' onFiltersClick={() => setActiveModal('filters')} />
					</CommonView>
				</Root>
				<Root id="users" activeView={activeView} popout={popout}>
					<CommonView id='users' activePanel={getActivePanel('users').panel}
						history={history}
						setActiveModal={setActiveModal}>
						<Users id="users" />
					</CommonView>
				</Root>
				<Root id="events" activeView={activeView} popout={popout}>
					<CommonView id='events' activePanel={getActivePanel('events').panel}
						history={history}
						setActiveModal={setActiveModal}>
						<Events id='events' />
					</CommonView>
				</Root>
				<Root id="profile" activeView={activeView} popout={popout}>
					<CommonView id='profile' activePanel={getActivePanel('profile').panel}
						history={history}
						setActiveModal={setActiveModal} />
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
		profile: state.user.profile,
		profileUser: state.user.profileUser,
		notifications: state.notice.notifications
	};
};


function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({
			setStory, goBack, closeModal
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);