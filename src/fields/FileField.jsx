import React from 'react'
import classNames from 'classnames'
import WatchComponent from '../components/WatchComponent'
import isEqual from 'lodash/isEqual'
import isArray from 'lodash/isArray'
import baseField from './base/baseField'
import { hasParentId, visuallyFocusElem, visuallyBlurElem, showExpanded, closeExpanded } from '../utils/frontend'
import { req } from '../Crudl'


function asArray(value = []) {
    return isArray(value) ? value : [value]
}

function cleanValue(value) {
    return value || undefined
}

/**
 * The FileField requires an action `search` which returns an array of
 * the form: [ {value, label}, ... ] in order to display the list of options.

There is several possibilites and API could handle an upload:
a) use Base64
b) use FileUpload
c) store file and use a reference (similar to FK)

 */
class FileField extends WatchComponent {

    state = {
        filename: null,
        filetype: null,
        filesize: null,
    }

    handleChange(evt) {
        const { formField } = this.props
        const reader = new FileReader()
        const file = evt.target.files[0]
        reader.onload = ((upload) => {
            this.refs.previewGroup.setAttribute('aria-hidden', false)
            this.refs.preview.src = upload.target.result
            this.setState({
                filename: file.name,
                filetype: file.type,
                filesize: file.size,
            })
            formField.onChange(upload.target.result) /* Base64 */
            // formField.onChange(file)
        })
        reader.readAsDataURL(file)
    }

    handleRemoveItem(event) {
        this.props.formField.onChange('')
        this.clearSearch()
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    getRepr() {
        let repr = ''
        repr = `${this.props.formField.value}`
        if (this.state.filename) {
            repr = `${this.state.filename} ${this.state.filesize} ${this.state.filetype}`
        }
        return repr
    }

    // FIXME: getValue: how to retrieve what value when representing the file
    // FIXME: action send: what to do when the image has been selected (e.g. nothing, upload, changeToBase64)

    clearSearch() {
        closeExpanded(this.props.id)
    }

    render() {
        const { id, required, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        const repr = this.getRepr()
        // const isAccessible = !disabled && !readOnly
        // FIXME (Axel): Styling, readOnly, disabled */
        return (
            <div className="autocomplete listbox" id={`autocomplete-${id}`}>
                <div ref="group" role="group" className="field-button-group field-button-inner">
                    <div
                        className="field"
                        aria-controls={id}
                        aria-expanded="false"
                        ><div className="label">{repr}</div>
                        <input
                            ref="fileField"
                            type="file"
                            className="filefield"
                            autoComplete="off"
                            onChange={(event) => this.handleChange(event)}
                            data-field-display-name={id}
                            readOnly={applyReadOnly}
                            disabled={disabled}
                            />
                    </div>
                    <ul role="group" className="buttons">
                        {!required &&
                            <li>
                                <button
                                    type="button"
                                    aria-label="Clear"
                                    className="action-clear icon-only"
                                    onClick={(event) => { this.handleRemoveItem(event) }}
                                    >&zwnj;</button>
                            </li>
                        }
                        {formField.initialValue &&
                            <li>
                                <button
                                    type="button"
                                    aria-label="Clear"
                                    className="action-clear icon-only"
                                    onClick={(event) => { this.handleRemoveItem(event) }}
                                    >&zwnj;</button>
                            </li>
                        }
                    </ul>
                </div>
                <div ref="previewGroup" className="preview" aria-hidden="true">
                    <img
                        ref="preview"
                        src=""
                        height="100"
                        role="presentation"
                        />
                </div>
            </div>
        )
    }
}

export default baseField(FileField)
