import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";
import { setUser, setProfileUser } from "../../store/user/actions";

import {
	Panel, PanelHeader, Group, Cell, Avatar, Button, Div, Input, Title,
	FormLayoutGroup, Textarea, Separator, FormLayout, PanelHeaderBack, Switch
} from '@vkontakte/vkui';
import CreatableMulti from '../components/CreatableMulti'
import '@vkontakte/vkui/dist/vkui.css';

import { Api } from '../../infrastructure/api';
import * as Utils from '../../infrastructure/utils';

class UserEdit extends React.Component {
	constructor(props) {
		super(props);

		this.bindingId = `profile`;
		this.state = {
			inputData: props.inputData[this.bindingId],
			allSkills: []
		}

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
			goBack();
		};

		this.postEdit = this.postEdit.bind(this);
		this.handleChangeSkills = this.handleChangeSkills.bind(this);
		const { goBack } = this.props;
	}

	componentDidMount() {
		this.state.inputData || this.fetchUser();
		this.populateSkills();
	}

	componentDidUpdate(prevProps) {
		if (this.props.inputData[this.bindingId] !== prevProps.inputData[this.bindingId]) {
			this.setState({ inputData: this.props.inputData[this.bindingId] });
		}
	}

	componentWillUnmount() {
		this.props.setFormData(this.bindingId, this.state.inputData);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.inputData !== null;
	}

	async postEdit() {
		const { setProfileUser, goBack } = this.props;
		let editUserViewModel = {
			...this.state.inputData,
			skillsIds: this.state.inputData.selectedSkills.map(s => s.id)
		}
		delete editUserViewModel.userSkills;
		delete editUserViewModel.selectedSkills;

		let updatedUser = await Api.Users.edit(editUserViewModel);
		setProfileUser(updatedUser);

		goBack();
	}

	fetchUser() {
		Api.Users.get(this.props.profile.id)
			.then(user => {
				this.setState({
					inputData: {
						...user,
						selectedSkills: Utils.convertUserSkills(user?.userSkills)
					}
				})
			})
	}

	populateSkills() {
		Api.Skills.getAll()
			.then(allSkillsJson => this.setState({ allSkills: Utils.convertSkills(allSkillsJson) }))
	}

	handleChangeSkills = (newValue, actionMeta) => {
		this.setState({
			inputData: {
				...this.state.inputData,
				selectedSkills: newValue
			}
		})

	};

	getOrEmpty = (name) => {
		console.log(`getOrEmpty`);
		return this.state.inputData && this.state.inputData[name] ? this.state.inputData[name] : '';
	}

	render() {
		return (
			<Panel id={this.props.id}>
				<PanelHeader left={<PanelHeaderBack onClick={() => this.cancelForm()} />}>Профиль</PanelHeader>
				{this.props.profile &&
					<Group title="VK Connect">
						<Cell description={this.props.profile.city && this.props.profile.city.title ? this.props.profile.city.title : ''}
							before={this.props.profile.photo_200 ? <Avatar src={this.props.profile.photo_200} /> : null}>
							{`${this.props.profile.first_name} ${this.props.profile.last_name}`}
						</Cell>
					</Group>}
				<Separator />
				<FormLayout>
					<FormLayoutGroup>
						<Input name="mobile" value={this.getOrEmpty('mobile')} onChange={this.handleInput} type="text" placeholder="Телефон" />
						<Input name="telegram" value={this.getOrEmpty('telegram')} onChange={this.handleInput} type="text" placeholder="Telegram" />
						<Input name="email" value={this.getOrEmpty('email')} onChange={this.handleInput} type="text" placeholder="Email" />
						<Textarea name="about" value={this.getOrEmpty('about')} onChange={this.handleInput} placeholder="Дополнительно" />
						<Div>
							<Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
							<CreatableMulti
								name="userSkills"
								data={this.state.allSkills}
								selectedSkills={this.getOrEmpty('selectedSkills')}
								onChange={this.handleChangeSkills}
							/>
						</Div>
						<Div>
							<Cell asideContent={
								<Switch
									name="isSearchable"
									onChange={this.handleInput}
									checked={this.getOrEmpty('isSearchable')} />}>
								Ищу команду
                                    </Cell>
						</Div>
					</FormLayoutGroup>
				</FormLayout>
				<Div style={{ display: 'flex' }}>
					<Button size="l" onClick={() => this.postEdit()} stretched style={{ marginRight: 8 }}>Принять</Button>
					<Button size="l" onClick={() => this.cancelForm()} stretched mode="secondary">Отменить</Button>
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
		...bindActionCreators({ goBack, setUser, setProfileUser, setFormData }, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);