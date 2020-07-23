import React from 'react';
import { connect } from 'react-redux';

import { goBack } from '../../store/router/actions';
import { setFormData } from "../../store/formData/actions";

import EventsListBase from './eventsListBase'

import { getActivePanel } from "../../services/_functions";

const EventsListToTeam = props => {
	const { goBack, setFormData } = props;

	const bindingId = getActivePanel(props.activeView).itemId;

	const itemClickHandler = (event) => {
		let input = {
			...props.inputData[bindingId],
			event: event,
			eventId: event.id
		}
		setFormData(bindingId, input);
		goBack();
	}

	const backClickHandler = () => {
		goBack();
	}

	return (
		<EventsListBase id={props.id} itemClickHandler={itemClickHandler} backClickHandler={backClickHandler} />
	);
};

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms
	};
};

const mapDispatchToProps = {
	setFormData,
	goBack
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsListToTeam);