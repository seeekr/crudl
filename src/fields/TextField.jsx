import React from 'react'
import baseField from './base/baseField'
import { baseFieldPropTypes } from '../PropTypes'


/* FIXME (Vaclav): readOnly is part of desc, but it´s a separate attribute
as well, whereas disabled is not part of  ??? */

/* FIXME (Vaclav): what about the hidden attribute. ??? */

/* FIXME (Vaclav): what about the error resp. errors attribute. ??? */

export class TextField extends React.Component {

    static propTypes = {
        ...baseFieldPropTypes,
    }

    render() {
        const { id, placeholder, input, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <div className="field">
                <input
                    type="text"
                    placeholder={placeholder}
                    id={id}
                    autoComplete="off"
                    {...input}
                    data-field-display-name={id}
                    data-field-display-values={input.value}
                    readOnly={applyReadOnly}
                    disabled={disabled}
                    />
            </div>
        )
    }
}

export default baseField(TextField)
