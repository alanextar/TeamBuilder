import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton, Cell } from '@vkontakte/vkui';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import '@vkontakte/vkui/dist/vkui.css';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import qwest from 'qwest';

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
    }

    render() {
        console.log('into userTeams render','------------', this.state.userTeams)
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
                                    after={userTeam.isConfirmed ? <Icon28CheckCircleOutline /> : <Icon28InfoOutline/>}
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

}

export default UserTeams;