import { SELECTOR, ERROR } from '../config.js'

/**
 * @class FinalValidator
 * @constructor
 *
 * @property {HTMLElement} form
 * @property {Number} errors
 */
export class FinalValidator
{
    constructor(form)
    {
        this.form = form

        this.errors = 0
    }

    setTooltip(msg, el, bg, left, top, position = 'beforeend')
    {
        const span = document.createElement('span')

        el.parentElement.style.position = 'relative'

        span.classList.add('error-tip')

        typeof top === 'number'  || (top = el.offsetTop + el.clientHeight + 7)
        typeof left === 'number' || (left = el.offsetLeft)

        span.style.left = `${left}px`
        span.style.top = `${top}px`
        span.textContent = msg

        if (typeof bg === 'string') {
            span.style.backgroundColor = bg
        }

        el.parentElement
            .insertAdjacentElement(
                position,
                span
            )
    }

    /**
     * Checking two numeric ranges for overlap.
     * @param {{min: Number, max: Number}} x
     * @param {{min: Number, max: Number}} y
     * @return {Number}
     */
    overlap(x, y)
    {
        switch (true) {
            case x.min <= y.min && x.max >= y.max:
                return 1
            case x.max < y.min || y.max < x.min:
                return 0
        }

        return (Math.min(x.max, y.max) - Math.max(x.min, y.min)) / (y.max - y.min)
    }

    /**
     * Traversing an array of ranges and sequential verification.
     * @param {{min: Number, max: Number}[]} ranges
     */
    checkOverlapping(ranges)
    {
        for (let i = 0, ln = ranges.length; i < ln; i++) {
            if (this.overlap(ranges[i], ranges[(i + 1) % ln]) > 0) {
                return true
            }
        }
    }

    validate()
    {
        document.querySelectorAll('.error-tip').forEach(tip => tip.remove())

        this.errors = 0

        this.form.querySelectorAll(`li.${SELECTOR.ACCORDION_ITEM}`)
            .forEach(el => {
                let content, baseCharge, extraCharge, bcInput, ecInputs, num, ranges = []

                content = el.querySelector(`.${SELECTOR.ACCORDION_CONTENT}`)
                baseCharge = el.querySelector(`.${SELECTOR.BASE_CHARGE}`)
                extraCharge = el.querySelectorAll(`.${SELECTOR.EXTRA_CHARGE}`)
                bcInput = baseCharge.querySelector('input')

                bcInput.classList.remove('error')
                el.classList.remove('error')

                if (!bcInput.value || isNaN(Number(bcInput.value)) || bcInput.value === '0.00') {
                    this.setTooltip(ERROR.UNSPECIFIED_BASE_CHARGE, bcInput)

                    bcInput.classList.add('error')
                    el.classList.add('error')

                    this.errors++
                }

                if (!extraCharge.length) return

                extraCharge.forEach(ec => {
                    ecInputs = ec.querySelectorAll('input')

                    ecInputs.forEach(c => c.classList.remove('error'))

                    const range = {}

                    if (!ecInputs[0].value || isNaN(num = Number(ecInputs[0].value)) || num <= 0) {
                        this.setTooltip(ERROR.UNSPECIFIED_WEIGHT, ecInputs[0])

                        ecInputs[0].classList.add('error')
                        el.classList.add('error')

                        this.errors++
                    }

                    range.min = num

                    if (!ecInputs[1].value || isNaN(num = Number(ecInputs[1].value)) || num <= 0) {
                        this.setTooltip(ERROR.UNSPECIFIED_WEIGHT, ecInputs[1])

                        ecInputs[1].classList.add('error')
                        el.classList.add('error')

                        this.errors++
                    }

                    range.max = num

                    if (!ecInputs[2].value || isNaN(num = Number(ecInputs[2].value)) || num === 0) {
                        this.setTooltip(ERROR.UNSPECIFIED_EXTRA_CHARGE, ecInputs[2])

                        ecInputs[2].classList.add('error')
                        el.classList.add('error')

                        this.errors++
                    }

                    ranges.push(range)
                })

                if (extraCharge.length < 2) return

                if (this.checkOverlapping(ranges)) {
                    this.setTooltip(
                        ERROR.WEIGHT_RANGES_OVERLAP,
                        content,
                        'rgba(0,210,240,.7)',
                        5,
                        3,
                        'afterbegin'
                    )
                }
            })

        return this.errors <= 0
    }
}
