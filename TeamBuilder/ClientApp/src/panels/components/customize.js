export const showTokensOnly = {
    control: (base, state) => ({
        ...base,
        backgroundColor: 'transparent',
        lineHeight: '14px',
        border: 'none',
        '&:hover': {
            border: 'none'
        },
        borderRadius: '16px',
        width: '100%',
        height: '100%',
        zIndex: 3,
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '16px',
        color: 'black',
    }),
    container: (provided, state) => ({
        ...provided,
        fontSize: '19px',
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        display: 'none',
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        display: 'none',
    }),
    multiValue: (provided, state) => ({
        ...provided,
        borderRadius: '15px',
        padding: '8px'
    }),
    multiValueRemove: (provided, state) => ({
        ...provided,
        display: 'none',
    })
}

export const customCreatableSelect = {
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