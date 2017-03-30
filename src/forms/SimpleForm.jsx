import React from 'react'
import { Field } from 'redux-form'
import FieldLoader from './FieldLoader'

const SimpleForm = ({ desc, submitting, handleSubmit }) => (
    <form onSubmit={handleSubmit(desc.onSubmit)}>
        {desc.fields.map(d => (
            <Field
                key={d.name}
                name={d.name}
                formName={desc.id}
                desc={d}
                label={d.label}
                onAdd={() => undefined}
                onEdit={() => undefined}
                component={FieldLoader}
                />
        ))}
        <div className="footer">
            <div role="group" className="buttons">
                <button
                    type="button"
                    className="action-apply boundless"
                    tabIndex={submitting ? '-1' : '0'}
                    aria-disabled={submitting}
                    disabled={submitting}
                    onClick={handleSubmit(desc.onSubmit)}
                    >Submit</button>
            </div>
        </div>
    </form>
)

SimpleForm.propTypes = {
    desc: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool,
}

export default SimpleForm
