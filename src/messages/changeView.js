import { defineMessages } from 'react-intl'

const messages = defineMessages({
    delete: {
        id: 'changeView.button.delete',
        defaultMessage: 'Delete',
    },
    save: {
        id: 'changeView.button.save',
        defaultMessage: 'Save',
    },
    saveAndContinue: {
        id: 'changeView.button.saveAndContinue',
        defaultMessage: 'Save and continue editing',
    },
    cancel: {
        id: 'changeView.button.cancel',
        defaultMessage: 'Cancel',
    },
    modalUnsavedChangesMessage: {
        id: 'changeView.modal.unsavedChanges.message',
        defaultMessage: 'You have unsaved changes. Are you sure you want to leave?',
    },
    modalUnsavedChangesLabelConfirm: {
        id: 'changeView.modal.unsavedChanges.labelConfirm',
        defaultMessage: 'Yes, leave',
    },
    modalDeleteMessage: {
        id: 'changeView.modal.deleteConfirm.message',
        defaultMessage: 'Are you sure you want to delete this {item}?',
    },
    modalDeleteLabelConfirm: {
        id: 'changeView.modal.deleteConfirm.labelConfirm',
        defaultMessage: 'Yes, delete',
    },
    deleteSuccess: {
        id: 'changeView.deleteSuccess',
        defaultMessage: '{item} was succesfully deleted.',
    },
    saveSuccess: {
        id: 'changeView.saveSuccess',
        defaultMessage: '{item} was succesfully saved.',
    },
    validationError: {
        id: 'changeView.validationError',
        defaultMessage: 'The form is not valid. Correct the errors and try again.',
    },
})

export default messages
