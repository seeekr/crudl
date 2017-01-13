import React from 'react'
import classNames from 'classnames'
import { pluralize } from '../utils/frontend'

/**
 * The NumberedPagination component implements the classic pagination, where each page has a number
 * and thus can be accessed directly. Pages are numbered from 1 to N.
 *
 * NumberedPagination requires pagination info in the form: `{ allPages, currentPage, resultsTotal }`, where
 * allPages is an array of page cursors. Page cursors can be any data. allPages[i-1] must provide a page
 * cursor for the ith page. The currentPage is the page number of the currently displayed page. The corresponding
 * page cursor of the current page is allPages[currentPage-1]. The total number of results can be optionally
 * provided as `resultsTotal`. The total number of *filtered* results can be optionally provided as `filteredTotal`.
 */
export class NumberedPagination extends React.Component {

    static propTypes = {
        pagination: React.PropTypes.object, // Pagination info obtained from action responses
        onRequestPage: React.PropTypes.func.isRequired, // Callback
        results: React.PropTypes.array.isRequired, // The currently displayed results
        filtered: React.PropTypes.bool.isRequired, // True if the new results were filtered
    };

    static defaultProps = {
        pagination: {
            allPages: [],
            currentPage: 1,
            resultsTotal: undefined,
            filteredTotal: undefined,
        },
    };

    handleRequestPage(pageCursor) {
        const combineResults = (prev, next) => next

        // If pageCursor is a string: automatically serialize,
        // else don't serialize
        if (typeof pageCursor === 'string') {
            this.props.onRequestPage(pageCursor, combineResults, true)
        } else {
            this.props.onRequestPage(pageCursor, combineResults, false)
        }
    }

    render() {
        const { pagination, filtered } = this.props
        const { allPages, currentPage, resultsTotal, filteredTotal } = pagination
        /* FIXME (Axel): we have one li here, although no results are given. is that correct? */
        /* FIXME (Axel): in contrast to continuous pagination, there is no ol here with the defaultProps */
        if (allPages.length > 0) {
            const resultsClass = classNames('results', { filtered })
            const resultString = pluralize(filteredTotal, 'result', 'results')
            return (
                <ol className="pagination type-numbered">
                    {resultsTotal !== 'undefined' &&
                        <li className={resultsClass}>
                            {filteredTotal < resultsTotal ?
                                `${filteredTotal} ${resultString} (${resultsTotal} total)`
                                :
                                `${resultsTotal} total`
                            }
                        </li>
                    }
                    {allPages.length > 1 &&
                        allPages.map((pageCursor, index) => (
                            <li
                                key={index}
                                className={index + 1 === currentPage ? 'page current' : 'page'}
                                onClick={() => this.handleRequestPage(pageCursor)}
                                >
                                {index + 1}
                            </li>
                        ))
                    }
                </ol>
            )
        }
        return false
    }
}

export default NumberedPagination
