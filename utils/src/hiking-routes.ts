/**
 * Translates an ```HikingRouteDifficulty``` into a string.
 *
 * @export
 * @param {HikingRouteDifficulty} x
 * @returns {string}
 */
export function HikingRouteDifficultyToString(x: number): string {
    switch (x) {
        case 1:
            return 'Einfach';
        case 2:
            return 'Mittel';
        case 3:
            return 'Experte';
        default:
            return 'unbekannt';
    }
}
