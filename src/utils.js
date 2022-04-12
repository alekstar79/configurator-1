import { SELECTOR, PHRASE, ERROR, SCREEN, CONSOLE, LOCALE } from '../config.js'

let debounceTimeout

/**
 * @class Emitter Event emitter.
 */
export class Emitter
{
    constructor()
    {
        this.events = {}
    }

    on(id, fn)
    {
        (this.events[id] = this.events[id] || []).push(fn)
    }

    emit(id, ...data)
    {
        (this.events[id] || []).forEach(fn => fn(...data))
    }
}

/**
 * @class Enum Emulation of an enumerated type class.
 */
export class Enum
{
    constructor(obj)
    {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                this[prop] = prop
            }
        }

        Object.freeze(this)
    }

    determine(entity)
    {
        const obj = {}

        for (const prop in this) {
            if (this.hasOwnProperty(prop)) {
                obj[prop] = prop === entity
            }
        }

        return obj
    }
}

/**
 * @class Cost Encapsulation of the cost structure in a class.
 */
export class Cost
{
    static entry = { value: '320.00', extra: [], id: null, name: null }

    constructor(data)
    {
        let set, entity

        for (entity of Object.keys(Cost.entry)) {
            set = data[entity] || Cost.entry[entity]

            if (entity === 'extra') {
                set = JSON.stringify(set)
            }

            this[entity] = set
        }
    }
}

/**
 * @class MediaTracker A simple Media queries tracker.
 */
export class MediaTracker
{
    constructor(width)
    {
        this.maxWidth = window.matchMedia(`(max-width: ${width - 1}px)`)
        this.minWidth = window.matchMedia(`(min-width: ${width + 1}px)`)
    }

    setHandler(handler)
    {
        if (typeof handler !== 'function') {
            throw new Error(ERROR.MISMATCH_OF_TYPES)
        }

        this.maxWidth.addEventListener('change', handler)
        this.minWidth.addEventListener('change', handler)
    }
}

/**
 * @class Adapter
 */
export class Adapter
{
    /**
     * Transformation of storage data according to the scheme.
     * @param {Object} data
     * @return {{rate_area_id: Number, base_charge_value: Number, extra_charges: Object[]}[]}
     */
    static perform(data)
    {
        return data.selected.map(cost => ({
            rate_area_id: cost.id,

            base_charge_value: cost.value,

            extra_charges: cost.extra.map(extra => ({
                charge_value: extra.charge_value,
                min_weight: extra.min_weight,
                max_weight: extra.max_weight
            }))
        }))
    }
}

/**
 * Printing data to the console, according to the requirements.
 * @param {?Array<Object>} data
 */
export function display(data)
{
    if (!data) return

    const walkArray = (arr, p) => arr.map(printObject.bind(null, p)),
        print = str => console.log(`%c${str}`, CONSOLE.STYLE),

        now = new Date(),

        date = now.toLocaleDateString(LOCALE),
        time = now.toLocaleTimeString(LOCALE)

    function printObject(p, obj, i, a)
    {
        const c = i < a.length - 1 ? ',' : ''

        print(`${' '.repeat(p)}{`)

        Object.entries(obj).forEach(([k, v]) => {
            switch (true) {
                case !Array.isArray(v):
                    print(`${' '.repeat(p + 2)}${k}: ${v},`)
                    break
                case !v.length:
                    print(`${' '.repeat(p + 2)}${k}: [],`)
                    break

                default:
                    print(`${' '.repeat(p + 2)}${k}: [`)
                    walkArray(v, p + 4)
                    print(`${' '.repeat(p + 2)}],`)
            }
        })

        print(`${' '.repeat(p)}}${c}`)
    }

    console.group(`%c${CONSOLE.TITLE}${date} ${time}`, CONSOLE.STYLE)
    walkArray(data, 0)
    console.groupEnd()
}

/**
 * Simple debounce function.
 * @param {Function} fn
 * @param {Number} ms
 * @return {Function}
 */
