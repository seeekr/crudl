# crudl
CRUDL is a React application for rapidly building an admin interface based on your API. You just need to define the endpoints and a visual representation in order to get a full-blown UI for managing your data.

## TOC
* [About](#about)
* [Architecture](#architecture)
* [Options](#options)
* [Admin](#admin)
    * [Attributes and properties](#attributes-and-properties)
* [Connectors](#connectors)
    * [Requests](#requests)
    * [Data](#data)
    * [Errors](#errors)
* [Views](#views)
    * [Actions](#actions)
    * [Promise functions](#promise-functions)
    * [Normalize and denormalize functions](#normalize-and-denormalize-functions)
    * [Paths](#paths)
* [List View](#list-view)
    * [Bulk Actions](#bulk-actions)
    * [Pagination](#pagination)
* [Change View](#change-view)
* [Add View](#add-view)
* [Fieldsets](#fieldsets)
* [Fields](#fields)
    * [onChange](#onchange)
    * [getValue](#getvalue)
    * [lazy](#lazy)
    * [Custom attributes](#custom-attributes)
* [Permissions](#permissions)
* [Messages](#messages)
* [Credits & Links](#credits--links)

## Architecture
The CRUDL architecture (depicted below) consists of three logical layers. The connectors, views, and the react-redux frontend. We use React and Redux for the frontend, which consists of different views such as *list*, *add*, and *change* view.  The purpose of the connectors layer is to provide the views with a unified access to different APIs like REST or GraphQL. You configure the connectors, the fileds, and the views by providing a [admin](#admin).
```
+-----------------------+
|     React / Redux     |     
+-----------------------+
|         Views         |
+-----------------------+
  ↓         ↑         ↑         CRUDL
request   data     errors
  ↓         ↑         ↑
+-----------------------+
|       Connectors      |
+-----------------------+       ------------
            ↕                  
         ~~~~~~~           
           API                  BACKEND
         ~~~~~~~             

```

## Admin
The purpose of the admin is to provide CRUDL with the necessary information about the connectors and the views.
The admin is an object with the following attributes and properties:
```js
const admin = {
    title,              // Title of the CRUDL instance (a string or a react element property)
    views,              // a dictionary of views
    auth: {
        login,          // Login view descriptor
        logout,         // Logout view descriptor
    },
    custom: {
        dashboard,      // The index page of the CRUDL instance (a string or a react element property)
        pageNotFound,   // The admin of the 404 page        
        menu,           // The custom navigation
    },
    options: {
        debug,          // Include DevTools (default false)
        basePath,       // The basePath of the front end (default  '/crudl/')
        baseURL,        // The baseURL of the API backend (default  '/api/')
        rootElementId,  // Where to place the root react element (default 'crudl-root')
    }
    messages,           // An object of custom messages
    crudlVersion,       // The required crudl version in the semver format (e.g., "^0.3.0")
    id,                 // The id of the admin. This id is stored (together with other info) locally in the
                        // localStorage of the browser. If the admin id and the locally stored id do not match,
                        // the stored information will not be used. That means, for example, that by changing
                        // the admin id, you can enforce a logout of all users.
}
```
The provided admin will be validated (using [Joi](https://github.com/hapijs/joi)) and all its attributes and properties are checked against the admin's schema.

> ### Attributes and properties
We distinguish between attributes and properties. An attribute is a value of a certain type (such as string, boolean, function, an object, etc.), whereas property can also be a function that returns such a value. In other words, with property you can also provide the getter method. For example, the title of the CRUDL instance is a string (or react element) property. So you can define it as
```js
title: 'Welcome to CRUDL'`
```
or as
```js
title: () => `Welcome to CRUDL. Today is ${getDayName()}
```
or even as:
```js
title: () => <span>Welcome to <strong>CRUDL</strong>. Today is {getDayName()}</span>,
```

## Options
In `admin.options` you may specify some general CRUDL settings
```js
{
    debug: false,                   // Include DevTools?
    basePath: '/crudl/',            // The basePath of the front end
    baseURL: '/api/',               // The baseURL of the API (backend)
    rootElementId: 'crudl-root',    // Where to place the root react element
}
```
Assuming we deploy CRUDL on www.mydomain.com, we'll have CRUDL running on `www.mydomain.com/crudl/...` and the ajax requests of the connectors will be directed at `www.mydomain.com/api/...`.

## Connectors
Connectors provide CRUDL with a unified view of the backend API. Connectors are a separate [package](https://github.com/crudlio/crudl-connectors-base) which can be also used independently from CRUDL.

### Requests
A request object contains all the information necessary to execute one of the CRUD methods on a connector.
It is an object with the following attributes:
```js
{
    data,           // Context dependent: in a change view, the data contains the form values
    params,         // Connectors may require parameters to do their job, these are stored here
    filters,        // The requested filters
    sorting,        // The requested sorting
    page,           // The requested page
    headers,        // The http headers (e.g. the auth token)
}
```

### Data

When a connector successfully executes a request it resolves to response data:
```js
usersConnector.read(req.filter('name', 'joe'))
.then(allJoes => {
    // do something will all Joes
})
```

List views require data to be in an array form `[ item1, item2, ... ]`. Where `item` is an object. Pagination information may be included as a parameter of the array:
```js
result = [ item1, item2, ... ],
result.pagination = {
    type: 'numbered',
    allPages: [1, 2],
    currentPage: 1,
}
```

Change and add views require the data as an object, e.g.
```js
{
    id: '3'
    username: 'Jane',
    email: 'jane@crudl.io'
}
```

### Errors
It is the responsibility of the connectors to throw the right errors. CRUDL distinguishes three kinds of errors:

* Validation error: The submitted form is not correct.
    ```js
    {
        validationError: true,
        errors: {
            title: 'Title is required',
            _errors: 'Either category or tag is required',
        }
    }
    ```
    Non field errors have the special attribute key `_error` (we use the same format error as [redux-form](https://github.com/erikras/redux-form)).

* Authorization error: The user is not authorized. When this error is thrown, CRUDL redirects the user to the login view.
    ```js
    {
        authorizationError: true,
    }
    ```

* Default error: When something else goes wrong.

If any of the thrown errors contains an attribute `message`, this message will be displayed as a notification to the user.

## Views
The attribute `admin.views` is a dictionary of the form:
```js
{
    name1: {
        listView,       // required
        changeView,     // required
        addView,        // optional
    },
    name2: {
        listView,
        changeView,
        addView,
    },
    ...

}
```

Before we go into details about the views, let's define some common elements of the view:

### Paths
> Note on paths and urls. In order to distinguish between backend URLs and the frontend URLs, we call the later *paths*. That means, connectors (ajax call) access URLs and views are displayed at paths.

A path can be defined as a simple (`'users'`) or parametrized (`'users/:id'`) string.
The parametrized version of the path definition is used only in change views and is not applicable to the list or add views. In order to resolve the parametrized change view path, the corresponding list item is used as the reference. The parameters of the current path are exported in the variable `crudl.path`.

### Actions
Each view must define its `actions`, which is an object [property](#attributes-and-properties). The attributes of the actions property are the particular actions.

An action is a function that takes a request as its argument and returns a *promise*. This promise either resolves to [data](#data) or throws an [error](#errors). Typically, action use some [connectors](https://github.com/crudlio/crudl-connectors-base) to do their job. For example, a typical list view defines an action like this:
```js
const users = createDRFConnector('api/users/') // using Django Rest Framework connectors
listView.actions = {
    list: (req) => users.read(req), // or just 'list: users.read'
}
```
A typical *save* action of a change view looks for example like this:
```js
const users = createDRFConnector('api/users/:id/')
changeView.path = 'users/:id',
changeView.actions = {
    save: (req) => user(crudl.path.id).save(req),
}
```

### Normalize and denormalize functions
The functions `normalize` and `denormalize` are used to prepare, manipulate, annotate etc. the data for the frontend and for the backend. The normalization function prepares the data for the frontend (before they are displayed) and the denormalization function prepares to data for the backend (before they are passed to the connectors). The general form is `(data) => data` for views and `(value, allValues) => value` for [fields](#fields).

## List View
A list view is defined like this:
```js
{
    // Required:
    path,             // The path of this view e.g. 'users' relative to options.basePath
    title,            // A string - title of this view (shown in navigation) e.g. 'Users'
    fields,           // An array of list view fields (see below)
    actions: {
        list,         // The list action (see below)
    },

    // Optional:
    filters: {       
        fields,       // An array of fields (see below)
        denormalize,  // The denormalize function for the filters form
    }
    bulkActions,      // See bellow
    permissions: {    
        list,         // either true or false. Default value is true
    }        
    normalize,        // The normalize function of the form (listItems) => listItems (see below)
    paginationComponent, // A function of the form (pagination) => ReactComponent
}
```

* `list` action of the form `(request) => <Promise>` must either resolve to an array `[ item1, item2, ..., itemN ]` or throw an error. The items must be objects and the values of their attributes will be displayed in the list view fields. The array may optionally have a `pagination` attribute (see [Pagination](#pagination)). The `request` parameter is provided by the list view and it has the pertinent attributes `filters`, `page`, `sorting` and `headers` accordingly set.

* `filters.fields`: See [fields](#fields) for details.

* `normalize`: a function of the form `listItems => listItems`

### Bulk Actions

Crudl supports bulk actions that are executed on one or more selected list view items. Bulk actions are defined like this:

```js
listView.bulkActions=  {
    actionName: {
        description: 'What the action does',
        modalConfirm: {...} // Require modal dialog for confirmation (Optional)
        before: (selection) => {...} // Do something with the selection before the action
        action: (selection) => {...} // Do the bulk action
        after: (selection) => {...}, // Do something with the results afterwards
    },
    // more bulk actions...
}
```
An example of a delete bulk action using a modal confirmation:
```js
listView.bulkActions.delete = {
    description: 'Delete tags',
    modalConfirm: {
        message: "All the selected items will be deleted. This action cannot be reversed!",
        modalType: 'modal-delete',
        labelConfirm: "Delete All",
    },
    action: (selection) => Promise.all(selection.map(item => tag(item.id).delete(crudl.req())))
        .then(() => crudl.successMessage(`All items (${selection.length}) were deleted`))
    },
},
```

The *before* and *after* actions take the current selection as argument and return a React component which will be displayed in an overlay window. This component will receive two handlers as props: `onProceed` and `onCancel`.

An example of a *Change Section* action:
```js
listView.bulkActions.changeSection = {
    description: 'Change Section',
    // Create a submission form to select a section
    // onProceed and onCancel are handlers provided by the list view
    before: createSelectSectionForm,
    // The action itself
    action: selection => Promise.all(selection.map(
        item => category(item.id).update(crudl.req(item)) // category is a connector
    )).then(() => crudl.successMessage('Successfully changed the sections')),
},
```

Using the crudl utility function `createForm()`, the function `createSelectSectionForm` may for example look like this:
```js
const createSelectSectionForm = selection => ({ onProceed, onCancel }) => (
    <div>
    {crudl.createForm({
        id: 'select-section',
        title: 'Select Section',
        fields: [{
            name: 'section',
            label: 'Section',
            field: 'Select',
            lazy: () => options('sections', 'id', 'name').read(crudl.req()),
        }],
        onSubmit: values => onProceed(
            selection.map(s => Object.assign({}, s, { section: values.section }))
        ),
        onCancel,
    })}
    </div>
)
```
Notice that the react component will obtain two props `onProceed()` and `onCancel()` which you can use to control the progression of the action.

### Pagination

A list view can display paginated data. In order to do so, the `list(req)` action must resolve to an array with an extra attribute `pagination` which provides the necessary pagination information. Two pagination types are currently supported:
- **Numbered** pagination: Each page has a cursor (typically a number, and can be accessed directly. Pages are numbered from 1 to N. The `pagination` attribute is of the form
    ```js
    {
        type: 'numbered',   // Required
        allPages,           // Required
        currentPage,        // Required
        resultsTotal,       // Optional
        filteredTotal,      // Optional
    }
    ```
    where `allPages` is an array of page cursors. A page cursor can be anything. `allPages[i-1]` must provide a page cursor for the ith page. The currentPage is the page cursor of the currently displayed page. The corresponding page cursor of the current page is `allPages[currentPage-1]`. The total number of results can be optionally provided as `resultsTotal`. The total number of *filtered* results can be optionally provided as `filteredTotal`.

- **continuous** pagination: Results are displayed on one page and more are loaded if required. The `pagination` attribute has the form:
    ```js
    {
        next,           // Required
        resultsTotal,   // Optional
        filteredTotal,  // Optional    
    }
    ```
    where `next` is a page cursor that must be truthy if there exist a next page, otherwise it MUST be falsy. The resultsTotal is optional and it gives the number of the total available results. The total number of *filtered* results can be optionally provided as `filteredTotal`.

When a user request a new page (or more results) the list view generate a new request to the connector layer. This request has an attribute `page` and its value is one of `allPages` (numbered pagination) or the value of `next` (continuous pagination).

> If the `listView.paginationComponent` function is defined, then the value of the `pagination` attribute is passed to this function, which in turn must return a react component. See [Pagination.jsx](src/components/Pagination.jsx) for the details.

## Change View
```js
{
    // Required
    path,               // Parametrized path definition e.g. 'users/:id/'
    title,              // A string e.g. 'User'
    actions: {
        get,            // E.g. (req) => user(crudl.path.id).read(req)
        save,           // E.g. (req) => user(crudl.path.id).save(req)
        delete,         // E.g. (req) => user(crudl.path.id).delete(req)
    },
    fields,             // A list of fields
    fieldsets,          // A list of fieldsets

    // Optional
    tabs,               // A list of tabs
    tabtitle,           // The title of the first tab
    normalize,          // The normalization function (dataToShow) => dataToShow
    denormalize,        // The denormalization function (dataToSend) => dataToSend
    validate,           // Frontend validation function
    permissions: {    
        get: <boolean>,     // Does the user have a view permission?
        save: <boolean>,    // Does the user have a change permission?
        delete: <boolean>,  // Does the user have a delete permission?
    },
}
```
Either `fields` or `fieldsets`, but not both, must be specified. The attribute `validate` is a [redux-form](https://github.com/erikras/redux-form) validation function.

### Get Action
The get action of the form `(req) => <Promise:Object>` must resolve to an object or reject with an error. For example:
```js
changeView.actions.get = (req) => user(crudl.path.id).read(req)
changeView.actions.get(crudl.createRequest())
.then(result => {
    // { id: 3, username: 'joe', email: 'joe@crudl.io' }
})
.catch(error => {
    // { authorizationError: true, message: "You have been logged out!" }
})
```

### Save Action
The save action should update the resource and resolve to the new values. For example:
```js
changeView.actions.save = (req) => user(crudl.path.id).update(req)
changeView.actions.save(crudl.createRequest({ email: 'joe.doe@crudl.io' }))
.then(result => {
    // { id: 3, username: 'joe', email: 'joe.doe@crudl.io' }
})
.catch(error => {
    // { validationError: true, errors: { email: 'The email address is already registered' } }
})
```

### Delete action
The delete action deletes the resource and returns a promise. The value of the resolved promise is irrelevant.
For example:
```js
changeView.actions.delete = (req) => user(crudl.path.id).delete(req)
changeView.actions.delete(crudl.createRequest())
.then(result => {
    // 'Ok'
})
.catch(error => {
    // { message: "You're not permitted to delete a user" }
})
```

## Add View
The add view defines almost the same set of attributes and properties as the change view. It is often possible to reuse parts of the change view.
```js
{
    // Required
    path,               // A path definition
    title,              // A string. e.g. 'Add new user'
    actions: {
        add,
    },
    permissions: {    
        add: <boolean>, // Does the user have a create permission?
    },
    fields,             // A list of fields
    fieldsets,          // A list of fieldsets

    // Optional
    validate,           // Frontend validation function
    denormalize,        // Note: add views don't have a normalize function
}
```

### Add action
The add action must create a new resource and resolve to the new values. For example:

```js
addView.actions.add = (req) => users.create(req)
addView.actions.add(crudl.createRequest({ username: 'jane' }))
.then(result => {
    // { id: 4, username: 'jane', email: '' }
})
.catch(error => {
    // { validationError: true, errors: { email: 'Email adress is required' } }
})
```


## Fieldsets
With fieldsets, you are able to group fields with the change/addView.
```js
{
    // Required
    fields,                 // Array of fields

    // Optional properties
    title,                  // string property
    hidden,                 // boolean property e.g. hidden: () => !isOwner()
    description,            // string or react element property
    expanded,               // boolean property

    // Misc optional
    onChange,               // onChange (see below)
}
```

## Fields
With the fields, you describe the behavior of a single element with the changeView and/or addView. All the attributes of the field descriptor will be passed as props to the field component. The field descriptor can contain further custom attributes which are as well passed as props to the field component.
```js
{
    // Required attributes
    name,                   // string property
    field,                  // either a string  (i.e. a name a field component) or
                            // directly a react component. It is not required only when hidden == true
                            // This attribute cannot be obtained asynchronously

    // Optional attributes
    getValue,               // A function of the form `(data) => fieldValue`. Default: `(data) => data[name]`
    label,                  // string property (by default equal to the value of name)
    readOnly,               // boolean property
    required,               // boolean property
    disabled,               // boolean property
    hidden,                 // boolean property
    initialValue,           // Initial value in an add view
    validate,               // a function (value, allFieldsValues) => error || undefined
    normalize,              // a function (valueFromBackend) => valueToFrontend
    denormalize,            // a function (valueFromFrontend) => valueToBackend
    onChange,               // onChange specification (see bellow)
    add,                    // add relation specification (see bellow)
    edit,                   // edit relation specification (see bellow)
    lazy,                   // A function returning a promise (see bellow)

    // further custom attributes and props
}
```

### getValue

The value of the field is by default `data[name]`, where `name` is the required name attribute of the field descriptor and `data` is the response data from an API call. You can customize this behavior by providing your own `getValue` function of the form `(data) => fieldValue`. For example, suppose the returned data is
```js
{
    username: 'joe'
    contact: {
        email: 'joe@github.com'
        address: '...',
    }
}
```
and you want to describe an `email` field:
```js
{
    name: 'email',
    field: 'TextField',
    getValue: data => data.contact.email,
}
```

### onChange
With onChange, you are able to define dependencies between one or more fields. For example, you might have a field Country and a field State. When changing the field Country, the options for field State should be populated. In order to achieve this, you use onChange with State, listening to updates in Country and (re)populate the available options depending on the selected Country.
```js
{
    // Required
    in,                     // a string or an array of strings (field names)

    // Optional
    setProps,               // An object or a promise function
    setValue,               // a plain value or a promise function
    setInitialValue,        // a plain valuer or a promise function
}
```

### lazy

By defining the `lazy` function, you may provide some attributes of the descriptor asynchronously. The lazy function takes zero arguments and must return a promise which resolves to an object (i.e. a partial descriptor). You __cannot__ provide the attributes `name` and `field` asynchronously.

__Example:__ A Select field component has a prop `options` which is an array of objects with attributes `value` and `label`. You can provide these options _synchronously_ like this:
```js
{
    name: 'rating',
    label: 'Service Rating',
    field: 'Select',
    options: [{value: 0, label: 'Bad'}, {value: 1, label: 'Good'}, {value: 2, label: 'Excellent'}]
},
```
Or you can provide these options _asynchronously_ using the lazy function:
```js
{
    name: 'rating',
    label: 'Service Rating',
    field: 'Select',
    lazy: () => crudl.connectors.ratings.read(crudl.req()).then(response => ({
        options: response.data,
    })),
},
```
Note that all the descriptor attributes will be passed as props to the field component. This is also true for asynchronously provided attributes.

### Add and Edit relations

A field containing a foreign key may define add and edit relations. The add descriptor looks like this:
```js
{
    name: 'section',
    label: 'Section',
    field: 'Select',
    lazy: () => options('sections', 'id', 'name').read(crudl.req()),
    add: {
        title: 'New section',
        actions: {
            add: req => sections.create(req).then(data => data.id),
        },
        fields: [
            {
                name: 'name',
                label: 'Name',
                field: 'String',
                required: true
            },
            {
                name: 'slug',
                label: 'Slug',
                field: 'String',
                required: true,
            },
        ],
    },
}
```
The `add` action of the add relation MUST return the new value for the field in the original form (the *section* field in this example).

The edit descriptor is quite similar:
```js
{
    name: 'section',
    label: 'Section',
    field: 'Select',
    lazy: () => options('sections', 'id', 'name').read(crudl.req()),
    edit: {
            title: 'Edit Section',
            actions: {
                get: (req) => section(crudl.context('section')).read(req),
                save: (req) => section(crudl.context('section')).update(req),
            },
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                    field: 'String',
                    required: true
                },
                {
                    name: 'slug',
                    label: 'Slug',
                    field: 'String',
                    required: true,
                },
            ],
        },
}
```
In contrast to the `add` actions of the add relation, the `save` action IS NOT required to resolve the the value of the originating field. Note that you can access the current form data via `crudl.context()` function.


### Custom attributes

You can provide any number of further custom attributes which will then be passed as props to the field component. Note however that the following props are already passed to the field components and cannot be overwritten:
- `dispatch`
- `input`
- `meta`
- `registerFilterField`
- `onAdd`
- `onEdit`

## Permissions
Each view may define its permissions. Permissions are defined on a per-action basis. A change view, for example, can define `get`, `save`, and `delete` actions, so it can specify corresponding `get`, `save`, and `delete` permissions like this:
```js
changeView.permissions = {
    get: true, // A user can view the values
    save: true, // A user may save changes
    delete: false, // A user cannot delete the resource
}
```

The permission key of a view is a _property_. That means you can define a getter and assign permissions dynamically. For example:
```js
changeView.permissions = {
    delete: () => crudl.auth.user == crudl.context('owner'), // Only the owner of the resource can delete it
}
```

## Messages

We use [react-intl](https://github.com/yahoo/react-intl) in order to provide for custom messages and translations. Examples of some custom messages:

```js
admin.messages = {
    'changeView.button.delete': 'Löschen',
    'changeView.button.saveAndContinue': 'Speichern und weiter bearbeiten',
    'changeView.button.save': 'Speichern',
    'modal.labelCancel.default': 'Abbrechen',
    'login.button': 'Anmelden',
    'logout.affirmation': 'Tchüß!',
    'logout.loginLink': 'Nochmal einloggen?',
    'logout.button': 'Abmelden',
    'pageNotFound': 'Die gewünschte Seite wurde nicht gefunden!',
    // ...more messages
}
```
You will find all configurable messages in `src/messages/*.js`.

## Credits & Links
CRUDL is written and maintained by vonautomatisch (Patrick Kranzlmüller, Axel Swoboda).

* http://crudl.io
* https://twitter.com/crudlio
* http://vonautomatisch.at
