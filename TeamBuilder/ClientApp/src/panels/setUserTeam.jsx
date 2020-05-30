import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";

import {
    Panel, PanelHeader, Button, Div, FormLayoutGroup, Separator, FormLayout, Select, PanelHeaderBack
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Api } from '../infrastructure/api';

class SetUserTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vkProfile: props.vkProfile,
            userId: props.user.id,
            selectedTeam: null,
            responseStatus: null,
            recruitTeams: props.recruitTeams
        }

        this.post = this.post.bind(this);
        this.onTeamSelect = this.onTeamSelect.bind(this);
    }

    onTeamSelect(e) {
        const value = e.currentTarget.value;
        this.setState({ selectedTeam: value });
    }

    componentDidMount() {
        //this.populateTeamData();
    }

    async post() {
        var id = this.state.userId;
        var teamId = this.state.selectedTeam;
        Api.Users.setTeam(id, teamId)
    }

    render() {
        const { goBack } = this.props;

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
                    <Button onClick={() => goBack()} data-to='user' mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        recruitTeams: state.user.recruitTeams,
        user: state.user.user
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetUserTeam);