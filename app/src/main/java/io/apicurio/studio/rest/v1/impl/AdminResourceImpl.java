/*
 * Copyright 2022 Red Hat
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

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;

import io.apicurio.common.apps.config.Dynamic;
import io.apicurio.common.apps.config.DynamicConfigPropertyDef;
import io.apicurio.common.apps.config.DynamicConfigPropertyDto;
import io.apicurio.common.apps.config.DynamicConfigPropertyIndex;
import io.apicurio.common.apps.storage.exceptions.InvalidInputException;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.studio.rest.v1.AdminResource;
import io.apicurio.studio.rest.v1.beans.ConfigurationProperty;
import io.apicurio.studio.rest.v1.beans.UpdateConfigurationProperty;
import io.apicurio.studio.storage.SqlStorage;

/**
 * Implementation of the /admin REST API operations.
 *
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class AdminResourceImpl implements AdminResource {

    @Inject
    Logger log;

    @Inject
    SqlStorage storage;

    @Inject
    DynamicConfigPropertyIndex dynamicPropertyIndex;

    /*******************************************************
     * Two temporary dynamic properties for testing.  Can
     * remove these once we have actual dynamic properties
     * somewhere in the application.
     *******************************************************/
    @Dynamic @ConfigProperty(name = "app.properties.test.string", defaultValue = "_default_")
    Supplier<String> stringProperty;
    @Dynamic @ConfigProperty(name = "app.properties.test.int", defaultValue = "100")
    Supplier<Integer> intProperty;


    /**
     * @see io.apicurio.mas.studio.rest.v1.AdminResource#listConfigProperties()
     */
    @Override
    public List<ConfigurationProperty> listConfigProperties() {
        List<DynamicConfigPropertyDto> props = storage.getConfigProperties();
        return props.stream().map(dto -> {
            return dtoToConfigurationProperty(dto);
        }).collect(Collectors.toList());
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.AdminResource#setConfigProperty(io.apicurio.mas.studio.rest.v1.beans.ConfigurationProperty)
     */
    @Override
    public void setConfigProperty(ConfigurationProperty data) {
        DynamicConfigPropertyDef propertyDef = resolveConfigProperty(data.getName());
        validateType(propertyDef, data);

        DynamicConfigPropertyDto dto = new DynamicConfigPropertyDto();
        dto.setName(data.getName());
        dto.setValue(data.getValue());
        storage.setConfigProperty(dto);
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.AdminResource#getConfigProperty(java.lang.String)
     */
    @Override
    public ConfigurationProperty getConfigProperty(String propertyName) {
        // Ensure that the property is a valid dynamic config property.
        resolveConfigProperty(propertyName);
        // Now get the current value from storage.
        DynamicConfigPropertyDto dto = storage.getConfigProperty(propertyName);
        return dtoToConfigurationProperty(dto);
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.AdminResource#updateConfigProperty(java.lang.String, io.apicurio.mas.studio.rest.v1.beans.UpdateConfigurationProperty)
     */
    @Override
    public void updateConfigProperty(String propertyName, UpdateConfigurationProperty data) {
        ConfigurationProperty cp = new ConfigurationProperty();
        cp.setName(propertyName);
        cp.setValue(data.getValue());
        this.setConfigProperty(cp);
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.AdminResource#deleteConfigProperty(java.lang.String)
     */
    @Override
    public void deleteConfigProperty(String propertyName) {
        // Check if the config property exists.
        resolveConfigProperty(propertyName);
        // Delete it in the storage.
        storage.deleteConfigProperty(propertyName);
    }

    /**
     * Lookup the dynamic configuration property being set.  Ensure that it exists (throws
     * a {@link NotFoundException} if it does not.
     * @param propertyName the name of the dynamic property
     * @return the dynamic config property definition
     */
    private DynamicConfigPropertyDef resolveConfigProperty(String propertyName) {
        DynamicConfigPropertyDef property = dynamicPropertyIndex.getProperty(propertyName);
        if (property == null) {
            throw new NotFoundException("Dynamic configuration property not found: " + propertyName);
        }
        return property;
    }

    /**
     * Ensure that the value being set on the given property is value for the property type.
     * For example, this should fail
     * @param propertyDef the dynamic config property definition
     * @param data the new value of the property
     */
    private void validateType(DynamicConfigPropertyDef propertyDef, ConfigurationProperty data) {
        if (!propertyDef.isValidValue(data.getValue())) {
            throw new InvalidInputException("Invalid dynamic configuration property value for: " + data.getName());
        }
    }

    private static ConfigurationProperty dtoToConfigurationProperty(DynamicConfigPropertyDto dto) {
        ConfigurationProperty rval = new ConfigurationProperty();
        rval.setName(dto.getName());
        rval.setValue(dto.getValue());
        return rval;
    }

}
