/* globals require, test, expect, describe, it */

import * as actions from '../../actions/filters.js'


describe('actions filters', () => {
    it('types', () => {
      expect(Object.keys(actions.types).length).toEqual(2)
    })
    it('setActiveFilters should create an action to set active filters', () => {
      const activeFilters = [1, 2, 3]
      const expectedAction = {
          type: actions.types.SET_ACTIVE_FILTERS,
          activeFilters,
      }
      expect(actions.setActiveFilters(activeFilters)).toEqual(expectedAction)
    })
    it('setFilters should create an action to set filters', () => {
      const filters = [1, 2, 3]
      const expectedAction = {
          type: actions.types.SET_FILTERS,
          filters,
      }
      expect(actions.setFilters(filters)).toEqual(expectedAction)
    })
})
