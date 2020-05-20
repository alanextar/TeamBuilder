import React from 'react';
import ReactDOM from 'react-dom';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, FormLayoutGroup, Textarea,
    Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class SetUserTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goSetUserTeam: props.goSetUserTeam,
            fetchedUser: props.fetchedUser,
            user: props.user,
            teams: null,
            selectedTeam: null
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
        this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch('/api/teams/getall');
        const data = await response.json();
        this.setState({ teams: data }) 
    }

    async post() {
        console.log('post setTeam ', this.state.selectedTeam)
        var id = this.state.user.id;
        var teamId = this.state.selectedTeam;

        const response = await fetch(`/api/user/setTeam/?id=${id}&&teamId=${teamId}`);
    }

    render() {
        console.log('setUserTeam render', this.state.user);
        return (
            <Panel id="setUserTeam">
                <PanelHeader>Выбор команды</PanelHeader>
                <Separator />
                <FormLayout>
                    <FormLayoutGroup top="Завербовать">
                        <Select
                            top="Выберите команду"
                            placeholder="Команда"
                            onChange={this.onTeamSelect}
                            status={this.state.selectedTeam ? 'valid' : 'error'}
                            bottom={this.state.selectedTeam ? '' : 'Пожалуйста, выберете или создайте событие'}
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
                    <Button onClick={(e) => { this.post(); this.state.goSetUserTeam(e) }}
                        data-user={JSON.stringify(this.state.user)} data-to='user' mode="commerce">Принять</Button>
                    <Button onClick={this.state.goSetUserTeam} data-to='user'
                        data-user={JSON.stringify(this.state.user)} mode="destructive">Отменить</Button>
                </Div>
            </Panel>
        )
    }
}

export default SetUserTeam;