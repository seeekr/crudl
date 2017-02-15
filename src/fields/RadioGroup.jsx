import React from 'react'
import baseField from './base/baseField'

class RadioGroup extends React.Component {

    static propTypes = {
        label: React.PropTypes.string.isRequired,
        helpText: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
    };

    static defaultProps = {
        options: [],
    };

    handleKeyPress(value) {
        this.props.input.onChange(value)
    }

    render() {
        const { id, options, input, helpText, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <div>
                {helpText && <p className="help">{helpText}</p>}
                <ul role="radiogroup">
                    {options.map((o) => {
                        const checked = input.value === o.value
                        return (
                            <li key={id + o.value} role="radio" aria-checked={checked} value={o.value}>
                                <label htmlFor={o.value}>
                                    <div
                                        className="field"
                                        role="radio"
                                        tabIndex="0"
                                        aria-checked={checked}
                                        onKeyPress={() => this.handleKeyPress(o.value)}
                                        >
                                        <input
                                            type="radio"
                                            name={id}
                                            id={o.value}
                                            {...input}
                                            value={o.value}
                                            aria-hidden="true"
                                            data-field-display-name={id}
                                            data-field-display-values={input.value}
                                            checked={checked}
                                            readOnly={applyReadOnly}
                                            disabled={disabled}
                                            />
                                    </div>
                                    <div className="label">{o.label}</div>
                                </label>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default baseField(RadioGroup)
