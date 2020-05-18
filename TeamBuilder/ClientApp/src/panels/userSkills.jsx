import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelHeader, Group, Search, List, RichCell, Avatar, PullToRefresh, PanelHeaderButton, Cell } from '@vkontakte/vkui';
import { Div,Title, } from '@vkontakte/vkui';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import '@vkontakte/vkui/dist/vkui.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import { skills } from '../demo_dataset/skills';

class UserSkills extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            skills: null,
            go: props.go,
            fetching: false,
            options: null
        }

        this.onRefresh = () => {
            this.setState({
                fetching: true
            });

            //this.populateSkillsData()
            this.setState({
                fetching: false
            });
        }
    }

    componentDidMount() {
        console.log('--------', 999, this.state.id);
        this.populateSkillsData(this.state.id);
    }

    async populateSkillsData(id) {
        const response = await fetch(`/api/user/getskills?vkId=${id}`);
        const data = await response.json();
        //console.log('--------', 777, data && data);
        this.setState({ skills: data });
        var skillsNames = data && data.map(function (skill) {
            return { id: skill.id, label: skill.name };
        });

        this.setState({ options: skillsNames });
    }

    render() {
        return (
            <Div>
                <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                <Typeahead id="skills"
                    onChange={(e) => this.props.handleClick(e)}
                    options={this.state.options ? this.state.options : 'no skills'}
                    top="Skills"
                    multiple
                    className="Select__el skillsInput"
                />
            </Div>
        )
    }

}

export default UserSkills;