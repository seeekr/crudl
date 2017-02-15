import React from 'react'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'

import baseField from './base/baseField'
import { hasParentId, visuallyFocusElem, visuallyBlurElem, closeExpanded, showExpanded } from '../utils/frontend'
import { req } from '../Crudl'
import asArray from '../utils/asArray'
import withPropsWatch from '../utils/withPropsWatch'

function cleanValue(value) {
    return value || undefined
}

/**
 * The AutocompleteField requires two actions: `search` and `select`. Both
 * actions return an array of the form: [ {value, label}, ... ]. `search` is used
 * to display the list of options to select from and `select` is used to confirm a selection.
 */
class AutocompleteMultipleField extends React.Component {

    static propTypes = {
        watch: React.PropTypes.func.isRequired,
    }

    static defaultProps = {
        allowDuplicates: false, // Can a single value selected multiple times?
        showAll: false, // Do `search` when the query string is empty?
        searchDelay: 333, // How long to wait between key strokes before we execute the search
    };

    state = {
        options: [],
        selection: [], // The displayed selection. An array of the form [ {value, label}, ... ]
    };

    componentWillMount() {
        // This watch enforces the correspondence between the field value and the displayed selection
        this.props.watch('input.value', (props) => {
            const selectedValues = this.state.selection.map(item => item.value)
            const inputValues = asArray(cleanValue(props.input.value))
            if (!isEqual(selectedValues, inputValues)) {
                this.select(inputValues.map(value => ({ value, label: undefined })))
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

    listenForEventOutside = (e) => {
        // If "ESC" then blur searchfield, close listbox and destroy search
        // otherwise check if target hasParentId
        if (e.key === 'Escape' || e.keyCode === 27) {
            this.clearSearch()
            this.refs.searchField.blur()
            visuallyBlurElem(this.refs.group)
        } else {
            // Use parentId to find out if event.target has a parent with a certain id
            const parentId = `autocomplete-multiple-${this.props.id}`
            // Close all results if event.target is not a child of parentId
            // otherwise keep visual focus
            const isChild = hasParentId(e.target, parentId)
            if (!isChild) {
                this.clearSearch()
                visuallyBlurElem(this.refs.group)
            } else {
                if (!this.props.disabled && !this.props.readOnly) {
                    visuallyFocusElem(this.refs.group)
                }
            }
        }
    };

    select(selection = []) {
        const { input } = this.props
        if (selection.length === 0) {
            this.setState({ selection: [] })
            input.onChange([])
        } else {
            this.props.actions.select(req({ selection }))
            .then((res) => {
                this.setState({ selection: res.data })
                const values = res.data.map(item => item.value)
                input.onChange(values)
            })
        }
        this.clearSearch()
    }

    doSearch(query) {
        this.props.actions.search(req({ query }))
        .then((res) => {
            showExpanded(this.props.id)
            this.setState({ options: res.data })
        })
    }

    search(query = '') {
        window.clearTimeout(this.searchTimeout)
        // Search with a delay if query is not empty
        if (query.length > 0) {
            this.searchTimeout = window.setTimeout(() => {
                this.doSearch(query)
            }, this.props.searchDelay)
        } else {
            // Search immediately if showAll
            // Clear search otherwise
            if (this.props.showAll) {
                this.doSearch(query)
            } else {
                this.clearSearch()
            }
        }
    }

    remove(e, index) {
        const selection = this.state.selection.slice() // Create a copy
        if (selection.length > 1 || !this.props.required) {
            selection.splice(index, 1)
            this.select(selection)
        }
    }

    handleSelectItem(value = '', label = '') {
        const index = this.state.selection.map(s => s.value).indexOf(value)
        if (index < 0 || this.props.allowDuplicates) {
            this.select(this.state.selection.concat({ value, label }))
        }
        this.refs.searchField.focus()
    }

    handleFieldFocus(event) {
        this.refs.searchField.focus()
        // automatically show all results if input has no value and there are no search results
        if (!event.target.value && this.state.options.length === 0) {
            this.search(event.target.value)
        }
    }

    handleShowAll() {
        if (this.state.options.length === 0) {
            this.clearSearch()
        }
    }

    handleClearSearch() {
        this.clearSearch()
    }

    clearSearch() {
        closeExpanded(this.props.id)
        this.refs.searchField.value = ''
    }

    focusSelectedOption(event) {
        event.target.parentNode.parentNode.parentNode.classList.add('focus')
    }

    blurSelectedOption(event) {
        event.target.parentNode.parentNode.parentNode.classList.remove('focus')
    }

    render() {
        const { id, required, disabled, readOnly } = this.props
        const isSearchResult = this.state.options.length > 0
        const selectedOptions = this.state.selection.map(item => item.label)
        const applyReadOnly = !disabled && readOnly
        const isAccessible = !disabled && !readOnly
        return (
            <div className="autocomplete listbox">
                <div role="group" className="selected-items">
                    {this.state.selection.map((item, index, array) => (
                        <div
                            key={index}
                            role="group"
                            className="field-button-group"
                            onClick={(e) => {
                                if (isAccessible) {
                                    e.preventDefault()
                                    this.remove(e, index)
                                }
                            }}
                            >
                            <input
                                className="selected-item"
                                disabled={disabled}
                                readOnly
                                value={item.label} tabIndex="-1"
                                                   />
                            <ul role="group" className="buttons">
                                <li><button
                                    type="button"
                                    className="action-clear icon-only"
                                    tabIndex="0"
                                    aria-label="Remove item (need to save the form)"
                                    aria-disabled={!isAccessible || array.length === 1 && required}
                                    disabled={!isAccessible || array.length === 1 && required}
                                    onFocus={event => isAccessible && this.focusSelectedOption(event)}
                                    onBlur={event => this.blurSelectedOption(event)}
                                    >&zwnj;</button>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="autocomplete listbox" id={`autocomplete-multiple-${id}`}>
                    <div
                        ref="group"
                        role="group"
                        className="field-button-group field-button-inner"
                        onClick={event => !disabled && this.handleFieldFocus(event)}
                        >
                        <div className="field" aria-controls={id} aria-expanded="false">
                            <input
                                ref="searchField"
                                type="text"
                                className="autocomplete-searchfield"
                                autoComplete="off"
                                onFocus={event => this.handleFieldFocus(event)}
                                onChange={event => this.search(event.target.value)}
                                data-field-display-name={id}
                                data-field-display-values={selectedOptions}
                                readOnly={applyReadOnly}
                                disabled={disabled}
                                />

                        </div>
                        <ul role="group" className="buttons">
                            <li><button
                                type="button"
                                aria-label="Show all"
                                className="action-search icon-only inherit-focus"
                                aria-disabled="false"
                                >&zwnj;</button>
                            </li>
                        </ul>
                    </div>
                    <div
                        className={classNames('options', { empty: !isSearchResult })}
                        id={id}
                        role="region"
                        aria-hidden="true"
                        >
                        <ul role="listbox">
                            {this.state.options.map(o => (
                                <li
                                    key={o.value}
                                    role="option"
                                    tabIndex="0"
                                    onClick={() => this.handleSelectItem(o.value, o.label)}
                                    onKeyPress={() => this.handleSelectItem(o.value, o.label)}
                                    ><span className="option">{o.label}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default withPropsWatch(baseField(AutocompleteMultipleField))
