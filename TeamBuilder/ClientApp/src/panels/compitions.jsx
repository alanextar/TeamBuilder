import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';

const Competitions = props => (
	<Panel id={props.id}>
		<PanelHeader right={<PanelHeaderButton><Icon28AddOutline /></PanelHeaderButton>}>События</PanelHeader>
		{
			<Group title="all competitions">
				<Cell>
					comp1
				</Cell>
				<Cell>
					comp2
				</Cell>
			</Group>}


	</Panel>
);

export default Competitions;