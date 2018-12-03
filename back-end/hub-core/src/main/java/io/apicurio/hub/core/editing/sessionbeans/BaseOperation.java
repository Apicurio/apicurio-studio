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

import com.fasterxml.jackson.annotation.JsonEnumDefaultValue;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class BaseOperation {
    private SourceEnum source = SourceEnum.LOCAL;

    private String type;

    public BaseOperation() {}

    public BaseOperation(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public BaseOperation setType(String type) {
        this.type = type;
        return this;
    }

    public SourceEnum getSource() {
        return source;
    }

    public BaseOperation setSource(SourceEnum source) {
        this.source = source;
        return this;
    }

    public enum SourceEnum {
        @JsonEnumDefaultValue
        LOCAL,
        REMOTE
    }
}
