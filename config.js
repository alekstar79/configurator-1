export const URL = 'https://raw.githubusercontent.com/cscart/apply-for-job/master/frontend/developer/files/rate-areas.json'

export const EVENT = { CHANGED: 'changed', VALIDATOR_ERROR: 'validator_error', VALIDATOR_SUCCESS: 'validator_success' }

export const NODE_TYPES = { BUTTON: 1, SPAN: 1, DIV: 1, LI: 1 }

export const LOCALE = 'ru-RU'

export const ERROR = {
    MISMATCH_OF_TYPES: 'The type of the passed argument does not match the function',
    RUNTIME_VALIDATION_ERROR: 'Runtime validation error',
    COULD_NOT_BE_FOUND: 'The object could not be found',
    WEIGHT_RANGES_OVERLAP: 'Диапазоны веса перекрываются',
    UNSPECIFIED_BASE_CHARGE: 'Укажите базовую стоимость',
    UNSPECIFIED_EXTRA_CHARGE: 'Укажите наценку',
    UNSPECIFIED_WEIGHT: 'Не указан вес'
}

export const SELECTOR = {
    EXTRA_CHARGE_BLOCK: 'extra-charge-block',
    MAIN_WINDOW: 'main-window',
    EMPTY_BLOCK: 'empty-block',
    SHOW_BLOCK: 'show',
    HIDE_BLOCK: 'hide',

    SELECTED_TARIFF_ZONES: 'selected-tariff-zones',
    SEARCH_TARIFF_ZONES: 'search-tariff-zones',

    SEARCH_INPUT: 'search-input',

    SELECTED_LIST: 'selected-list',
    REGIONS_LIST: 'regions-list',
    LIST_ITEM: 'list-item',

    BASE_CHARGE: 'base-charge',
    BASE_CHARGE_TITLE: 'base-charge__title',
    ADD_EXTRA_CHARGE: 'add-extra-charge',
    DEL_EXTRA_CHARGE: 'del-extra-charge',
    EXTRA_CHARGE: 'extra-charge',
    TOTAL_COST: 'total-cost',

    ACCORDION: 'accordion',
    ACCORDION_ITEM: 'accordion__item',
    ACCORDION_TITLE: 'accordion__title',
    ACCORDION_CONTENT: 'accordion__content',

    BTN_SAVE_CHANGES: 'save-changes-btn',
    DIRECTION_COLUMN: 'direction-column',
    FORM_CONTROL: 'form-control',
    ACTIVE: 'active',
    ADD: 'add',
    DEL: 'del'
}

export const PHRASE = {
    BASE_CHARGE_TITLE: 'Базовая стоимость доставки, (₽)',
    TOTAL_COST: 'Итоговая стоимость: ',
    SEARCH: 'Поиск...',
    ADD: 'Добавить',
    DEL: 'Удалить'
}

export const CONSOLE = {
    STYLE: 'text-shadow: #a0f9fa 0 0 2px; font-family: monospace; font-size: 1.4em;',
    TITLE: 'Отчет сформирован: '
}

export const VALIDATOR = {
    MSG: {
        INCORRECT_DATA_ENTRY: 'Incorrect data entry'
    },
    EVENT: {
        SUCCESS: EVENT.VALIDATOR_SUCCESS,
        ERROR: EVENT.VALIDATOR_ERROR
    }
}

export const EXTRA = { CHARGE_VALUE: '+50.00', MIN_WEIGHT: '1.000', MAX_WEIGHT: '3.000' }

export const BASE_CHARGE_VALUE = '320.00'

export const DOTS_PATTERN = '(?!\\.|.*\\.$)(?=[^.]*\\.?[^.]*$).{1,10}'

export const SCREEN = { MIN_WIDTH: 491 }
