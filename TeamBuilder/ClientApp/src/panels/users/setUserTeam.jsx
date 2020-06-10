import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../../store/router/actions";
import { setFormData } from "../../store/formData/actions";

import {
    Panel, PanelHeader, Button, Div, FormLayoutGroup, Separator, FormLayout, Select, PanelHeaderBack
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Api } from '../../infrastructure/api';

class SetUserTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vkProfile: props.vkProfile,
            userId: props.user.id,
            responseStatus: null,
            recruitTeams: props.recruitTeams,
            inputData: props.inputData['setUserTeam']
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
    }

    componentWillUnmount() {
        this.props.setFormData('setUserTeam', this.state.inputData);
    }

    async post() {
        var id = this.state.userId;
        var teamId = this.state.inputData;
        Api.Users.setTeam(id, teamId)
    }

    render() {
        const { goBack } = this.props;
        var inputData = this.state.inputData;

        return (
            <Panel id="setUserTeam">
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
                            name="name"
                            value={inputData && inputData.name}
                        >
                            {this.state.recruitTeams && this.state.recruitTeams.map((team, i) => {
                                return (
                                    <option value={team.id}>
                                        {team.name}
                                    </ option>
                                )
                            })}

                        </Select>
                    </FormLayoutGroup>
                </FormLayout>
                <Div>
                    <Button onClick={(e) => { this.post(); goBack() }}
                        data-to='user' mode="commerce">Принять</Button>
                    <Button onClick={this.cancelForm} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        recruitTeams: state.user.recruitTeams,
        user: state.user.user,
        inputData: state.formData.forms
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setFormData }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetUserTeam);