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

package io.apicurio.hub.api.storage;

import java.util.Collection;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.LinkedAccount;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IStorage {
    
    /**
     * Creates a linked account for the given user.
     * @param userId
     * @param account
     * @throws AlreadyExistsException
     * @throws StorageException
     */
    public void createLinkedAccount(String userId, LinkedAccount account) throws AlreadyExistsException, StorageException;
    
    /**
     * Returns a collection of linked accounts for the given user.
     * @param userId
     * @return
     * @throws StorageException
     */
    public Collection<LinkedAccount> listLinkedAccounts(String userId) throws StorageException;
    
    /**
     * Deletes a single linked account for the given user.
     * @param userId
     * @param type
     * @throws StorageException
     * @throws NotFoundException
     */
    public void deleteLinkedAccount(String userId, LinkedAccountType type) throws StorageException, NotFoundException;
    
    /**
     * Deletes all linked accounts for the given user.
     * @param userId
     * @throws StorageException
     */
    public void deleteLinkedAccounts(String userId) throws StorageException;
    
    /**
     * Gets a single linked account for a user by its type.
     * @param userId
     * @param type
     * @throws StorageException
     * @throws NotFoundException
     */
    public LinkedAccount getLinkedAccount(String userId, LinkedAccountType type) throws StorageException, NotFoundException;

    /**
     * Updates a linked account.
     * @param userId
     * @param account
     * @throws NotFoundException
     * @throws StorageException
     */
    public void updateLinkedAccount(String userId, LinkedAccount account) throws NotFoundException, StorageException;

    /**
     * Gets a single API Design from the storage layer by its unique ID.
     * @param userId
     * @param designId
     * @return an API Design
     * @throws NotFoundException
     * @throws StorageException
     */
    public ApiDesign getApiDesign(String userId, String designId) throws NotFoundException, StorageException;

    /**
     * Creates a new API Design in the storage layer and returns a new unique Design ID.  This
     * ID should be used in the future to retrieve information about the design (and to delete
     * or update it).
     * 
     * If an API design already exists for the given source repository URL, this will throw
     * an exception.
     * @param userId
     * @param design
     * @return the unique design id
     * @throws AlreadyExistsException
     * @throws StorageException
     */
    public String createApiDesign(String userId, ApiDesign design) throws AlreadyExistsException, StorageException;

    /**
     * Deletes a single API Design by its unique ID.  Throws an exception if no design
     * was found.
     * @param userId
     * @param designId
     * @throws NotFoundException
     * @throws StorageException
     */
    public void deleteApiDesign(String userId, String designId) throws NotFoundException, StorageException;

    /**
     * Updates a single API design.  An exception is thrown if no design for the given ID
     * was found.
     * @param userId
     * @param design
     * @throws NotFoundException
     * @throws StorageException
     */
    public void updateApiDesign(String userId, ApiDesign design) throws NotFoundException, StorageException;

    /**
     * Returns a collection of API Designs accessible by the currently authenticated
     * user.
     * @param userId
     * @return a collection of API Designs
     * @throws StorageException
     */
    public Collection<ApiDesign> listApiDesigns(String userId) throws StorageException;

}
