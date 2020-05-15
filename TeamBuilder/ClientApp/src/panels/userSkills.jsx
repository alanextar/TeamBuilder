import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton, Cell } from '@vkontakte/vkui';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import '@vkontakte/vkui/dist/vkui.css';

class UserSkills extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            skills: null,
            go: props.go,
            fetching: false,
        }

        this.onRefresh = () => {
            this.setState({
                fetching: true
            });

            this.populateSkillsData()
            this.setState({
                fetching: false
            });
        }
    }

    componentDidMount() {
        this.populateTeamData();
    }

    async populateSkillsData() {
        const response = await fetch($`/user/getskills`);
        const data = await response.json();
        console.log('--------', 2, data);
        this.setState({ skills: data });
    }

    render() {
        return (
            <Div>
                <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                <Typeahead id="skills"
                    onChange={(selected) => {
                        // Handle selections...
                    }}
                    options={[
                        'John',
                        'Miles',
                        'Charles',
                        'Herbie1',
                        'John1',
                        'Miles1',
                        'Charles2',
                        'John2',
                        'Miles2',
                        'Charles3',
                        'John3',
                        'Miles3',
                        'Charles4'
                    ]}
                    top="Skills"
                    multiple
                    className="Select__el skillsInput"
                />
            </Div>
        )
    }

}

export default TeamsSet;