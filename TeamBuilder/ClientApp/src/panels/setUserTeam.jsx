import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";

import {
    Panel, PanelHeader, Button, Div, FormLayoutGroup, Separator, FormLayout, Select, PanelHeaderBack
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class SetUserTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goSetUserTeam: props.goSetUserTeam,
            vkProfile: props.vkProfile,
            userId: props.userId,
            teams: null,
            selectedTeam: null,
            responseStatus: null,
            recruitTeam: props.recruitTeams
        }

        this.post = this.post.bind(this);
        this.onTeamSelect = this.onTeamSelect.bind(this);
    }

    onTeamSelect(e) {
        const value = e.currentTarget.value;
        console.log('selected team', value)
        this.setState({ selectedTeam: value });
    }

    componentDidMount() {
        //this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch(`/api/user/getOwnerTeams/?id=${this.state.vkProfile.id}`);
        const data = await response.json();
        this.setState({ teams: data }) 
    }

    async post() {
        var id = this.state.userId;
        var teamId = this.state.selectedTeam;

        const response = await fetch(`/api/user/setTeam/?id=${id}&&teamId=${teamId}`);
    }

    render() {
        const { goBack, setPage } = this.props;

        console.log('setUserTeam render', this.state.user);
        return (
            <Panel id="setUserTeam">
                <PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />}>Выбор команды</PanelHeader>
                <Separator />
                <FormLayout>
                    <FormLayoutGroup top="Завербовать">
                        <Select
                            top="Выберите команду"
                            placeholder="Команда"
                            onChange={this.onTeamSelect}
                            status={this.state.selectedTeam ? 'valid' : 'error'}
                            bottom={this.state.selectedTeam ? '' : 'Пожалуйста, выберете или создайте команду'}
                            name="check"
                        >
                            {this.state.teams && this.state.teams.map((team, i) => {
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
                    <Button onClick={() => goBack()} data-to='user' mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack }, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(SetUserTeam);