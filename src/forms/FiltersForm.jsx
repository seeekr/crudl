import React from 'react'
import { Field } from 'redux-form'
import FieldLoader from './FieldLoader'
import { filtersShape } from '../PropTypes'

const FiltersForm = ({ handleSubmit, onClear, desc, onRegisterFilterField, submitting }) => (
    <form onSubmit={handleSubmit}>
        {desc.fields.map(d =>
            <Field
                key={d.name}
                name={d.name}
                formName={desc.id}
                desc={d}
                label={d.label}
                registerFilterField={obj => onRegisterFilterField(d, obj)}
                onAdd={() => undefined}
                onEdit={() => undefined}
                component={FieldLoader}
                />
        )}
        <div className="footer">
            <div role="group" className="buttons">
                <button
                    type="button"
                    className="action-clear boundless"
                    tabIndex={submitting ? '-1' : '0'}
                    aria-disabled={submitting}
                    disabled={submitting}
                    onClick={() => onClear()}
                    >Clear</button>
                <button
                    type="button"
                    className="action-apply boundless"
                    tabIndex={submitting ? '-1' : '0'}
                    aria-disabled={submitting}
                    disabled={submitting}
                    onClick={handleSubmit}
                    >Apply</button>
            </div>
        </div>
    </form>
)

FiltersForm.propTypes = {
    desc: filtersShape,
    onClear: React.PropTypes.func.isRequired,
    onRegisterFilterField: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool,
}

export default FiltersForm
