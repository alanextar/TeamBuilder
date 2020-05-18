import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton, Cell } from '@vkontakte/vkui';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import '@vkontakte/vkui/dist/vkui.css';

class UserTeams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: null,
            go: props.go,
            fetching: false,
        }

        this.onRefresh = () => {
            this.setState({
                fetching: true
            });

            this.populateTeamData()
            this.setState({
                fetching: false
            });
        }
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch('/team/getall');
        const data = await response.json();
        this.setState({ teams: data });
    }

    render() {
        return (
            <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
                <Group>
                    <List>
                        {
                            this.state.teams &&
                            this.state.teams.map(({ id, name, description, go }, i) => {
                                return (
                                    <RichCell key={i}
                                        text={description}
                                        caption="Навыки"
                                        after="1/3"
                                        onClick={go}
                                        data-to='teaminfo'
                                        data-id={id}>
                                        {name}
                                    </RichCell>
                                )
                            })}
                    </List>
                </Group>
        </PullToRefresh>
        )
    }

}

export default UserTeams;