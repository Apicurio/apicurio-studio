/**
 * Clones an object by stringifying it and then parsing it.  Not efficient
 * but effective.  Use sparingly.
 * @param object
 */
export function cloneObject(object: any): any {
    return JSON.parse(JSON.stringify(object));
}

/**
 * Function to search a JS object for a property value that matches a criteria (from) and
 * replaces it with a new value (to);
 * @param object
 * @param from
 * @param to
 */
export function propertyReplace(object: any, from: string, to: string): void {
    Object.keys(object).forEach(key => {
        const value: any = object[key];
        if (typeof value === "object") {
            propertyReplace(value, from, to);
        } else if (value === from) {
            object[key] = to;
        }
    });
}
