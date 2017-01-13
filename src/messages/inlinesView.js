import { defineMessages } from 'react-intl'

const messages = defineMessages({
    delete: {
        id: 'inlinesView.button.delete',
        defaultMessage: 'Delete',
    },
    save: {
        id: 'inlinesView.button.save',
        defaultMessage: 'Save',
    },
    modalDeleteMessage: {
        id: 'inlinesView.modal.deleteConfirm.message',
        defaultMessage: 'Are you sure you want to delete {item}?',
    },
    modalDeleteLabelConfirm: {
        id: 'inlinesView.modal.deleteConfirm.labelConfirm',
        defaultMessage: 'Yes, delete',
    },
    deleteSuccess: {
        id: 'inlinesView.deleteSuccess',
        defaultMessage: '{item} was succesfully deleted.',
    },
    deleteFailure: {
        id: 'inlinesView.deleteFailure',
        defaultMessage: 'Failed to delete {item}.',
    },
    addSuccess: {
        id: 'inlinesView.addSuccess',
        defaultMessage: '{item} was succesfully created.',
    },
    saveSuccess: {
        id: 'inlinesView.saveSuccess',
        defaultMessage: '{item} was succesfully saved.',
    },
    validationError: {
        id: 'inlinesView.validationError',
        defaultMessage: 'The form is not valid. Correct the errors and try again.',
    },
})

export default messages
