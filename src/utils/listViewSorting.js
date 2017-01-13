import cloneDeep from 'lodash/cloneDeep'

export const getInitialSorting = listDesc => listDesc.fields
    .filter(f => f.sorted !== 'none')
    .sort((a, b) => a.sortpriority - b.sortpriority)

export const sortingToQueryString = sorting => sorting
    .filter(item => item.sorted !== 'none')
    .map((item) => {
        const sorted = item.sorted === 'ascending' ? 'asc_' : 'desc_'
        return sorted + item.name + (item.name !== item.sortKey ? `-${item.sortKey}` : '')
    }).join(',')

export const queryStringToSorting = (queryString) => {
    if (!queryString) {
        return []
    }
    const sorting = []
    queryString.split(',').forEach((item) => {
        const match = item.match(/(asc_|desc_)([^-]+)(?:-([^-]+))?/)
        if (match) {
            sorting.push({
                name: match[2],
                sorted: match[1] === 'asc_' ? 'ascending' : 'descending',
                sortKey: match[3] || match[2],
            })
        }
    })
    return sorting
}

export const updateSorting = (sorting, sortItem) => {
    const newSorting = cloneDeep(sorting)
    const index = newSorting.map(item => item.name).indexOf(sortItem.name)
    if (index >= 0) {
        if (sortItem.sorted === 'none') {
            newSorting.splice(index, 1)
        } else {
            newSorting[index] = cloneDeep(sortItem)
        }
    } else {
        newSorting.push(cloneDeep(sortItem))
    }
    return newSorting
}
