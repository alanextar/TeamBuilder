import React from 'react';
import qwest from 'qwest';
import { Api } from '../infrastructure/api';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam } from "../store/teams/actions";
import { setUser } from "../store/user/actions";
import * as VK from '../services/VK';

import {
    Panel, PanelHeader, PanelHeaderBack, Tabs, TabsItem, Group, Cell, InfoRow,
    SimpleCell, Avatar, Div, Button, FixedLayout
} from '@vkontakte/vkui';

import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';

class TeamInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            team: props.activeTeam,
            go: props.go,
            id: props.id,
            activeTab: 'teamDescription',
            return: props.return,
            edit: true
        };
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        var self = this;

        qwest.get(Api.Teams.Get,
            {
                id: self.state.team.id
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
                console.log(`Error for get team id:${self.state.team.id}. Details: ${error}`));
    }

    render() {
        const { id, goBack, setTeam, setUser, setPage } = this.props;

        var self = this;
        return (
            <Panel id={id}>
                <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => goBack()} data-to={this.state.return} />}>
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
                                        {this.state.team.userTeams &&
                                            this.state.team.userTeams.map((userTeam, i) => {
                                                //{ members.isOwner && (members.id === self.props.vkProfile.id) && self.setState({ edit: true }) }
                                                return (
                                                    <SimpleCell
                                                        onClick={() => {
                                                            setPage('teams', 'user');
                                                            setUser(userTeam.user)
                                                        }}
                                                        before={<Avatar size={48} src={userTeam.user.photo100}/>}
                                                        after={<Icon28MessageOutline />}>
                                                        {userTeam.user.firstName, userTeam.user.fullName}
                                                    </SimpleCell>
                                            )}
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
            </Panel>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        activeTeam: state.team.activeTeam
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, setTeam,setUser, goBack }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo);