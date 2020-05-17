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
            userSkills: [],
            options: []
        }

        //this.onRefresh = () => {
        //    this.setState({
        //        fetching: true
        //    });

        //    //this.populateSkillsData()
        //    this.setState({
        //        fetching: false
        //    });
        //}
    }


    componentDidMount() {
        console.log("user skills componentDidMount()");
        this.populateSkills(this.state.id);
    }

    //componentWillMount() {
    //    console.log("componentWillMount()");
    //    this.populateSkills(this.state.id);
    //}

    //componentWillReceiveProps(nextProps) {
    //    console.log("componentWillReceiveProps()");
    //}

    //componentWillUnmount() {
    //    console.log("componentWillUnmount()");
    //}
    //shouldComponentUpdate() {
    //    console.log("shouldComponentUpdate()");
    //    return true;
    //}
    //componentWillUpdate() {
    //    console.log("componentWillUpdate()");
    //}
    //componentDidUpdate() {
    //    console.log("componentDidUpdate()");
    //}

    async populateSkills(id) {
        console.log("id -------- ", id);

        const getAllResponse = await fetch('skill/getall');
        const allSkillsData = await getAllResponse.json();

        var options = allSkillsData && allSkillsData.map(function (skill) {
            return { id: skill.id, label: skill.name };
        });

        const getSkillsResponse = await fetch(`user/getSkills?vkId=${id}`);
        const userSkillsData = await getSkillsResponse.json();

        var userSkills = userSkillsData && userSkillsData.map(function (skill) {
            return { id: skill.id, label: skill.name };
        });

        this.setState({
            options: options,
            userSkills: userSkills
        });
    }

    render() {
        console.log("user skills render", '##########', this.state.userSkills ? this.state.userSkills : 'no user skills value yet');
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
                    //defaultSelected={[{ id: 1, label: 'Jog' }]}
                    //options={[
                    //    { id: 1, label: 'Jog' }
                    //]}
                    top="Skills"
                    multiple
                    className="Select__el skillsInput"
                />
            </Div>
        )
    }
}

export default UserSkills;