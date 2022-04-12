import { inputKeyupHandler, inputFocusHandler, inputBlurHandler, searchListClickHandler, saveButtonClickHandler } from './handlers.js'
import { createListItem, createUl, createInput, rebuildSelectedList, showContent } from './dom.js'
import { addBtnTune, toggleSearchListBtn, toggleScreen } from './utils.js'

import { FinalValidator } from './final-validator.js'
import { URL, EVENT, SELECTOR } from '../config.js'
import { storage } from './storage.js'

/**
* todo: Web Components - as an option for further refactoring.
*/
(async function() {
    try {

        let /* Application Scope Variables */

            /** @type {Object[]}       */ zoneList,
            /** @type {HTMLElement[]}  */ nodeList,
            /** @type {HTMLElement}    */ selected,
            /** @type {HTMLElement}    */ empty,
            /** @type {HTMLElement}    */ input,
            /** @type {HTMLElement}    */ list,
            /** @type {HTMLElement}    */ save

        /**
         * @notice If there would be more network requests, allocate to a separate API module.
         */
        zoneList = await fetch(URL).then(response => response.json())
        nodeList = zoneList.map(createListItem(addBtnTune))

        ;[selected, save, empty] = showContent(
            list = createUl(nodeList, searchListClickHandler(() => {
                list.classList.add('active')
                input.focus()
            })),

            input = createInput(SELECTOR.SEARCH_INPUT, {
                keyup: inputKeyupHandler(nodeList),
                focus: inputFocusHandler(list, 0),
                blur: inputBlurHandler(list, 90)
            })
        )

        storage.on(EVENT.CHANGED, ({ add, change, list, current: { id } }) => {
            toggleScreen(selected, empty, save, list)

            rebuildSelectedList(list, selected)

            if (!change) {
                toggleSearchListBtn(id, nodeList, add)
            }
        })

        saveButtonClickHandler(
            new FinalValidator(selected),
            save
        )

    } catch (e) {

        // Application-level error handling :)
        console.error(e.message)
    }
})()
