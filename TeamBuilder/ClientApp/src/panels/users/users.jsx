import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import {
	Panel, PanelHeader, Avatar, RichCell,
	CardGrid, Card
} from '@vkontakte/vkui';
import Icon24Work from '@vkontakte/icons/dist/24/work';

import { Api, Urls } from '../../infrastructure/api';

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { setUser, setParticipantUser } from "../../store/user/actions";
import { setPage } from '../../store/router/actions';

const Users = props => {
	const { setParticipantUser, setUser, setPage } = props;
	
	const renderItems = items => {
		return (
			<CardGrid style={{ marginBottom: 10 }}>
				{items && items.map(user => (
					<Card size="l" mode="shadow" key={user.id}>
						{user.isSearchable &&
							<RichCell
								before={<Avatar size={48} src={user.photo100} />}
								after={user.isTeamMember && <Icon24Work />}
								caption={user.city && user.city}
								bottom={stringfySkills(user.skills)}
								text={user.about && user.about}
								onClick={() => handleSelectItem(user)}
							>
								{user.firstName} {user.lastName}
							</RichCell>}
					</Card>
				))}
			</CardGrid>
		)
	}

	const stringfySkills = (skills) => {
		var joined = skills && skills.map(s => s.name).join(", ");
		var max = 20;
		var result = joined.length > max ? `${joined.substring(0, max)}...` : joined;
		return result;
	}

	const handleSelectItem = user => {
		setUser(user);
		setParticipantUser(user);
		setPage('common', 'user');
	}

	return (
		<Panel id={props.id}>
			<SearchWithInfiniteScroll
				getPageHandler={Api.Users.getPage}
				pagingSearchHandler={Api.Users.pagingSearch}
				getPageUrl={Urls.Users.GetPage}
				header={<PanelHeader separator={false}>Участники</PanelHeader>}>
				{renderItems}
			</SearchWithInfiniteScroll>
		</Panel>
	);
};

const mapStateToProps = (state) => {
	return {
		profileUser: state.user.profileUser
	}
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ setPage, setUser, setParticipantUser }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
