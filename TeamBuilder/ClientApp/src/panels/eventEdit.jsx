import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setEvent } from "../store/events/actions";

import {
    Panel, PanelHeader, Button, Textarea,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../infrastructure/api';

const EventEdit = props => {
    const [eventName, setEventName] = useState(props.event.name);
    const [eventDescription, setEventDescription] = useState(props.event.description);
    const [eventLink, setEventLink] = useState(props.event.link);
    const [eventStartDate, setEventStartDate] = useState(props.event.startDate);
    const [eventFinishDate, setEventFinishDate] = useState(props.event.finishDate);
    const { goBack, setEvent } = props;

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

    const eventEdit = () => {
        var editEventViewModel = {
            id: props.event.id,
            name: eventName,
            description: eventDescription,
            link: eventLink,
            startDate: eventStartDate,
            finishDate: eventFinishDate
        }
        Api.Events.edit(editEventViewModel)
            .then(result => {
                setEvent(result);
                goBack();
            });
    }

    return (

        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                Редактировать
        </PanelHeader>

            <FormLayout>
                <Input top="Название события" type="text" onChange={onNameChange} value={eventName} status={eventName ? 'valid' : 'error'} placeholder="Введите название события" />
                <Textarea top="Описание события" onChange={onDescriptionChange} value={eventDescription} />
                <Input top="Ссылка на событие" type="text" onChange={onLinkChange} value={eventLink} />
                <Input top="Дата начала события" type="text" onChange={onStartDateChange} value={eventStartDate} />
                <Input top="Дата завершения события" type="text" onChange={onFinishDateChange} value={eventFinishDate} />
                <Button
                    size='xl'
                    onClick={() => {  eventName && eventEdit(); }}>
                    Сохранить
                </Button>
            </FormLayout>
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        event: state.event.event,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setEvent }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEdit);