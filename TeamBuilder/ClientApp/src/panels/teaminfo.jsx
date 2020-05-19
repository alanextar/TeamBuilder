import React from 'react';
import qwest from 'qwest';
import { Api } from './../api'

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow,
    SimpleCell, Avatar, Div, Button
} from '@vkontakte/vkui';

import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';

class Teaminfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: null,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription',
            return: props.return
        };
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        var self = this;
        qwest.get(Api.Teams.Get,
            {
                id: self.props.teamId
            },
            {
                cache: true
            })
            .then((xhr, resp) => {
                if (resp) {
                    self.setState({ team: resp});
                }
            })
            .catch((error) => 
                console.log(`Error for get team id:${self.props.teamId}. Details: ${error}`));
    }

    render() {
        return (
            <Panel id={this.state.id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={this.state.go} data-to={this.state.return} />}>
                    {this.state.team && this.state.team.name}
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
                    {this.state.team && (
                        this.state.activeTab === 'teamDescription' ?
                            <Cell>
                                {console.log('==== ', this.state.team)}
                                <SimpleCell>
                                    <InfoRow header='Описаноие команды'>
                                        {this.state.team.description}    
                                    </InfoRow>
                                </ SimpleCell>
                                <SimpleCell>
                                    <InfoRow header='Участвуем в '>
                                        {this.state.team.event && this.state.team.event.name}
                                    </InfoRow>
                                </ SimpleCell>
                            </ Cell>
                            :
                            <Cell>
                                <InfoRow header='Участники'>
                                    {console.log('userTeams ', this.state.team.userTeams)}
                                    {this.state.team.userTeams &&
                                        this.state.team.userTeams.map((members, i) => {
                                            return (
                                                <SimpleCell
                                                    onClick={this.state.go}
                                                    data-to='user'
                                                    data-id={members.userId}
                                                    before={<Avatar size={48} />}
                                                    after={<Icon28MessageOutline />}>
                                                    {members.user.firstName, members.user.fullName}
                                                </SimpleCell>
                                        )}
                                        )}
                                </InfoRow>
                            </ Cell>)}
                    <Div>
                        {/* add check on owner */}
                        {this.state.team &&
                        <Button
                            mode="destructive"
                            onClick={this.state.go}
                            data-to='teamEdit'
                            data-id={this.state.team.id} >
                            Редактировать Команду
                        </Button>}
                    </Div>
                </ Group>
            </Panel>
        );
    }

};

export default Teaminfo;