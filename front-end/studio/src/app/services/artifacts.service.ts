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

import {AbstractHubService} from "./hub";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {IAuthenticationService} from "./auth.service";
import {Injectable} from "@angular/core";
import {HttpUtils} from "../util/common";
import {Artifact, ArtifactDefinition} from "../models/artifact.model";


/**
 * An implementation of the Artifacts service that uses the Apicurio Studio back-end (Hub API) service
 * to reach the configured registry.
 */
@Injectable()
export class ArtifactsService extends AbstractHubService {

    private cachedArtifacts: Artifact[] = null;

    /**
     * Constructor.
     * @param http
     * @param authService
     * @param config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
    }

    /**
     * @see ArtifactsService.getArtifacts
     */
    public getArtifacts(): Promise<Artifact[]> {
        console.info("[ArtifactsService] Getting all Artifacts");

        let listArtifactsUrl: string = this.endpoint("/registry");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[ArtifactsService] Fetching Artifact list: %s", listArtifactsUrl);
        return this.httpGet<Artifact[]>(listArtifactsUrl, options, (artifacts) => {
            artifacts.forEach(artifact => artifact.__resourceType = "ARTIFACT")
            this.cachedArtifacts = artifacts;
            return artifacts;
        });
    }

    /**
     * @see ArtifactsService.getArtifact
     */
    public getArtifact(artifactId: string): Promise<Artifact> {
        let getArtifactUrl: string = this.endpoint("/registry/:artifactId", {
            artifactId: artifactId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[ArtifactsService] Getting an Artifact: %s", getArtifactUrl);
        return this.httpGet<Artifact>(getArtifactUrl, options);
    }

    /**
     * @see ArtifactsService.getArtifactDefinition
     */
    public getArtifactDefinition(artifactId: string): Promise<ArtifactDefinition> {
        return this.getArtifact(artifactId).then(artifact => {
            let getContentUrl: string = this.endpoint("/registry/:artifactId/:artifactVersion/content", {
                artifactId: artifactId,
                artifactVersion: artifact.version
            });
            let options: any = this.options({ "Accept": "application/json" });
            if (artifact.type == "GRAPHQL") {
                console.info("[ArtifactsService] Getting GraphQL content!");
                options = this.options({ "Accept": "application/graphql" });
                options["responseType"] = "text";
            }
            console.info("[ArtifactsService] Getting Artifact content: %s", getContentUrl);
            options["observe"] = "response";
            return HttpUtils.mappedPromise(this.http.get<HttpResponse<any>>(getContentUrl, options).toPromise(), response => {
                let artifactSpec: any = response.body;
                let artifactDefinition: ArtifactDefinition = ArtifactDefinition.fromArtifact(artifact);
                artifactDefinition.spec = artifactSpec;
                return artifactDefinition;
            });
        });
    }

    /**
     * @see ArtifactsService.getArtifactContentForVersion
     */
    public getArtifactContentForVersion(artifactId: string, artifactVersion: string): Promise<any> {
        let getContentUrl: string = this.endpoint("/registry/:artifactId/:artifactVersion/content", {
            artifactId: artifactId,
            artifactVersion: artifactVersion
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[ArtifactsService] Getting Artifact content: %s", getContentUrl);
        return this.httpGet<any>(getContentUrl, options);
    }

}
