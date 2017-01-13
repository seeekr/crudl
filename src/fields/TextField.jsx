import React from 'react'
import baseField from './base/baseField'
import { fieldShape } from '../PropTypes'


/* FIXME (Vaclav): readOnly is part of desc, but it´s a separate attribute
as well, whereas disabled is not part of desc. ??? */

/* FIXME (Vaclav): what about the hidden attribute. ??? */

/* FIXME (Vaclav): what about the error resp. errors attribute. ??? */

export class TextField extends React.Component {

    static propTypes = {
        desc: fieldShape,
        input: React.PropTypes.shape({
            value: React.PropTypes.string,
            onChange: React.PropTypes.func.isRequired,
        }).isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
    }

    render() {
        const { desc, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
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
        )
    }
}

export default baseField(TextField)
