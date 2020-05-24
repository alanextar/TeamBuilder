import React from 'react';
import ReactDOM from 'react-dom';
import { Div,Title } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead } from 'react-bootstrap-typeahead';

class UserSkills extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userSkills: props.userSkills ? props.userSkills : [],
            allSkills: []
        }

    }


    componentDidMount() {
        this.populateSkills();
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.userSkills && (this.state.userSkills !== this.props.userSkills)) {
            this.setState({
                userSkills: this.props.userSkills
            });
        }
    }

    async populateSkills() {
        const getAllSkills = await fetch('/api/skill/getall');
        const allSkillsJson = await getAllSkills.json();

        var options = allSkillsJson && allSkillsJson.map(function (skill) {
            return { id: skill.id, label: skill.name };
        });

        this.setState({ allSkills: options });
    }

    render() {

        return (
            <Div>
                <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                <Typeahead id="skills"
                    clearButton
                    onChange={(e) => {
                        this.props.onSkillsChange(e)
                    }}
                    options={this.state.allSkills}
                    selected={this.state.userSkills}
                    top="Skills"
                    multiple
                    className="Select__el skillsInput"
                    disabled={this.props.readOnlyMode}
                />
            </Div>
        )
    }
}

export default UserSkills