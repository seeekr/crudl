import React from 'react'

import FieldSet from './FieldSet'
import { createFieldSetId } from '../utils/frontend'
import { addViewShape } from '../PropTypes'
import { hasPermission } from '../Crudl'

/* FIXME (Axel): aria-disabled is a string here, but a boolean with ChangeViewForm. */

const AddViewForm = props => (
    <form tabIndex="0" onSubmit={props.handleSubmit(props.onSave)}>
        {props.anyTouched && props.error &&
            <div className="form-error">
                {props.error}
            </div>
        }
        {props.desc.fieldsets.map((fs, i) => (
            <FieldSet
                key={i}
                id={createFieldSetId(props.desc.id, i)}
                desc={fs}
                formName={props.form}
                onAdd={props.onAdd}
                onEdit={props.onEdit}
                />
        ))}
        <div id="viewport-footer">
            {hasPermission(props.desc.id, 'add') &&
                <ul role="group" className="buttons">
                    <li className="opposite"><button
                        type="button"
                        className="action-save"
                        tabIndex="0"
                        aria-label={props.labels.save}
                        aria-disabled="false"
                        onClick={props.handleSubmit(props.onSave)}
                        >{props.labels.save}</button>
                    </li>
                    <li className="opposite"><button
                        type="button"
                        className="action-save secondary"
                        tabIndex="0"
                        aria-label={props.labels.saveAndContinue}
                        aria-disabled="false"
                        onClick={props.handleSubmit(props.onSaveAndContinue)}
                        >{props.labels.saveAndContinue}</button>
                    </li>
                    <li className="opposite"><button
                        type="button"
                        className="action-save secondary"
                        tabIndex="0"
                        aria-label={props.labels.saveAndAddAnother}
                        aria-disabled="false"
                        onClick={props.handleSubmit(props.onSaveAndAddAnother)}
                        >{props.labels.saveAndAddAnother}</button>
                    </li>
                </ul>
            }
        </div>
    </form>
)

AddViewForm.propTypes = {
    desc: addViewShape,
    onSave: React.PropTypes.func.isRequired,
    onSaveAndContinue: React.PropTypes.func.isRequired,
    onSaveAndAddAnother: React.PropTypes.func.isRequired,
    form: React.PropTypes.string.isRequired,
    anyTouched: React.PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    error: React.PropTypes.node,
    labels: React.PropTypes.shape({
        save: React.PropTypes.string.isRequired,
        saveAndContinue: React.PropTypes.string.isRequired,
        saveAndAddAnother: React.PropTypes.string.isRequired,
    }).isRequired,
    onAdd: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
}

export default AddViewForm
