/* globals require, jest, expect, describe, it, beforeEach */

import Response from '../../connectors/Response'

const req = {}


describe('Response', () => {
    it('works correctly', () => {
        const response = new Response(req)
        expect(1).toEqual(1)
    })
    /* FIXME (Vaclav): Please complete the tests – I could not think of any
    useful test patterns with this one. */
})
