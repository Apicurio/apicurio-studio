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

package io.apicurio.hub.api.rest.impl;

import java.util.Collection;
import java.util.Objects;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.IValidationProfilesResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.CreateValidationProfile;
import io.apicurio.hub.core.beans.UpdateValidationProfile;
import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class ValidationProfilesResource implements IValidationProfilesResource {

    private static Logger logger = LoggerFactory.getLogger(ValidationProfilesResource.class);

    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;

    /**
     * @see io.apicurio.hub.api.rest.IValidationProfilesResource#listValidationProfiles()
     */
    @Override
    public Collection<ValidationProfile> listValidationProfiles() throws ServerError {
        metrics.apiCall("/validationProfiles", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Listing Validation Profiles for {}", user);
            return this.storage.listValidationProfiles(user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IValidationProfilesResource#createValidationProfile(io.apicurio.hub.core.beans.CreateValidationProfile)
     */
    @Override
    public ValidationProfile createValidationProfile(CreateValidationProfile info) throws ServerError {
        metrics.apiCall("/validationProfiles", "POST");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Creating a new validaton profile for {} named: {}", user, info.getName());
            ValidationProfile profile = new ValidationProfile();
            profile.setName(info.getName());
            profile.setDescription(info.getDescription());
            if (info.getSeverities() != null) {
                profile.setSeverities(info.getSeverities());
            }
            if (info.getExternalRuleset() != null && !Objects.equals(info.getExternalRuleset(), "")) {
                profile.setExternalRuleset(info.getExternalRuleset());
            }
            long pid = storage.createValidationProfile(user, profile);
            profile.setId(pid);
            return profile;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IValidationProfilesResource#updateValidationProfile(java.lang.String, io.apicurio.hub.core.beans.UpdateValidationProfile)
     */
    @Override
    public void updateValidationProfile(String profileId, UpdateValidationProfile update)
            throws ServerError, NotFoundException {
        metrics.apiCall("/validationProfiles/{profileId}", "PUT");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Updating an existing validaton profile for {} named: {}", user, update.getName());
            ValidationProfile profile = new ValidationProfile();
            profile.setId(Long.parseLong(profileId));
            profile.setName(update.getName());
            profile.setDescription(update.getDescription());
            if (update.getSeverities() != null) {
                profile.setSeverities(update.getSeverities());
            }
            storage.updateValidationProfile(user, profile);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IValidationProfilesResource#deleteValidationProfile(java.lang.String)
     */
    @Override
    public void deleteValidationProfile(String profileId) throws ServerError, NotFoundException {
        metrics.apiCall("/validationProfiles/{profileId}", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Deleting validation profile for {} with ID: ", user, profileId);
            this.storage.deleteValidationProfile(user, Long.parseLong(profileId));
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

}
