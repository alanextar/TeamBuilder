import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);

        const customCreatableSelect = {
            control: (base) => ({
                ...base,
                backgroundColor: 'var(--field_background)',
                lineHeight: '44px',
                border: '1px solid var(--field_border)',
                borderRadius: '16px',
                width: '100%',
                height: '100%'
            }),
            option: (provided, state) => ({
                ...provided,
                fontSize: '16px',
            }),
            container: (provided, state) => ({
                ...provided,
                fontSize: '19px',
                lineHeight: '19px',
                color: 'var(--text_primary)'
            }),
        }

        console.group('constructor');
        console.log(`props.data: ${props.data}`);
        console.groupEnd();

        this.state = {
            options: props.data,
            style: customCreatableSelect
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
                styles={this.state.style}
                placeholder='Выберите скиллы'
                isMulti
                onChange={this.handleChange}
                options={this.props.data}
            />
        );
    }
}
