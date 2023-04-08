/**
 * Check if the device is touch enabled
 * @returns {boolean} True if the device is touch enabled, otherwise false
 */
export function isTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
