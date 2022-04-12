import { VALIDATOR } from '../config.js'
import { Emitter } from './utils.js'

/**
 * @class RuntimeValidator Form validator
 * @constructor
 *
 * @property {HTMLInputElement} input
 * @property {Array<{id: String, validator: (Function|String), message: ?String}>} rules
 * @property {Array<{id: String, message: ?String}>} errors
 */
export class RuntimeValidator extends Emitter
{
    static SUCCESS = 'success'
    static ERROR = 'error'

    static ON_ENTRY = 1
    static ON_BLUR = 0

    /**
     * @param {HTMLInputElement} input
     * @param {Array<{id: String, validator: (Function|String), message: ?String}>} rules
     * @param {?Number} [validateOn]
     */
    constructor(input, rules, validateOn = null)
    {
        super()

        this.input = input
        this.rules = rules
        this.errors = []

        switch (validateOn) {
            case RuntimeValidator.ON_ENTRY:
                this.validateOnEntry()
                break
            case RuntimeValidator.ON_BLUR:
                this.validateOnBlur()
                break
        }
    }

    validateOnEntry()
    {
        this.input.addEventListener('input', this.validate.bind(this))
    }

    validateOnBlur()
    {
        this.input.addEventListener('blur', this.validate.bind(this))
    }

    validate()
    {
        this.rules.forEach(r => {
            switch (typeof r.validator) {
                case 'function':
                    if (!r.validator(this.input, r.id)) {
                        this.setStatus(r.id, r.message, RuntimeValidator.ERROR)
                    }
                    break
                case 'string':
                    if (!r.validator.test(this.input.value)) {
                        this.setStatus(r.id, r.message, RuntimeValidator.ERROR)
                    }
            }
        })
    }

    setStatus(id, message, status)
    {
        switch (status) {
            case RuntimeValidator.ERROR:
                this.errors.push({ id, message })
                this.emit(VALIDATOR.EVENT.ERROR, this.errors)
                break
            case RuntimeValidator.SUCCESS:
                this.emit(VALIDATOR.EVENT.SUCCESS)
                break
        }
    }
}

/**
 * @class ValidatorRuntimeError
 */
export class RuntimeValidatorError extends Error
{
}
