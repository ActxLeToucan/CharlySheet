/**
 * Try get the slot dom object from a given child element.
 * @param {HTMLElement} dom Child element from where to start seach
 * @returns The first parent dom element found corresponding to a document slot.
 * If not, returns null
 */
export function tryGetDomSlot(dom) {
    // console.log('tryGetDomSlot', dom);
    // console.trace();
    let loops = 5;
    while (dom && dom.classList && !dom.classList.contains('comp-sheetslot') && loops > 0) {
        // console.log('tryGetDomSlot', dom);
        dom = dom.parentElement;
        loops--;
    }
    // console.log('tryGetDomSlot-res', dom)
    return loops > 0 ? dom : null;
}
