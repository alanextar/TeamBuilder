import React, { useState } from 'react';

import {
    Panel, PanelHeader, Group, Button, Textarea, FixedLayout,
    PanelHeaderBack, Input, FormLayout
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import { Api } from '../api';

const EventCreate = props => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLink, setEventLink] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventFinishDate, setEventFinishDate] = useState('');

    const onNameChange = () => {
        setEventName(eventName);
    };

    const onDescriptionChange = () => {
        setEventDescription(eventDescription);
    };

    const onLinkChange = () => {
        setEventLink(eventLink);
    };

    const onStartDateChange = () => {
        setEventStartDate(eventStartDate);
    };

    const onFinishDateChange = () => {
        setEventFinishDate(eventFinishDate);
    };

    const eventCreate = () => {
        let name = eventName;
        let description = eventDescription;
        let link = eventLink;
        let startDate = eventStartDate;
        let finishDate = eventFinishDate;
        let ownerId = props.owner;
        var createEventViewModel = { name, description, startDate, finishDate, link, ownerId }
        fetch(`${Api.Events.Create}`, {
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
                <FixedLayout vertical="bottom">
                    <Button
                        stretched={true}
                        onClick={(e) => { eventCreate(); this.state.go(e) }}
                        data-to={'events'}>
                        Создать оревнование
                </Button>
                </ FixedLayout>
            </Group>
        </Panel>
    );
}

export default EventCreate;