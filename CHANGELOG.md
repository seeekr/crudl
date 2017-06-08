# CHANGELOG

## 0.3.0 (not yet released)
* NEW: Checking version compatibility of admin and crudl. It is possible to specify the required crudl version in the admin (e.g. `admin.crudlVersion = '^0.3.0'`) and if the provided crudl version does not match, an error is thrown.
* NEW: You can specify an _admin id_ in the admin file. Any locally persisted user data will be invalidated if the ids do not match. This means, for example, that you can enforce a logout of all users by changing the admin's id.
* NEW: Bulk actions. You can define bulk actions for a list view and thus change (or delete) multiple items at once. Each action may define _before_ or _after_ hooks in order to prepare the action and display the results.
* REMOVED: Connectors were removed from crudl's core. They are now a standalone NPM package. They provide an extensible way to access different APIs (e.g. REST, GraphQl). Currently there are two connector packages available: [basic and general connector package](https://github.com/crudlio/crudl-connectors-base) and [Django REST Framework connectors](https://github.com/crudlio/crudl-connectors-drf).
* NEW: File field.
* CHANGED: Passing props to field components. Every attribute in the field descriptor will be passed to the field component as a prop. You can also provide props dynamically using the field descriptor function `lazy`, which returns an object of props or a promise resolving to such. An example of a field descriptor:
    ```js
    {
        name: 'section',
        label: 'Section',
        field: 'Select',
        lazy: () => options('sections', 'id', 'name').read(crudl.req()),
        helpText: 'Select a section'
    }
    ```
    Where `options` is a connector resolving to `{ options: [ { value: <id>, label: <name> }, ...] }`

    The select field will obtain the prop `options` once the options connector resolves.

## 0.2.0 (January 23, 2017)
* NEW: Published npm package (crudl).
* ADDED: Add/edit relations.
* ADDED: Custom messages and enabled translations.
* ADDED: Multiple base API URLs are supported. Connectors can override the default base URL.
* ADDED: Permissions. A user can define per-action permissions in a descriptor or they may be included in an API call response.
* ADDED: Tests (initial) with Jest/Enzyme/Sinon.
* IMPROVED: Removed crudlComponent().
* IMPROVED: WatchComponent removed in favor of props.watch() function and injectPropsWatch() utility.
* IMPROVED: propTypes (using Joi descriptor schema).
* IMPROVED: Folder structure and terminology.
* IMPROVED: Updated redux to 3.6.0.
* IMPROVED: Updated redux-forms to 6.2.0.
* IMPROVED: Using bluebird as promise library.
* IMPROVED: Folder structure.
* CHANGED: Admin stucture (see README.md) and some definitions.
* REMOVED: FieldMap in favor of direct component specification in the field descriptor (see README.md).

## 0.1.0 (September 12, 2016)
initial version
