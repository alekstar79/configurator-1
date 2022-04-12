import { debounce, toggleAccordion, display, Enum, Adapter } from './utils.js'
import { SELECTOR, NODE_TYPES, EXTRA } from '../config.js'
import { storage } from './storage.js'

const Types = new Enum(NODE_TYPES)

/**
 * Processing a click on the save button.
 * @param {FinalValidator} validator
 * @param {HTMLButtonElement} btn
 */
export function saveButtonClickHandler(validator, btn)
{
    btn.addEventListener('click', () => {
        if (validator.validate()) {
            display(Adapter.perform(storage))
        }
    })
}

/**
 * Handler for the click on the add extra charge button.
 * @param {HTMLElement} target
 */
function addExtraChargeBlock({ target })
{
    const data = storage.get({ id: +target.dataset.id })

    data.extra.push({
        charge_value: EXTRA.CHARGE_VALUE,
        min_weight: EXTRA.MIN_WEIGHT,
        max_weight: EXTRA.MAX_WEIGHT
    })

    storage.change(data)
}

/**
 * Handler for the click on the del extra charge button.
 * @param {HTMLElement} target
 */
function removeExtraChargeBlock({ target })
{
    const data = storage.get({ id: +target.dataset.id })

    data.extra.splice(+target.dataset.idx, 1)

    storage.change(data)
}

/**
 * Input handler for the search field.
 * @param {HTMLElement[]} list
 * @param {Number} [timeout]
 * @return {Function}
 */
export function inputKeyupHandler(list, timeout = 0)
{
    let filter

    return debounce(({ target }) => {
        filter = target.value.toLowerCase()

        list.forEach(item => item.style.display = item.textContent.toLowerCase().includes(filter) ? '' : 'none')

    }, timeout)
}

/**
 * Focus handler for the search field.
 * @param {HTMLElement} el
 * @param {Number} timeout
 * @return {Function}
 */
export function inputFocusHandler(el, timeout)
{
    return debounce(() => el.classList.add(SELECTOR.ACTIVE), timeout)
}

/**
 * Blur handler for the search field.
 * @param {HTMLElement} el
 * @param {Number} timeout
 * @return {Function}
 */
export function inputBlurHandler(el, timeout)
{
    return debounce(() => el.classList.remove(SELECTOR.ACTIVE), timeout)
}

/**
 * Handler for clicks on search list.
 * @param {Function} handler
 * @return {Function}
 */
export function searchListClickHandler(handler)
{
    return ({ target }) => {
        handler()

        if (!Types.determine(target.tagName).BUTTON) return

        storage.resolve({
            extra: JSON.parse(target.dataset.extra),
            value: target.dataset.value,
            name: target.dataset.name,
            id: +target.dataset.id
        })
    }
}

/**
 * Handler for clicks on selected list.
 * @param {Event}
 */
export function selectedListClickHandler({ target })
{
    const types = Types.determine(target.tagName)

    if (!types.BUTTON) {
        return toggleAccordion(target, types)
    }

    switch (true) {
        case target.classList.contains(SELECTOR.ADD_EXTRA_CHARGE):
            addExtraChargeBlock({ target })
            break
        case target.classList.contains(SELECTOR.DEL_EXTRA_CHARGE):
            removeExtraChargeBlock({ target })
            break

        default: storage.resolve({
            extra: JSON.parse(target.dataset.extra),
            value: target.dataset.value,
            name: target.dataset.name,
            id: +target.dataset.id
        })
    }
}
