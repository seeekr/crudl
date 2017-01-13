import React from 'react'
import { connect } from 'react-redux'
import { activeFiltersShape } from '../PropTypes'

export class ActiveFilters extends React.Component {

    static propTypes = {
        activeFilters: activeFiltersShape.isRequired,
        onRemove: React.PropTypes.func.isRequired,
    };

    render() {
        const { activeFilters, onRemove } = this.props
        if (activeFilters.length > 0) {
            return (
                <ul role="listbox" className="active-filters">
                    <li role="option" className="title"><span>Filtered by</span></li>
                    {this.props.activeFilters.map(f => (
                        <li key={f.name} role="option">
                            <span className="label">{f.label}</span>
                            <span className="value">{f.value}</span>
                            <button
                                onClick={() => onRemove(f.name)}
                                type="button"
                                aria-label="Remove filter"
                                className="action-clear icon-only"
                                >&zwnj;</button>
                        </li>
                    ))}
                </ul>
            )
        }
        return null
    }
}

function mapStateToProps(state) {
    return {
        activeFilters: state.filters.activeFilters,
    }
}

export default connect(mapStateToProps)(ActiveFilters)
