import React, { useState } from 'react';

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../api';

const EventEdit = props => {
    const [eventName, setEventName] = useState(props.event.name);
    const [eventDescription, setEventDescription] = useState(props.event.description);
    const [eventLink, setEventLink] = useState(props.event.link);
    const [eventStartDate, setEventStartDate] = useState(props.event.startDate);
    const [eventFinishDate, setEventFinishDate] = useState(props.event.finishDate);

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
        let id = props.event.id;
        let name = eventName;
        let description = eventDescription;
        let link = eventLink;
        let startDate = eventStartDate;
        let finishDate = eventFinishDate;
        let userId = props.owner.id;
        var createEventViewModel = { id, name, description, startDate, finishDate, link, userId }
        fetch(`${Api.Events.Edit}`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createEventViewModel)
        })
            .then(console.log('ok'))
            .catch((error) => console.log(`Error for create events. Details: ${error}`))
    }

    return (

        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={props.go} data-to={props.back} />}>
                Редактировать мероприятие
        </PanelHeader>

            <Group>
                <FormLayout>
                    <Input top="Название соревнования" type="text" onChange={onNameChange} defaultValue={eventName} />
                    <Textarea top="Описание соревнования" onChange={onDescriptionChange} defaultValue={eventDescription} />
                    <Input top="Ссылка на соревнование" type="text" onChange={onLinkChange} defaultValue={eventLink} />
                    <Input top="Дата начала соревнований" type="text" onChange={onStartDateChange} defaultValue={eventStartDate} />
                    <Input top="Дата завершения соревнований" type="text" onChange={onFinishDateChange} defaultValue={eventFinishDate} />
                </ FormLayout >
            </Group>
            <FixedLayout vertical="bottom">
                <Button
                    stretched={true}
                    onClick={(e) => { eventEdit(); props.go(e) }}
                    data-to={'eventsInfo'}
                    data-from={props.id}>
                    Изменить мероприятие
                </Button>
            </ FixedLayout>
        </Panel>
    );
}

export default EventEdit;