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

import { goToPage } from '../../store/router/actions';
import { isNotContentResponse } from "../../infrastructure/utils";

const Users = props => {
	const { goToPage } = props;
	
	const renderItems = items => {
		return (
			<CardGrid style={{ marginTop: 10, marginBottom: 10 }}>
				{items?.map(user => (
					<Card size="l" mode="shadow" key={user.id}>
						{user.isSearchable &&
							<RichCell
								before={<Avatar size={48} src={user.photo100} />}
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
		var joined = skills && skills.map(s => s.name).join(", ");
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
				isNotContentResponse(props.error) &&
				<Placeholder header="Список участников пока пуст">
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
