import React from 'react'
import { autobind } from 'core-decorators'

import baseField from './base/baseField'
import { baseFieldPropTypes } from '../PropTypes'
import asPromise from '../utils/asPromise'
import { errorMessage } from '../actions/messages'

/**
 * There are several possibilites and API could handle an upload:
 *      a) use Base64
 *      b) use File Upload
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
        onSelect: React.PropTypes.func,
        dispatch: React.PropTypes.func.isRequired,
    }

    static defaultProps = {
        onSelect: (file, data) => data,
    }

    static initialState = {
        uploading: false,
        previewURL: undefined,
        previewData: undefined,
        label: '',
    }

    state = FileField.initialState

    handleFileSelect() {
        const { dispatch, input, onSelect } = this.props
        const reader = new FileReader()
        const file = this.fileInput.files[0]
        reader.onload = (event) => {
            const data = event.target.result
            this.setState({ uploading: true })

            // Pass the file and the data to the onSelect function
            asPromise(onSelect(file, data))

            .then((result) => {
                this.setState({
                    uploading: false,
                    previewURL: result.previewURL,
                    previewData: result.previewData,
                    label: result.label,
                })
                input.onChange(result.value)
            })

            .catch((error) => {
                dispatch(errorMessage(`Upload failed: ${error}`))
            })
        }
        reader.readAsDataURL(file)
    }

    handleRemoveItem() {
        this.props.input.onChange('')
        this.fileInput.value = ''
        this.setState(FileField.initialState)
    }

    // FIXME: getValue: how to retrieve what value when representing the file
    // FIXME: action send: what to do when the image has been selected (e.g. nothing, upload, changeToBase64)

    render() {
        const { id, required, disabled, readOnly, input } = this.props
        const { previewURL, previewData } = this.state
        const applyReadOnly = !disabled && readOnly
        const label = this.state.label || this.props.input.value
        return (
            <div className="autocomplete listbox" id={`autocomplete-${id}`}>
                <div role="group" className="field-button-group field-button-inner">
                    <div
                        className="field"
                        aria-controls={id}
                        aria-expanded="false"
                        ><div className="label">{this.state.uploading ? 'Uploading...' : label}</div>
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
                    aria-hidden={previewURL || previewData ? 'false' : 'true'}
                    >
                    <img
                        ref={(c) => { this.preview = c }}
                        src={this.state.previewURL || this.state.previewData}
                        height="100"
                        role="presentation"
                        />
                </div>
            </div>
        )
    }
}

export default baseField(FileField)
