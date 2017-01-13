
export const types = {
    SET_ACTIVE_FILTERS: 'frontend.setActiveFilters',
    SET_FILTERS: 'frontend.setFilters',
}

export function setActiveFilters(activeFilters) {
    return {
        type: types.SET_ACTIVE_FILTERS,
        activeFilters,
    }
}

export function setFilters(filters) {
    return {
        type: types.SET_FILTERS,
        filters,
    }
}
