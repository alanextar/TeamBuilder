import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, Button, Div, FormLayoutGroup, Separator, FormLayout, Select, PanelHeaderBack
} from '@vkontakte/vkui';

import { Api } from '../../infrastructure/api';
import { getActivePanel } from "../../services/_functions";

class SetUserTeam extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `setUserTeam_${itemIdInitial}`;
		this.state = {
			itemId: itemIdInitial,
			recruitTeams: [],
			inputData: props.inputData[this.bindingId]
		}

		this.post = this.post.bind(this);

		this.handleInput = (e) => {
			let value = e.currentTarget.value;

			if (e.currentTarget.type === 'checkbox') {
				value = e.currentTarget.checked;
			}

			this.setState({
				inputData: {
					...this.state.inputData,
					[e.currentTarget.name]: value
				}
			})
		}

		this.cancelForm = () => {
			this.setState({
				inputData: null
			})
			this.props.goBack();
		};
	}

	componentDidMount() {
		Api.Users.getRecruitTeams(this.props.profile.id, this.state.itemId).
			then(teams => this.setState({ recruitTeams: teams }));
	}

	componentWillUnmount() {
		this.props.setFormData(this.bindingId, this.state.inputData);
	}

	post() {
		let userId = this.state.itemId;
		let teamId = this.state.inputData.teamId;
		Api.Users.setTeam(userId, teamId)
			.then(_ => this.props.goBack());
	}

	render() {
		let inputData = this.state.inputData;

		return (
			<Panel id={this.props.id}>
				<PanelHeader left={<PanelHeaderBack onClick={this.cancelForm} />}>Выбор команды</PanelHeader>
				<Separator />
				<FormLayout>
					<FormLayoutGroup top="Завербовать">
						<Select
							top="Выберите команду"
							placeholder="Команда"
							onChange={this.handleInput}
							status={inputData ? 'valid' : 'error'}
							bottom={inputData ? '' : 'Пожалуйста, выберете или создайте команду'}
							name="teamId"
							value={inputData?.teamId}
						>
							{this.state.recruitTeams?.map(team => {
								return (
									<option ket={team.id} value={team.id}>
										{team.name}
									</option>
								)
							})}

						</Select>
					</FormLayoutGroup>
				</FormLayout>
				<Div style={{ display: 'flex' }}>
					<Button size="l" onClick={() => this.post()} stretched style={{ marginRight: 8 }}>Принять</Button>
					<Button size="l" onClick={this.cancelForm} stretched mode="secondary">Отменить</Button>
				</Div>
			</Panel>
		)
	}
}

const mapStateToProps = (state) => {

	return {
		profile: state.user.profile,
		inputData: state.formData.forms,
		activeView: state.router.activeView,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ goBack, setFormData }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SetUserTeam);