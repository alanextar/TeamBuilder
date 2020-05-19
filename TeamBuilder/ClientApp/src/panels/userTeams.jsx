import React from 'react';
import ReactDOM from 'react-dom';
import {
    Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh,
    PanelHeaderButton, Cell, CardGrid, Card, Button
} from '@vkontakte/vkui';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';

class UserTeams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userTeams: props.userTeams,
            goUserEdit: props.goUserEdit,
            fetching: false,
        }
    }

    componentDidMount() {
        //this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch('/api/teams/getpage/20');
        const data = await response.json();
        this.setState({ teams: data });
    }

    async handleJoin(e, userTeam) {
        console.log(userTeam);
        e.stopPropagation();
        console.log('into handleJoin');
        const response = await fetch(`/api/user/joinTeam/?id=${userTeam.userId}&&teamId=${userTeam.teamId}`);
        const data = await response.json();
        console.log(data);
        this.setState({ userTeams: data });
    }

    async handleQuitOrDecline(e,userTeam) {
        e.stopPropagation();
        console.log('into handleQuiteOrDecline');
        const response = await fetch(`/api/user/quitOrDeclineTeam/?id=${userTeam.userId}&&teamId=${userTeam.teamId}`);
        const data = await response.json();
        console.log(data);
        this.setState({ userTeams: data });
    }

    render() {
        console.log('into userTeams', '------------', this.state.userTeams)
        return (
            <Group>
                <List>
                    {
                        this.state.userTeams &&
                        this.state.userTeams.map((userTeam, i) => {
                            console.log('team params', userTeam.team.id);
                            return (
                                <CardGrid>
                                    <Card size="l" mode="shadow">
                                        <RichCell key={userTeam.team.id}
                                            text={userTeam.team.description}
                                            caption="Команда"
                                            after={userTeam.userAction === 3 ? < Icon28CheckCircleOutline /> :
                                                (userTeam.userAction === 1 && <Icon28InfoOutline />)}
                                            onClick={this.state.goUserEdit}
                                            data-to='teaminfo'
                                            data-id={userTeam.team.id}
                                            actions={userTeam.userAction === 6 ?
                                                <React.Fragment>
                                                    <Button onClick={(e) => this.handleJoin(e,userTeam)}>Принять</Button>
                                                    <Button onClick={(e) => this.handleQuitOrDecline(e,userTeam)} mode="secondary">Отклонить</Button>
                                                </React.Fragment> :
                                                (userTeam.userAction === 3 && <React.Fragment>
                                                    <Button onClick={(e) => this.handleQuitOrDecline(e,userTeam)} mode="secondary">Выйти</Button>
                                                </React.Fragment>)
                                            }>
                                            {userTeam.team.name}
                                        </RichCell>
                                    </Card>
                                </CardGrid>
                            )
                        })
                    }
                </List>
            </Group>
        )
    }

}

export default UserTeams;