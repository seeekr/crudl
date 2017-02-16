import React from 'react'
import { baseFieldPropTypes } from '../PropTypes'

const HiddenField = props => (
    <input type="hidden" {...props.input} />
)

HiddenField.propTypes = baseFieldPropTypes

export default HiddenField
