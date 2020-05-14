import React from 'react';
import { Panel, PanelHeader, Cell, PanelHeaderBack, Avatar, Search } from "@vkontakte/vkui";

const Panel2 = ({ id, go }) => (
    <Panel id={id}>
        <PanelHeader separator={false} left={<PanelHeaderBack onClick={go} data-to='panel1' />}>
            Communities
                        </PanelHeader>
        <Search />
        <Cell description="Humor" before={<Avatar />} onClick={go} data-to='panel3'>
            Swipe Right
                        </Cell>
        <Cell description="Cultural Center" before={<Avatar />} onClick={go} data-to='panel3'>
            Out Cinema
                        </Cell>
        <Cell description="Movies" before={<Avatar />} onClick={go} data-to='panel3'>
            #ARTPOKAZ
                        </Cell>
    </Panel>
);

export default Panel2;