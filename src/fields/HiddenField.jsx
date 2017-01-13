import React from 'react'

class HiddenField extends React.Component {

    static propTypes = {
        input: React.PropTypes.object.isRequired,
    };

    render() {
        return (
            <input type="hidden" {...this.props.input} />
        )
    }
}

export default HiddenField
