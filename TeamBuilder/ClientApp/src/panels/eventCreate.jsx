import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setEvent } from "../store/events/actions";

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../infrastructure/api';

const EventCreate = props => {
    const { setPage, setEvent, goBack } = props;

    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLink, setEventLink] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventFinishDate, setEventFinishDate] = useState('');

    const onNameChange = (e) => {
        setEventName(e.target.value);
    };

    const onDescriptionChange = (e) => {
        setEventDescription(e.target.value);
    };

    const onLinkChange = (e) => {
        setEventLink(e.target.value);
    };

    const onStartDateChange = (e) => {
        setEventStartDate(e.target.value);
    };

    const onFinishDateChange = (e) => {
        setEventFinishDate(e.target.value);
    };

    const eventCreate = () => {
        var createEventViewModel = { 
            name: eventName, 
            description: eventDescription, 
            startDate: eventStartDate, 
            finishDate: eventFinishDate, 
            link: eventLink }

        Api.Events.create(createEventViewModel)
            .then(result => setEvent(result));
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                Создать мероприятие
        </PanelHeader>

            <Group>
                <FormLayout>
                    <Input top="Название соревнования" type="text" onChange={onNameChange} defaultValue={eventName} />
                    <Textarea top="Описание соревнования" onChange={onDescriptionChange} defaultValue={eventDescription} />
                    <Input top="Ссылка на соревнование" type="text" onChange={onLinkChange} defaultValue={eventLink} />
                    <Input top="Дата начала соревнований" type="text" onChange={onStartDateChange} defaultValue={eventStartDate} />
                    <Input top="Дата завершения соревнований" type="text" onChange={onFinishDateChange} defaultValue={eventFinishDate} />
                </FormLayout>
            </Group>
            <FixedLayout vertical="bottom">
                <Button
                    stretched={true}
                    onClick={() => { eventCreate(); setPage('events', 'eventInfo') }}
                >
                    Создать соревнование
                </Button>
            </FixedLayout>
        </Panel>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setEvent, goBack }, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(EventCreate);
