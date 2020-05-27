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

    async handleJoin(e, userTeam) {
        e.stopPropagation();
        const response = await fetch(`/api/user/joinTeam/?id=${userTeam.userId}&&teamId=${userTeam.teamId}`);
        const data = await response.json();
        this.setState({ userTeams: data });
    }

    async handleQuitOrDecline(e,userTeam) {
        e.stopPropagation();
        const response = await fetch(`/api/user/quitOrDeclineTeam/?id=${userTeam.userId}&&teamId=${userTeam.teamId}`);
        const data = await response.json();
        this.setState({ userTeams: data });
    }

    render() {
        const { setPage, setTeam, activeView, setUserTeam } = this.props;

        return (
            <Group>
                <List>
                    {
                        this.state.userTeams &&
                        this.state.userTeams.map((userTeam, i) => {
                            return (
                                <CardGrid>
                                    <Card size="l" mode="shadow">
                                        <RichCell key={userTeam.team.id}
                                            text={userTeam.team.description}
                                            caption={"Событие: " + (userTeam.team.event ? userTeam.team.event.name : '')}
                                            after={userTeam.userAction === 2 ? < Icon28CheckCircleOutline /> :
                                                (userTeam.userAction === 1 && <Icon28InfoOutline />)}
                                            onClick={() => { setTeam(userTeam.team); setUserTeam(userTeam.team); setPage(activeView, 'teaminfo') }}
                                            actions={!this.props.readOnlyMode && (userTeam.userAction === 5 ?
                                                <React.Fragment>
                                                    <Button onClick={(e) => this.handleJoin(e,userTeam)}>Принять</Button>
                                                    <Button onClick={(e) => this.handleQuitOrDecline(e, userTeam)}
                                                        mode="secondary">Отклонить</Button>
                                                </React.Fragment> :
                                                ((userTeam.userAction === 2 || userTeam.userAction === 1) && <React.Fragment>
                                                    <Button onClick={(e) => this.handleQuitOrDecline(e, userTeam)}
                                                        mode="secondary">{userTeam.userAction === 2 ? "Выйти" :
                                                            (userTeam.userAction === 1 ? "Отозвать заявку" : '')}
                                                    </Button>
                                                </React.Fragment>
                                            ))}>
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
