import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { autobind } from 'core-decorators'

import getFieldNames from '../utils/getFieldNames'
import getInitialValues from '../utils/getInitialValues'
import getValidator from '../utils/getValidator'
import timeoutPromise from '../utils/timeoutPromise'
import { setActiveFilters } from '../actions/filters'
import { calculateSidebarDimensions } from '../utils/frontend'
import FiltersForm from '../forms/FiltersForm'
import withPropsWatch from '../utils/withPropsWatch'

import { filtersShape } from '../PropTypes'


@autobind
export class Filters extends React.Component {

    static propTypes = {
        desc: filtersShape,
        onSubmit: React.PropTypes.func.isRequired,
        onClear: React.PropTypes.func.isRequired,
        filters: React.PropTypes.object,
        dispatch: React.PropTypes.func.isRequired,
        watch: React.PropTypes.func.isRequired,
    };

    constructor() {
        super()
        this.registeredFields = {}
    }

    componentWillMount() {
        // When filters change, provide the active filters
        this.props.watch('filters', (props) => {
            this.provideActiveFilters(props)
        })
        // Here we create the filters form
        const { desc, onClear, onSubmit } = this.props
        this.initialValues = getInitialValues(desc)

        const formSpec = {
            form: desc.id,
            fields: getFieldNames(desc),
            validate: getValidator(desc),
            touchOnBlur: false,
            enableReinitialize: true,
        }

        const formProps = {
            desc,
            onClear,
            onSubmit,
            onRegisterFilterField: this.handleRegisterFilterField,
        }

        this.filtersForm = React.createElement(reduxForm(formSpec)(FiltersForm), formProps)
    }

    componentDidMount() {
        // Calculate sidebar dimensions (filters overflow) and register resize listener
        calculateSidebarDimensions()
        window.addEventListener('resize', this.onResize)
    }

    componentWillUnmount() {
        // Remove resize listener
        window.removeEventListener('resize', this.onResize)
    }

    onResize() {
        calculateSidebarDimensions()
    }

    handleRegisterFilterField(desc, callbacks = {}) {
        if (!callbacks.hasOwnProperty('getDisplayValue')) {
            throw new Error(
                `The filter field '${desc.name}' did not provide `
                + 'the required getDisplayValue() callback when registering'
            );
        }
        this.registeredFields[desc.name] = { desc, callbacks }
    }

    provideActiveFilters(props) {
        const fieldNames = Object.keys(props.filters)

        // Get display values as promises and synchronize on all of them
        Promise.all(fieldNames.map((name) => {
            const value = props.filters[name]
            if (this.registeredFields[name]) {
                return timeoutPromise(
                    Promise.resolve(this.registeredFields[name].callbacks.getDisplayValue(value)),
                    2000,
                    value // default to value when time is out
                )
            }
            throw new Error(`The field ${name} is not a registered filter field.`)
        }))

        // Once we have the display value, create the activeFilters array and publish it
        .then((displayValues) => {
            const activeFilters = displayValues.map((value, index) => ({
                name: fieldNames[index],
                label: this.registeredFields[fieldNames[index]].desc.label,
                value,
            }))
            this.props.dispatch(setActiveFilters(activeFilters))
        })

        // Ignore errors
        .catch(() => undefined)
    }

    render() {
        const { filters } = this.props
        const initialValues = Object.assign({}, this.initialValues, filters)
        return (
            <div>
                {React.cloneElement(this.filtersForm, { initialValues })}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        filters: state.filters.filters,
    }
}

export default connect(mapStateToProps)(withPropsWatch(Filters))
