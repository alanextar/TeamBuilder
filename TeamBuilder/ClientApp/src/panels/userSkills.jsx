import React from 'react';
import ReactDOM from 'react-dom';
import { Div,Title } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import qwest from 'qwest';

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

        var self = this;
        if (self.props.userSkills === null) {

            qwest.get('/api/skill/getall',
                {
                    cache: true
                })
                .then((xhr, resp) => {
                    if (resp) {
                        console.log('get all skills', resp);
                        var options = resp && resp.collection.map(function (skill) {
                            return { id: skill.id, label: skill.name };
                        });

                        qwest.get(`/api/user/getSkills?vkId=${id}`,
                            {
                                cache: true
                            })
                            .then((xhr, resp) => {
                                if (resp) {
                                    console.log('user getSkills', resp);
                                    var userSkills = resp && resp.collection.map(function (skill) {
                                        return { id: skill.id, label: skill.name };
                                    });

                                    self.setState({
                                        options: options,
                                        userSkills: userSkills
                                    });
                                }
                            })
                            .catch((error) =>
                                console.log(`Error for get user. Details: ${error}`));
                    }
                })
                .catch((error) =>
                    console.log(`Error for get user. Details: ${error}`));
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
                />
            </Div>
        )
    }
}

export default UserSkills;