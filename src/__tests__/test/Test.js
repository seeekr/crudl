/* globals require, jest, expect, describe, it, console */
/* eslint-disable no-console, max-len, newline-per-chained-call */

import React from 'react'
import { shallow, mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import MainView, { TestView } from './TestView.jsx'
import Footer from './TestFooter.jsx'

/* MOCK STORE */
const initialState = {
    loggedIn: false,
}
const mockStore = configureStore()
const store = mockStore(initialState)

/* PROPS */
const testviewProps = {
    desc: {
        title: 'Test title',
    },
    loggedIn: true,
    onClicked: undefined,
}
const onClicked = jest.fn()
testviewProps.onClicked = onClicked


describe('TestView (Enzyme)', () => {
    it('renders', () => {
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* structure */
        expect(testview.find('main').length).toEqual(1)
        expect(testview.find('Header').length).toEqual(1)
        expect(testview.find('div#header-toolbar').length).toEqual(1)
        expect(testview.find('div#header-title').length).toEqual(1)
        /* at */
        expect(testview.find('div#header-title').at(0).text()).toEqual('Test title')
        expect(testview.find('Header').at(0).props().children.length).toEqual(2)
        /* childAt */
        expect(testview.find('Header').childAt(0).text()).toEqual('Toolbar')
        /* children */
        expect(testview.find('Header').children().length).toEqual(2)
        /* closest, contains */
        /* debug */
        console.log(testview.debug())
        /* equals, every, everyWhere */
        /* filter, filterWhere */
        expect(testview.find('div').filter('#header-title').at(0).text()).toEqual('Test title')
        /* find, findWhere */
        /* first */
        expect(testview.find('div').first().text()).toEqual('Toolbar')
        /* forEach */
        testview.find('Header div').forEach((node) => {
            expect(node.hasClass('headeritem')).toEqual(true)
        })
        /* get(index) */
        expect(testview.find('Header div').get(0).props.id).toEqual('header-toolbar')
        /* hasClass(className) */
        expect(testview.find('Header div').at(0).hasClass('headeritem')).toEqual(true)
        /* html() */
        expect(testview.find('Header div').at(0).html()).toEqual('<div id="header-toolbar" class="headeritem">Toolbar</div>')
        /* is(selector) */
        expect(testview.is('#test')).toEqual(true)
        /* key() */
        /* last() */
        expect(testview.find('Header div').last().text()).toEqual('Test title')
        /* map(fn) */
        const texts = testview.find('div.headeritem').map(node => node.text())
        expect(texts).toEqual(['Toolbar', 'Test title'])
        /* isEmpty() */
        /* matchesElement(node) */
        /* name() */
        expect(testview.name()).toEqual('main')
        expect(testview.find('Header').name()).toEqual('Header')
        /* not(selector) */
        /* parent() */
        expect(testview.find('div').at(0).parent().is('Header')).toEqual(true)
        /* parents() */
        expect(testview.find('div').at(0).parents().length).toEqual(2)
        /* reduce(fn[, initialValue]) */
        /* reduceRight(fn[, initialValue]) */
        /* render() */
        expect(testview.find('Header').render().find('div').length).toEqual(3)
        /* shallow([options])
        when we first render TestView, the Header component is not being fully rendered,
        which can be achieved with using shallow on this component explicietly */
        expect(testview.find('main').shallow().find('Header div').length).toEqual(2)
        expect(testview.find('Header').shallow().find('div').length).toEqual(3)
        /* some(selector) */
        /* someWhere(predicate) */
        /* tap(intercepter) */
        /* text() */
        /* type() */
        /* unmount() */
    })
    it('get and set props with shallow', () => {
        /* shallow returns a wrapper around the rendered output, so there is
        no option to actually retrieve the TestView props here
        FIXME: this is kind of strange */
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        expect(testview.type()).toBe('main')
        /* prop([key]) */
        expect(testview.prop('loggedIn')).toEqual(undefined)
        expect(testview.find('Header').at(0).prop('loggedIn')).toEqual(true)
        expect(testview.find('div').at(0).prop('className')).toEqual('headeritem')
        /* props() */
        expect(testview.props().loggedIn).toEqual(undefined)
        expect(testview.find('Header').at(0).props().loggedIn).toEqual(true)
        expect(testview.find('div').at(0).props().className).toEqual('headeritem')
        /* setProps(nextProps) */
        testview.setProps({ loggedIn: false })
        expect(testview.find('Header').at(0).prop('loggedIn')).toEqual(false)
    })
    it('get and set props with mount', () => {
        /* in contrast to shallow, mount returns the component ... */
        const testview = mount(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        expect(testview.type()).toBe(TestView)
        /* prop([key]) */
        expect(testview.prop('loggedIn')).toEqual(true)
        expect(testview.find('Header').at(0).prop('loggedIn')).toEqual(true)
        expect(testview.find('div').at(0).prop('className')).toEqual('headeritem')
        /* props() */
        expect(testview.props().loggedIn).toEqual(true)
        expect(testview.find('Header').at(0).props().loggedIn).toEqual(true)
        expect(testview.find('div').at(0).props().className).toEqual('headeritem')
        /* setProps(nextProps) */
        testview.setProps({ loggedIn: false })
        expect(testview.prop('loggedIn')).toEqual(false)
        expect(testview.find('Header').at(0).prop('loggedIn')).toEqual(false)
    })
    it('get and set state with shallow', () => {
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* state([key]) */
        expect(testview.state('clickCounter')).toEqual(0)
        expect(testview.find('span#clickcounter').at(0).text()).toEqual('0')
        /* setState(nextState) */
        testview.setState({ clickCounter: 100 })
        expect(testview.state('clickCounter')).toEqual(100)
        expect(testview.find('span#clickcounter').at(0).text()).toEqual('100')
    })
    it('get and set state with mount', () => {
        const testview = mount(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* state([key]) */
        expect(testview.state('clickCounter')).toEqual(0)
        expect(testview.find('span#clickcounter').at(0).text()).toEqual('0')
        /* setState(nextState) */
        testview.setState({ clickCounter: 100 })
        expect(testview.state('clickCounter')).toEqual(100)
        expect(testview.find('span#clickcounter').at(0).text()).toEqual('100')
    })
    it('get and set context', () => {
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* context([key]) */
        /* FIXME: context should not be empty */
        expect(testview.context()).toEqual({})
        /* setContext */
    })
    it('simulate works correctly', () => {
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* simulate(event[, data]) */
        expect(testview.state('clickCounter')).toEqual(0)
        expect(testview.find('span#clickcounter').at(0).text()).toEqual('0')
        testview.find('button').at(0).simulate('click')
        expect(testview.state('clickCounter')).toEqual(1)
        /* re-renders automatically, because we use setState with handleClickCounter */
        expect(testview.find('span#clickcounter').at(0).text()).toEqual('1')
    })
    it('instance works correctly', () => {
        onClicked.mockClear()
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        const inst = testview.instance()
        /* instance() */
        expect(testview.state('clickCounter')).toEqual(0)
        inst.handleClickCounter(true)
        expect(onClicked).not.toBeCalled()
        expect(testview.state('clickCounter')).toEqual(1)
        /* ----- */
        inst.handleClick(inst.props)
        expect(onClicked).toBeCalled()
        expect(testview.state('clickCounter')).toEqual(2)
        /* ----- */
    })
    /* update() */
})

describe('TestView (shallow vs. mount)', () => {
    it('shallow works correctly', () => {
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* shallow just renders the root component (TestView).
        Therefore, with Header only the 2 child elements given with TestView are rendered. */
        expect(testview.find('Header div').length).toEqual(2)
        /* shallow returns a wrapper around render */
        expect(testview.type()).toBe('main')
    })
    it('mount works correctly', () => {
        const testview = mount(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* mount is full DOM rendering.
        Therefore, Header is completely rendered. */
        expect(testview.find('Header div').length).toEqual(3)
        /* mount returns the root component */
        expect(testview.type()).toBe(TestView)
    })
})

describe('TestView (Jest)', () => {
    it('toBeCalled works correctly', () => {
        const testview = shallow(
            <TestView {...testviewProps} />,
            { context: { store, router: {} } }
        )
        /* simulate(event[, data]) */
        expect(testview.state('clickCounter')).toEqual(0)
        testview.find('button').at(0).simulate('click')
        expect(onClicked).toBeCalled()
    })
    /* toBeCalledWith */
    /* toThrow */
    /* toThrowError */
    /* FIXME: test footer (createElement) */
})
