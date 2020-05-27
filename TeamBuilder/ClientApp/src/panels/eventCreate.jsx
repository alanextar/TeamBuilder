import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setEvent } from "../store/events/actions";

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api, Urls } from '../infrastructure/api';

const EventCreate = props => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLink, setEventLink] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventFinishDate, setEventFinishDate] = useState('');
    const { activeView, setPage, setEvent, goBack } = props;

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
        let name = eventName;
        let description = eventDescription;
        let link = eventLink;
        let startDate = eventStartDate;
        let finishDate = eventFinishDate;
        let ownerId = props.owner ? props.owner.id : -1;
        var createEventViewModel = { name, description, startDate, finishDate, link, ownerId }
        console.log('Api.Events.create ------------', `${Api.Events.create}`);

        fetch(Urls.Events.Create,
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createEventViewModel)
            })
            .then(result => result.json())
            .then(data => setEvent(data))
            .then(console.log('ok'))
            .catch((error) => console.log(`Error for create events. Details: ${error}`));
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                Создать мероприятие
        </PanelHeader>

            <Group>
                <FormLayout>
                    <Input top="Название соревнования" type="text" onChange={onNameChange} defaultValue={eventName} placeholder="Введите название соревнований" status={eventName ? 'valid' : 'error'} />
                    <Textarea top="Описание соревнования" onChange={onDescriptionChange} defaultValue={eventDescription} />
                    <Input top="Ссылка на соревнование" type="text" onChange={onLinkChange} defaultValue={eventLink} />
                    <Input top="Дата начала соревнований" type="text" onChange={onStartDateChange} defaultValue={eventStartDate} />
                    <Input top="Дата завершения соревнований" type="text" onChange={onFinishDateChange} defaultValue={eventFinishDate} />
                </ FormLayout >
            </Group>
            <FixedLayout vertical="bottom">
                <Button
                    stretched={true}
                    onClick={() => { eventName && eventCreate(); setPage(activeView, 'eventInfo') }}
                    >
                    Создать соревнование
                </Button>
            </ FixedLayout>
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setEvent, goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCreate);
