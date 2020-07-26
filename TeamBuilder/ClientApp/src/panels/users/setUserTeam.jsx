import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
	Panel, PanelHeader, Button, Div, FormLayoutGroup, PullToRefresh,
	Separator, FormLayout, Select, PanelHeaderBack, PanelSpinner
} from '@vkontakte/vkui';

import { Api } from '../../infrastructure/api';
import { getActivePanel, longOperationWrapper } from "../../services/_functions";

class SetUserTeam extends React.Component {
	constructor(props) {
		super(props);

		let itemIdInitial = getActivePanel(props.activeView).itemId;
		this.bindingId = `${props.id}_${itemIdInitial}`;

		this.state = {
			itemId: itemIdInitial,
			recruitTeams: undefined,
			inputData: props.inputData[this.bindingId]
		}

		this.onRefresh = async () => {
			this.setState({ fetching: true });
			await this.populateData();
			this.setState({
				fetching: false
			});

		};

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

		this.post = this.post.bind(this);
	}

	componentDidMount() {
		this.populateData();
	}

	async populateData() {
		let teams = await Api.Users.getRecruitTeams(this.props.profile.id, this.state.itemId);
		this.setState({ recruitTeams: teams });
	}

	componentWillUnmount() {
		this.props.setFormData(this.bindingId, this.state.inputData);
	}

	post() {
		let userId = this.state.itemId;
		let teamId = this.state.inputData.teamId;

		let action = async () => await Api.Users.setTeam(userId, teamId);
		let postAction = () => this.props.goBack();

		longOperationWrapper({ action, postAction });
	}

	render() {
		let inputData = this.state.inputData;
		const loader = <PanelSpinner key={0} size="large" />

		return (
			<Panel id={this.props.id}>
				<PanelHeader left={<PanelHeaderBack onClick={this.cancelForm} />}>Выбор команды</PanelHeader>
				<Separator />
				{!this.state.recruitTeams
					? loader
					:
					<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
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
											<option key={team.id} value={team.id}>
												{team.name}
											</option>
										)
									})}

								</Select>
							</FormLayoutGroup>
						</FormLayout>
						<Div style={{ display: 'flex' }}>
							<Button size="l" onClick={this.post} stretched style={{ marginRight: 8 }}>Принять</Button>
							<Button size="l" onClick={this.cancelForm} stretched mode="secondary">Отменить</Button>
						</Div>
					</PullToRefresh>
				}
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