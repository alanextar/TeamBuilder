import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);

        console.group('constructor');
        console.log(`props.data: ${props.data}`);
        console.groupEnd();

        this.state = {
            options: props.data,
        }
    }

    handleChange = (newValue: any, actionMeta: any) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };

    render() {
        return (
            <CreatableSelect
                isMulti
                onChange={this.handleChange}
                options={this.props.data}
            />
        );
    }
}
