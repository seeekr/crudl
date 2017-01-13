import React from 'react'
import baseField from './base/baseField'
import { hasParentId, visuallyFocusElem, visuallyBlurElem, toggleExpanded, closeExpanded } from '../utils/frontend'
import asArray from '../utils/asArray'

class SelectMultipleField extends React.Component {

    static defaultProps = {
        allowDuplicates: false, // Can a single value selected multiple times?
        allowNone: true, // Is it allowed to select no item?
        options: [], // Options to be displayed
    };

    componentDidMount() {
        window.addEventListener('keyup', this.listenForEventOutside)
        window.addEventListener('click', this.listenForEventOutside)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.listenForEventOutside)
        window.removeEventListener('click', this.listenForEventOutside)
    }

    listenForEventOutside = (e) => {
        // If "ESC" then blur searchfield, close listbox and destroy search
        // otherwise check if target hasParentId
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeExpanded(this.props.desc.id)
        } else {
            // Use parentId to find out if event.target has a parent with a certain id
            const parentId = `select-multiple-${this.props.desc.id}`
            // Close all results if event.target is not a child of parentId
            // otherwise keep visual focus
            const isChild = hasParentId(e.target, parentId)
            if (!isChild) {
                closeExpanded(this.props.desc.id)
                visuallyBlurElem(this.refs.group)
            } else {
                if (!this.props.disabled && !this.props.readOnly) {
                    visuallyFocusElem(this.refs.group)
                }
            }
        }
    };

    select(selection = []) {
        this.props.input.onChange(selection)
    }

    remove(index) {
        const selection = this.props.input.value.slice() // Create a copy
        if (selection.length > 1 || this.props.allowNone) {
            selection.splice(index, 1)
            this.select(selection)
        }
    }

    handleSelectItem(value) {
        const values = this.getSelectedValues()
        if (values.indexOf(value) < 0 || this.props.allowDuplicates) {
            this.select(values.concat(value))
        }
    }

    focusSelectedOption(event) {
        event.target.parentNode.parentNode.parentNode.classList.add('focus')
    }

    blurSelectedOption(event) {
        event.target.parentNode.parentNode.parentNode.classList.remove('focus')
    }

    getLabel(value) {
        const { options } = this.props
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

    getSelectedValues() {
        return asArray(this.props.input.value).filter(item => item)
    }

    render() {
        const { desc, options, allowNone, disabled, readOnly } = this.props
        const selectedOptions = this.getSelectedValues().map(value => this.getLabel(value)).filter(item => item)
        const isAccessible = !disabled && !readOnly
        return (
            <div className="select-multiple">
                <div role="group" className="selected-items">
                    {selectedOptions.map((label, index) => (
                        <div
                            key={index}
                            role="group"
                            className="field-button-group"
                            >
                            <input
                                className="selected-item"
                                disabled={disabled}
                                readOnly
                                value={label} tabIndex="-1"
                                              />
                            <ul role="group" className="buttons">
                                <li><button
                                    onClick={(e) => {
                                        if (isAccessible) {
                                            e.preventDefault()
                                            this.remove(index)
                                        }
                                    }}
                                    type="button"
                                    className="action-clear icon-only"
                                    tabIndex="0"
                                    aria-label="Remove item (need to save the form)"
                                    aria-disabled={!isAccessible || selectedOptions.length === 1 && !allowNone}
                                    onFocus={event => isAccessible && this.focusSelectedOption(event)}
                                    onBlur={event => this.blurSelectedOption(event)}
                                    >&zwnj;</button>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="select listbox" id={`select-multiple-${desc.id}`}>
                    <div
                        ref="group"
                        role="group"
                        className="field-button-group field-button-inner"
                        aria-controls={desc.id}
                        aria-expanded="false"
                        data-field-display-name={desc.id}
                        data-field-display-values={selectedOptions}
                        onClick={() => isAccessible && toggleExpanded(desc.id)}
                        >
                        <div className="field" tabIndex={disabled ? '-1' : '0'}>
                            <div className="label">{desc.label}</div>
                        </div>
                        <ul role="group" className="buttons">
                            <li><button
                                onClick={(e) => { e.preventDefault() }}
                                className="action-toggle-expand icon-only inherit-focus"
                                tabIndex="0"
                                aria-label="Show options"
                                >&zwnj;</button>
                            </li>
                        </ul>
                    </div>
                    <div className="options" id={desc.id} role="region" aria-hidden="true">
                        <ul role="listbox">
                            {options.map(o => (
                                <li
                                    key={o.value}
                                    role="option"
                                    tabIndex="0"
                                    value={o.value}
                                    onClick={() => this.handleSelectItem(o.value)}
                                    onKeyPress={() => this.handleSelectItem(o.value)}
                                    ><span className="option">{o.label}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default baseField(SelectMultipleField)
