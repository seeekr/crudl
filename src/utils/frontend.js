
// Pluralize
export function pluralize(length, singular, plural) {
    if (length == 1) {
        return singular
    } else {
        return plural
    }
}

// Get a single dom node by selector
export function getDOMNode(selector) {
    const node = document.querySelectorAll(selector)[0]
    return node
}

// Create array from DOM elements list
export function createDOMArray(list) {
    const arr = [];
    for (let i = 0; i < list.length; i++) {
        arr.push(list[i]);
    }
    return arr
}

// Look for parent with id
export function hasParentId(target, id) {
    let node = target
    while (node !== null) {
        if (node.id === id) {
            return true
        }
        node = node.parentNode;
    }
    return false
}

// Pluralize
export function calculateSidebarDimensions() {
    const sidebar = document.getElementById('sidebar')
    const filters = document.getElementById('filters')
    if (filters !== undefined) {
        const viewportHeight = window.innerHeight - (2 * 48)
        const filtersHeight = filters.scrollHeight
        if (filtersHeight > viewportHeight) {
            sidebar.classList.add('scroll-overflow')
        } else {
            sidebar.classList.remove('scroll-overflow')
        }
    }
}

// Visually focus element (via className)
export function visuallyFocusElem(elem) {
    elem.classList.add('focus')
}

// Visually blur element (via className)
export function visuallyBlurElem(elem) {
    elem.classList.remove('focus')
}

// Create fieldset id
export function createFieldSetId(...args) {
    const id = `fieldset_${args.join('_')}`
    return id
}

// Create inlines-item id
export function createInlinesItemId(...args) {
    const id = `inlines_item_${args.join('_')}`
    return id
}

// Get the [data-field-display-values] of a dom node with [data-field-display-name="fieldDisplayName"]
export function getFieldDisplayValues(fieldDisplayName) {
    const node = getDOMNode(`[data-field-display-name="${fieldDisplayName}"]`)
    if (node !== undefined) {
        const fieldDisplayValues = node.getAttribute('data-field-display-values')
        return fieldDisplayValues
    }
    return undefined
}

// Toggle expanded
export function toggleExpanded(id) {
    const handler = getDOMNode(`[aria-controls="${id}"]`)
    const region = document.getElementById(id)
    const display = handler.getAttribute('aria-expanded') === 'false'
    handler.setAttribute('aria-expanded', display)
    region.setAttribute('aria-hidden', !display)
}

// Close expanded
export function closeExpanded(id) {
    const handler = getDOMNode(`[aria-controls="${id}"]`)
    const region = document.getElementById(id)
    handler.setAttribute('aria-expanded', false)
    region.setAttribute('aria-hidden', true)
}

// Show expanded
export function showExpanded(id) {
    const handler = getDOMNode(`[aria-controls="${id}"]`)
    const region = document.getElementById(id)
    handler.setAttribute('aria-expanded', true)
    region.setAttribute('aria-hidden', false)
}

// Close all expanded
export function closeAllExpanded(container) {
    const expandables = container.querySelectorAll('[aria-expanded]')
    expandables.forEach((element) => {
        element.setAttribute('aria-expanded', false)
        const region = document.getElementById(element.getAttribute('aria-controls'))
        region.setAttribute('aria-hidden', true)
    })
}

// Show all expanded
export function showAllExpanded(container) {
    const expandables = container.querySelectorAll('[aria-expanded]')
    expandables.forEach((element) => {
        element.setAttribute('aria-expanded', true)
        const region = document.getElementById(element.getAttribute('aria-controls'))
        region.setAttribute('aria-hidden', false)
    })
}

// Format date YYYY-MM-DD
export function formatDate(date) {
    return date.toJSON().slice(0, 10)
}

// Format time HH:MM:SS
export function formatTime(date) {
    return date.toJSON().slice(11, 19)
}

export function formatDateTime(date) {
    const d = formatDate(date)
    const t = formatTime(date)
    return `${d}, ${t}`
}
