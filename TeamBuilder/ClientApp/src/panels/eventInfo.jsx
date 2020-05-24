import React, { useState } from 'react';

import {
    Panel, PanelHeader, Group, SimpleCell, InfoRow, Header, FixedLayout,
    PanelHeaderBack, CardGrid, Card
} from '@vkontakte/vkui';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import { Api } from '../infrastructure/api';

const EventInfo = props => {
    const [edit, setEdit] = useState(true);

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={props.go} data-to={props.back} />}>
                {props.event && props.event.name}
            </PanelHeader>
            <Group>
                <Header mode="primary">Информация о мероприятии</Header>
                <SimpleCell multiline>
                    <InfoRow header="Название">
                        {props.event && props.event.name}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header="Ссылка">
                        {props.event && <a href={props.event.link}>{props.event.link}</a>}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header="Описание">
                        {props.event && props.event.description}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header="Время проведения">
                        {props.event && props.event.startDate} - {props.event && props.event.finishDate}
                    </InfoRow>
                </SimpleCell>
                Добавить команды
                {props.event && edit &&
                    <FixedLayout vertical="bottom">
                        <SimpleCell
                            after={<Icon28EditOutline />}
                            onClick={props.go}
                            data-to='eventEdit'
                            data-event={JSON.stringify(props.event)}
                            data-from={props.id}>
                        </SimpleCell>
                    </FixedLayout>}
            </Group>
        </Panel>
    );
}
export default EventInfo;
