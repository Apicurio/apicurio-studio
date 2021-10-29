/**
 * @license
 * Copyright 2020 Red Hat
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

export function componentTypeToString(type: ComponentType): string {
    switch (type) {
        case ComponentType.schema:
            return "schema";
        case ComponentType.response:
            return "response";
        case ComponentType.parameter:
            return "parameter";
        case ComponentType.header:
            return "header";
        case ComponentType.requestBody:
            return "requestBody";
        case ComponentType.callback:
            return "callback";
        case ComponentType.example:
            return "example";
        case ComponentType.securityScheme:
            return "securityScheme";
        case ComponentType.link:
            return "link";
        case ComponentType.messageTrait:
            return "messageTrait";
        case ComponentType.message:
            return "message";
    }
    return "n/a";
}

export enum ComponentType {
    schema, response, parameter, header, requestBody, callback, example, securityScheme, link, messageTrait,
    message,
}
