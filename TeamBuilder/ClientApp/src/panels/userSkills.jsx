import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { setAllSkills } from "../store/user/actions";

import { Div,Title } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead } from 'react-bootstrap-typeahead';

class UserSkills extends React.Component {
    constructor(props) {
        super(props);

        console.log('userSkills constructor', props.allSkills);

        this.state = {
            id: props.id,
            go: props.go,
            fetching: false,
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
                        this.props.handleClick(e)
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

const mapStateToProps = (state) => {
    return {
        allSkills: state.user.allSkills,
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setAllSkills }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSkills);