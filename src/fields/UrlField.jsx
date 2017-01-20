import React from 'react'
import FieldButtonGroup from './base/FieldButtonGroup'
import baseField from './base/baseField'
import { fieldShape } from '../PropTypes'


class UrlField extends React.Component {

    static propTypes = {
        desc: fieldShape,
        input: React.PropTypes.object.isRequired,
        disabled: React.PropTypes.bool.isRequired,
        readOnly: React.PropTypes.bool.isRequired,
        link: React.PropTypes.bool.isRequired,
        linkURL: React.PropTypes.string,
    };

    render() {
        const { desc, input, link, linkURL, disabled, readOnly } = this.props
        const applyReadOnly = !disabled && readOnly
        return (
            <FieldButtonGroup id={`url-${desc.id}`} layout="field-button-inner" {...this.props}>
                <div className="field">
                    <input
                        type="text"
                        placeholder={desc.placeholder}
                        id={desc.id}
                        autoComplete="off"
                        {...input}
                        data-field-display-name={desc.id}
                        data-field-display-values={input.value}
                        readOnly={applyReadOnly}
                        disabled={disabled}
                        />
                </div>
                {link &&
                    <ul role="group" className="buttons">
                        <li><a
                            role="button"
                            aria-label="Open link"
                            className="action-open-in-new icon-only"
                            target="_blank"
                            href={linkURL || input.value}
                            />
                        </li>
                    </ul>
                }
            </FieldButtonGroup>
        )
    }
}

export default baseField(UrlField)
