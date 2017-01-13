import React from 'react'
import classNames from 'classnames'
import WatchComponent from '../WatchComponent'
import isEqual from 'lodash/isEqual'
import isArray from 'lodash/isArray'
import baseField from './base/baseField'
import { hasParentId, visuallyFocusElem, visuallyBlurElem, showExpanded, closeExpanded } from '../utils/frontend'
import { req } from '../Crudl'


function asArray(value = []) {
    return isArray(value) ? value : [value]
}

function cleanValue(value) {
    return value || undefined
}

/**
 * The SuggestionField requires an action `search` which returns an array of
 * the form: [ {value, label}, ... ] in order to display the list of options.
 */
class SuggestionField extends WatchComponent {

    static defaultProps = {
        allowNone: true, // Is it allowed to select no item?
        searchDelay: 333, // How long to wait between key strokes before we execute the search
    }

    state = {
        options: [],
        selection: [], // The displayed selection. An array of the form [ {value, label}, ... ]
    }

    constructor() {
        super()

        // This watch enforces the correspondence between the field value and the displayed selection
        this.watch('formField.value', (props) => {
            const selectedValues = this.state.selection.map(item => item.value)
            const inputValues = asArray(cleanValue(props.formField.value))
            if (!isEqual(selectedValues, inputValues)) {
                this.select(inputValues.map(value => ({ value, label: undefined })))
            }
        })
    }

    componentDidMount() {
        super.componentDidMount()
        window.addEventListener('keyup', this.listenForEventOutside)
        window.addEventListener('click', this.listenForEventOutside)
    }

    componentWillUnmount() {
        super.componentDidMount()
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
            const parentId = `autocomplete-${this.props.desc.id}`
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
    }

    select(selection = []) {
        const { formField } = this.props
        if (selection.length === 0) {
            this.setState({ selection: [] })
            formField.onChange('')
            this.refs.searchField.value = ''
        } else {
            this.setState({ selection })
            let values = selection.map(item => item.value)
            values = values.length > 0 ? values[0] : ''
            this.refs.searchField.value = values
            formField.onChange(values)
        }
    }

    search(query = '') {
        const { formField } = this.props
        window.clearTimeout(this.searchTimeout)
        // Search with a delay if query is not empty
        if (query.length > 0) {
            this.searchTimeout = window.setTimeout(() => {
                this.props.desc.actions.search(req({ query }))
                .then(res => this.setState({ options: res.data }))
            }, this.props.searchDelay)
        }
        console.log("SEARCH", query, this.state.selection)
        formField.onChange(query)
    }

    handleRemoveItem(event) {
        this.props.formField.onChange('')
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
        showExpanded(this.props.desc.id)
    }

    clearSearch() {
        closeExpanded(this.props.desc.id)
    }

    render() {
        const { desc, disabled, readOnly } = this.props
        const selectedOption = this.state.selection.map(item => item.label)[0]
        const isSearchResult = this.state.options.length > 0
        const applyReadOnly = !disabled && readOnly
        const isAccessible = !disabled && !readOnly
        return (
            <div className="autocomplete listbox" id={`autocomplete-${desc.id}`}>
                <div ref="group" role="group" className="field-button-group field-button-inner">
                    <div
                        className="field"
                        aria-controls={desc.id}
                        aria-expanded="false"
                        onClick={() => isAccessible && showExpanded(desc.id)}
                    >
                        <input
                            ref="searchField"
                            type="text"
                            className="autocomplete-searchfield"
                            placeholder={selectedOption}
                            autoComplete="off"
                            onFocus={() => isAccessible && this.handleFieldFocus()}
                            onChange={(event) => this.search(event.target.value)}
                            data-field-display-name={desc.id}
                            data-field-display-values={selectedOption}
                            readOnly={applyReadOnly}
                            disabled={disabled}
                        />
                    </div>
                    <ul role="group" className="buttons">
                        {!desc.required && selectedOption &&
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
                    id={desc.id}
                    role="region"
                    aria-hidden="true"
                >
                    <ul role="listbox">
                        {this.state.options.map((o, i) => (
                            <li
                                key={i}
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

export default baseField(SuggestionField)
