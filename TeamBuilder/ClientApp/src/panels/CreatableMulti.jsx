import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);
    }

    //
    handleChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`actionMeta: ${Object.entries(actionMeta)}`);
        console.log(`actionMeta.action: ${actionMeta.action}`);
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
