import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setActiveTab } from "../store/vk/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, FixedLayout, Link
} from '@vkontakte/vkui';
import { Api } from '../infrastructure/api';
import { GetRandomPic } from '../infrastructure/utils';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            membersDescription: '',
            events: [],
            eventId: null,
            usersNumber: 2,
            go: props.go,
            id: props.id,
            activeTab: props.activeTab["teamCreate"] || "teamDescription",
        };

        this.onEventChange = this.onEventChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onMembersDescriptionChange = this.onMembersDescriptionChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.postCreate = this.postCreate.bind(this);
    }

    componentDidMount() {
        this.populateTeamData();
    }

    componentWillUnmount() {
        const { setActiveTab } = this.props;
        setActiveTab("teamCreate", this.state.activeTab);
    }

    async populateTeamData() {
        Api.Events.getAll()
            .then(result => this.setState({ events: result, }));
    }

    onEventChange(e) {
        this.setState({ eventId: e.target.value });
    }

    onNameChange(e) {
        this.setState({ name: e.target.value })
    }

    onDescriptionChange(e) {
        this.setState({ description: e.target.value })
    }

    onMembersDescriptionChange(e) {
        this.setState({ membersDescription: e.target.value })
    }

    async postCreate() {
        const { setTeam, setPage } = this.props;
        var createTeamViewModel = {
            name: this.state.name,
            photo100: GetRandomPic(),
            description: this.state.description,
            numberRequiredMembers: this.state.usersNumber,
            descriptionRequiredMembers: this.state.membersDescription,
            eventId: this.state.eventId
        }
        let result = await Api.Teams.create(createTeamViewModel)

        setTeam(result);
        setPage('teams', 'teaminfo');
    }

    render() {
        const { id, goBack, setPage, setTeam, activeView } = this.props;
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} />}>
                    Создание
                </PanelHeader>
                <Tabs>
                    <TabsItem
                        onClick={() => {
                            this.setState({ activeTab: 'teamDescription' })
                        }}
                        selected={this.state.activeTab === 'teamDescription'}
                    >
                        Описание
                    </TabsItem>
                    <TabsItem
                        onClick={() => {
                            this.setState({ activeTab: 'teamUsers' })
                        }}
                        selected={this.state.activeTab === 'teamUsers'}
                    >
                        Участники
                    </TabsItem>
                </Tabs>
                <Group>
                    {this.state.activeTab === 'teamDescription' ?
                        <FormLayout >
                            <Input top="Название команды" type="text" placeholder="Введите название команды"
                                onChange={this.onNameChange}
                                defaultValue={this.state.name}
                                status={this.state.name ? 'valid' : 'error'} />
                            <Textarea top="Описание команды" onChange={this.onDescriptionChange} defaultValue={this.state.description} />
                            <Select
                                top="Выберете событие"
                                placeholder="Событие"
                                onChange={this.onEventChange}
                                value={this.state.eventId ? this.state.eventId : ''}
                                name="eventId"
                                bottom={<Link style={{ color: 'rebeccapurple', textAlign: "right" }} onClick={() => setPage(activeView, 'eventCreate')}>Создать событие</Link>}>>
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
                        <Cell>
                            <FormLayout >
                                <Slider
                                    step={1}
                                    min={2}
                                    max={10}
                                    value={Number(this.state.usersNumber)}
                                    onChange={usersNumber => this.setState({ usersNumber })}
                                    top="Количество участников в команде"
                                />
                                <Input value={String(this.state.usersNumber)} onChange={e => this.setState({ usersNumber: e.target.value })} type="number" />
                                <Textarea top="Описание участников и их задач" onChange={this.onMembersDescriptionChange} defaultValue={this.state.membersDescription} />
                            </FormLayout>
                        </Cell>}
                    <Div>
                        <Button
                            stretched={true}
                            onClick={(e) => {
                                this.state.name &&
                                    this.postCreate();
                            }}>
                            Создать Команду
                            </Button>
                    </Div>
                </Group>
            </Panel>
        );
    }

};


const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activeTab: state.vkui.activeTab
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setTeam, setActiveTab }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamCreate);