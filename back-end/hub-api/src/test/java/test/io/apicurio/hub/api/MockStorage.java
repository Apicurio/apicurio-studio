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
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.LinkedAccount;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockStorage implements IStorage {
    
    private Map<String, Map<LinkedAccountType, LinkedAccount>> accounts = new HashMap<>();
    private Map<String, ApiDesign> designs = new HashMap<>();
    private int counter = 1;
    
    /**
     * @see io.apicurio.hub.api.storage.IStorage#getLinkedAccount(java.lang.String, io.apicurio.hub.api.beans.LinkedAccountType)
     */
    @Override
    public LinkedAccount getLinkedAccount(String userId, LinkedAccountType type)
            throws StorageException, NotFoundException {
        if (!accounts.containsKey(userId)) {
            throw new NotFoundException();
        }
        if (!accounts.get(userId).containsKey(type)) {
            throw new NotFoundException();
        }
        return accounts.get(userId).get(type);
    }
    
    /**
     * @see io.apicurio.hub.api.storage.IStorage#updateLinkedAccount(java.lang.String, io.apicurio.hub.api.beans.LinkedAccount)
     */
    @Override
    public void updateLinkedAccount(String userId, LinkedAccount account) throws NotFoundException, StorageException {
        this.getLinkedAccount(userId, account.getType()).setUsedOn(account.getUsedOn());
    }
    
    /**
     * @see io.apicurio.hub.api.storage.IStorage#createLinkedAccount(java.lang.String, io.apicurio.hub.api.beans.LinkedAccount)
     */
    @Override
    public void createLinkedAccount(String userId, LinkedAccount account)
            throws AlreadyExistsException, StorageException {
        if (!accounts.containsKey(userId)) {
            accounts.put(userId, new HashMap<>());
        }
        if (accounts.get(userId).containsKey(account.getType())) {
            throw new AlreadyExistsException();
        }
        accounts.get(userId).put(account.getType(), account);
    }
    
    /**
     * @see io.apicurio.hub.api.storage.IStorage#deleteLinkedAccount(java.lang.String, io.apicurio.hub.api.beans.LinkedAccountType)
     */
    @Override
    public void deleteLinkedAccount(String userId, LinkedAccountType type)
            throws StorageException, NotFoundException {
        if (!accounts.containsKey(userId)) {
            throw new NotFoundException();
        }
        if (!accounts.get(userId).containsKey(type)) {
            throw new NotFoundException();
        }
        accounts.get(userId).remove(type);
    }
    
    /**
     * @see io.apicurio.hub.api.storage.IStorage#deleteLinkedAccounts(java.lang.String)
     */
    @Override
    public void deleteLinkedAccounts(String userId) throws StorageException {
        this.accounts.remove(userId);
    }
    
    /**
     * @see io.apicurio.hub.api.storage.IStorage#listLinkedAccounts(java.lang.String)
     */
    @SuppressWarnings("unchecked")
    @Override
    public Collection<LinkedAccount> listLinkedAccounts(String userId) throws StorageException {
        if (!accounts.containsKey(userId)) {
            return Collections.EMPTY_LIST;
        }
        return accounts.get(userId).values();
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#getApiDesign(java.lang.String, java.lang.String)
     */
    @Override
    public ApiDesign getApiDesign(String userId, String designId) throws NotFoundException, StorageException {
        ApiDesign design = this.designs.get(designId);
        if (design == null) {
            throw new NotFoundException();
        }
        return design;
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#createApiDesign(java.lang.String, io.apicurio.hub.api.beans.ApiDesign)
     */
    @Override
    public String createApiDesign(String userId, ApiDesign design) throws AlreadyExistsException, StorageException {
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
     * @see io.apicurio.hub.api.storage.IStorage#deleteApiDesign(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteApiDesign(String userId, String designId) throws NotFoundException, StorageException {
        if (this.designs.remove(designId) == null) {
            throw new NotFoundException();
        }
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#updateApiDesign(java.lang.String, io.apicurio.hub.api.beans.ApiDesign)
     */
    @Override
    public void updateApiDesign(String userId, ApiDesign design) throws NotFoundException, StorageException {
        ApiDesign savedDesign = this.getApiDesign(userId, design.getId());
        savedDesign.setName(design.getName());
        savedDesign.setDescription(design.getDescription());
        savedDesign.setModifiedBy(design.getModifiedBy());
        savedDesign.setModifiedOn(design.getModifiedOn());
    }

    /**
     * @see io.apicurio.hub.api.storage.IStorage#listApiDesigns(java.lang.String)
     */
    @Override
    public Collection<ApiDesign> listApiDesigns(String userId) throws StorageException {
        return this.designs.values();
    }

}
