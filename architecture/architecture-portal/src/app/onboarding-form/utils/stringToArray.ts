/* istanbul ignore file */

export const stringToArray = (values: string, removeSpaces: boolean) => {
    let valuesArray = []
    if (removeSpaces) {
        valuesArray = values
            .replaceAll(' ', '')
            .replaceAll(',,', ',')
            .split(',')
            .filter(value => value !== '')
            .sort()
    } else {
        valuesArray = values
            .replaceAll(',,', ',')
            .split(',')
            .map(s => s.trim())
            .filter(value => value !== '')
            .sort()
    }
    return valuesArray
}
