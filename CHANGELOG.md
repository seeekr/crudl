# CHANGELOG

## 0.3 (not yet released)

## 0.2 (2017-01-13)
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

## 0.1 (2016-09-12)
initial version
