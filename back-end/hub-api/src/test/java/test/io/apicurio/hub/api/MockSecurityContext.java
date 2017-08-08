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

package test.io.apicurio.hub.api;

import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.studio.shared.beans.User;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockSecurityContext implements ISecurityContext {

    private User user = new User();
    {
        user.setAvatar("avatar.jpg");
        user.setEmail("user@example.org");
        user.setId(1);
        user.setLogin("user");
        user.setName("User");
    }
    
    /**
     * @see io.apicurio.hub.api.security.ISecurityContext#getCurrentUser()
     */
    @Override
    public User getCurrentUser() {
        return user;
    }
    
    /**
     * @param user
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * @see io.apicurio.hub.api.security.ISecurityContext#getToken()
     */
    @Override
    public String getToken() {
        return "TOKEN12345";
    }

}
