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
public class SelectionOperation extends BaseOperation {
    private String user;
    private String id;
    private String selection;

    public SelectionOperation() {}

    public String getUser() {
        return user;
    }

    public SelectionOperation setUser(String user) {
        this.user = user;
        return this;
    }

    public String getId() {
        return id;
    }

    public SelectionOperation setId(String id) {
        this.id = id;
        return this;
    }

    public String getSelection() {
        return selection;
    }

    public SelectionOperation setSelection(String selection) {
        this.selection = selection;
        return this;
    }

    public static SelectionOperation select(String user, String id, String selection) {
        return (SelectionOperation) new SelectionOperation()
                .setUser(user)
                .setId(id)
                .setSelection(selection)
                .setType("selection");
    }
}
