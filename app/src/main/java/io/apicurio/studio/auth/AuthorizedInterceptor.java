/*
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

package io.apicurio.studio.auth;

import io.apicurio.common.apps.config.Info;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

import io.quarkus.security.UnauthorizedException;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;

/**
 * This class implements authorization logic.  It is driven by a combination of the
 * security identity (authenticated user) and configured security level of the operation the user is
 * attempting to perform.
 */
@Authorized
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class AuthorizedInterceptor {

    @Inject
    Logger log;

    @Inject
    SecurityIdentity securityIdentity;

    @ConfigProperty(name = "quarkus.oidc.tenant-enabled")
    @Info(category = "auth", description = "OIDC authentication enabled", availableSince = "1.0.0")
    boolean authenticationEnabled;

    @AroundInvoke
    public Object authorizeMethod(InvocationContext context) throws Exception {

        // If authentication is not enabled, just do it.
        if (!authenticationEnabled) {
            return context.proceed();
        }

        log.trace("Authentication enabled, protected resource: " + context.getMethod());

        // If the securityIdentity is not set (or is anonymous)...
        if (securityIdentity == null || securityIdentity.isAnonymous()) {
            //just fail - auth was enabled but no credentials provided.
            log.warn("Authentication credentials missing and required for protected endpoint.");
            throw new UnauthorizedException("User is not authenticated.");
        }

        log.trace("principalId:" + securityIdentity.getPrincipal().getName());

        return context.proceed();
    }
}
