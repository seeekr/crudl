import React from 'react'
import { autobind } from 'core-decorators'

import baseField from './base/baseField'
import { baseFieldPropTypes } from '../PropTypes'
import asPromise from '../utils/asPromise'
import { errorMessage } from '../actions/messages'

/**
 * FileField requires an input value in the form:
 *      { value, label, previewURL }, where
 * value (required) is the value to be send when the form is submitted
 * label (optional) a string (e.g. a file name).
 * preivewURL (optional) is an URL of a thumbnail if applicable (can also be urlData)
 *
 * FileField further requires a prop onSelect which must be a function of the form:
 *      (file, urlData) => inputValue, where
 * file is the File object of obtained from the FileList of the input element
 * urlData is the result of the FileReader.readAsDataURL call.
 * inputValue is either the input value described above or a promise resolving to such.
 *
 * There are several possibilites and API could handle an upload:
 *      a) use Base64
 *      b) use File Upload
 *      c) store file and use a reference (similar to FK)
 *
 * In the case of a), the onSelect function simply returns the value as required by the backend. E.g.
 *      onSelect: (file, urlData) => ({ value: { filename: file.name, file: urlData.split(',')[1] } })
 *
 * In the case of b) or c), the onSelect function must execute the upload and return a promise. For example:
 *      onSelect: (file, urlData) => {
 *          const data = prepareData(urlData)
 *          return axios.put('/upload/server', data, config).then(res => ({
 *              value: res.data.fileID,
 *              previewURL: res.data.thumbnailURL,
 *          }))
 *      }
 *
 * FileField takes an optional prop onRemove, which will be invoked when user click on remove button. onRemove is a
 * function of the form ({ value, label, previewURL }) => ({value, label, previewURL}).
 * The default onRemove function is: () => ({ value: ''})
 */
@autobind
class FileField extends React.Component {

    static propTypes = {
        input: React.PropTypes.shape({
            onChange: React.PropTypes.func.isRequired,
            value: React.PropTypes.shape({
                value: React.PropTypes.any,
                label: React.PropTypes.node,
                previewURL: React.PropTypes.string,
            }),
        }),
        id: baseFieldPropTypes.id,
        readOnly: baseFieldPropTypes.readOnly,
        disabled: baseFieldPropTypes.disabled,
        onSelect: React.PropTypes.func.isRequired,
        onClear: React.PropTypes.func,
        dispatch: React.PropTypes.func.isRequired,
    }

    static defaultProps = { onClear: () => ({ value: '' }) }

    handleFileSelect() {
        const { dispatch, input, onSelect } = this.props
        const reader = new FileReader()
        const file = this.fileInput.files[0]
        reader.onload = (event) => {
            const data = event.target.result

            // Pass the file and the data to the onSelect function
            asPromise(onSelect(file, data))

            .then((result) => {
                input.onChange(result)
            })

            .catch((error) => {
                dispatch(errorMessage(`Upload failed: ${error}`))
            })
        }
        reader.readAsDataURL(file)
    }

    handleRemoveItem() {
        const newInputValue = this.props.onClear(this.props.input.value)
        this.props.input.onChange(newInputValue)
        this.fileInput.value = ''
    }

    render() {
        const { id, disabled, readOnly, input } = this.props
        const { value, label, previewURL } = input.value
        const applyReadOnly = !disabled && readOnly
        return (
            <div className="autocomplete listbox" id={`autocomplete-${id}`}>
                <div role="group" className="field-button-group field-button-inner">
                    <div
                        className="field"
                        aria-controls={id}
                        aria-expanded="false"
                        ><div className="label">{label}</div>
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
                        {value &&
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
                    aria-hidden={previewURL ? 'false' : 'true'}
                    >
                    <img
                        ref={(c) => { this.preview = c }}
                        src={previewURL}
                        height="100"
                        role="presentation"
                        />
                </div>
            </div>
        )
    }
}

export default baseField(FileField)
