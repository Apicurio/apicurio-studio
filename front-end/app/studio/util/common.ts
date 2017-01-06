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
     * @return {boolean}
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