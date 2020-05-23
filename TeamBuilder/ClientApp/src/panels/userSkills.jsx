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
            id: props.id,
            go: props.go,
            fetching: false,
            userSkills: props.userSkills ? props.userSkills : [],
            options: []
        }

    }


    componentDidMount() {
        this.populateSkills(this.state.id);
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.userSkills && (this.state.userSkills !== this.props.userSkills)) {
            this.setState({
                userSkills: this.props.userSkills
            });
        }
    }

    async populateSkills(id) {

        if (this.props.userSkills === null) {
            const getAllResponse = await fetch('/api/skill/getall');
            const allSkillsData = await getAllResponse.json();

            var options = allSkillsData && allSkillsData.map(function (skill) {
                return { id: skill.id, label: skill.name };
            });

            const getSkillsResponse = await fetch(`/api/user/getSkills?id=${id}`);
            const userSkillsData = await getSkillsResponse.json();

            var userSkills = userSkillsData && userSkillsData.map(function (skill) {
                return { id: skill.id, label: skill.name };
            });

            this.setState({
                options: options,
                userSkills: userSkills
            });
		}
		else {
            this.setState({
                userSkills: this.props.userSkills
            });
		}
        
    }

    render() {
        return (
            <Div>
                <Title level="3" weight="regular" style={{ marginBottom: 16 }}>Скиллы:</Title>
                <Typeahead id="skills"
                    clearButton
                    onChange={(e) => {
                        this.props.handleClick(e)
                    }}
                    options={this.state.options}
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

export default UserSkills;