export function debounce(fn, ms = 9)
{
    return function(...args) {
        debounceTimeout && clearTimeout(debounceTimeout)

        debounceTimeout = setTimeout(() => {
            fn.apply(this, args)
        }, ms)
    }
}

/**
 * Safe summation using eval.
 * Eval is evil, I can dispute this statement. The use here is due to the desire to simplify logic,
 * and not to develop a parser of math expression.
 * @param {String|Number} x
 * @param {String|Number} y
 * @param {String} postfix
 * @return {String}
 */
export function safeSum(x, y, postfix = ' ₽')
{
    const prefix = window.innerWidth > SCREEN.MIN_WIDTH ? PHRASE.TOTAL_COST : ''

    try {

        return prefix + eval(`${x} + ${y}`) + postfix
    } catch (e) {
        return prefix + (x || '0') + postfix
    }
}

/**
 * Tuning of the add button.
 * @param {HTMLButtonElement} btn
 */
export function addBtnTune(btn)
{
    btn.classList.add('btn', SELECTOR.ADD)
    btn.textContent = PHRASE.ADD
}

/**
 * Tuning of the delete button.
 * @param {HTMLButtonElement} btn
 */
export function delBtnTune(btn)
{
    btn.classList.add('btn', SELECTOR.DEL)
    btn.textContent = PHRASE.DEL
}

/**
 * Toggling the active accordion tab.
 * @param {HTMLElement} target
 * @param {Object} types
 */
export function toggleAccordion(target, types)
{
    let isActive, elements, node = target

    switch (true) {
        case types.SPAN:
            node = target.parentElement.parentElement
            break
        case types.DIV:
            node = target.parentElement
            break
    }

    elements = node.parentElement.querySelectorAll('li')
    isActive = node.classList.contains(SELECTOR.ACTIVE)

    for (const li of elements) {
        li.classList.remove(SELECTOR.ACTIVE)
    }

    isActive || node.classList.add(SELECTOR.ACTIVE)
}

/**
 * Toggling the buttons in the search list.
 * @param {Number} id
 * @param {HTMLElement[]} list
 * @param {Boolean} isAdd
 */
export function toggleSearchListBtn(id, list, isAdd)
{
    list.some(el => {
        if (+el.dataset.id !== id) return false

        const btn = el.querySelector('button')

        btn.textContent = isAdd ? PHRASE.DEL : PHRASE.ADD

        btn.classList.toggle(SELECTOR.ADD)
        btn.classList.toggle(SELECTOR.DEL)

        return true
    })
}

/**
 * Switching the application state.
 * @param {HTMLElement} selected
 * @param {HTMLElement} empty
 * @param {HTMLElement} save
 * @param {Object[]} list
 */
export function toggleScreen(selected, empty, save, list)
{
    const active = !!list.length

    const rem = SELECTOR[active ? 'HIDE_BLOCK' : 'SHOW_BLOCK']
    const add = SELECTOR[active ? 'SHOW_BLOCK' : 'HIDE_BLOCK']

    selected.classList.remove(rem)
    selected.classList.add(add)
    empty.classList.remove(add)
    empty.classList.add(rem)

    save.disabled = !active
}

/**
 *  Searching for the active item in the selected list.
 * @param {HTMLUListElement} selected
 * @return {?Number}
 */
export function findActiveListItem(selected)
{
    let id = null

    if (!selected) return id

    ;[...selected.querySelectorAll('li')].some(el => {
        if (!el.classList.contains('active')) return false

        id = +el.dataset.id

        return true
    })

    return id
}

/**
 * Searching for an element by selector in parent elements.
 * @param {String} selector
 * @param {Element|Node} el
 * @param {Number} [i]
 * @return {Element}
 */
export function findElement(selector, el, i = 5)
{
    while (!el.classList.contains(selector) && --i) {
        el = el.parentElement
    }

    return el
}
