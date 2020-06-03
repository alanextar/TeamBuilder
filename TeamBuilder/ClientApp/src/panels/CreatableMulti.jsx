import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);

        const customCreatableSelect = {
            control: (base, state) => ({
                ...base,
                backgroundColor: 'var(--field_background)',
                lineHeight: '20px',
                border: '1px solid var(--field_border)',
                //'&:hover': {
                //    border: '1px solid var(--field_border)',
                //},
                borderRadius: '16px',
                width: '100%',
                height: '100%',
                zIndex: 3,
            }),
            option: (provided, state) => ({
                ...provided,
                fontSize: '16px',
                color: 'black'
            }),
            container: (provided, state) => ({
                ...provided,
                fontSize: '19px',
            })
        }

        console.group('constructor');
        console.log(`props.data: ${props.data}`);
        console.groupEnd();

        this.state = {
            options: props.data,
            style: customCreatableSelect
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
    };

    render() {
        return (
            <CreatableSelect
                styles={this.state.style}
                //openMenuOnFocus={true}
                //menuIsOpen={true}
                placeholder='Выберите скиллы'
                isMulti
                onChange={() => this.handleChange()}
                options={this.props.data}
            />
        );
    }
}
