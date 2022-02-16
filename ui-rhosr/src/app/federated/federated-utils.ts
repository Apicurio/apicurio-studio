/**
 * @license
 * Copyright 2021 Red Hat
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

import {ConfigType, Services} from "../../services";
import {PureComponent} from "../components";

/**
 * Component properties shared by all federated pages.
 */
export interface FederatedComponentProps {
    config: ConfigType;
    history: any;
}

export class FederatedUtils {

    public static updateConfiguration(props: FederatedComponentProps): void {
        Services.getLoggerService().info("[FederatedUtils] Updating config: %o", props.config);
        Services.getConfigService().updateConfig(props.config);
        PureComponent.setHistory(props.history);
    }

}
