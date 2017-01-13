import { SubmissionError } from 'redux-form'

class ValidationError extends SubmissionError {
    constructor(errors) {
        super(errors)
        Object.assign(this, errors)
    }
}

export default ValidationError
