import React from 'react'
import isEqual from 'lodash/isEqual'
import isArray from 'lodash/isArray'
import classNames from 'classnames'

import baseField from './base/baseField'
import { hasParentId, visuallyFocusElem, visuallyBlurElem, showExpanded, closeExpanded } from '../utils/frontend'
import { req } from '../Crudl'
import withPropsWatch from '../utils/withPropsWatch'
import { baseFieldPropTypes } from '../PropTypes'


function asArray(value = []) {
    return isArray(value) ? value : [value]
}

function cleanValue(value) {
    return value || undefined
}

/**
 * The AutocompleteField requires two actions: `search` and `select`. Both
 * actions return an array of the form: [ {value, label}, ... ]. `search` is used
 * to display the list of options to select from and `select` is used to confirm a selection.
 */
class AutocompleteField extends React.Component {

    static propTypes = {
        ...baseFieldPropTypes,
        actions: React.PropTypes.shape({
            select: React.PropTypes.func.isRequired,
            search: React.PropTypes.func.isRequired,
        }),
    }

    static defaultProps = {
        allowNone: true, // Is it allowed to select no item?
        showAll: false, // Do `search` when the query string is empty?
        searchDelay: 333, // How long to wait between key strokes before we execute the search
    };

    state = {
        options: [],
        selection: [], // The displayed selection. An array of the form [ {value, label}, ... ]
    };

    getDisplayValue(value) {
        const selectedOption = this.state.selection[0]
        // Try it synchronously first
        if (selectedOption && `${selectedOption.value}` === `${value}`) {
            return this.state.selection[0].label
        }
        return this.props.actions.select(req({ selection: [{ value }] }))
        .then(res => res[0].label)
    }

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
            const parentId = `autocomplete-${this.props.id}`
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
            input.onChange('')
        } else {
            this.props.actions.select(req({ selection }))
            .then((res) => {
                this.setState({ selection: res })
                let values = res.map(item => item.value)
                values = values.length > 0 ? values[0] : ''
                input.onChange(values)
            })
        }
    }

    search(query = '') {
        window.clearTimeout(this.searchTimeout)
        // Search with a delay if query is not empty
        if (query.length > 0) {
            this.searchTimeout = window.setTimeout(() => {
                this.props.actions.search(req({ query }))
                .then(res => this.setState({ options: res }))
            }, this.props.searchDelay)
        } else {
            // Search immediately if showAll
            // Clear search otherwise
            if (this.props.showAll) {
                this.props.actions.search(req({ query }))
                .then(res => this.setState({ options: res }))
            } else {
                this.clearSearch()
            }
        }
    }

    handleRemoveItem(event) {
        this.props.input.onChange('')
        this.clearSearch()
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    handleSelectItem(value = '', label = '') {
        this.select([{ value, label }])
        this.clearSearch()
    }

    handleFieldFocus() {
        this.refs.searchField.focus()
        this.search('')
        showExpanded(this.props.id)
    }

    clearSearch() {
        closeExpanded(this.props.id)
        this.refs.searchField.value = ''
    }

    render() {
        const { id, disabled, readOnly, required } = this.props
        const selectedOption = this.state.selection.map(item => item.label)[0]
        const isSearchResult = this.state.options.length > 0
        const applyReadOnly = !disabled && readOnly
        const isAccessible = !disabled && !readOnly
        return (
            <div className="autocomplete listbox" id={`autocomplete-${id}`}>
                <div ref="group" role="group" className="field-button-group field-button-inner">
                    <div
                        className="field"
                        aria-controls={id}
                        aria-expanded="false"
                        onClick={() => isAccessible && showExpanded(id)}
                        >
                        <input
                            ref="searchField"
                            type="text"
                            className="autocomplete-searchfield"
                            placeholder={selectedOption}
                            autoComplete="off"
                            onFocus={() => isAccessible && this.handleFieldFocus()}
                            onChange={event => this.search(event.target.value)}
                            data-field-display-name={id}
                            data-field-display-values={selectedOption}
                            readOnly={applyReadOnly}
                            disabled={disabled}
                            />
                    </div>
                    <ul role="group" className="buttons">
                        {!required
                            &&
                            selectedOption
                            &&
                            <li><button
                                type="button"
                                aria-label="Clear"
                                className="action-clear icon-only"
                                onClick={(event) => { this.handleRemoveItem(event) }}
                                >&zwnj;</button>
                            </li>
                        }
                        <li><button
                            type="button"
                            aria-label="Search"
                            className="action-search icon-only inherit-focus"
                            onClick={() => this.handleFieldFocus()}
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
        )
    }
}

export default withPropsWatch(baseField(AutocompleteField))
