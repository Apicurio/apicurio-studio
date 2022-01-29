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

package io.apicurio.studio.rest.v1.impl;

import java.util.function.Supplier;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

import io.apicurio.common.apps.config.Dynamic;
import io.apicurio.studio.rest.v1.UsersResource;
import io.apicurio.studio.rest.v1.beans.UserInfo;
import io.quarkus.security.identity.SecurityIdentity;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class UsersResourceImpl implements UsersResource {

    @Inject
    Logger log;

    @Inject
    SecurityIdentity securityIdentity;

    @Dynamic @ConfigProperty(name="app.properties.foo", defaultValue="bar")
    Supplier<String> foo;

    /**
     * @see io.apicurio.mas.studio.rest.v1.UsersResource#getCurrentUserInfo()
     */
    @Override
    public UserInfo getCurrentUserInfo() {
        String username = "anonymous";
        String displayName = "Anonymous";
        if (!securityIdentity.isAnonymous()) {
            username = securityIdentity.getPrincipal().getName();
            displayName = securityIdentity.getPrincipal().getName();
        }
        return UserInfo.builder()
                .username(username)
                .displayName(displayName + " :: " + foo)
                .build();
    }
}
