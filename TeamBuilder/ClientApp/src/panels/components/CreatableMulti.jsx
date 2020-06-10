import React, { Component } from 'react';
import Select from 'react-select';
import { customCreatableSelect } from './customize.js';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            style: customCreatableSelect
        }
    }

    render() {
        return (
            <Select
                styles={this.state.style}
                openMenuOnFocus={true}
                placeholder='Выберите скиллы'
                value={this.props.selectedSkills}
                isMulti
                onChange={this.props.onChange}
                options={this.props.data}
            />
        );
    }
}
