
export default function saveDisabled(formProps) {
    return formProps.submitting || !formProps.dirty
}
