import React from 'react'
import { autobind } from 'core-decorators'

import baseField from './base/baseField'
import { baseFieldPropTypes } from '../PropTypes'

/**
 * The FileField requires an action `upload` which returns an array of
 * the form: [ {value, label}, ... ] in order to display the list of options.
 * There are several possibilites and API could handle an upload:
 *      a) use Base64
 *      b) use FileUpload
 *      c) store file and use a reference (similar to FK)
 */
@autobind
class FileField extends React.Component {

    static propTypes = {
        input: baseFieldPropTypes.input,
        id: baseFieldPropTypes.id,
        required: baseFieldPropTypes.required,
        readOnly: baseFieldPropTypes.readOnly,
        disabled: baseFieldPropTypes.disabled,
    }

    state = {
        file: undefined,
        uploadResult: undefined,
    }

    getRepr() {
        let repr = ''
        repr = `${this.props.input.value}`
        if (this.state.file) {
            repr = `${this.state.file.name} ${this.state.file.size} ${this.state.file.type}`
        }
        return repr
    }

    handleFileSelect() {
        const reader = new FileReader()
        const file = this.fileInput.files[0]
        reader.onload = (upload) => {
            this.setState({ file, uploadResult: upload.target.result })
            this.props.input.onChange(upload.target.result) /* Base64 */
        }
        reader.readAsDataURL(file)
    }

    handleRemoveItem() {
        this.setState({ file: undefined, uploadResult: undefined })
        this.props.input.onChange('')
    }

    // FIXME: getValue: how to retrieve what value when representing the file
    // FIXME: action send: what to do when the image has been selected (e.g. nothing, upload, changeToBase64)

    render() {
        const { id, required, disabled, readOnly, input } = this.props
        const applyReadOnly = !disabled && readOnly
        const repr = this.getRepr()
        // FIXME (Axel): Styling, readOnly, disabled */
        return (
            <div className="autocomplete listbox" id={`autocomplete-${id}`}>
                <div role="group" className="field-button-group field-button-inner">
                    <div
                        className="field"
                        aria-controls={id}
                        aria-expanded="false"
                        ><div className="label">{repr}</div>
                        <input
                            type="file"
                            className="filefield"
                            autoComplete="off"
                            onChange={this.handleFileSelect}
                            data-field-display-name={id}
                            readOnly={applyReadOnly}
                            disabled={disabled}
                            ref={(c) => { this.fileInput = c }}
                            />
                    </div>
                    <ul role="group" className="buttons">
                        {!required &&
                            <li>
                                <button
                                    type="button"
                                    aria-label="Clear"
                                    className="action-clear icon-only"
                                    onClick={this.handleRemoveItem}
                                    >&zwnj;</button>
                            </li>
                        }
                        {input.initialValue &&
                            <li>
                                <button
                                    type="button"
                                    aria-label="Clear"
                                    className="action-clear icon-only"
                                    onClick={this.handleRemoveItem}
                                    >&zwnj;</button>
                            </li>
                        }
                    </ul>
                </div>
                <div
                    ref={(c) => { this.previewGroup = c }}
                    className="preview"
                    aria-hidden={this.state.uploadResult ? 'false' : 'true'}
                    >
                    <img
                        ref={(c) => { this.preview = c }}
                        src={this.state.uploadResult}
                        height="100"
                        role="presentation"
                        />
                </div>
            </div>
        )
    }
}

export default baseField(FileField)
