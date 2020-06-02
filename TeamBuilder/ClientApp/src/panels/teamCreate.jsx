import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setActiveTab } from "../store/vk/actions";
import { setFormData } from "../store/formData/actions";

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell,
    Div, Button, Textarea, FormLayout, Select, Input, Slider, FixedLayout, Link
} from '@vkontakte/vkui';
import { Api } from '../infrastructure/api';
import { GetRandomPic } from '../infrastructure/utils';

class TeamCreate extends React.Component {
    constructor(props) {
        super(props);

        let defaultInputData = {
            name: '',
            eventId: null,
            numberRequiredMembers: 2,
            membersDescription: ''
        };

        this.state = {
            events: [],
            id: props.id,
            activeTab: props.activeTab["teamCreate"] || "teamDescription",
            inputData: props.inputData['teamCreate_form'] || defaultInputData
        };

         this.handleInput = (e) => {
             let value = e.currentTarget.value;

             if (e.currentTarget.type === 'checkbox') {
                 value = e.currentTarget.checked;
             }
             console.log(value);
             this.setState({
                 inputData: {
                     ...this.state.inputData,
                     [e.currentTarget.name]: value
                 }
             })
             console.log(this.state.inputData);
         }

        this.cancelForm = () => {
            this.setState({
                inputData: null
            })
            props.goBack();
        };

        this.postCreate = this.postCreate.bind(this);
    }

    componentDidMount() {
        this.populateTeamData();
    }

    componentWillUnmount() {
        const { setActiveTab, setFormData } = this.props;
        setActiveTab("teamCreate", this.state.activeTab);
        setFormData('teamCreate_form', this.state.inputData);
    }

    async populateTeamData() {
        Api.Events.getAll()
            .then(result => this.setState({ events: result, }));
    }

    async postCreate() {
        const { setTeam, setPage } = this.props;
        this.setState = {
            ...this.state.inputData,
            photo100: GetRandomPic()
        }

        let result = await Api.Teams.create(this.state.inputData)

        setTeam(result);
        setPage('teams', 'teaminfo');
    }

    render() {
        const { id, goBack, setPage, setTeam, activeView } = this.props;
        var inputData = this.state.inputData;

        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.cancelForm} />}>
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
                                onChange={this.handleInput}
                                name="name"
                                value={inputData.name}
                                status={inputData.name ? 'valid' : 'error'} />
                            <Textarea top="Описание команды" onChange={this.handleInput} name="description" value={inputData.description} />
                            <Select
                                top="Выберете событие"
                                placeholder="Событие"
                                onChange={this.handleInput}
                                value={inputData.eventId && inputData.eventId}
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
                                {/*<Slider
                                    step={1}
                                    min={2}
                                    max={10}
                                    name="numberRequiredMembers"
                                    value={Number(inputData.numberRequiredMembers)}
                                    onChange={this.handleInput}
                                    top="Количество участников в команде"
                                />*/}
                                <Input name="numberRequiredMembers" value={inputData.numberRequiredMembers} onChange={this.handleInput} type="number" />
                                <Textarea name="membersDescription" value={inputData.membersDescription} top="Описание участников и их задач" onChange={this.handleInput} />
                            </FormLayout>
                        </Cell>}
                    <Div>
                        <Button
                            stretched={true}
                            onClick={(e) => {
                                inputData.name &&
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
        activeTab: state.vkui.activeTab,
        inputData: state.formData.forms,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setTeam, setActiveTab, setFormData }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamCreate);