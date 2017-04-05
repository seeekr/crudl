import { defineMessages } from 'react-intl'

const messages = defineMessages({
    save: {
        id: 'addView.button.save',
        defaultMessage: 'Save',
    },
    saveAndContinue: {
        id: 'addView.button.saveAndContinue',
        defaultMessage: 'Save and continue editing',
    },
    saveAndAddAnother: {
        id: 'addView.button.saveAndAddAnother',
        defaultMessage: 'Save and add another',
    },
    saveAndBack: {
        id: 'addView.button.saveAndBack',
        defaultMessage: 'Save and back',
    },
    cancel: {
        id: 'addView.button.cancel',
        defaultMessage: 'Cancel',
    },
    addSuccess: {
        id: 'addView.add.success',
        defaultMessage: '{title} was succesfully created.',
    },
    validationError: {
        id: 'addView.add.failed',
        defaultMessage: 'The form is not valid. Correct the errors and try again.',
    },
    modalUnsavedChangesMessage: {
        id: 'addView.modal.unsavedChanges.message',
        defaultMessage: 'You have unsaved changes. Are you sure you want to leave?',
    },
    modalUnsavedChangesLabelConfirm: {
        id: 'addView.modal.unsavedChanges.labelConfirm',
        defaultMessage: 'Yes, leave',
    },
})

export default messages
