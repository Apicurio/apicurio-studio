/*
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

package io.apicurio.hub.api.security;

import java.io.IOException;

import io.apicurio.hub.api.beans.InitiatedLinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;

/**
 * Provides account linking functionality to the application.  This is used to actually
 * create a secure link between Apicurio and e.g. GitLab, GitHub, Bitbucket.
 * @author eric.wittmann@gmail.com
 */
public interface ILinkedAccountsProvider {

    /**
     * Called to generate a URL that a browser will use to initiate a new linked account.
     * @param accountType the type of account
     * @param redirectUri where to redirect the browser back to after success/failure
     * @param nonce unique, single-use UUID
     */
    public InitiatedLinkedAccount initiateLinkedAccount(LinkedAccountType accountType, String redirectUri, String nonce) throws IOException;

    /**
     * Deletes the linked account (by type).
     * @param type
     */
    public void deleteLinkedAccount(LinkedAccountType type) throws IOException;
    
    /**
     * Gets the linked account's access token.  This access token is what is
     * provided by the external system (e.g. GitHub) to be used for secure access to
     * its API.  The returned value is platform-specific but is typically a JSON
     * formatted string.
     * @param type
     */
    public String getLinkedAccountToken(LinkedAccountType type) throws IOException;

}
