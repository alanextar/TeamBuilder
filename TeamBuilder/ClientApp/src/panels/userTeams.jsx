import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
    Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh,
    PanelHeaderButton, Cell, CardGrid, Card, Button
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import { setTeam, setUserTeam } from '../store/teams/actions';
import { setPage } from '../store/router/actions';
import { Api } from '../infrastructure/api';

class UserTeams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userTeams: props.userTeams,
            fetching: false,
        }
    }

    componentDidMount() {

    }

    async handleJoin(e, teamId) {
        e.stopPropagation();
        Api.Users.joinTeam(teamId)
            .then(data => this.setState({ userTeams: data }));
    }

    async handleQuitOrDecline(e, teamId) {
        e.stopPropagation();
        Api.Users.quitOrDeclineTeam(teamId)
            .then(data => this.setState({ userTeams: data }));
    }

    async handleCancelRequestTeam(e, teamId) {
        e.stopPropagation();
        Api.Users.cancelRequestTeam(teamId)
            .then(data => this.setState({ userTeams: data }));
    }

    render() {
        const { setPage, setTeam, activeView, setUserTeam } = this.props;

        return (
            <Group>
                <List>

                    <CardGrid>
                        {
                            this.state.userTeams &&
                            this.state.userTeams.map(userTeam => {
                                return (
                                    <Card key={userTeam.teamId} size="l" mode="shadow">
                                        <RichCell key={userTeam.team.id}
                                            text={userTeam.team.description}
                                            caption={"Событие: " + (userTeam.team.event ? userTeam.team.event.name : '')}
                                            after={userTeam.userAction === 2 ? < Icon28CheckCircleOutline /> :
                                                (userTeam.userAction === 1 && <Icon28InfoOutline />)}
                                            onClick={() => { setTeam(userTeam.team); setUserTeam(userTeam.team); setPage(activeView, 'teaminfo') }}
                                            actions={!this.props.readOnlyMode && (userTeam.userAction === 5 ?
                                                <React.Fragment>
                                                    <Button onClick={(e) => this.handleJoin(e, userTeam.teamId)}>Принять</Button>
                                                    <Button onClick={(e) => this.handleQuitOrDecline(e, userTeam.teamId)}
                                                        mode="secondary">Отклонить</Button>
                                                </React.Fragment> :
                                                ((userTeam.userAction === 2 || userTeam.userAction === 1 && !userTeam.isOwner) && <React.Fragment>
                                                    {
                                                        userTeam.userAction === 2
                                                        ?
                                                        <Button onClick={(e) => this.handleQuitOrDecline(e, userTeam.teamId)} mode="secondary">
                                                            Выйти
                                                        </Button>
                                                        :
                                                        (userTeam.userAction === 1 ?
                                                            <Button onClick={(e) => this.handleCancelRequestTeam(e, userTeam.teamId)} mode="secondary">
                                                                Отозвать заявку
                                                    </Button> : '')
                                                    }
                                                </React.Fragment>
                                                ))}>
                                            {userTeam.team.name}
                                        </RichCell>
                                    </Card>
                                )
                            })
                        }
                    </CardGrid>
                </List>
            </Group>
        )
    }

}

const mapStateToProps = (state) => {

    return {
        activeView: state.router.activeView
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam, setUserTeam }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTeams);
