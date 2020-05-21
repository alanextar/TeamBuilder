import React, { useState } from 'react';

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import { Api } from '../infrastructure/api';

const EventCreate = props => {
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
        let name = eventName;
        let description = eventDescription;
        let link = eventLink;
        let startDate = eventStartDate;
        let finishDate = eventFinishDate;
        let ownerId = props.owner ? props.owner.id : -1;
        var createEventViewModel = { name, description, startDate, finishDate, link, ownerId }
        fetch(`${Api.Events.Create}`,
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createEventViewModel)
            })
            .then(console.log('ok'))
            .catch((error) => console.log(`Error for create events. Details: ${error}`));
    }

    return (

        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={props.go} data-to={props.back} />}>
                Создать мероприятие
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
                    onClick={(e) => { eventCreate(); props.go(e) }}
                    data-to={'events'}
                    data-from={props.id}>
                    Создать оревнование
                </Button>
            </ FixedLayout>
        </Panel>
    );
}

export default EventCreate;