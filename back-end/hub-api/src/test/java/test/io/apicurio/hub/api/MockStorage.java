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

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockStorage implements IStorage {
    
    private Map<String, ApiDesign> designs = new HashMap<>();
    private int counter = 1;

    /**
     * @see io.apicurio.hub.api.storage.IStorage#getApiDesign(java.lang.String)
     */
    @Override
    public ApiDesign getApiDesign(String designId) throws NotFoundException, StorageException {
        ApiDesign design = this.designs.get(designId);
        if (design == null) {
            throw new NotFoundException();
        }
        return design;
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#createApiDesign(io.apicurio.hub.api.beans.ApiDesign)
     */
    @Override
    public String createApiDesign(ApiDesign design) throws AlreadyExistsException, StorageException {
        for (ApiDesign d : designs.values()) {
            if (d.getRepositoryUrl().equals(design.getRepositoryUrl())) {
                throw new AlreadyExistsException();
            }
        }
        String designId = String.valueOf(counter++);
        design.setId(designId);
        this.designs.put(designId, design);
        return designId;
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#deleteApiDesign(java.lang.String)
     */
    @Override
    public void deleteApiDesign(String designId) throws NotFoundException, StorageException {
        if (this.designs.remove(designId) == null) {
            throw new NotFoundException();
        }
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#updateApiDesign(io.apicurio.hub.api.beans.ApiDesign)
     */
    @Override
    public void updateApiDesign(ApiDesign design) throws NotFoundException, StorageException {
        ApiDesign savedDesign = this.getApiDesign(design.getId());
        savedDesign.setName(design.getName());
        savedDesign.setDescription(design.getDescription());
        savedDesign.setModifiedBy(design.getModifiedBy());
        savedDesign.setModifiedOn(design.getModifiedOn());
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#listApiDesigns()
     */
    @Override
    public Collection<ApiDesign> listApiDesigns() throws StorageException {
        return this.designs.values();
    }

}
