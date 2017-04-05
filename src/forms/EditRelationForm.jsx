import React from 'react'

import FieldSet from './FieldSet'
import { createFieldSetId } from '../utils/frontend'
import { hasPermission } from '../Crudl'

const EditRelationForm = ({ anyTouched, desc, form, error, handleSubmit, onSave, onCancel, labels }) => (
    <form tabIndex="0" onSubmit={handleSubmit(onSave)}>
        {anyTouched && error &&
            <div className="form-error">
                {error}
            </div>
        }
        {desc.fieldsets.map((fs, i) => (
            <FieldSet
                key={i}
                id={createFieldSetId(desc.id, i)}
                desc={fs}
                formName={form}
                />
        ))}
        <div>
            <ul role="group" className="buttons">
                <li><button
                    type="button"
                    className="action-cancel"
                    tabIndex="0"
                    aria-label={labels.cancel}
                    onClick={onCancel}
                    >{labels.cancel}</button>
                </li>
                {hasPermission(desc.id, 'save') &&
                    <li className="opposite"><button
                        type="button"
                        className="action-save"
                        tabIndex="0"
                        aria-label={labels.save}
                        aria-disabled="false"
                        onClick={handleSubmit(onSave)}
                        >{labels.save}</button>
                    </li>
                }
            </ul>
        </div>
    </form>
)

EditRelationForm.propTypes = {
    desc: React.PropTypes.object.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    form: React.PropTypes.string.isRequired,
    anyTouched: React.PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    error: React.PropTypes.node,
    labels: React.PropTypes.shape({
        save: React.PropTypes.string.isRequired,
        cancel: React.PropTypes.string.isRequired,
    }).isRequired,
}

export default EditRelationForm
