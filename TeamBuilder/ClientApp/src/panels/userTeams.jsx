import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton, Cell } from '@vkontakte/vkui';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import '@vkontakte/vkui/dist/vkui.css';

class UserTeams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userTeams: props.userTeams,
            goUserEdit: props.goUserEdit,
            fetching: false,
        }

        //this.onRefresh = () => {
        //    this.setState({
        //        fetching: true
        //    });

        //    this.populateTeamData()
        //    this.setState({
        //        fetching: false
        //    });
        //}
    }

    componentDidMount() {
        //this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch('/team/getall');
        const data = await response.json();
        this.setState({ teams: data });
    }

    render() {
        console.log('into userTeams','------------', this.state.userTeams)
        return (
            <Group>
                <List>
                    {
                        this.state.userTeams &&
                        this.state.userTeams.map((userTeam, i) => {
                            console.log('team params', userTeam.team.id);
                            return (
                                <RichCell key={userTeam.team.id}
                                    text={userTeam.team.description}
                                    caption="Команда"
                                    after="1/3"
                                    onClick={this.state.goUserEdit}
                                    data-to='teaminfo'
                                    data-id={userTeam.team.id}>
                                    {userTeam.team.name}
                                </RichCell>
                            )
                        })}
                </List>
            </Group>
        )
    }

    //render() {
    //    var self = this;

    //    var items = [];
    //    this.state.userTeams && this.state.userTeams.map((userTeam, i) => {
    //        items.push(
    //            <RichCell
    //                key={userTeam.team.id}
    //                text={userTeam.team.description}
    //                caption="Навыки"
    //                after="1/3"
    //                onClick={self.state.go}
    //                data-to='teaminfo'
    //                data-id={userTeam.team.id}>
    //                {userTeam.team.name} - {userTeam.team.id}
    //            </RichCell>
    //        );
    //    });

    //    return (
    //        <List>
    //            {items}
    //        </List>
    //    );
    //}

}

export default UserTeams;