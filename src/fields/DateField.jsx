import React from 'react'
import FieldButtonGroup from './base/FieldButtonGroup'
import * as frontendUtils from '../utils/frontend'
import baseField from './base/baseField'
import { fieldShape } from '../PropTypes'


class DateField extends React.Component {

    static propTypes = {
        desc: fieldShape,
        input: React.PropTypes.shape({
            onChange: React.PropTypes.func.isRequired,
        }).isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
        formatDate: React.PropTypes.func,
    };

    static defaultProps = {
        formatDate: frontendUtils.formatDate,
    };

    setDateNow() {
        this.props.input.onChange(this.props.formatDate(new Date()))
    }

    render() {
        const { desc, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <FieldButtonGroup id={`date-${desc.id}`} layout="field-button-inner field-size-small" {...this.props}>
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
                    <li><button
                        type="button"
                        className="action-access-time icon-only"
                        aria-label="Insert current date"
                        aria-disabled={disabled}
                        disabled={disabled}
                        onClick={() => this.setDateNow()}
                        >&zwnj;</button></li>
                </ul>
            </FieldButtonGroup>
        )
    }
}

export default baseField(DateField)
