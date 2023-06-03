/**
 * Get an element by id
 * @param id The id of the element
 * @type T The type of the HTMLElement
 * @returns The element with the given id, or null if it doesn't exist
 */
export function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return <T>document.getElementById(id);
}
