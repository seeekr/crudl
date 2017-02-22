/* eslint-disable quote-props */
import AutocompleteField from './AutocompleteField'
import AutocompleteMultipleField from './AutocompleteMultipleField'
import CheckboxField from './CheckboxField'
import DateField from './DateField'
import DateTimeField from './DateTimeField'
import PasswordField from './PasswordField'
import RadioGroup from './RadioGroup'
import SelectField from './SelectField'
import SelectMultipleField from './SelectMultipleField'
import SearchField from './SearchField'
import TextField from './TextField'
import TextareaField from './TextareaField'
import TimeField from './TimeField'
import UrlField from './UrlField'
import HiddenField from './HiddenField'
import FileField from './FileField'

export default {
    'String': TextField,
    'Email': TextField,
    'Text': TextField,
    'Autocomplete': AutocompleteField,
    'AutocompleteMultiple': AutocompleteMultipleField,
    'Checkbox': CheckboxField,
    'Date': DateField,
    'Datetime': DateTimeField,
    'File': FileField,
    'Password': PasswordField,
    'RadioGroup': RadioGroup,
    'Select': SelectField,
    'SelectMultiple': SelectMultipleField,
    'Search': SearchField,
    'Textarea': TextareaField,
    'Time': TimeField,
    'URL': UrlField,
    'hidden': HiddenField,
}
