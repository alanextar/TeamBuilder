import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack } from "./store/router/actions";

import {
	View, PanelHeader, Avatar, RichCell,
	CardGrid, Card
} from '@vkontakte/vkui';
import Icon24Work from '@vkontakte/icons/dist/24/work';

import Events from './panels/events/events'
import EventCreate from './panels/events/eventCreate'
import EventInfo from './panels/events/eventInfo'
import EventEdit from './panels/events/eventEdit'

import Teams from './panels/teams/teams'
import TeamInfo from './panels/teams/teamInfo'
import TeamCreate from './panels/teams/teamCreate'
import TeamEdit from './panels/teams/teamEdit'
import EventsFilter from './panels/teams/eventsFilter'
import TeamsFilters from './panels/teams/teamsFilters'

import Users from './panels/users/users'
import User from './panels/users/user'
import UserEdit from './panels/users/userEdit'
import SetUserTeam from './panels/users/setUserTeam'

const CommonPanels = props => {
	return (
		<View id='common' activePanel={props.getActivePanel()}
			history={props.history}
			onSwipeBack={() => goBack()}>
			<TeamInfo id='teaminfo' />
			<TeamEdit id='teamEdit' />
			<User id='user' />
			<SetUserTeam id='setUserTeam' />
			<EventCreate id='eventCreate' />
			<EventInfo id='eventInfo' />
			<EventEdit id='eventEdit' owner={props.profile} />
		</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommonPanels);
