import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { showTokensOnly } from '../customize.js';

export default class SkillTokens extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: props.data,
            selectedSkills: this.props.selectedSkills,
            style: showTokensOnly
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
    };

    render() {
        return (
            <CreatableSelect
                styles={this.state.style}
                value={[{ key: 1, label: 'C#' }, { key: 2, label: 'React' }, { key: 2, label: 'javascript' },
                { key: 2, label: 'python' }, { key: 2, label: 'html' }, { key: 2, label: 'css' }, { key: 2, label: 'блокнот' }]}
                isDisabled
                placeholder=''
                isMulti
                options={this.props.data}

            />
        );
    }
}