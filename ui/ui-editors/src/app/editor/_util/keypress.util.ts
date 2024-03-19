/**
 * @license
 * Copyright 2019 Red Hat
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

export class KeypressUtils {

    /**
     * Returns true if the given keyboard event is for pressing the Escape key on the keyboard.
     * @param event
     * @param allowModifiers
     */
    public static isEscapeKey(event: KeyboardEvent, allowModifiers: boolean = true): boolean {
        if (event.key === "Escape" || event.keyCode === 27) {
            return allowModifiers || (!event.metaKey && !event.altKey && !event.ctrlKey);
        }
        return false;
    }

    /**
     * Returns true if the given keyboard event is from pressing the Enter key.
     * @param event
     */
    public static isEnterKey(event: KeyboardEvent): boolean {
        return event.key === "Enter" || event.keyCode === 10 || event.keyCode === 13;
    }


    /**
     * Returns true if the given keyboard event is from pressing the Enter key.
     * @param event
     */
    public static isCtrlEnterKey(event: KeyboardEvent): boolean {
        return event.ctrlKey && KeypressUtils.isEnterKey(event);
    }

    /**
     * Returns true if the given keyboard event is an UpArrow keypress.
     * @param event
     */
    public static isUpArrow(event: KeyboardEvent): boolean {
        return event.key === "ArrowUp" || event.keyCode === 38;
    }

    /**
     * Returns true if the given keyboard event is a DownArrow keypress.
     * @param event
     */
    public static isDownArrow(event: KeyboardEvent): boolean {
        return event.key === "ArrowDown" || event.keyCode === 40;
    }

}
