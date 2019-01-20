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
package io.apicurio.hub.core.storage;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.js.OaiCommandException;
import io.apicurio.hub.core.js.OaiCommandExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
@Default
public class RollupExecutor implements IRollupExecutor {
    private static Logger logger = LoggerFactory.getLogger(RollupExecutor.class);

    @Inject
    private IStorage storage;
    @Inject
    private OaiCommandExecutor oaiCommandExecutor;

    @Override
    public void rollupCommands(String userId, String designId) throws NotFoundException, StorageException, OaiCommandException {
        logger.debug("Rolling up commands for API with ID: {}", designId);
        ApiDesignContent designContent = storage.getLatestContentDocument(userId, designId);
        logger.debug("Using latest contentVersion {} for possible command rollup.", designContent.getContentVersion());
        List<ApiDesignCommand> apiCommands = storage.listContentCommands(userId, designId, designContent.getContentVersion());
        if (apiCommands.isEmpty()) {
            logger.debug("No hanging commands found, rollup of API {} canceled.", designId);
            return;
        }
        List<String> commands = new ArrayList<>(apiCommands.size());
        for (ApiDesignCommand apiCommand : apiCommands) {
            commands.add(apiCommand.getCommand());
        }
        String content = this.oaiCommandExecutor.executeCommands(designContent.getOaiDocument(), commands);
        long contentVersion = storage.addContent(userId, designId, ApiContentType.Document, content);
        logger.debug("Rollup of {} commands complete with new content version: {}", commands.size(), contentVersion);

        try {
            logger.debug("Updating meta-data for API design {} if necessary.", designId);
            ApiDesign design = storage.getApiDesign(userId, designId);
            ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
            boolean dirty = false;
            if (design.getName() == null || !design.getName().equals(info.getName())) {
                design.setName(info.getName());
                dirty = true;
            }
            if (design.getDescription() == null || !design.getDescription().equals(info.getDescription())) {
                design.setDescription(info.getDescription());
                dirty = true;
            }
            if (design.getTags() == null || !design.getTags().equals(info.getTags())) {
                design.setTags(info.getTags());
                dirty = true;
            }
            if (dirty) {
                logger.debug("API design {} meta-data changed, updating in storage.", designId);
                storage.updateApiDesign(userId, design);
            }
        } catch (Exception e) {
            // Not the end of the world if we fail to update the API's meta-data
            logger.error(e.getMessage(), e);
        }
    }

    @Override
    public void rollupCommands(String designId) throws NotFoundException, StorageException, OaiCommandException {
        Optional<ApiDesignCommand> lastCommandOptional = storage.getLatestCommand(designId);

        // Doing it this tortured way as using the lambda does not allow checked exceptions to be gracefully propagated
        if (lastCommandOptional.isPresent()) {
            // Rollup using author selected from the last command.
            rollupCommands(lastCommandOptional.get().getAuthor(), designId);
        } else {
            // Edge case: If user imports a document, makes no edits, then leaves immediately, we won't find any commands
            // In this case, we don't actually need to do a rollup anyway, so can just early terminate.
            logger.debug("No commands exist for design: {}. No rollup needed.", designId);
        }
    }
}
