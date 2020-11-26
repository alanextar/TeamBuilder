import React from 'react';
// import GroupCell from '../components/GroupCell';

import { Link } from '@vkontakte/vkui';
import { store } from "../index";
import { goToPage } from "../store/router/actions";

// export const renderGroupsList = (items) => {
// 	let groups = null;
// 	if (items !== undefined && items !== null && items.length !== 0) {
// 		groups = items.map((group) => (
// 			<GroupCell
// 				key={group.id}
// 				description={group.description}
// 				photo={group.photo_100}
// 				name={group.name} />
// 		));
// 	}
// 	return groups;
// };

export const renderNotification = (notification) => {
	var message = notification.message;
	var items = JSON.parse(notification.items);

	if (items?.length === 0) {
		return message;
	}

	return formatMentionText(message, items, new RegExp(/#\[(.*?)\]/g))
};

const formatMentionText = (text, items, regex) => {
	if (!items.length)
		return text;

	return (<div>
		{text.split(regex)
			.reduce((prev, current, i) => {
				if (!i)
					return [current];

				let item = findIt(items, current);

				return prev.concat(
					item ?
						<b><Link key={i + current}
							style={{ color: '#468dd6' }}
							onClick={() => store.dispatch(goToPage('teamInfo', item.Id))}>
							{item.Text}
						</Link></b>
						: current
				);
			}, [])}
	</div>);
};

const findIt = (items, placement) => {
	for (var i = 0; i < items.length; i++) {
		if (items[i].Placement === placement) {
			return items[i];
		}
	}
};