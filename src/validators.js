import { RuntimeValidator, RuntimeValidatorError } from './runtime-validator.js'
import { VALIDATOR, ERROR } from '../config.js'

// SETTERS

export function setValidator(input, rules, validateOn = RuntimeValidator.ON_BLUR)
{
    return new RuntimeValidator(input, rules, validateOn)
}

export function setBaseChargeValidator(input, vid = 'INCORRECT_DATA_ENTRY')
{
    return setValidator(input, [{ id: 'baseChargeValue', validator: baseChargeValidator, message: VALIDATOR.MSG[vid] }])
}

export function setExtraChargeValidator(input, id, validator, vid = 'INCORRECT_DATA_ENTRY')
{
    return setValidator(input, [{ id, validator, message: VALIDATOR.MSG[vid] }])
}

export function setChargeValueValidator(input, vid = 'INCORRECT_DATA_ENTRY')
{
    return setExtraChargeValidator(input, 'extraChargeValue', extraChargeValidator, vid)
}

export function setMinWeightValidator(input, vid = 'INCORRECT_DATA_ENTRY')
{
    return setExtraChargeValidator(input, 'extraMinWeight', extraWeightValidator, vid)
}

export function setMaxWeightValidator(input, vid = 'INCORRECT_DATA_ENTRY')
{
    return setExtraChargeValidator(input, 'extraMaxWeight', extraWeightValidator, vid)
}

// AUXILIARY

const decimalPlacesBefore = x => x.includes('.') ? x.split('.').shift().length : 0
const decimalPlacesAfter = x => x.includes('.') ? x.split('.').pop().length : 0

/**
 * @param {String} source
 * @param {Number} b
 * @param {Number} d
 * @return {String[]}
 */
function splitByDecimal(source, b, d)
{
    if (source.length !== b + d) {
        throw new RuntimeValidatorError(ERROR.RUNTIME_VALIDATION_ERROR)
    }

    return [
        source.substr(0, b),
        source.substr(b, source.length)
    ]
}

// VALIDATORS

/**
 * Fit number to a floating-point string.
 * @param {*} value
 * @param {Number} digits
 * @param {Boolean|String} sign
 * @return {String}
 */
export function fitNumber(value, digits, sign = '')
{
    let b, d, p, n, w, f

    value = value.toString()

    p = value.includes('+')
    n = value.includes('-')

    value = value.replace(/[+\-]/g, '')

    b = decimalPlacesBefore(value)
    d = decimalPlacesAfter(value)

    value = value.replace(/[.]/g, '')

    ;[w, f] = value.split('.', 2)

    if (!f && b) {
        [w, f] = splitByDecimal(w, b, d)
    }
    if (isNaN(w = Number(w))) {
        return `0.${'0'.repeat(digits)}`
    }

    d > digits && (digits = d)

    value = Number([w, f].filter(Boolean).join('.')).toFixed(digits)

    if (typeof sign === 'string' || !sign) {
        return value
    }

    switch (true) {
        case n: sign = '-'; break
        case p: sign = '+'; break

        case Number(value) < 0: sign = '-'; break
        case Number(value) > 0: sign = '+'; break

        default:
            sign = ''
    }

    return `${sign}${
        value.replace(/[+\-]/g, '')
    }`
}

/**
 * The function of checking the value of the base charge.
 * @param {HTMLInputElement} input
 * @return {Boolean}
 */
export function baseChargeValidator(input/*, id */)
{
    if (['','.'].includes(input.value)) {
        input.value = '0.00'
        return false
    }

    input.value = fitNumber(input.value, 2)

    return true
}

/**
 * The function of checking the value of the extra charge.
 * @param {HTMLInputElement} input
 * @return {Boolean}
 */
export function extraChargeValidator(input/*, id */)
{
    if (['','.'].includes(input.value)) {
        input.value = '0.00'
        return false
    }

    input.value = fitNumber(input.value, 2, true)

    return true
}

/**
 * The function of checking the value of the weight.
 * @param {HTMLInputElement} input
 * @return {Boolean}
 */
export function extraWeightValidator(input/*, id */)
{
    if (['','.'].includes(input.value)) {
        input.value = '0.000'
        return false
    }

    input.value = fitNumber(input.value, 3)

    return true
}
