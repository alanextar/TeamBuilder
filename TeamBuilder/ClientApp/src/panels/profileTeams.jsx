import React from 'react';
import ReactDOM from 'react-dom';
import { List, Cell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

class TeamsSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams
        }
    }

    render() {
        console.log('--------', 2, this.state.teams)

        return (

            <List>
                {this.state.teams.Teams.map(function (team, index) {
                    return <Cell>{team.Name}</Cell>;
                })}
            </List>
        )
    }

}

export default TeamsSet;