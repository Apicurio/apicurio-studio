/**
 * @license
 * Copyright 2022 Red Hat
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

import {BaseService} from "../baseService";
import {ContentTypes, RegistryInstance} from "../../models";
import {AuthConfig} from "../config";
import {GetArtifactsCriteria} from "../../models/getArtifactsCriteria.model";
import {Paging} from "../../models/paging.model";
import {ArtifactsSearchResults} from "../../models/artifactsSearchResults.model";
import {ArtifactMetaData} from "../../models/artifactMetaData.model";
import {VersionMetaData} from "../../models/versionMetaData.model";

/**
 * The registry service.  Responsible for interacting with a single Service Registry instance.
 */
export class RegistryService extends BaseService {

    public getArtifacts(registry: RegistryInstance, criteria: GetArtifactsCriteria, paging: Paging): Promise<ArtifactsSearchResults> {
        this.logger.debug("[RegistryService] Getting artifacts: ", criteria, paging);
        const start: number = (paging.page - 1) * paging.pageSize;
        const end: number = start + paging.pageSize;
        const queryParams: any = {
            limit: end,
            offset: start,
            order: criteria.sortAscending ? "asc" : "desc",
            orderby: "name"
        };
        if (criteria.value) {
            if (criteria.type === "everything") {
                // tslint:disable-next-line:no-string-literal
                queryParams["name"] = criteria.value;
                // tslint:disable-next-line:no-string-literal
                queryParams["description"] = criteria.value;
                // tslint:disable-next-line:no-string-literal
                queryParams["labels"] = criteria.value;
            } else {
                queryParams[criteria.type] = criteria.value;
            }
        }
        const endpoint: string = this.endpoint(registry.registryUrl,"/apis/registry/v2/search/artifacts", {}, queryParams);
        const auth: AuthConfig = this.config.instancesConfig()?.auth;
        return this.httpGet<ArtifactsSearchResults>(endpoint, auth, undefined, (data) => {
            const results: ArtifactsSearchResults = {
                artifacts: data.artifacts,
                count: data.count,
                page: paging.page,
                pageSize: paging.pageSize
            };
            return results;
        });
    }

    public getArtifactMetaData(registry: RegistryInstance, groupId: string, artifactId: string): Promise<ArtifactMetaData> {
        const endpoint: string = this.endpoint(registry.registryUrl,
            "/apis/registry/v2/groups/:groupId/artifacts/:artifactId/meta",
            { groupId, artifactId });
        const auth: AuthConfig = this.config.instancesConfig()?.auth;
        return this.httpGet<ArtifactMetaData>(endpoint, auth);
    }

    public getArtifactContent(registry: RegistryInstance, groupId: string, artifactId: string): Promise<string> {
        const endpoint: string = this.endpoint(registry.registryUrl,
            "/apis/registry/v2/groups/:groupId/artifacts/:artifactId",
            { groupId, artifactId });
        const auth: AuthConfig = this.config.instancesConfig()?.auth;

        const options: any = this.options({
            "Accept": "*"
        });
        options.maxContentLength = "5242880"; // TODO 5MB hard-coded, make this configurable?
        options.responseType = "text";
        options.transformResponse = (data: any) => data;
        return this.httpGet<string>(endpoint, auth, options);
    }

    public updateArtifactContent(registry: RegistryInstance, groupId: string, artifactId: string, content: string): Promise<VersionMetaData> {
        const endpoint: string = this.endpoint(registry.registryUrl,
            "/apis/registry/v2/groups/:groupId/artifacts/:artifactId",
            { groupId, artifactId });
        const auth: AuthConfig = this.config.instancesConfig()?.auth;

        const headers: any = {};
        headers["Content-Type"] = ContentTypes.APPLICATION_JSON;
        return this.httpPutWithReturn<any, VersionMetaData>(endpoint, auth, content, this.options(headers));
    }
}
