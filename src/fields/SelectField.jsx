import React from 'react'
import baseField from './base/baseField'
import withPropsWatch from '../utils/withPropsWatch'
import {
    hasParentId,
    visuallyFocusElem,
    visuallyBlurElem,
    toggleExpanded,
    closeExpanded,
} from '../utils/frontend'

class SelectField extends React.Component {

    static propTypes = {
        watch: React.PropTypes.func.isRequired,
    }

    static defaultProps = {
        options: [],
    };

    componentWillMount() {
        this.props.watch('options', (props) => {
            if (this.displayValuePromise && props.options.length > 0) {
                const { value, resolve } = this.displayValuePromise
                // Clear the promise
                this.displayValuePromise = undefined
                // Try to obtain the display value
                const displayValue = this.getLabel(value, props)
                // Resolve
                resolve(displayValue || value)
            }
        })
    }

    componentDidMount() {
        window.addEventListener('keyup', this.listenForEventOutside)
        window.addEventListener('click', this.listenForEventOutside)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.listenForEventOutside)
        window.removeEventListener('click', this.listenForEventOutside)
    }

    /**
     * Used by active filters to obtain the display value.
     */
    getDisplayValue(value) {
        // Try it synchronously first
        const label = this.getLabel(value)
        if (label) {
            return label
        }
        // Return a promise that resolves when the options props arrive
        return new Promise((resolve) => {
            this.displayValuePromise = { value, resolve }
        })
    }

    listenForEventOutside = (e) => {
        // If "ESC" then blur searchfield, close listbox and destroy search
        // otherwise check if target hasParentId
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeExpanded(this.props.id)
        } else {
            // Use parentId to find out if event.target has a parent with a certain id
            const parentId = `select-${this.props.id}`
            // Close all results if event.target is not a child of parentId
            // otherwise keep visual focus
            const isChild = hasParentId(e.target, parentId)
            if (!isChild) {
                closeExpanded(this.props.id)
                visuallyBlurElem(this.refs.group)
            } else {
                if (!this.props.disabled && !this.props.readOnly) {
                     visuallyFocusElem(this.refs.group)
                }
            }
        }
    };

    select(value) {
        this.props.input.onChange(value)
        closeExpanded(this.props.id)
    }

    handleSelectItem(value = '') {
        this.select(value)
    }

    handleRemoveItem(event) {
        this.props.input.onChange('')
        closeExpanded(this.props.id)
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    getLabel(value, props) {
        const { options } = props || this.props
        for (const option of options) {
            // The values are converted to strings in order to avoid data type mismatch, such as
            // when comparing '1' and 1. This can happen when the Select field is used in filters,
            // because filter fields values are converted to strings and stored in the URL query.
            if (`${option.value}` === `${value}`) {
                return option.label
            }
        }
        return undefined
    }

    render() {
        const { id, required, options, input, disabled, readOnly } = this.props
        const selectedOption = this.getLabel(input.value)
        const isAccessible = !disabled && !readOnly
        return (
            <div className="select listbox" id={`select-${id}`}>
                <div
                    ref="group"
                    role="group"
                    className="field-button-group field-button-inner"
                    tabIndex={disabled ? '-1' : '0'}
                    aria-controls={id}
                    aria-expanded="false"
                    data-field-display-name={id}
                    data-field-display-values={selectedOption}
                    onClick={() => isAccessible && toggleExpanded(id)}
                    >
                    <div className="field">
                        <div className="label">{selectedOption}</div>
                    </div>
                    <ul role="group" className="buttons">
                        {!required && selectedOption && <li>
                            <button
                                type="button"
                                className="icon-only action-clear"
                                tabIndex="0"
                                aria-label="Remove selected option"
                                onClick={event => this.handleRemoveItem(event)}
                                >&zwnj;</button>
                        </li>
                        }
                        <li><button
                            type="button"
                            className="icon-only action-toggle-expand inherit-focus"
                            tabIndex="0"
                            aria-label="Show options"
                            >&zwnj;</button>
                        </li>
                    </ul>
                </div>
                <div className="options" id={id} role="region" aria-hidden="true">
                    <ul role="listbox">
                        {options.map(o => (
                            <li
                                key={o.value}
                                role="option"
                                tabIndex="0"
                                value={o.value}
                                onClick={() => this.handleSelectItem(o.value, o.label)}
                                onKeyPress={() => this.handleSelectItem(o.value, o.label)}
                                ><span className="option">{o.label}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default withPropsWatch(baseField(SelectField))
