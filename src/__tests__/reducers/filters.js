/* globals require, test, expect, describe, it */

import filters from '../../reducers/filters.js'
import { types } from '../../actions/filters.js'


describe('filters messages', () => {
    it('should return the initial state', () => {
        expect(
            filters(undefined, {})
        ).toEqual({
            activeFilters: [],
            filters: {},
        })
    })
    /* FIXME (Vaclav): please add test for SET_FILTERS */
    it('should handle SET_ACTIVE_FILTERS', () => {
        expect(
            filters(undefined, {
                type: types.SET_ACTIVE_FILTERS,
                activeFilters: [
                    {
                        name: 'section',
                        label: 'Section',
                        value: 'Updates',
                    },
                ],
            })
        ).toEqual({
            activeFilters: [
                {
                    name: 'section',
                    label: 'Section',
                    value: 'Updates',
                },
            ],
            filters: {},
        })
    })
})
