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

package io.apicurio.hub.core.storage;

import java.util.Collection;
import java.util.List;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IStorage {

    /**
     * Returns true if the given user has ownership permission over the API design.
     * @param userId
     * @param designId
     */
    public boolean hasOwnerPermission(String userId, String designId) throws StorageException;

    /**
     * Returns true if the given user has write permission over the API design.
     * @param userId
     * @param designId
     */
    public boolean hasWritePermission(String userId, String designId) throws StorageException;
    
    /**
     * Returns a collection of all collaborators for a given API design.
     * @param designId
     * @throws StorageException
     */
    public Collection<ApiDesignCollaborator> listPermissions(String designId) throws StorageException;
    
    /**
     * Creates a permission for a single user for a given API design.
     * @param designId
     * @param userId
     * @param permission
     * @throws StorageException
     */
    public void createPermission(String designId, String userId, String permission) throws StorageException;
    
    /**
     * Changes the permission of a given user.  For example, this might change a user's permission
     * from 'collaborator' to 'owner'.
     * @param designId
     * @param userId
     * @param permission
     * @throws StorageException
     */
    public void updatePermission(String designId, String userId, String permission) throws StorageException;
    
    /**
     * Deletes a permission.  This will typically revoke a user's access to an API design.
     * @param designId
     * @param userId
     * @throws StorageException
     */
    public void deletePermission(String designId, String userId) throws StorageException;
    
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
     * Gets the list of users who have collaborated to edit the given API design.
     * @param userId
     * @param designId
     * @return a collection of contributors (editors) on a given API design
     */
    public Collection<Contributor> listContributors(String userId, String designId) throws NotFoundException, StorageException;

    /**
     * Creates a new API Design in the storage layer and returns a new unique Design ID.  This
     * ID should be used in the future to retrieve information about the design (and to delete
     * or update it).
     * 
     * Initial content for the API must be provided (in the form of an OAI 2.0 or 3.0.0 document).
     * 
     * @param userId
     * @param design
     * @param initialApiDocument
     * @return the unique design id
     * @throws StorageException
     */
    public String createApiDesign(String userId, ApiDesign design, String initialApiDocument) throws StorageException;

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

    /**
     * Returns the most recent full content row for the given API Design.
     * @param userId
     * @param designId
     * @return the API Design content (OAI document) and content version
     * @throws NotFoundException
     * @throws StorageException
     */
    public ApiDesignContent getLatestContentDocument(String userId, String designId) throws NotFoundException, StorageException;

    /**
     * Returns a list of commands for a given API design that have been executed since 
     * a specific content version.
     * @param userId
     * @param designId
     * @param sinceVersion
     * @throws StorageException
     */
    public List<ApiDesignCommand> listContentCommands(String userId, String designId, long sinceVersion) throws StorageException;

    /**
     * Adds a single content row to the DB and returns a unique content version number 
     * for it.
     * @param userId
     * @param designId
     * @param type
     * @param data
     * @throws StorageException
     */
    public long addContent(String userId, String designId, ApiContentType type, String data) throws StorageException;

    /**
     * Creates an entry for an editing session UID.  Throws an exception if the entry could
     * not be created for any reason.
     * @param uuid
     * @param designId
     * @param userId
     * @param hash
     * @param contentVersion
     * @param expiresOn
     */
    public void createEditingSessionUuid(String uuid, String designId, String userId, String hash, long contentVersion, 
            long expiresOn) throws StorageException;
    
    /**
     * Looks up an editing session and returns the Content Version associated with it.
     * @param uuid
     * @param designId
     * @param userId
     * @param hash
     * @return the content version
     * @throws StorageException
     */
    public long lookupEditingSessionUuid(String uuid, String designId, String userId, String hash) throws StorageException;
    
    /**
     * Consumes (deletes) an editing session UUID.  Returns true if the UUID was successfully
     * consumed or false if not (e.g. if it did not exist).  Throws an exception only if an
     * error of some kind occurs.
     * @param uuid
     * @param designId
     * @param userId
     * @param hash
     * @return true if the UUID was consumed
     * @throws StorageException
     */
    public boolean consumeEditingSessionUuid(String uuid, String designId, String userId, String hash) throws StorageException;

    /**
     * Creates an invitation to collaborate on an API design.
     * @param inviteId
     * @param designId
     * @param userId
     * @param username
     * @param role
     * @throws StorageException
     */
    public void createCollaborationInvite(String inviteId, String designId, String userId, String username, String role) throws StorageException;

    /**
     * Updates the status of an invitation.  This can be used to accept, reject, or cancel an invite.
     * @param inviteId
     * @param fromStatus
     * @param toStatus
     * @param userId
     * @return true if the status was changed successfully
     * @throws StorageException
     */
    public boolean updateCollaborationInviteStatus(String inviteId, String fromStatus, String toStatus, String userId) throws StorageException;
    
    /**
     * Returns all of the invitations for a given API design.
     * @param designId
     * @throws StorageException
     */
    public List<Invitation> listCollaborationInvites(String designId, String userId) throws StorageException;

    /**
     * Returns a single invitation for a given API design.  The invitation ID is required.
     * @param designId
     * @param inviteId
     */
    public Invitation getCollaborationInvite(String designId, String inviteId) throws StorageException, NotFoundException;
    
}
