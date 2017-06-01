/* globals require, test, beforeEach, expect, describe, it, jest */
import * as crudl from '../Crudl'
import Request from '../Request'
import validateAdmin from '../utils/validateAdmin'

// Mock storage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: () => undefined,
        setItem: () => undefined,
        clear: () => undefined,
    },
});

const admin = {
    views: {
        users: {
            listView: {
                id: 'usersListView',
                path: 'users',
                title: 'Users',
                fields: [],
                actions: { list: jest.fn },
            },
            changeView: {
                path: 'users/:id',
                title: 'User',
                actions: {
                    get: jest.fn,
                    save: jest.fn,
                    delete: jest.fn,
                },
                fields: [],
            },
        },
    },
    auth: {
        login: {
            fields: [
                {
                    name: 'username',
                    field: 'Text',
                },
                {
                    name: 'password',
                    field: 'Password',
                },
            ],
        },
    },
}

const validatedAdmin = validateAdmin(admin)

describe('crudl without a store', () => {
    it('export is minimal and sufficient', () => {
        const mustExport = [
            'options',
            'auth',
            'path',
            'context',
            'baseField',
            'log',
            'resolvePath',
            'createRequest',
            'req',
            'hasPermission',
            'createStore',
            'getStore',
            'setStore',
            'setAdmin',
            'getViewDesc',
            'render',
            'createForm',
            'successMessage',
            'errorMessage',
            'infoMessage',
            'getAdmin',
            'getParentDesc',
            'getSiblingDesc',
            'getViewComponent',
            'setViewIndexEntry',
        ]
        expect(Object.keys(crudl).sort()).toEqual(mustExport.sort())
    })
    it('resolvePath resolves a simple string correctly', () => {
        expect(crudl.resolvePath('/users/')).toEqual('/users/')
    })
    it('resolvePath resolves a string with a variable correctly', () => {
        expect(crudl.resolvePath('/users/:username/edit', { username: 'Joe' })).toEqual('/users/Joe/edit')
    })
    it('resolvePath resolves a with a correct basePath', () => {
        Object.assign(crudl.options, { basePath: '/crudl/' })
        expect(crudl.resolvePath('blogs/:id', { id: 1 })).toEqual('/crudl/blogs/1')
    })
    it('getViewDesc fails without a validated admin', () => {
        expect(() => crudl.getViewDesc('usersListView')).toThrow()
    })
})

describe('crudl with a store', () => {
    it('creates a store correctly', () => {
        const store = crudl.createStore()
        expect(store).toBeDefined()
        expect(Object.keys(store).sort()).toEqual(['dispatch', 'subscribe', 'getState', 'replaceReducer'].sort())
    })
    it('sets a store correctly', () => {
        const store = crudl.createStore()
        crudl.setStore(store)
        expect(crudl.getStore()).toEqual(store)
    })
    it('creates a request object correctly', () => {
        const request = crudl.req()
        expect(request).toBeInstanceOf(Request)
    })
})
describe('crudl with a store and admin', () => {
    it('sets admin correctly', () => {
        expect(() => crudl.setAdmin(admin)).not.toThrow()
    })
    it('getViewDesc returns correct value', () => {
        expect(crudl.getViewDesc('usersListView')).toEqual(validatedAdmin.views.users.listView)
    })
})
