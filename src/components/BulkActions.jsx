import React from 'react'
import { autobind } from 'core-decorators'

import { toggleExpanded, closeExpanded } from '../utils/frontend'
import { bulkActionsShape } from '../PropTypes'

@autobind
class BulkActions extends React.Component {

    static propTypes = {
        id: React.PropTypes.string.isRequired,
        actions: bulkActionsShape.isRequired,
        nSelected: React.PropTypes.number.isRequired,
        onApply: React.PropTypes.func.isRequired,
    }

    state = { selected: undefined }

    handleSelectItem(action) {
        this.setState({ selected: action })
        closeExpanded(this.props.id)
    }

    handleRemoveItem(event) {
        this.setState({ selected: undefined })
        closeExpanded(this.props.id)
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    handleApplyAction(event) {
        if (this.props.nSelected > 0) {
            this.props.onApply(this.state.selected)
            closeExpanded(this.props.id)
            event.stopPropagation()
            event.nativeEvent.stopImmediatePropagation()
        }
    }

    select(action) {
        this.setState({ selected: action })
    }

    render() {
        const { actions, id, nSelected } = this.props
        const selected = this.state.selected
        return (
            <div className="select listbox" id={`select-${id}`}>
                <div
                    role="group"
                    className="field-button-group field-button-inner"
                    aria-controls={id}
                    aria-expanded="false"
                    data-field-display-name={id}
                    data-field-display-values={this.state.selected}
                    onClick={() => toggleExpanded(id)}
                    >
                    <div className="field">
                        <div className="label">{selected && (actions[selected].description || selected)}</div>
                    </div>
                    <ul role="group" className="buttons">
                        {selected &&
                            <li>
                                <button
                                    type="button"
                                    className="icon-only action-clear"
                                    tabIndex="0"
                                    aria-label="Remove selected option"
                                    onClick={this.handleRemoveItem}
                                    >&zwnj;</button>
                            </li>
                        }
                        <li><button
                            type="button"
                            className="icon-only action-toggle-expand inherit-focus"
                            tabIndex="0"
                            aria-label="Show options"
                            >&zwnj;</button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="action-apply"
                                onClick={this.handleApplyAction}
                                tabIndex="0"
                                aria-disabled={!(nSelected > 0 && selected)}
                                disabled={!(nSelected > 0 && selected)}
                                >Apply ({nSelected})</button>
                        </li>
                    </ul>
                </div>
                <div className="options" id={id} role="region" aria-hidden="true">
                    <ul role="listbox">
                        {Object.keys(actions).map(action => (
                            <li
                                key={action}
                                role="option"
                                tabIndex="0"
                                value={action}
                                onClick={() => this.handleSelectItem(action)}
                                onKeyPress={() => this.handleSelectItem(action)}
                                ><span className="option">{actions[action].description || action}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default BulkActions
