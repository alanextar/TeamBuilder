import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { showTokensOnly } from './customize.js';

export default class SkillTokens extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            style: showTokensOnly
        }
    }

    render() {
        return (
            <CreatableSelect
                styles={this.state.style}
                value={this.props.selectedSkills}
                isDisabled
                placeholder=''
                isMulti
            />
        );
    }
}