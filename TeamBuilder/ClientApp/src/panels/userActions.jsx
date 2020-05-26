import React from 'react';
import ReactDOM from 'react-dom';
import {
    Panel, PanelHeader, Group, Cell, Avatar, Search, Button, Div, Input, FormLayoutGroup, Textarea,
    Tabs, TabsItem, Separator, Checkbox, List, Header, FormLayout, Select, RichCell
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../../src/styles/style.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Api, Urls } from '../infrastructure/api';

class UserActions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userTeam: props.userTeam
        }

    }

    async handleJoin(e, userTeam) {
        e.stopPropagation();
        console.log('into handleJoin');
        console.log(userTeam);
        Api.get(Urls.Users.JoinTeam, { id: userTeam.userId, teamId: userTeam.teamId })
            .then(result => {
                console.log(result);
                this.setState({ userTeams: result })
            });
    }

    async handleQuitOrDecline(e, userTeam) {
        e.stopPropagation();
        console.log('into handleQuiteOrDecline');
        Api.get(Urls.Users.QuitOrDeclineTeam, { id: userTeam.userId, teamId: userTeam.teamId })
        .then(result => {
            console.log(result);
            this.setState({ userTeams: result })
        });
    }

    render() {
        return (
            <RichCell key={userTeam.team.id}
                text={userTeam.team.description}
                caption={"Событие: " + (userTeam.team.event ? userTeam.team.event.name : '')}
                after={userTeam.userAction === 3 ? < Icon28CheckCircleOutline /> :
                    (userTeam.userAction === 2 && <Icon28InfoOutline />)}
                onClick={this.state.goUserEdit}
                data-to='teaminfo'
                data-id={userTeam.team.id}
                actions={userTeam.userAction === 6 ?
                    <React.Fragment>
                        <Button onClick={(e) => this.handleJoin(e, userTeam)}>Принять</Button>
                        <Button onClick={(e) => this.handleQuitOrDecline(e, userTeam)} mode="secondary">Отклонить</Button>
                    </React.Fragment> :
                    ((userTeam.userAction === 3 || userTeam.userAction === 2) && <React.Fragment>
                        <Button onClick={(e) => this.handleQuitOrDecline(e, userTeam)}
                            mode="secondary">{userTeam.userAction === 3 ? "Выйти" : (userTeam.userAction === 2 ? "Отозвать заявку" : '')}
                        </Button>
                    </React.Fragment>
                    )}>
                {userTeam.team.name}
            </RichCell>
        )
    }
}

export default UserActions;