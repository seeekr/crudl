import toPath from 'lodash/toPath'
import get from 'lodash/get'

/**
* Works like lodash.get() with an extra feature: '[*]' selects
* the complete array. For example:
*
*      let object = { name: 'Abc', tags: [ {id: 1, name: 'javascript'}, {id: 2, name: 'select'} ]}
*      let names = select(object, 'tags[*].name')
*      console.log(names)
*      > ['javascript', 'select']
*
*/
export default function select(object, pathSpec, defaultValue) {
    if (!object || !pathSpec) {
        return defaultValue
    }
    const path = toPath(pathSpec)
    const pos = path.indexOf('*')
    if (pos >= 0) {
        // Break the path at '*' and do select() recursively on
        // every element of the first path part
        return get(object, path.slice(0, pos)).map(
            item => select(item, path.slice(pos + 1), defaultValue)
        )
    }
    return get(object, path, defaultValue)
}
