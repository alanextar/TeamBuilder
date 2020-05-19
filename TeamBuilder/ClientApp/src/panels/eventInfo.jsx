import React, { useState } from 'react';

import {
    Panel, PanelHeader, Group, Search, List, RichCell, PullToRefresh,
    PanelHeaderBack, CardGrid, Card
} from '@vkontakte/vkui';
import InfiniteScroll from 'react-infinite-scroller';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import { Api } from '../api';

const EventInfo = props => (
    <Panel id={props.id}>
        <PanelHeader separator={false} left={<PanelHeaderBack onClick={props.go} data-to={props.back} />}>
            Создать мероприятие
        </PanelHeader>

            <Group>

            </Group>
    </Panel>
);

export default EventInfo;