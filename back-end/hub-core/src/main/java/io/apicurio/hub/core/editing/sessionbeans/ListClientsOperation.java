/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class ListClientsOperation extends BaseOperation {
    private static final ListClientsOperation INSTANCE;

    static {
        INSTANCE = (ListClientsOperation) new ListClientsOperation().setType("list-clients");
    }

    public static ListClientsOperation listClients() {
        return INSTANCE;
    }
}
