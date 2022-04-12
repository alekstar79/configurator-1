import { delBtnTune, findElement, findActiveListItem, safeSum, Cost, MediaTracker } from './utils.js'
import { selectedListClickHandler } from './handlers.js'

import { SELECTOR, PHRASE, BASE_CHARGE_VALUE, DOTS_PATTERN, SCREEN } from '../config.js'
import { storage } from './storage.js'

import {

    setBaseChargeValidator,
    setChargeValueValidator,
    setMaxWeightValidator,
    setMinWeightValidator,
    fitNumber

} from './validators.js'

const createDomElements = entities => entities.map(tag => document.createElement(tag)),

    extraChargeTmpl = document.getElementById(SELECTOR.EXTRA_CHARGE_BLOCK),
    mainWindowTmpl = document.getElementById(SELECTOR.MAIN_WINDOW),

    media = new MediaTracker(SCREEN.MIN_WIDTH)

/**
 * Handler for entering value of the base charge in the input field.
 * @param {{ id: Number, value: Number }}
 */
function setBaseChargeValue({ id, value })
{
    const data = storage.get({ id })

    data.value = value

    storage.input(data)
}

/**
 * Handler for entering value of the extra charge in the input field.
 * @param {{ id: Number, idx: Number, fid: String, value: Number }}
 */
function setExtraChargeValue({ id, idx, fid, value })
{
    const data = storage.get({ id })

    data.extra[idx][fid] = value

    storage.input(data)
}

/**
 * To wrap the children of an element.
 * @param {HTMLElement} el
 * @param {String[]} elClasses
 * @param {String[]} wrapClasses
 * @return {HTMLElement}
 */
function wrapChildren(el, elClasses = [], wrapClasses = [])
{
    const [wrapper] = createDomElements(['div']),
        children = el.querySelectorAll('*')

    children.forEach(wrapper.appendChild, wrapper)
    wrapper.classList.add(...wrapClasses)

    el.insertAdjacentElement('afterbegin', wrapper)
    el.classList.add(...elClasses)

    return el
}

/**
 * Wrap an element in to form
 * @param {HTMLElement} el
 * @param {String[]} classes
 * @return {HTMLFormElement}
 */
function wrapIntoForm(el, classes = [])
{
    const [form] = createDomElements(['form'])

    form.classList.add(...classes)
    form.setAttribute('novalidate', '')
    form.appendChild(el)

    return form
}

/**
 * Creating a simple ul element.
 * @param {{ id, name }} cost
 * @param {String} [className]
 * @return {HTMLLIElement}
 */
function createNoopItem(cost, className)
{
    const [span, li] = createDomElements(['span','li'])

    li.insertAdjacentElement('afterbegin', span)
    li.dataset.id = cost.id

    span.textContent = cost.name
    span.classList.add('title')

    if (className) {
        li.classList.add(className)
    }

    return li
}

/**
 * Auxiliary function for finding root nodes extra-charge
 * @param {Element|Node} el
 * @return {NodeList}
 */
function listExtras(el)
{
    return findElement(SELECTOR.ACCORDION_CONTENT, el).querySelectorAll('div + div')
}

/**
 * Cloning content for a base charge item from the selected list.
 * @param {{ id, value }} cost
 * @param {HTMLElement} el
 * @return {Node}
 */
function cloneBaseChargeContent(cost, el)
{
    let li, lock, extra = [], _target = el.cloneNode(true)

    if (_target instanceof HTMLInputElement) {
        _target.value = fitNumber(cost.value, 2)
        _target.pattern = DOTS_PATTERN
        _target.autofocus = true

        setBaseChargeValidator(_target)

        function keyUpHandler({ target = _target })
        {
            if (lock) return

            lock = true

            extra.length || (extra = listExtras(target))

            li = findElement('list-item', target)
            li.querySelectorAll('.error-tip').forEach(e => e.remove())
            li.classList.remove('error')

            target.value = target.value.replace(/[^\d.]/, '')
            target.classList.remove('error')

            _target = target

            extra.forEach(el => {
                const span = el.querySelector(`.${SELECTOR.TOTAL_COST}`),
                    input = el.querySelectorAll('input')[2]

                span.textContent = safeSum(input.value, target.value)
            })

            setBaseChargeValue({
                value: fitNumber(target.value, 2),
                id: cost.id
            })

            lock = false
        }
        function handleMediaChange(e)
        {
            if (!e.matches) return

            keyUpHandler({})
        }

        _target.addEventListener('keyup', keyUpHandler)

        media.setHandler(handleMediaChange)
    }
    if (_target instanceof HTMLButtonElement) {
        _target.dataset.id = cost.id
    }

    return _target
}

