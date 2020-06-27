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
	return (
		<View id={props.id} activePanel={console.log(`acPa: ${props.activePanel}`), props.activePanel}
			history={props.history}
			onSwipeBack={() => goBack()}>

			<TeamInfo id='teaminfo' />
			<TeamCreate id='teamCreate' />
			<TeamEdit id='teamEdit' />
			<User id='user' />
			<UserEdit id='userEdit' />
			<SetUserTeam id='setUserTeam' />
			<EventInfo id='eventInfo' />
			<EventCreate id='eventCreate' />
			<EventEdit id='eventEdit' />
			
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

export default connect(mapStateToProps, mapDispatchToProps)(CommonView);
