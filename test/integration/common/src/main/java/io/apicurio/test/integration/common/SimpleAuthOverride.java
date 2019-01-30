/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.test.integration.common;

import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.api.security.SecurityContext;
import io.apicurio.studio.shared.beans.User;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
@Default
public class SimpleAuthOverride implements IAuthOverride {
    @Inject
    private ISecurityContext security;
    private User user;
    private String token;

    public boolean isManualOverride() {
        return user != null;
    }

    public User getUser() {
        return user;
    }

    public void setUser(String name, String token) {
        User user = new User();
        user.setEmail(name + "@example.org");
        user.setLogin(name);
        user.setName(name);
        this.user = user;
        this.token = token;
    }

    public void applyUser() {
        if (user == null || token == null) {
            throw new IllegalStateException("Token or user is not null; this is not a valid configuration.");
        }
        ((SecurityContext) security).setUser(user);
        ((SecurityContext) security).setToken(token);
    }
}
