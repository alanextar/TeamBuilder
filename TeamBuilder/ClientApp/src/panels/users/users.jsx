import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import {
	Panel, PanelHeader, Avatar, RichCell,
	CardGrid, Card, Placeholder
} from '@vkontakte/vkui';
import Icon24Work from '@vkontakte/icons/dist/24/work';
import Icon56UsersOutline from '@vkontakte/icons/dist/56/users_outline';

import { Api, Urls } from '../../infrastructure/api';

import SearchWithInfiniteScroll from '../components/SearchWithInfiniteScroll';

import { goToPage } from '../../store/router/actions';
import { isNoContentResponse } from "../../infrastructure/utils";

const Users = props => {
	const { goToPage } = props;
	
	const renderItems = items => {
		return (
			<CardGrid style={{ marginTop: 10, marginBottom: 10 }}>
				{items?.map(user => (
					<Card size="l" mode="shadow" key={user.id}>
						{user.isSearchable &&
							<RichCell
								before={<Avatar size={64} src={user.photo200} />}
								after={user.isTeamMember && <Icon24Work  />}
								caption={user.city && user.city}
								bottom={stringfySkills(user.skills)}
								text={user.about && user.about}
								onClick={() => goToPage('user', user.id)}
							>
								{user.firstName} {user.lastName}
							</RichCell>}
					</Card>
				))}
			</CardGrid>
		)
	}

	const stringfySkills = (skills) => {
		var joined = skills && [...skills].join(", ");
		var max = 20;
		var result = joined.length > max ? `${joined.substring(0, max)}...` : joined;
		return result;
	}

	return (
		<Panel id={props.id}>
			<SearchWithInfiniteScroll
				id={props.id}
				pagingSearchHandler={Api.Users.pagingSearch}
				getPageUrl={Urls.Users.PagingSearch}
				header={<PanelHeader separator={false}>Участники</PanelHeader>}>
				{renderItems}
			</SearchWithInfiniteScroll>
			{
				isNoContentResponse(props.error) &&
				<Placeholder icon={<Icon56UsersOutline />} header="Список участников пока пуст">
					Но мы развиваемся и, надеемся, что пользователи к нам подтянутся :)
				</Placeholder>
			}
		</Panel>
	);
};


const mapStateToProps = (state) => {
	return {
		error: state.formData.error
	}
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ goToPage }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
