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
    * [Responses](#responses)
    * [Errors](#errors)
* [Views](#views)
    * [Actions](#actions)
    * [Promise functions](#promise-functions)
    * [Normalize and denormalize functions](#normalize-and-denormalize-functions)
    * [Paths](#paths)
* [List View](#list-view)
* [Change View](#change-view)
* [Add View](#add-view)
* [Fieldsets](#fieldsets)
* [Fields](#fields)
    * [onChange](#onchange)
    * [getValue](#getvalue)
    * [lazy](#lazy)
* [Permissions](#permissions)
    * [Example of a connector providing permissions](#example-of-a-connector-providing-permissions)
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
request  response  errors
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
    connectors,         // a dictionary of connectors
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
In `admin.options` you may specify some general CURDL settings
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
The purpose of the connectors is to provide CRUDL with a unified view of the backend API. A connector is an object that defines the four CRUD methods `create`, `read`, `update`, and `delete`. These methods accept a [request](#requests) object as their argument and return a *promise* that either resolves to a [response](#responses) object or throws an [error](#errors). Normally, a single connector represents a single API endpoint or a single resource. So you define, for example, a single connector to access the blog entries and another connector to access the users.

CRUDL provides connectors for RESTful and GraphQL APIs. A REST connector must define the `url` attribute and a GraphQL connector must define the `query` attribute.

A connector has the following schema:
```js
{
    url,            // REST: The endpoint URL (will be appended to options.baseURL)
    urlQuery,       // REST: A function that builds the url query part
    query,          // GraphQL: The GraphQL queries for create, read, update, and delete operations
    mapping,        // The mapping between CRUD and HTTP methods
    transform,      // Definition of Request and Response transformations
    pagination,     // Function that returns pagination info
    baseURL,        // Overrides the value of admin.options.baseURL for this particular connector
}
```
 * `url`: url can either be a string such as `users/`, that will resolve against the `baseURL` [option](#options). Or it can be a function of the form: `(request) => urlString`

 * `urlQuery`: is an optional attribute. When provided, it must be a function `(request) => query`, where `query` is an object of url query keys and values e.g. `{ search: 'John', sortBy: 'last_name' }`. The resulting URL would then be: `baseURL/users?search=John&sortBy=last_name`.

 * `query`: An object with attributes `create`, `read`, `update`, and `delete` each defining a GraphQL query. The definition of the GraphQL query can be either a string or a function `(request) => queryString`

 * `mapping`: An object that defines the mapping between the CRUD and HTTP methods. The default mapping of a REST connector is:
   ```js
   {
       create: 'post',
       read: 'get',
       update: 'patch',
       delete: 'delete',
   }
   ```
   The default mapping of a GraphQL admin is:
   ```js
   {
       create: 'post',
       read: 'post',
       update: 'post',
       delete: 'post',
   }
   ```

 * `transform`: An object of request and response transformations:
   ```js
   {
       // Request
       createRequest: (req) => req,
       readRequest: (req) => req,
       updateRequest: (req) => req,
       deleteRequest: (req) => req,
       // Request data
       createRequestData: (data) => data,
       readRequestData: (data) => data,
       updateRequestData: (data) => data,
       deleteRequestData: (data) => data,
       // Response
       createResponse: (res) => res,
       readResponse: (res) => res,
       updateResponse: (res) => res,
       deleteResponse: (res) => res,
       // Response data
       createResponseData: (data) => data,
       readResponseData: (data) => data,
       updateResponseData: (data) => data,
       deleteResponseData: (data) => data,
   }
   ```
   The transformation of a request is applied prior to the transformation of request data and similarly, the transformation of a response is applied prior to transformation of a response data.
 * `pagination`: a function `(response) => paginationInfo`, where the format of `paginationInfo` depends on the kind of pagination that is being used.

   The **numbered pagination** requires pagination info in the form: `{ allPages, currentPage, resultsTotal, filteredTotal }`, where `allPages` is an array of page cursors. Page cursors can be any data. `allPages[i-1]` must provide a page cursor for the i-th page. The `currentPage` is the page number of the currently displayed page. The corresponding page cursor of the current page is `allPages[currentPage-1]`. The total number of results can be optionally provided as `resultsTotal`. The total number of *filtered* results can be optionally provided as `filteredTotal`.

   The **continuous scroll pagination** requires the pagination info in the form: `{ next, resultsTotal, resultsTotal, filteredTotal }`. Where next is a pageCursor that must be truthy if there exist a next page, otherwise it must be falsy. The `resultsTotal` is optional and it gives the number of the total available results. The total number of *filtered* results can be optionally provided as `filteredTotal`.

 * `baseURL`: A string that overrides the `admin.options.baseURL` value for this particular connector. It allows to access different API at different base URLs.

### Bare Connectors
If neither `url` nor `query` are provided, then the connector is called a __bare connector__ and it must provide the CRUD methods directly, for example like this:
```js
{
    // Provide some testing data
    read: () => Promise.resolve({
        data: require('./testdata/tags.json')
    }),
    // Pretend to create a resource
    create: (req) => Promise.resolve({
        data: req.data
    }),
},
```

### Requests
A request object contains all the information necessary to execute one of the CRUD methods on a connector.
It is an object with the following attributes:
```js
{
    data,           // Context dependent: in a change view, the data contains the form values
    params,         // Connectors may require parameters to do their job, these are stored here
    filters,        // The requested filters
    sorting,        // The requested sorting
    pagination,     // true / false (whether to paginate, default true)
    page,           // The requested page
    headers,        // The http headers (e.g. the auth token)
}
```
>Calling a connector like this `crudl.connectors.user(31).read(request)` will cause the request object to have the `params = [31]`.

### Responses
A response object has the following attributes:
```js
{
    data,       // The data as returned by the API
    url,        // The url of the API endpoint (where the request was directed at)
    status,     // The HTTP status code of the response
}
```
The response may contain other attributes as well. For example, if a connector has the pagination function defined, the response will contain the attribute `pagination` set to the result of this function e.g.
```js
{
    data: [{id: 1, ...}, {id: 2, ...}, ..., {id: 63, ...} ],
    url: '/api/users/',
    status: 200,
    pagination: {
        page: 1,
        allPages: [1, 2, 3],
        resultsTotal: 63,
    }
}
```

### Errors
It is the responsibility of the connectors to throw the right errors. CRUDL distinguishes four kinds of errors:

* ValidationError: An object of the form: `{ fieldNameA: errorA, fieldNameB: errorB, ...  }`. Non field errors have the special attribute key `_error` (we use the same format error as [redux-form](https://github.com/erikras/redux-form)). Corresponds to HTTP status code 400.

* AuthorizationError: The request is not authorized. When this error is thrown, CRUDL redirects the user to the login view. Corresponds to HTTP status code 401.

* PermissionError: Thrown when the user is authorized to access the API but not permitted to execute the requested action e.g. delete a user, change passwords, etc. Corresponds to HTTP status code 403.

* NotFoundError: When this error is thrown, CRUDL redirect the user to the `pageNotFound` view. Corresponds to HTTP status code 404.

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

### Actions
Each view must define its `actions`, which is an object [property](#attributes-and-properties). The attributes of the actions property are the particular actions.

An action is a function that takes a request as its argument and returns a *promise*. A CRUDL promise either resolves to a [reponse](#responses) or throws an [error](#errors). Typically, actions make use of the connectors to do their job. For example, a typical list view defines an action like this:
```js
list: (req) => crudl.connectors.users.read(req)
```

### Promise functions
Some attributes may be asynchronous functions that may return promises (alternatively they may return plain values). The resolved values of these promises depend on the requirements of the particular function. You can use connectors to implement their functionality, but don't forget that the connectors promises resolve to *response* objects. It may therefore be necessarey to use them like this:
```js
return crudl.connectors.users.read().then(response => response.data)
```

### Normalize and denormalize functions
The functions `normalize` and `denormalize` are used to prepare, manipulate, annotate etc. the data for the frontend and for the backend. The normalization function prepares the data for the frontend (before they are displayed) and the denormalization function prepares to data for the backend (before they are passed to the connectors). The general form is `(data) => data` for views and `(value, allValues) => value` for [fields](#fields).

### Paths
> Note on paths and urls. In order to distinguish between backend URLs and the frontend URLs, we call the later *paths*. That means, connectors (ajax call) access URLs and views are displayed at paths.

A path can be defined as a simple (`'users'`) or parametrized (`'users/:id'`) string.
The parametrized version of the path definition is used only in change views and is not applicable to the list or add views. In order to resolve the parametrized change view path, the corresponding list item is used as the reference.

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
    permissions: {    
        list: <boolean>, // Does the user have a list permission?
    }        
    // Optional:
    filters: {       
        fields,       // An array of fields (see below)
        denormalize,  // The denormalize function for the filters form
    }
    normalize,        // The normalize function of the form (listItems) => listItems (see below)
}
```

* `list` resolves to a response, where `response.data == [{ ...item1 }, { ...item2 }, ..., { ...itemN }]`. The response object may optionally have `response.pagination` defined.

* `filters.fields`: See [fields](#fields) for details.

* `normalize`: a function of the form `listItems => listItems`

## Change View
```js
{
    // Required
    path,               // Parametrized path definition
    title,              // A string e.g. 'User'
    actions: {
        get,            
        save,
        delete,
    },
    permissions: {    
        get: <boolean>,     // Does the user have a view permission?
        save: <boolean>,    // Does the user have a change permission?
        delete: <boolean>,  // Does the user have a delete permission?
    },
    fields,             // A list of fields
    fieldsets,          // A list of fieldsets

    // Optional
    tabs,               // A list of tabs
    normalize,          // The normalization function (dataToShow) => dataToShow
    denormalize,        // The denormalization function (dataToSend) => dataToSend
    validate,           // Frontend validation function
}
```
Either `fields` or `fieldsets`, but not both, must be specified. The attribute `validation` is a [redux-form](https://github.com/erikras/redux-form) validation function.

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
    // Required Properties
    name,                   // string property
    field,                  // a property of either a string  (i.e. a name a field component)
                            // or directly a react component

    // Optional properties
    getValue,               // A function of the form `(data) => fieldValue`. Default: `(data) => data[name]`
    label,                  // string property (by default equal to the value of name)
    readOnly,               // booolean property
    required,               // booolean property
    disabled,               // booolean property
    initialValue,           // Initial value in an add view
    validate,               // a function (value, allFieldsValues) => error || undefined
    onChange,               // onChange specification (see bellow)
    add,                    // add relation specification (see bellow)
    edit,                   // edit relation specification (see bellow)
    lazy,                   // A function returning promise (see bellow)
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

By defining the `lazy` function, you may provide some attributes of the descriptor asynchronously. The lazy function takes zero arguments and must return a promise which resolves to an object (i.e. a partial descriptor).

__Example:__ A Select field component has a prop `options` which is an array of object with atteributes `value` and `label`. You can provide these options _synchronously_ like this:
```js
{
    name: 'rating',
    label: 'Service Rating',
    field: 'Select',
    options: [{value: 0, label: 'Bad'}, {value: 1, label: 'Good'}, {value: 2, label: 'Excellent'}]
},
```
Or you can provide these options asynchronously using the lazy function:
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

Beside defining the permissions in the view descriptors, you can provide them also in the API responses. In order to do so, your connector must return a response with an attribtue `permissions` of the form:
```js
response.permissions = {
    viewPath1: { actionName1: <boolean>, actionName2: <boolean>, ... },
    viewPath2: { actionName1: <boolean>, actionName2: <boolean>, ... },
    ...
}
```
where a `viewPath` is the path of a particular view in the admin object without the prefix `views`. Formally: if `viewPath` is `X.Y`, then it holds that `admin.views.X.Y === _.get(admin, 'views.' + 'viewPath')`.

### Example of a connector providing permissions
Suppose that a successful login API call returns the following data:
```json
{
    "username":"demo",
    "token":"cb1de9d5cd25d0abce47c36be67b1aa26a210eda",
    "user":1,
    "permission_list": [
        {
            "blogentry": {
                "create": false,
                "read": true,
                "update": true,
                "delete": true,
                "list": true
            }
        }
    ]
}
```
A login connector that includes these permission and _additionally_ prohibits deletion and creating of users may look like this:
```js
admin.connectors = {
    login: {
        url: '/rest-api/login/',
        mapping: { read: 'post', },
        transform: {
            readResponse(res => res
                .set('permissions', {
                    'users.changeView': { delete: false },
                    'users.addView': { add: false },
                    ...translatePermissions(data.permission_list),
                })
                .set('data', {
                    requestHeaders: { "Authorization": `Token ${data.token}` },
                    info: { user: data.user, username: data.username },
                })
            ),
        },
    },
    // ...other connectors
}
```
The `translatePermissions` function is backend specific and so the user must take care of the translation herself. In this particular example, the `translatePermissions` will return:
```js
{
    blogentries.addView: { add: false },
    blogentries.changeView: { get: true, save: true, delete: true }
    blogentries.listView: { list: true},
}
```

## Messages

We use [react-intl](https://github.com/yahoo/react-intl) in order to provide for custom messages and translations. Examples of some custom messages:

```js
admin.messages = {
    'changeView.button.delete': 'Löschen',
    'changeView.button.saveAndContinue': 'Speichern und weiter bearbeiten',
    'changeView.button.save': 'Speichern',
    'changeView.button.saveAndBack': 'Speichern und zurück',
    'modal.labelCancel.default': 'Abbrechen',
    'login.button': 'Anmelden',
    'logout.affirmation': 'Tchüß!',
    'logout.loginLink': 'Nochmal einloggen?',
    'logout.button': 'Abmelden',
    'pageNotFound': 'Die gewünschte Seite wurde nicht gefunden!',
    // ...more messages
}
```

This ist the complete list of all message IDs:
```json
[
  {
    "id": "addView.button.save",
    "defaultMessage": "Save"
  },
  {
    "id": "addView.button.saveAndContinue",
    "defaultMessage": "Save and continue editing"
  },
  {
    "id": "addView.button.saveAndAddAnother",
    "defaultMessage": "Save and add another"
  },
  {
    "id": "addView.button.saveAndBack",
    "defaultMessage": "Save and back"
  },
  {
    "id": "addView.add.success",
    "defaultMessage": "Succesfully created {title}."
  },
  {
    "id": "addView.add.failed",
    "defaultMessage": "The form is not valid. Correct the errors and try again."
  },
  {
    "id": "addView.modal.unsavedChanges.message",
    "defaultMessage": "You have unsaved changes. Are you sure you want to leave?"
  },
  {
    "id": "addView.modal.unsavedChanges.labelConfirm",
    "defaultMessage": "Yes, leave"
  }
  {
    "id": "changeView.button.delete",
    "defaultMessage": "Delete"
  },
  {
    "id": "changeView.button.save",
    "defaultMessage": "Save"
  },
  {
    "id": "changeView.button.saveAndContinue",
    "defaultMessage": "Save and continue editing"
  },
  {
    "id": "changeView.button.saveAndBack",
    "defaultMessage": "Save and back"
  },
  {
    "id": "changeView.modal.unsavedChanges.message",
    "defaultMessage": "You have unsaved changes. Are you sure you want to leave?"
  },
  {
    "id": "changeView.modal.unsavedChanges.labelConfirm",
    "defaultMessage": "Yes, leave"
  },
  {
    "id": "changeView.modal.deleteConfirm.message",
    "defaultMessage": "Are you sure you want to delete this {item}?"
  },
  {
    "id": "changeView.modal.deleteConfirm.labelConfirm",
    "defaultMessage": "Yes, delete"
  },
  {
    "id": "changeView.deleteSuccess",
    "defaultMessage": "{item} was succesfully deleted."
  },
  {
    "id": "changeView.saveSuccess",
    "defaultMessage": "{item} was succesfully saved."
  },
  {
    "id": "changeView.validationError",
    "defaultMessage": "The form is not valid. Correct the errors and try again."
  }
  {
    "id": "inlinesView.button.delete",
    "defaultMessage": "Delete"
  },
  {
    "id": "inlinesView.button.save",
    "defaultMessage": "Save"
  },
  {
    "id": "inlinesView.modal.deleteConfirm.message",
    "defaultMessage": "Are you sure you want to delete {item}?"
  },
  {
    "id": "inlinesView.modal.deleteConfirm.labelConfirm",
    "defaultMessage": "Yes, delete"
  },
  {
    "id": "inlinesView.deleteSuccess",
    "defaultMessage": "{item} was succesfully deleted."
  },
  {
    "id": "inlinesView.deleteFailure",
    "defaultMessage": "Failed to delete {item}."
  },
  {
    "id": "inlinesView.addSuccess",
    "defaultMessage": "{item} was succesfully created."
  },
  {
    "id": "inlinesView.saveSuccess",
    "defaultMessage": "{item} was succesfully saved."
  },
  {
    "id": "inlinesView.validationError",
    "defaultMessage": "The form is not valid. Correct the errors and try again."
  }
  {
    "id": "login.button",
    "defaultMessage": "Login"
  },
  {
    "id": "login.success",
    "defaultMessage": "You're logged in!"
  },
  {
    "id": "login.failed",
    "defaultMessage": "Login failed"
  }
  {
    "id": "logout.button",
    "defaultMessage": "Logout"
  },
  {
    "id": "logout.affirmation",
    "defaultMessage": "You have been logged out."
  },
  {
    "id": "logout.loginLink",
    "defaultMessage": "Log in again?"
  }
  {
    "id": "modal.labelConfirm.default",
    "defaultMessage": "Yes"
  },
  {
    "id": "modal.labelCancel.default",
    "defaultMessage": "Cancel"
  }
  {
    "id": "pageNotFound",
    "defaultMessage": "Page not found"
  }
  {
    "id": "permissions.viewNotPermitted",
    "defaultMessage": "You don't have a view permission"
  },
  {
    "id": "permissions.deleteNotPermitted",
    "defaultMessage": "You don't have a delete permission"
  },
  {
    "id": "permissions.addNotPermitted",
    "defaultMessage": "You don't have an add permission"
  },
  {
    "id": "permissions.saveNotPermitted",
    "defaultMessage": "You don't have a save permission"
  }
]
```

## Credits & Links
CRUDL is written and maintained by vonautomatisch (Patrick Kranzlmüller, Axel Swoboda).

* http://crudl.io
* https://twitter.com/crudlio
* http://vonautomatisch.at
