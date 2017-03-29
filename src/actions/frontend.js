
export const types = {
    SHOW_NAVIGATION: 'frontend.showNavigation',
    HIDE_NAVIGATION: 'frontend.hideNavigation',
    TOGGLE_NAVIGATION: 'frontend.toggleNavigation',
    SHOW_FILTERS: 'frontend.showFilters',
    HIDE_FILTERS: 'frontend.hideFilters',
    TOGGLE_FILTERS: 'frontend.toggleFilters',
    SHOW_MODAL_CONFIRM: 'frontend.showModalConfirm',
    HIDE_MODAL_CONFIRM: 'frontend.hideModalConfirm',
    PAGE_NOT_FOUND_MESSAGE: 'frontend.pageNotFoundMessage',
    SHOW_BLOCK_OVERLAY: 'frontend.showBlockOverlay',
    HIDE_BLOCK_OVERLAY: 'frontend.hideBlockOverlay',
    SHOW_BOTTOMBAR: 'frontend.showBottomBar',
    HIDE_BOTTOMBAR: 'frontend.hideBottomBar',
    TOGGLE_BOTTOMBAR: 'frontend.toggleBottomBar',
}

export function showNavigation() {
    return {
        type: types.SHOW_NAVIGATION,
    }
}

export function hideNavigation() {
    return {
        type: types.HIDE_NAVIGATION,
    }
}

export function toggleNavigation() {
    return {
        type: types.TOGGLE_NAVIGATION,
    }
}

export function showFilters() {
    return {
        type: types.SHOW_FILTERS,
    }
}

export function hideFilters() {
    return {
        type: types.HIDE_FILTERS,
    }
}

export function toggleFilters() {
    return {
        type: types.TOGGLE_FILTERS,
    }
}

export function showModalConfirm(options) {
    return {
        type: types.SHOW_MODAL_CONFIRM,
        options,
    }
}

export function hideModalConfirm() {
    return {
        type: types.HIDE_MODAL_CONFIRM,
    }
}

export function pageNotFoundMessage(message) {
    return {
        type: types.PAGE_NOT_FOUND_MESSAGE,
        message,
    }
}

export function showBlockOverlay() {
    return {
        type: types.SHOW_BLOCK_OVERLAY,
    }
}

export function hideBlockOverlay() {
    return {
        type: types.HIDE_BLOCK_OVERLAY,
    }
}

export function showBottomBar() {
    return {
        type: types.SHOW_BOTTOMBAR,
    }
}

export function hideBottomBar() {
    return {
        type: types.HIDE_BOTTOMBAR,
    }
}

export function toggleBottomBar() {
    return {
        type: types.TOGGLE_BOTTOMBAR,
    }
}
