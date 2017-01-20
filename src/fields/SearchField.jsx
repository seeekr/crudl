import React from 'react'
import FieldButtonGroup from './base/FieldButtonGroup'
import baseField from './base/baseField'
import { fieldShape } from '../PropTypes'



class SearchField extends React.Component {

    static propTypes = {
        desc: fieldShape,
        input: React.PropTypes.object.isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
    };

    clearSearch(event) {
        this.props.input.onChange('');
        event.preventDefault();
    }

    render() {
        const { desc, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        const clearDisabled = !input.initialValue && !input.value
        return (
            <FieldButtonGroup id={`search-${desc.id}`} layout="field-button-inner" {...this.props}>
                <div className="field">
                    <input
                        type="text"
                        placeholder={desc.placeholder}
                        id={desc.id}
                        autoComplete="off"
                        {...input}
                        data-field-display-name={desc.id}
                        data-field-display-values={input.value}
                        readOnly={applyReadOnly}
                        disabled={disabled}
                        />
                </div>
                <ul role="group" className="buttons">
                    <li aria-hidden={clearDisabled}><button
                        type="button"
                        onClick={event => this.clearSearch(event)}
                        aria-label="Clear search"
                        className="icon-only action-clear"
                        aria-disabled={clearDisabled}
                        disabled={clearDisabled}
                        >&zwnj;</button></li>
                    <li><button
                        aria-label="Submit search"
                        className="icon-only indicator action-search"
                        aria-disabled="true"
                        disabled
                        >&zwnj;</button></li>
                </ul>
            </FieldButtonGroup>
        )
    }
}

export default baseField(SearchField)
