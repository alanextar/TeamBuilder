import React from 'react';
import { connect } from 'react-redux';
import { goBack } from "./store/router/actions";

import { View } from '@vkontakte/vkui';

import EventCreate from './panels/events/eventCreate'
import EventInfo from './panels/events/eventInfo'
import EventEdit from './panels/events/eventEdit'

import TeamInfo from './panels/teams/teamInfo'
import TeamCreate from './panels/teams/teamCreate'
import TeamEdit from './panels/teams/teamEdit'

import User from './panels/users/user'
import UserEdit from './panels/users/userEdit'
import SetUserTeam from './panels/users/setUserTeam'

const CommonView = props => {
	const h = React.createElement;

	const panels = [
		h(TeamInfo, { id: 'teamInfo', key: 'teamInfo' }),
		h(TeamCreate, { id: 'teamCreate', key: 'teamCreate' }),
		h(TeamEdit, { id: 'teamEdit', key: 'teamEdit' }),
		h(User, { id: 'user', key: 'user' }),
		h(UserEdit, { id: 'userEdit', key: 'userEdit' }),
		h(SetUserTeam, { id: 'setUserTeam', key: 'setUserTeam' }),
		h(EventInfo, { id: 'eventInfo', key: 'eventInfo' }),
		h(EventCreate, { id: 'eventCreate', key: 'eventCreate' }),
		h(EventEdit, { id: 'eventEdit', key: 'eventEdit' })
	]

	return (
		h(
			View,
			{
				id: props.id,
				activePanel: props.activePanel,
				history: props.history,
				onSwipeBack: () => goBack(),
				modal: props.modal
			},
			[...React.Children.toArray(props.children), ...panels]
		)
	);
};

const mapDispatchToProps = {
	goBack
};

export default connect(null, mapDispatchToProps)(CommonView);
