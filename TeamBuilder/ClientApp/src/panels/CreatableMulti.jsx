import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CreatableSelect
                isDisabled={this.props.disabled ? this.props.disabled : false}
                isMulti
                onChange={this.props.handleChange}
                options={this.props.data}
                defaultValue={this.props.selected}
            />
        );
    }
}
