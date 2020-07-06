import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack } from "./store/router/actions";

import {
	View
} from '@vkontakte/vkui';

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
		h(TeamInfo, { id: 'teamInfo' }),
		h(TeamCreate, { id: 'teamCreate' }),
		h(TeamEdit, { id: 'teamEdit' }),
		h(User, { id: 'user' }),
		h(UserEdit, { id: 'userEdit' }),
		h(SetUserTeam, { id: 'setUserTeam' }),
		h(EventInfo, { id: 'eventInfo' }),
		h(EventCreate, { id: 'eventCreate' }),
		h(EventEdit, { id: 'eventEdit' })
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

const mapStateToProps = (state) => {
	return {
		profileUser: state.user.profileUser,
		profile: state.user.profile
	}
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ goBack }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonView);
