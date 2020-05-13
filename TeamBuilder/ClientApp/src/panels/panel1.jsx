import React from 'react';
import { Panel, PanelHeader, Group, Cell, Avatar } from "@vkontakte/vkui";
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28MusicOutline from '@vkontakte/icons/dist/28/music_outline';

const Panel1 = ({ id, go, fetchedUser }) => (
    <Panel id={id}>
        <PanelHeader>More</PanelHeader>
        {fetchedUser &&
            <Group title="Результат из VK Connect">
                <Cell description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
                    before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}>
                    {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                </Cell>
            </Group>}
        <Group>
            <Cell expandable before={<Icon28UserOutline />} onClick={go} data-to='panel2'>
                Friends
                        </Cell>
            <Cell expandable before={<Icon28UsersOutline />} onClick={go} data-to='panel2'>
                Communities
                        </Cell>
            <Cell expandable before={<Icon28MusicOutline />} onClick={go} data-to='panel2'>
                Music
                        </Cell>
        </Group>
    </Panel>
);

export default Panel1;