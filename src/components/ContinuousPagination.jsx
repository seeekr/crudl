import React from 'react'
import classNames from 'classnames'
import { pluralize } from '../utils/frontend'

/**
 * The ContinuousPagination component implements the continuous scroll pagination.
 * It requires pagination info in the form: `{ next, resultsTotal }`.
 * Where next is a pageCursor that must be truthy if there exist a next page,
 * ohterwise it MUST be falsy. The resultsTotal is optional and it gives the number of the
 * total available results. The total number of *filtered* results can be optionally provided as `filteredTotal`.
 */
export class ContinuousPagination extends React.Component {

    static propTypes = {
        pagination: React.PropTypes.object, // pagingation info obtained from action responses
        onRequestPage: React.PropTypes.func.isRequired, // Callback
        results: React.PropTypes.array.isRequired, // the currently displayed results
        filtered: React.PropTypes.bool.isRequired, // True if the new results were filtered
        loading: React.PropTypes.bool.isRequired, // True if the new results are currently being loaded
    };

    static defaultProps = {
        pagination: {
            next: undefined,
            resultsTotal: undefined,
            filteredTotal: undefined,
        },
    };

    // Concats the previous results with the next ones
    combineResults(prev, next = []) {
        return prev.concat(next)
    }

    render() {
        const { onRequestPage, results, loading, filtered } = this.props
        const { pagination: { next, resultsTotal, filteredTotal } } = this.props
        const resultsClass = classNames('results', { filtered })
        const pageClass = classNames('page show-more', { loading })
        /* FIXME (Axel): we have one li here, although no results are given. is that correct? */
        return (
            <ol className="pagination type-endless">
                <li className={resultsClass}>
                    {typeof resultsTotal !== 'undefined' && filteredTotal < resultsTotal ?
                        `${filteredTotal} ${pluralize(filteredTotal, 'result', 'results')} (${resultsTotal} total)`
                        :
                        `${resultsTotal} total`
                    }
                    {typeof resultsTotal === 'undefined' && `${results.length} total`}
                </li>
                {next &&
                    <li
                        className={pageClass}
                        onClick={() => onRequestPage(next, this.combineResults)}
                        >load more</li>
                }
            </ol>
        )
    }
}

export default ContinuousPagination
