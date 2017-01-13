import React from 'react'
import classNames from 'classnames'
import select from '../utils/select'

class ListViewItem extends React.Component {

    static propTypes = {
        fields: React.PropTypes.array.isRequired,
        data: React.PropTypes.object.isRequired,
        onClick: React.PropTypes.func.isRequired,
    };

    constructor() {
        super()
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.data)
        }
    }

    render() {
        const { fields, data, onClick } = this.props
        return (
            <tr>
                {fields.map((f, index) => {
                    let value = select(data, f.key, f.defaultValue)
                    let renderClass = f.render

                    if (typeof f.render === 'function') {
                        value = f.render(value, data)
                        renderClass = 'string'
                    }

                    const cellClass = classNames(renderClass, {
                        main: f.main,
                        true: f.render && select(this.props.data, f.key, f.defaultValue),
                        false: f.render && !select(this.props.data, f.key, f.defaultValue),
                        // 'true': value,
                        // 'false': value
                    })

                    if (f.main && onClick) {
                        return (
                            <th key={index} data-column={index} className={cellClass}>
                                <div onClick={this.handleClick} className="item-handler">{value}</div>
                            </th>
                        )
                    }
                    return (
                        <td key={index} data-column={index} className={cellClass}>
                            <div>{value}</div>
                        </td>
                    )
                })}
            </tr>
        )
    }
}

export default ListViewItem
