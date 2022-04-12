import { EVENT, ERROR } from '../config.js'
import { Emitter } from './utils.js'

/**
 * @class Storage extends Emitter
 * App storage of the base and extra charges.
 */
class Storage extends Emitter
{
    constructor()
    {
        super();

        this.selected = []
    }

    /**
     * @param {{ id: Number, name: String, value: String, extra: Object[] }}
     */
    select({ id, name, value, extra })
    {
        const current = { id, value, extra, name }

        this.selected.push(current)

        this.selected = this.selected.sort((x, y) => x.name.localeCompare(y.name))

        this.emit(EVENT.CHANGED, {
            list: this.selected,
            add: true,
            current
        })
    }

    /**
     * @param {{ id: Number }}
     */
    deselect({ id })
    {
        this.selected = this.selected.filter(c => c.id !== id)

        this.emit(EVENT.CHANGED, {
            list: this.selected,
            current: { id },
            add: false
        })
    }

    /**
     * @param {Object} payload
     */
    change(payload)
    {
        const idx = this.selected.findIndex(c => c.id === payload.id)

        if (idx < 0) {
            throw new StorageError(ERROR.COULD_NOT_BE_FOUND)
        }

        this.selected[idx] = payload

        this.emit(EVENT.CHANGED, {
            current: { id: payload.id },
            list: this.selected,
            change: true
        })
    }

    /**
     * @param {Object} payload
     */
    input(payload)
    {
        const idx = this.selected.findIndex(c => c.id === payload.id)

        if (idx < 0) {
            throw new StorageError(ERROR.COULD_NOT_BE_FOUND)
        }

        this.selected[idx] = payload
    }

    /**
     * @param {{ id: Number }}
     * @return {Object}
     */
    get({ id })
    {
        const obj = this.selected.find(c => c.id === id)

        if (!obj) {
            throw new StorageError(ERROR.COULD_NOT_BE_FOUND)
        }

        return obj
    }

    /**
     * @param {{ id: Number, name: String, value: String, extra: Object[] }}
     */
    resolve({ id, name, value, extra })
    {
        this[this.selected.find(c => c.id === id) ? 'deselect' : 'select']({
            id, name, value, extra
        })
    }
}

export const storage = new Storage()

// When the logic becomes more complicated, it is recommended to allocate it into a separate module.
export class StorageError extends Error
{
}
