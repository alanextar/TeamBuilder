import React from 'react';
import { Panel, PanelHeader, Group, FixedLayout, Search } from '@vkontakte/vkui';

const Teams = ({ id, go }) => (
    <Panel id={id}>
        <PanelHeader>Команды</PanelHeader>
        <FixedLayout vertical="top">
            <Search />
        </FixedLayout>

    </Panel>
);

export default Teams;