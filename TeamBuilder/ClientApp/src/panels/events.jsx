import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';

const Events = props => (
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

export default Events;