/*
 * Copyright 2020 Red Hat
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

package io.apicurio.hub.core.editing.infinispan;

import io.apicurio.hub.core.editing.events.EventAction;
import io.apicurio.hub.core.editing.events.EventActionUtil;
import org.infinispan.commons.marshall.AdvancedExternalizer;

import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import java.util.Collections;
import java.util.Set;

/**
 * @author Ales Justin
 */
@SuppressWarnings("deprecation")
public class EventActionExternalizer implements AdvancedExternalizer<EventAction> {
    private static final long serialVersionUID = -606136823538898704L;
    
    private static final int ID = 1_000_042;

    @Override
    public Set<Class<? extends EventAction>> getTypeClasses() {
        return Collections.singleton(EventAction.class);
    }

    @Override
    public Integer getId() {
        return ID;
    }

    @Override
    public void writeObject(ObjectOutput output, EventAction eventAction) throws IOException {
        byte[] bytes = EventActionUtil.serialize(eventAction);
        output.write(bytes.length);
        output.write(bytes);
    }

    @Override
    public EventAction readObject(ObjectInput input) throws IOException {
        int length = input.read();
        byte[] bytes = new byte[length];
        input.read(bytes);
        return EventActionUtil.deserialize(bytes);
    }
}
