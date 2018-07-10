/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class Base64Utils {

    /**
     * Converts from UTF8 to Base64 with support for Unicode.
     */
    public static encode(str: string): string {
        if (window
            && "btoa" in window
            && "encodeURIComponent" in window) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode(("0x" + p1) as any);
            }));
        } else {
            console.warn("[Base64Utils] Base64Utils.encode requirements: window.btoa and window.encodeURIComponent functions");
            return null;
        }

    }

    /**
     * Converts from Base64 to UTF8 with support for Unicode.
     */
    public static decode(str: string): string {
        if (window
            && "atob" in window
            && "decodeURIComponent" in window) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""));
        } else {
            console.warn("[Base64Utils] b64DecodeUnicode requirements: window.atob and window.decodeURIComponent functions");
            return null;
        }
    }

}

export class ArrayUtils {

    /**
     * Returns the intersection of two arrays.
     * @param a1
     * @param a2
     */
    public static intersect(a1: any[], a2: any[]): any[] {
        let rval: any[] = [];
        for (let item of a1) {
            if (ArrayUtils.contains(a2, item)) {
                rval.push(item);
            }
        }
        return rval;
    }

    /**
     * Returns true if the given item is contained in the given array.
     * @param a
     * @param item
     * @return
     */
    public static contains(a: any[], item: any): boolean {
        for (let aitem of a) {
            if (aitem === item) {
                return true;
            }
        }
        return false;
    }

}

export class ObjectUtils {

    public static isNullOrUndefined(object: any): boolean {
        return object === undefined || object === null;
    }

    public static objectEquals(x:any, y:any) {
        if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
        // after this just checking type of one would be enough
        if (x.constructor !== y.constructor) { return false; }
        // if they are functions, they should exactly refer to same one (because of closures)
        if (x instanceof Function) { return x === y; }
        // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
        if (x instanceof RegExp) { return x === y; }
        if (x === y || x.valueOf() === y.valueOf()) { return true; }
        if (Array.isArray(x) && x.length !== y.length) { return false; }

        // if they are dates, they must had equal valueOf
        if (x instanceof Date) { return false; }

        // if they are strictly equal, they both need to be object at least
        if (!(x instanceof Object)) { return false; }
        if (!(y instanceof Object)) { return false; }

        var p = Object.keys(x);
        return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
            p.every(function (i) { return ObjectUtils.objectEquals(x[i], y[i]); });
    }

}

export class HttpUtils {

    public static parseLinkHeader(header: string): any {
        let links: any = new Object();
        if (ObjectUtils.isNullOrUndefined(header)) {
            return links;
        }
        if (header.length === 0) {
            return links;
        }

        // Split parts by comma
        let parts: string[] = header.split(',');

        // Parse each part into a named link
        parts.forEach( part => {
            var section = part.split(';');
            if (section.length == 2) {
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = url;
            }
        });

        return links;
    }

}