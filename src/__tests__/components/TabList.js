/* globals jest, require, test, expect, describe, it, beforeEach */

import React from 'react'
import { shallow } from 'enzyme'
import TabList from '../../components/TabList'

const props = {
    titles: [
        'Main',
        'Links',
    ],
    selected: 0,
    onSelectTab: undefined,
}
const onSelectTab = jest.fn()
props.onSelectTab = onSelectTab

describe('TabList', () => {
    it('renders correctly', () => {
        const tablist = shallow(
            <TabList {...props} />
        )
        expect(tablist.find('div.tabs').length).toEqual(1)
        expect(tablist.find('ul').length).toEqual(1)
        expect(tablist.find('li').length).toEqual(2)
    })
    it('handles selectTab correctly', () => {
        const tablist = shallow(
            <TabList {...props} />
        )
        tablist.find('li').at(1).simulate('click')
        expect(onSelectTab).toBeCalledWith(1)
        tablist.find('li').at(0).simulate('click')
        expect(onSelectTab).toBeCalledWith(0)
    })
})
