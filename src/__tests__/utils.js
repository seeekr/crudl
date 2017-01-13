/* globals require, test, expect, describe, it */

import getAllFields from '../utils/getAllFields'
import getFieldNames from '../utils/getFieldNames'
import objectDiff from '../utils/objectDiff'

/* getAllFields */

describe('getAllFields', () => {
    it('returns fields, if only fields are given', () => {
        const desc = {
            fields: [1, 2, 3],
        }
        expect(getAllFields(desc)).toEqual([1, 2, 3])
    })
    it('returns fields, if both fields and fieldsets are given', () => {
        const desc = {
            fields: [1, 2, 3],
            fieldsets: [
                { fields: ['a', 'b', 'c'] },
                { fields: ['d', 'e', 'f'] },
            ],
        }
        expect(getAllFields(desc)).toEqual([1, 2, 3])
    })
    it('returns fieldsets, if only fieldsets is given', () => {
        const desc = {
            fieldsets: [
                { fields: ['a', 'b', 'c'] },
                { fields: ['d', 'e', 'f'] },
            ],
        }
        expect(getAllFields(desc)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    })
    it('throws error with empty desc object', () => {
        const desc = {}
        expect(() => { getAllFields(desc) }).toThrowError('The provided descriptor does not define any fields')
    })
    it('throws error with undefined field/fieldsets object', () => {
        const desc = {
            fields: undefined,
            fieldsets: undefined,
        }
        expect(() => { getAllFields(desc) }).toThrowError('The provided descriptor does not define any fields')
    })
})

/* getFieldNames */

describe('getFieldNames', () => {
    it('returns fields, if only fields are given', () => {
        const desc = {
            fields: [
                { name: '001' },
                { name: '002' },
                { name: '003' },
            ],
        }
        expect(getFieldNames(desc)).toEqual(['001', '002', '003'])
    })
})

/* objectDiff */
describe('objectDiff', () => {
    it('computes diff(A, B) when B contains exactly the same keys as A', () => {
        const a = { one: '1', two: [1, 1], three: 3 }
        const b = { one: 'one', two: [1, 1], three: 3 }
        expect(Object.assign({}, a, objectDiff(a, b))).toEqual(b)
    })
    it('computes diff(A, B) when B contains only a subset of A\'s keys', () => {
        const a = { one: '1', two: [1, 1], three: 3 }
        const b = { one: 'one', two: [1, 1] }
        expect(Object.assign({}, a, objectDiff(a, b))).toEqual(b)
    })
    it('computes diff(A, B) when B contains some keys not present by A', () => {
        const a = { one: '1', two: [1, 1], three: 3 }
        const b = { one: 'one', two: [1, 1], three: 3, four: 4 }
        expect(Object.assign({}, a, objectDiff(a, b))).toEqual(b)
    })
    it('computes diff(A, B) for a general case', () => {
        const a = { one: '1', two: [1, 1], three: 3 }
        const b = { two: [1, 1], three: 3, four: 4 }
        expect(Object.assign({}, a, objectDiff(a, b))).toEqual(b)
    })
})