/**
 * Creating the structure and data for the base charge element in the selected list.
 * @param {Number|String} value
 * @return {HTMLElement[]}
 */
export function createBaseChargeContent(value)
{
    const [input, button, span] = createDomElements(['input','button','span'])

    span.classList.add(SELECTOR.BASE_CHARGE_TITLE)
    span.textContent = PHRASE.BASE_CHARGE_TITLE

    button.classList.add('btn', 'primary', SELECTOR.ADD_EXTRA_CHARGE)
    button.textContent = PHRASE.ADD

    input.classList.add(SELECTOR.FORM_CONTROL, 'col')
    input.value = fitNumber(value, 2)
    input.type = 'text'

    return [span, input, button]
}

/**
 * Handler for the weight input field.
 * @param {HTMLInputElement} target
 * @param {RegExp} regexp
 */
function weightHandler(target, regexp)
{
    const li = findElement('list-item', target)

    target.value = target.value.replace(regexp, '')
    target.classList.remove('error')

    li.querySelectorAll('.error-tip').forEach(e => e.remove())
    li.classList.remove('error')
}

/**
 * Creating the structure and data for the extra charge element in the selected list.
 * @param {{ id }} cost
 * @param {HTMLInputElement} input
 * @param {{ min_weight, max_weight, charge_value }} extra
 * @param {String} idx
 * @return {HTMLElement}
 */
function createAccordionExtraItem(cost, input, extra, idx)
{
    let node, el, btn, span, inputs

    node = extraChargeTmpl.content.cloneNode(true)
    el = node.firstElementChild

    btn = el.querySelector(`.${SELECTOR.DEL_EXTRA_CHARGE}`)
    span = el.querySelector(`.${SELECTOR.TOTAL_COST}`)
    inputs = el.querySelectorAll('input')

    inputs[2].value = fitNumber(extra.charge_value, 2, true)
    inputs[2].pattern = DOTS_PATTERN
    inputs[2].autofocus = true

    inputs[1].value = fitNumber(extra.max_weight, 3)
    inputs[1].pattern = DOTS_PATTERN
    inputs[1].autofocus = true

    inputs[0].value = fitNumber(extra.min_weight, 3)
    inputs[0].pattern = DOTS_PATTERN
    inputs[0].autofocus = true

    setChargeValueValidator(inputs[2])
    setMaxWeightValidator(inputs[1])
    setMinWeightValidator(inputs[0])

    inputs[2].addEventListener('keyup', ({ target }) => {
        weightHandler(target, /([^\d.+-])/)

        setExtraChargeValue({ id: cost.id, idx, fid: 'charge_value', value: fitNumber(target.value, 2, true) })

        span.textContent = safeSum(input.value, target.value)
    })

    inputs[1].addEventListener('keyup', ({ target }) => {
        weightHandler(target, /[^\d.]/)

        setExtraChargeValue({ id: cost.id, idx, fid: 'max_weight', value: fitNumber(target.value, 3) })
    })

    inputs[0].addEventListener('keyup', ({ target }) => {
        weightHandler(target, /[^\d.]/)

        setExtraChargeValue({ id: cost.id, idx, fid: 'min_weight', value: fitNumber(target.value, 3) })
    })

    span.textContent = safeSum(input.value, extra.charge_value)

    btn.dataset.id = cost.id
    btn.dataset.idx = idx

    return el
}

/**
 * Creating a list item.
 * @param {Function} btnTune
 * @param {String[]} classNames
 * @return {Function}
 */
