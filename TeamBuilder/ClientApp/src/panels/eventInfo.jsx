import React, { useState } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { goBack, setPage } from "../store/router/actions";
import { setTeam, setEventsTeam } from "../store/teams/actions";

import {
    Panel, PanelHeader, Group, SimpleCell, InfoRow, Header, Avatar,
    PanelHeaderBack, Cell, List, PanelHeaderContent, PanelHeaderContext
} from '@vkontakte/vkui';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

const EventInfo = props => {
    const { goBack, setPage, setTeam, setEventsTeam, activeView } = props;
    const [contextOpened, setContextOpened] = useState(false);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const canEdit = () => {
        let isOwner = props.profile ? props.profile.id === props.event.ownerId : false;
        let isModerator = props.profileUser ? props.profileUser.isModerator : false;
        return props.profileUser && (isOwner || isModerator);
    }

    return (
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />}>
                {canEdit()
                    ?
                    <PanelHeaderContent
                        aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}
                        onClick={toggleContext}>
                        Событие
                    </PanelHeaderContent>
                    :
                    `Событие`
                }
            </PanelHeader>
            <PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
                <List>
                    <Cell
                        onClick={() => { setPage(activeView, 'eventEdit') }}>
                        Редактировать событие
                        </Cell>
                </List>
            </PanelHeaderContext>
            <Group>
                <SimpleCell multiline>
                    <InfoRow header="Название">
                        {props.event && props.event.name}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header="Ссылка">
                        {props.event && <a href={props.event.link}>{props.event.link}</a>}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell multiline>
                    <InfoRow header="Описание">
                        {props.event && props.event.description}
                    </InfoRow>
                </SimpleCell>
                <SimpleCell>
                    <InfoRow header="Время проведения">
                        {props.event && props.event.startDate} - {props.event && props.event.finishDate}
                    </InfoRow>
                </SimpleCell>
            </Group>
            {props.event && props.event.teams &&
                <Group>
                    <Header mode="secondary">Участвующие команды</Header>
                    {props.event.teams.map(team => {
                        return (
                            <Cell
                                key={team.id}
                                expandable
                                indicator={+team.userTeams.map(x => x.userAction === 2 || x.isOwner).reduce((a, b) => a + b) + '/' + team.numberRequiredMembers}
                                onClick={() => {
                                    setTeam(team);
                                    setEventsTeam(team);
                                    setPage(activeView, 'teaminfo')
                                }}
                                before={<Avatar size={48} src={team.photo100} />}>
                                {team.name}
                            </Cell>

                        )
                    }
                    )}
                </Group>}
        </Panel>
    );
}

const mapStateToProps = (state) => {
    return {
        event: state.event.event,
        profile: state.user.profile,
        profileUser: state.user.profileUser,
        activeView: state.router.activeView
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setPage, goBack, setTeam, setEventsTeam }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);
