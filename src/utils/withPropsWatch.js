import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import React from 'react'

function chain(func1, func2) {
    func1 = func1 || (() => undefined) // eslint-disable-line no-param-reassign
    func2 = func2 || (() => undefined) // eslint-disable-line no-param-reassign
    return function chained(...args) {
        func1(...args)
        func2(...args)
    }
}

function withPropsWatch(Component) {
    return class PropsWatcher extends React.Component {
        static displayName = `PropsWatcher(${Component.displayName || Component.name})`;

        watchedProps = {}; // Format: { propPath: {lastValue, callback, options} }

        constructor() {
            super()
            this.watch = this.watch.bind(this)
            this.unwatch = this.unwatch.bind(this)
        }

        componentDidMount() {
            this.checkAllWatchedProps(this.props)
        }

        componentWillReceiveProps(nextProps) {
            this.checkAllWatchedProps(nextProps)
        }

        /**
        * Watch a prop and invoke a callback when the prop's value changes
        */
        watch(propPath, cb, options = { }) {
            let callback = cb
            // Extend the default options
            options = Object.assign({ // eslint-disable-line no-param-reassign
                // Initial (last) value of the prop
                initialValue: undefined,
                // Invoke check immediately?
                checkNow: false,
                // used to decide when to invoke the callback
                watchCondition: (nextValue, lastValue) => !isEqual(nextValue, lastValue),
            }, options)

            // Chain callbacks if there are some already
            if (this.watchedProps[propPath]) {
                callback = chain(this.watchedProps[propPath].callback, callback)
            }

            // Register the watched prop
            this.watchedProps[propPath] = { lastValue: options.initialValue, callback, options }

            // Should we check now?
            if (options.checkNow) {
                this.checkWatchedProp(propPath)
            }
        }

        unwatch(propPath) {
            if (propPath) {
                delete this.watchedProps[propPath]
            } else {
                this.watchedProps = {}
            }
        }

        checkWatchedProp(props, propPath) {
            const { lastValue, callback, options } = this.watchedProps[propPath]
            const nextValue = get(props, propPath, undefined)

            if (options.watchCondition(nextValue, lastValue)) {
                this.watchedProps[propPath].lastValue = nextValue
                callback(props)
            }
        }

        checkAllWatchedProps(props) {
            Object.getOwnPropertyNames(this.watchedProps).forEach(
                propPath => this.checkWatchedProp(props, propPath),
            )
        }

        render() {
            return (
                <Component
                    {...this.props}
                    watch={this.watch}
                    unwatch={this.unwatch}
                    />
            )
        }
    }
}

export default withPropsWatch
