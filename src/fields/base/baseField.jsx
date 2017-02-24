import React from 'react'
import { baseFieldPropTypes } from '../../PropTypes'

const defaultOptions = {
    renderLabel: true,
    renderHelpText: true,
    renderError: true,
}

export default function baseField(Component, opts = {}) {
    const options = Object.assign({}, defaultOptions, opts)

    class BaseField extends Component {

        static displayName = `BaseField(${Component.displayName || Component.name})`;

        static propTypes = {
            ...baseFieldPropTypes,
            ...Component.propTypes,
        };

        static defaultProps = {
            onAdd: () => console.warn('Cannot open the add view. The parent form did not provide the onAdd prop.'),
            onEdit: () => console.warn('Cannot open the edit view. The parent form did not provide the onEdit prop.'),
            ...Component.defaultProps,
        }

        componentDidMount() {
            const { registerFilterField } = this.props
            if (registerFilterField) {
                registerFilterField({
                    getDisplayValue: this.getDisplayValue.bind(this),
                })
            }
            if (super.componentDidMount) {
                super.componentDidMount()
            }
        }

        /**
         * The lower level components may provide their own getDisplayValue in order to
         * override the default behaviour which just returns the attribute value.
         * The return value of this function may be a promise.
         */
        getDisplayValue(value) {
            if (super.getDisplayValue) {
                return super.getDisplayValue(value)
            }
            return value
        }

        renderHelpText(helpText) {
            if (super.renderHelpText) {
                return super.renderHelpText(helpText)
            } else if (helpText) {
                return (
                    <p className="help">{helpText}</p>
                )
            }
            return null
        }

        renderError(error) {
            if (super.renderError) {
                return super.renderError(error)
            } else if (error) {
                return (
                    <p className="error-message">{error}</p>
                )
            }
            return null
        }

        renderLabel(label) {
            if (super.renderLabel) {
                return super.renderLabel(label)
            } else if (label) {
                return (
                    <label htmlFor={this.props.id}>{label}</label>
                )
            }
            return null
        }

        renderRelations() {
            const { add, edit, onAdd, onEdit, input } = this.props
            const allowAdd = !!add
            const allowEdit = !!edit && input.value
            if (allowAdd || allowEdit) {
                return (
                    <ul role="group" className="field-tools">
                        {allowAdd && <li><a onClick={onAdd}>Add</a></li>}
                        {allowEdit && <li><a onClick={onEdit}>Edit</a></li>}
                    </ul>
                )
            }
            return null
        }

        render() {
            const { label, helpText } = this.props
            const error = (this.props.meta.touched && this.props.meta.error) || ''
            return (
                <div className="basefield">
                    {options.renderLabel && this.renderLabel(label)}
                    {this.renderRelations()}
                    {super.render()}
                    {options.renderError && this.renderError(error)}
                    {options.renderHelpText && this.renderHelpText(helpText)}
                </div>
            )
        }
    }

    return BaseField
}
