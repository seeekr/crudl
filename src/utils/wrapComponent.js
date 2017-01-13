import React from 'react'

function except(propTypes = {}, props) {
    if (typeof props === 'object') {
        const copy = Object.assign(propTypes)

        Object.getOwnPropertyNames(props).forEach((name) => {
            delete (copy[name])
        })

        return copy
    }
    return propTypes
}

export default function wrapComponent(Component, props) {
    return class WrappedComponent extends React.Component {

        static displayName = `Wrapped(${Component.displayName || Component.name})`;

        static propTypes = except(Component.propTypes, props);

        render() {
            return (
                <Component {...props} {...this.props} />
            )
        }
    }
}
