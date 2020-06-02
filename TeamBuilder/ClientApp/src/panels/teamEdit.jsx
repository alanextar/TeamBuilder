import React from 'react';
import { Api } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setActiveTab } from "../store/vk/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Header, InfoRow, Avatar,
    RichCell, Link
} from '@vkontakte/vkui';

import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';

class TeamEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: this.props.activeTeam,
            events: [],
            activeTab: props.activeTab["teamEdit"] || "teamDescription",
            panelId: props.id
        };

        this.onEventChange = this.onEventChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onMembersDescriptionChange = this.onMembersDescriptionChange.bind(this);
        this.onNumberRequiredMembersChange = this.onNumberRequiredMembersChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.postEdit = this.postEdit.bind(this);
    }

    componentDidMount() {
        this.populateEventsData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeTeam !== prevProps.activeTeam) {
            this.setState({ team: this.props.activeTeam });
        }
    }

    componentWillUnmount() {
        const { setActiveTab } = this.props;
        setActiveTab("teamEdit", this.state.activeTab);
    }

    async populateEventsData() {
        Api.Events.getAll()
            .then(result => this.setState({ events: result, }));
    }

    onEventChange(e) {
        var team = this.state.team;
        team.eventId = e.target.value;
        this.setState({ team: team })
    }

    onNameChange(e) {
        var team = this.state.team;
        team.name = e.target.value;
        this.setState({ team: team })
    }

    onDescriptionChange(e) {
        var team = this.state.team;
        team.description = e.target.value;
        this.setState({ team: team })

    }

    onMembersDescriptionChange(e) {
        var team = this.state.team;
        team.membersDescription = e.target.value;
        this.setState({ team: team })
    }

    onNumberRequiredMembersChange(e) {
        var team = this.state.team;
        team.numberRequiredMembers = e.target.value;
        this.setState({ team: team })
    }

    async postEdit() {
        const { setTeam } = this.props;

        var editTeamViewModel = {
            id: this.state.team.id,
            name: this.state.team.name,
            description: this.state.team.description,
            numberRequiredMembers: this.state.team.numberRequiredMembers,
            descriptionRequiredMembers: this.state.team.membersDescription,
            eventId: this.state.team.eventId
        }
        Api.Teams.edit(editTeamViewModel)
            .then(t => { setTeam(t) });
    };

    //Принять в команду
    async handleJoin(e, userTeam) {
        e.stopPropagation();
        Api.Teams.joinTeam({userId: userTeam.userId, teamId: userTeam.teamId})
            .then(newTeam => {
                this.updateTeam(newTeam)
            });
    };

    //Удалить из команды / отклонить заявку
    async dropUser(e, userTeam) {
        Api.Teams.rejectedOrRemoveUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(newTeam => {
                this.updateTeam(newTeam);
            })
    };

    //Отменить приглашение
    async cancelUser(e, userTeam) {
        Api.Teams.cancelRequestUser({ teamId: userTeam.teamId, userId: userTeam.userId })
            .then(newTeam => {
                this.updateTeam(newTeam)
            })
    };

    updateTeam(newTeam) {
        const { setTeam } = this.props;
        setTeam(newTeam);
    }

    render() {
        const { goBack, setPage, activeView } = this.props;

        return (
            <Panel id={this.state.panelId}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                    Редактировать
                </PanelHeader>
                <Tabs>
                    <TabsItem
                        onClick={() => { this.setState({ activeTab: 'teamDescription' }) }}
                        selected={this.state.activeTab === 'teamDescription'}>
                        Описание
                        </TabsItem>
                    <TabsItem
                        onClick={() => { this.setState({ activeTab: 'teamUsers' }) }}
                        selected={this.state.activeTab === 'teamUsers'}>
                        Участники
                        </TabsItem>
                </Tabs>
                <Group>
                    {this.state.team && (
                        this.state.activeTab === 'teamDescription' ?
                            <FormLayout >
                                <Input top="Название команды" type="text" defaultValue={this.state.team.name}
                                    onChange={this.onNameChange} status={this.state.team.name ? 'valid' : 'error'} placeholder='Введите название команды' />
                                <Textarea top="Описание команды" defaultValue={this.state.team.description} onChange={this.onDescriptionChange} />
                                <Select
                                    top='Выберете событие'
                                    placeholder="Событие"
                                    onChange={this.onEventChange}
                                    value={this.state.team && this.state.team.eventId}
                                    name="eventId"
                                    bottom={<Link style={{ color: 'rebeccapurple', textAlign: "right" }} onClick={() => setPage(activeView, 'eventCreate')}>Создать событие</Link>}>
                                    {this.state.events && this.state.events.map((ev, i) => {
                                        return (
                                            <option value={ev.id} key={i}>
                                                {ev.name}
                                            </option>
                                        )
                                    })}
                                </Select>
                            </FormLayout>
                            :
                            <Group>
                                <Group>
                                    <FormLayout>
                                        <Input top="Количество требуемых участников"
                                            value={String(this.state.team.numberRequiredMembers)}
                                            onChange={this.onNumberRequiredMembersChange}
                                            type="number" />
                                        <Textarea
                                            top="Описание участников и их задач"
                                            value={this.state.team.membersDescription}
                                            onChange={this.onMembersDescriptionChange} />
                                    </FormLayout>
                                </Group>
                                <Group>
                                    <Header mode="secondary">Участники</Header>
                                    {this.state.team.userTeams &&
                                        this.state.team.userTeams.map(userTeam => {
                                            return (
                                                (userTeam.userAction === 1 || userTeam.userAction === 2 || userTeam.userAction === 5) &&
                                                <RichCell key={userTeam.userId}
                                                    before={<Avatar size={48} src={userTeam.user.photo100} />}
                                                    after={userTeam.userAction === 2 && <Icon24DismissDark
                                                        onClick={(e) => this.dropUser(e, userTeam)} />}
                                                    actions={
                                                        userTeam.userAction === 1 &&
                                                        <React.Fragment>
                                                            <Button
                                                                onClick={(e) => this.handleJoin(e, userTeam)}>Принять</Button>
                                                            <Button mode="secondary" style={{ marginLeft: 2 }}
                                                                onClick={(e) => this.dropUser(e, userTeam)}>Отклонить</Button>
                                                        </React.Fragment> ||
                                                        userTeam.userAction === 5 &&
                                                        <React.Fragment>
                                                            <Button mode="secondary"
                                                                onClick={(e) => this.cancelUser(e, userTeam)}>Отозвать предложение</Button>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    {userTeam.user.fullName}
                                                </RichCell>
                                            )
                                        }
                                        )}
                                </Group>

                            </Group>
                    )}
                    <Div>
                        <Button
                            stretched
                            onClick={() => { this.state.team.name && this.postEdit(); goBack() }}>
                            Сохранить
                        </Button>
                    </Div>
                </Group>
            </Panel>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        activeTeam: state.team.activeTeam,
        activeView: state.router.activeView,
        activeTab: state.vkui.activeTab
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam, goBack, setActiveTab }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);