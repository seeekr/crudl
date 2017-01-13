import React from 'react'
import { propTypes as RFPropTypes } from 'redux-form'
import { fieldShape } from '../../PropTypes'


export default function baseField(Component) {
    /**
     * Return true if the lower level Component requires the propName
     */
    function forgo(propName) {
        return Component.propTypes && Component.propTypes.hasOwnProperty(propName)
    }

    class BaseField extends Component {

        static displayName = `BaseField(${Component.displayName || Component.name})`;

        static propTypes = {
            desc: fieldShape,
            input: React.PropTypes.object.isRequired,
            meta: React.PropTypes.object.isRequired,
            label: React.PropTypes.string.isRequired,
            helpText: React.PropTypes.node.isRequired,
            disabled: React.PropTypes.bool.isRequired,
            readOnly: React.PropTypes.bool.isRequired,
            error: RFPropTypes.error.isRequired,
            hidden: React.PropTypes.bool.isRequired,
            registerFilterField: React.PropTypes.func,
            onAdd: React.PropTypes.func,
            onEdit: React.PropTypes.func,
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
                    <label htmlFor={this.props.desc.id}>{label}</label>
                )
            }
            return null
        }

        renderRelations() {
            const { desc, onAdd, onEdit, input } = this.props
            const allowAdd = desc.add
            const allowEdit = desc.edit && input.value
            if (allowAdd || allowEdit) {
                return (
                    <ul role="group" className="field-tools">
                        {allowAdd && <li><a onClick={() => onAdd(desc)}>Add</a></li>}
                        {allowEdit && <li><a onClick={() => onEdit(desc)}>Edit</a></li>}
                    </ul>
                )
            }
            return null
        }

        render() {
            const { label, helpText, error } = this.props
            return (
                <div className="basefield">
                    {!forgo('label') && this.renderLabel(label)}
                    {this.renderRelations()}
                    {super.render()}
                    {!forgo('error') && this.renderError(error)}
                    {!forgo('helpText') && this.renderHelpText(helpText)}
                </div>
            )
        }
    }

    return BaseField
}
