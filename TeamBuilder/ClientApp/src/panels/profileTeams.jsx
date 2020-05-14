import React from 'react';
import ReactDOM from 'react-dom';
import { List, Cell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

class TeamsSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: null
        }
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateTeamData() {
        const response = await fetch('/team/getall');
        const data = await response.json();
        console.log('--------', 2, data);
        this.setState({ teams: data });
    }

    render() {
        return (
            <List>
                {this.state.teams ? this.state.teams.map(function (team, index) {
                    return <Cell>{team.name}</Cell>;
                }) : <Cell/> }
            </List>
        )
    }

}

export default TeamsSet;