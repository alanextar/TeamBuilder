import React from 'react';
import { Api } from '../infrastructure/api';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow,
    SimpleCell, Avatar, Div, PullToRefresh, FixedLayout
} from '@vkontakte/vkui';

import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';

class TeamInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: null,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription',
            return: props.return,
            edit: true,
            fetching: false
        };

        this.onRefresh = async () => {
            this.setState({ fetching: true });
            await this.populateTeamData();
            this.setState({
                fetching: false
            });

        };
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        Api.Teams.get(this.props.teamId)
            .then(result => this.setState({ team: result }))
    }

    render() {
        var self = this;
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
                <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                    <Group>
                        {this.state.team && (
                            this.state.activeTab === 'teamDescription' ?
                                <Cell>
                                    {console.log('==== ', this.state.team)}
                                    <SimpleCell>
                                        <InfoRow header='Описаноие команды'>
                                            {this.state.team.description}
                                        </InfoRow>
                                    </SimpleCell>
                                    <SimpleCell>
                                        <InfoRow header='Участвуем в '>
                                            {this.state.team.event && this.state.team.event.name}
                                        </InfoRow>
                                    </SimpleCell>
                                </Cell>
                                :
                                <Cell>
                                    <Div>
                                        <InfoRow header='Участники'>
                                            Требуется {this.state.team.numberRequiredMembers} участников
                                        {console.log('userTeams ', this.state.team.userTeams)}
                                            {this.state.team.userTeams &&
                                                this.state.team.userTeams.map((userTeam, i) => {
                                                    return (
                                                        userTeam.userAction === 2 &&
                                                        <SimpleCell key={i}
                                                            onClick={this.state.go}
                                                            data-to='user'
                                                            data-id={userTeam.userId}
                                                            data-user={JSON.stringify(userTeam.user)}
                                                            before={<Avatar size={48} src={userTeam.user.photo100} />}
                                                            after={<Icon28MessageOutline />}>
                                                            {userTeam.user.firstName, userTeam.user.fullName}
                                                        </SimpleCell>

                                                    )
                                                }
                                                )}
                                        </InfoRow>
                                    </Div>
                                    <Div>
                                        <InfoRow header='Описание задач'>
                                            {this.state.team.descriptionRequiredMembers}
                                        </InfoRow>
                                    </Div>
                                </Cell>)}
                        {this.state.team && this.state.edit &&
                            <FixedLayout vertical="bottom" >
                                <SimpleCell
                                    after={<Icon28EditOutline />}
                                    onClick={this.state.go}
                                    data-to='teamEdit'
                                    data-id={this.state.team.id}>
                                </SimpleCell>
                            </FixedLayout>}
                    </Group>
                </PullToRefresh>
            </Panel>
        );
    }

};

export default TeamInfo;
