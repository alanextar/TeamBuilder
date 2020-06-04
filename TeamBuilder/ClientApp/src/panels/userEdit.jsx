import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { goBack } from "../store/router/actions";
import { setFormData } from "../store/formData/actions";
import { setUser, setProfile } from "../store/user/actions";

import {
    Panel, PanelHeader, Group, Cell, Avatar, Button, Div, Input,
    FormLayoutGroup, Textarea, Separator, FormLayout, PanelHeaderBack, Title, Link, Switch
} from '@vkontakte/vkui';

import { Api, Urls } from '../infrastructure/api';
import CreatableMulti from './CreatableMulti'

class UserEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allSkills: [],
            profile: props.profile,
            selectedSkills: props.profile.userSkills ? this.convertSkills(props.profile.userSkills) : [],
            inputData: props.inputData['profile_form'] ? props.inputData['profile_form'] : props.profile
        }

        this.handleInput = (e) => {
            let value = e.currentTarget.value;

            if (e.currentTarget.type === 'checkbox' || e.currentTarget.type === 'switch') {
                value = e.currentTarget.checked;
            }

            // if (e.currentTarget.type === 'сreatableMulti') {
            //     value = e.currentTarget.selected;
            // }

            this.setState({
                inputData: {
                    ...this.state.inputData,
                    [e.currentTarget.name]: value
                },
                profile: {
                    ...this.state.profile,
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
        const { goBack } = this.props;
    }

    //ОСТАНОВИЛСЯ НА СОХРАНЕНИЕ СКИЛЛОВ И ВОЗВРАЩЕНИИ ПОЛЬЗОВАТЕЛЯ С НОВЫМИ ДАННЫМИ + НАДО ДЕРЖАТЬ АКТУАЛЬНЫМ PROFILE

    componentDidMount() {
        this.populateSkills();
    }

    componentWillUnmount() {
        this.props.setFormData('profile_form', this.state.inputData);
    }

    async postEdit() {
        const { setProfile, setUser } = this.props;
        let existSkills = this.state.selectedSkills.filter(x => x.id).map(s => s.id);
        let newSkills = this.state.selectedSkills.filter(x => x.__isNew__);
        let updatedUser = await Api.Users.edit({...this.state.inputData, skills: existSkills});
        console.log(`postEdit.updatedUser ${JSON.stringify(updatedUser, null, 4)}`);
        setUser(updatedUser);
        setProfile(updatedUser);
    }

    populateSkills() {
        Api.Skills.getAll()
            .then(allSkillsJson => {
                let options = allSkillsJson && this.convertSkills(allSkillsJson);
                this.setState({ allSkills: options });
            })
    }

    convertSkills(userSkills) {
        return userSkills.map(skill => {
            return {
                id: skill.id,
                value: skill.name,
                label: skill.name
            };
        })
    }

    handleChange = (newValue, actionMeta) => {
        this.setState({ selectedSkills: newValue });
    };

    getOrEmpty = (name) => {
        return this.state.inputData[name] ? this.state.inputData[name]  : '';
    }

    render() {
        const { goBack } = this.props;
        let profile = this.state.profile

        return (
            <Panel id="userEdit">
                <PanelHeader left={<PanelHeaderBack onClick={this.cancelForm} />}>Профиль</PanelHeader>
                {profile &&
                    <Group title="VK Connect">
                        <Cell description={profile.city ? profile.city : ''}
                            before={profile.photo100 ? <Avatar src={profile.photo100} /> : null}>
                            {`${profile.firstName} ${profile.lastName}`}
                        </Cell>
                    </Group>}
                <Separator />
                <FormLayout>
                    <FormLayoutGroup top="Редактирование">
                        <Input name="mobile" value={this.getOrEmpty('mobile')} onChange={this.handleInput} type="text" placeholder="Телефон" />
                        <Input name="telegram" value={this.getOrEmpty('telegram')} onChange={this.handleInput} type="text" placeholder="Telegram" />
                        <Input name="email" value={this.getOrEmpty('email')} onChange={this.handleInput} type="text" placeholder="Email" />
                        <Textarea name="about" value={this.getOrEmpty('about')} onChange={this.handleInput} placeholder="Дополнительно" />
                        <Div>
                            <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                            <CreatableMulti
                                name="userSkills"
                                data={this.state.allSkills && this.state.allSkills}
                                defaultValue={this.state.selectedSkills}
                                handleChange={this.handleChange}
                            />
                        </Div>
                        <Div>
                            <Cell asideContent={
                                <Switch
                                    name="isSearchable"
                                    onChange={this.handleInput}
                                    checked={profile.isSearchable} />}>
                                Ищу команду
                                    </Cell>
                        </Div>
                    </FormLayoutGroup>
                </FormLayout>
                <Div>
                    <Button onClick={() => {
                        this.postEdit();
                        goBack()
                    }}
                        mode="commerce"
                    >
                        Принять
                     </Button>
                    <Button onClick={this.cancelForm} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.user.user,
        profile: state.user.profile,
        inputData: state.formData.forms,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ goBack, setUser, setProfile, setFormData }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);