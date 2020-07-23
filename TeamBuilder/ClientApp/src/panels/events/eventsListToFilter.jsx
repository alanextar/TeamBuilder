import React from 'react';
import { connect } from 'react-redux';

import { goBack } from '../../store/router/actions';
import { setTeamsEventFilter } from "../../store/events/actions";

import EventsListBase from './eventsListBase'

const EventsListToFilter = props => {
	const { goBack, setTeamsEventFilter } = props;

	const itemClickHandler = (event) => {
		goBack();
		setTeamsEventFilter(event);
		props.openFilter();
	}

	const backClickHandler = () => {
		goBack();
		props.openFilter();
	}

	return (
		<EventsListBase id={props.id} itemClickHandler={itemClickHandler} backClickHandler={backClickHandler} />
	);
};

const mapDispatchToProps = {
	setTeamsEventFilter,
	goBack
}

export default connect(null, mapDispatchToProps)(EventsListToFilter);