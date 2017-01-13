/* globals require, test, expect, describe, it */

import React from 'react'
import { render } from 'enzyme'
import Breadcrumbs from '../../components/Breadcrumbs'


describe('Breadcrumbs', () => {
    it('renders correctly', () => {
        const props = [
            {
                name: '001',
                path: '/001/',
            },
            {
                name: '002',
                path: '/002/',
            },
        ]
        const breadcrumbs = render(
            <Breadcrumbs breadcrumbs={props} />,
        )
        expect(breadcrumbs.find('li').length).toEqual(2)
    })
})
