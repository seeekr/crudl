import React from 'react'

import FieldSet from './FieldSet'
import { createFieldSetId } from '../utils/frontend'
import saveDisabled from '../utils/saveDisabled'
import { changeViewShape } from '../PropTypes'
import { hasPermission } from '../Crudl'


const ChangeViewForm = props => (
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
            <ul role="group" className="buttons">
                {!props.fromRelation && props.onDelete && hasPermission(props.desc.id, 'delete') &&
                    <li><button
                        type="button"
                        className="action-delete"
                        tabIndex="0"
                        aria-label={props.labels.delete}
                        onClick={props.handleSubmit(props.onDelete)}
                        >{props.labels.delete}</button>
                    </li>
                }
                {props.fromRelation &&
                    <li><button
                        type="button"
                        className="action-cancel"
                        tabIndex="0"
                        aria-label={props.labels.cancel}
                        onClick={props.onCancel}
                        >{props.labels.cancel}</button>
                    </li>
                }
                {hasPermission(props.desc.id, 'save') &&
                    <li className="opposite"><button
                        type="button"
                        className="action-save"
                        tabIndex="0"
                        aria-label={props.fromRelation ? props.labels.saveAndBack : props.labels.save}
                        aria-disabled={saveDisabled(props)}
                        disabled={saveDisabled(props)}
                        onClick={props.handleSubmit(props.onSave)}
                        >{props.fromRelation ? props.labels.saveAndBack : props.labels.save}</button>
                    </li>
                }
                {hasPermission(props.desc.id, 'save') &&
                    <li className="opposite"><button
                        type="button"
                        className="action-save secondary"
                        tabIndex="0"
                        aria-label={props.labels.saveAndContinue}
                        aria-disabled={saveDisabled(props)}
                        disabled={saveDisabled(props)}
                        onClick={props.handleSubmit(props.onSaveAndContinue)}
                        >{props.labels.saveAndContinue}</button>
                    </li>
                }
            </ul>
        </div>
    </form>
)

ChangeViewForm.propTypes = {
    desc: changeViewShape.isRequired,
    onDelete: React.PropTypes.func,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onSaveAndContinue: React.PropTypes.func.isRequired,
    fromRelation: React.PropTypes.bool,
    form: React.PropTypes.string.isRequired,
    anyTouched: React.PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    error: React.PropTypes.node,
    labels: React.PropTypes.shape({
        save: React.PropTypes.string.isRequired,
        saveAndBack: React.PropTypes.string.isRequired,
        saveAndContinue: React.PropTypes.string.isRequired,
        delete: React.PropTypes.string.isRequired,
        cancel: React.PropTypes.string.isRequired,
    }).isRequired,
    onAdd: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
}

export default ChangeViewForm
