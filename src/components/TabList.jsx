import React from 'react'
import { getDOMNode } from '../utils/frontend'


class TabList extends React.Component {

    static propTypes = {
        titles: React.PropTypes.array.isRequired,
        selected: React.PropTypes.number.isRequired,
        onSelectTab: React.PropTypes.func.isRequired,
    };

    componentDidMount() {
        // set some tab properties
        this.tabProps = {
            tabList: getDOMNode('ul[role=tablist]'),
            handlerPrev: getDOMNode('button.tabscroll.action-previous'),
            handlerNext: getDOMNode('button.tabscroll.action-next'),
        }
        // check if tabs should be scrollable
        this.checkScroll()
    }
    componentWillUnmount() {
        // destroy scrollable tabs
        this.destroyScroll()
    }
    checkScroll() {
        // Compare viewport and tablist width and init/destroy scrollable tablist
        const widthTabList = this.tabProps.tabList.scrollWidth
        const widthViewport = getDOMNode('#viewport').offsetWidth
        widthTabList > widthViewport ? this.initScroll() : this.destroyScroll()
    }
    initScroll() {
        // inititalize scrollable tabs ...
        // ... set data attributes
        this.tabProps.tabList.setAttribute('data-switch', 'true')
        this.tabProps.tabList.setAttribute('data-switch-offset', 'false')
        this.tabProps.tabList.firstChild.setAttribute('data-switch-reference', 'true')
        // ... bind event handlers
        this.tabProps.handlerPrev.addEventListener('click', this.onSwitch.bind(this.tabProps.tabList, 'previous'), true)
        this.tabProps.handlerNext.addEventListener('click', this.onSwitch.bind(this.tabProps.tabList, 'next'), true)
    }
    destroyScroll() {
        // destroy scrollable tabs (only if they've been scrollable)
        if (this.tabProps.tabList.getAttribute('data-switch') === 'true') {
            this.tabProps.tabList.removeAttribute('data-switch')
            this.tabProps.tabList.removeAttribute('data-switch-offset')
            this.tabProps.handlerPrev.removeEventListener(
                'click',
                this.onSwitch.bind(this.tabProps.tabList, 'previous'),
                true)
            this.tabProps.handlerNext.removeEventListener(
                'click',
                this.onSwitch.bind(this.tabProps.tabList, 'next'),
                true)
        }
    }

    onSwitch = (direction) => {
        // get referencing item
        const fromItem = getDOMNode('ul[role=tablist] > li[data-switch-reference=\'true\']')
        // check scroll direction and do scroll
        if (direction === 'previous' && fromItem.previousSibling) {
            this.doScroll(fromItem, fromItem.previousSibling)
        } else if (direction === 'next' && fromItem.nextSibling) {
            this.doScroll(fromItem, fromItem.nextSibling)
        }
    };

    doScroll = (fromItem, toItem) => {
        // set new reference item
        fromItem.setAttribute('data-switch-reference', 'false')
        toItem.setAttribute('data-switch-reference', 'true')
        // check if previous/next buttons are shown and set attributes
        if (toItem.previousSibling) {
            this.tabProps.tabList.setAttribute('data-switch-offset', 'true')
            this.tabProps.handlerPrev.setAttribute('aria-hidden', 'false')
        } else {
            this.tabProps.tabList.setAttribute('data-switch-offset', 'false')
            this.tabProps.handlerPrev.setAttribute('aria-hidden', 'true')
        }
        if (toItem.nextSibling) {
            this.tabProps.handlerNext.setAttribute('aria-hidden', 'false')
        } else {
            this.tabProps.handlerNext.setAttribute('aria-hidden', 'true')
        }
        // scroll tablist
        this.tabProps.tabList.style.transform = `translateX(${-toItem.offsetLeft}px)`
    };

    render() {
        const { titles, selected, onSelectTab } = this.props
        return (
            <div className="tabs viewport-full-spread">
                <button
                    key="tabscroll-previous"
                    className="tabscroll action-previous icon-only"
                    aria-label="Scroll to previous tab"
                    aria-hidden="true"
                    />
                <ul role="tablist">
                    {titles.map((title, i) => (
                        <li
                            id={`tab${i}`}
                            key={i}
                            role="tab"
                            aria-selected={selected === i}
                            onClick={() => onSelectTab(i)}
                            ><span>{title}</span></li>
                    ))}
                </ul>
                <button
                    key="tabscroll-next"
                    className="tabscroll action-next icon-only"
                    aria-label="Scroll to next tab"
                    aria-hidden="false"
                    />
            </div>
        )
    }
}

export default TabList