export function createListItem(btnTune, classNames = [SELECTOR.LIST_ITEM])
{
    return function(cost) {
        cost = new Cost(cost)

        const [btn] = createDomElements(['button']),
            li = createNoopItem(cost)

        btn.dataset.value = cost.value
        btn.dataset.extra = cost.extra
        btn.dataset.name = cost.name
        btn.dataset.id = cost.id

        btnTune(btn)

        li.insertAdjacentElement('beforeend', btn)
        li.classList.add(...classNames)

        return li
    }
}

/**
 * Creating an accordion (selected) list item.
 * @param {HTMLElement[]} [content]
 * @param {?Number} activeId
 * @return {Function}
 */
export function createAccordionItem(content = [], activeId)
{
    let li, input, fabric = createListItem(delBtnTune, [SELECTOR.ACCORDION_ITEM, SELECTOR.LIST_ITEM])

    return function(cost) {
        li = fabric(cost)
        li = wrapChildren(li, [SELECTOR.DIRECTION_COLUMN], [SELECTOR.ACCORDION_TITLE])

        const [cont, wrap] = createDomElements(['div','div'])

        cont.classList.add(SELECTOR.ACCORDION_CONTENT)
        wrap.classList.add(SELECTOR.BASE_CHARGE)

        content.map(cloneBaseChargeContent.bind(null, cost))
            .forEach(wrap.appendChild, wrap)

        cont.appendChild(wrap)

        input = wrap.querySelector('input')

        cost.extra.map(createAccordionExtraItem.bind(null, cost, input))
            .forEach(cont.appendChild, cont)

        li.insertAdjacentElement('beforeend', cont)

        if (activeId && activeId === cost.id) {
            li.classList.add('active')
        }

        return li
    }
}

/**
 * Creating a DOM node (ul) list.
 * @param {HTMLElement[]} nodeList
 * @param {Function} [handler]
 * @param {String[]} classNames
 * @param {Boolean} [form]
 * @return {HTMLElement}
 */
export function createUl(nodeList, handler, classNames = [SELECTOR.REGIONS_LIST], form = false)
{
    let [ul] = createDomElements(['ul'])

    nodeList.forEach(ul.appendChild, ul)

    ul.classList.add(...classNames)

    if (typeof handler === 'function') {
        ul.addEventListener('click', handler)
    }
    if (form) {
        ul = wrapIntoForm(ul, ['needs-validation'])
    }

    return ul
}

/**
 * Creating an input field element for the search.
 * @param {String} className
 * @param {Object} handlers
 * @return {HTMLInputElement}
 */
export function createInput(className, handlers = {})
{
    const [input] = createDomElements(['input'])

    Object.keys(handlers).forEach(e => input.addEventListener(e, handlers[e]))

    input.classList.add(className, SELECTOR.FORM_CONTROL)
    input.setAttribute('placeholder', PHRASE.SEARCH)
    input.setAttribute('type', 'text')

    return input
}

/**
 * The main function for rendering the app interface in the DOM.
 * @param {HTMLUListElement} list
 * @param {HTMLInputElement} input
 * @return {Array<HTMLElement|Element>}
 */
export function showContent(list, input)
{
    let node, main, selected, search, save, empty

    node = mainWindowTmpl.content.cloneNode(true)
    main = node.firstElementChild

    selected = main.querySelector(`#${SELECTOR.SELECTED_TARIFF_ZONES}`)
    search = main.querySelector(`#${SELECTOR.SEARCH_TARIFF_ZONES}`)
    save = main.querySelector(`.${SELECTOR.BTN_SAVE_CHANGES}`)

    empty = main.querySelector(`#${SELECTOR.EMPTY_BLOCK}`)

    search.insertAdjacentElement('afterbegin', input)
    search.appendChild(list)

    document.body.appendChild(node)

    return [selected, save, empty]
}

/**
 * Rebuilding the selected list.
 * @param {Object[]} data
 * @param {HTMLElement} selected
 */
export function rebuildSelectedList(data, selected)
{
    const id = findActiveListItem(selected),
        list = data.map(createAccordionItem(createBaseChargeContent(BASE_CHARGE_VALUE), id)),
        ulNode = createUl(list, selectedListClickHandler, [
            SELECTOR.SELECTED_LIST,
            SELECTOR.ACCORDION

        ], true)

    selected.innerHTML = ''
    selected.appendChild(ulNode)
}
