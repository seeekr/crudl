// Inspired by https://github.com/foss-haas/joi-react
export default function joiToPropType(joiSchema) {
    function joiPropType(props, propName, required = false) {
        if (typeof props[propName] !== 'undefined') {
            return joiSchema.validate(props[propName]).error;
        }
        return required ? new Error(`${propName} is required`) : null
    }
    joiPropType.isRequired = (props, propName) => joiPropType(props, propName, true)
    return joiPropType
}
