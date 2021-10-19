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
import java.util.Optional;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiMock;
import io.apicurio.hub.core.beans.ApiPublication;
import io.apicurio.hub.core.beans.ApiTemplatePublication;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.beans.SharingConfiguration;
import io.apicurio.hub.core.beans.SharingInfo;
import io.apicurio.hub.core.beans.SharingLevel;
import io.apicurio.hub.core.beans.StoredApiTemplate;
import io.apicurio.hub.core.beans.ValidationProfile;
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
     * Returns a collection of API Designs that represent the "recent" APIs edited by the 
     * given user.
     * @param userId
     * @throws StorageException
     */
    public Collection<ApiDesign> getRecentApiDesigns(String userId) throws StorageException;

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
     * Returns the most recent full content row for the given API Design.
     * @param sharingUuid
     * @throws NotFoundException
     * @throws StorageException
     */
    public ApiDesignContent getLatestContentDocumentForSharing(String sharingUuid) throws NotFoundException, StorageException;
    
    /**
     * Returns the full content row for the given API Design and content version.
     * @param designId
     * @param contentVersion 
     * @throws NotFoundException
     * @throws StorageException
     */
    public ApiDesignContent getContentDocumentForVersion(String designId, long contentVersion) throws NotFoundException, StorageException;

    /**
     * Returns a list of commands for a given API design that have been executed since 
     * a specific content version (excludes reverted commands).
     * @param userId
     * @param designId
     * @param sinceVersion
     * @throws StorageException
     */
    public List<ApiDesignCommand> listContentCommands(String userId, String designId, long sinceVersion) throws StorageException;

    /**
     * Returns a list of commands for a given API design that have been executed since 
     * a specific content version, including reverted commands.
     * @param userId
     * @param designId
     * @param sinceVersion
     * @throws StorageException
     */
    public List<ApiDesignCommand> listAllContentCommands(String userId, String designId, long sinceVersion) throws StorageException;

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
     * Marks a single content change as "reverted", which will undo that one change, removing it
     * from the document.
     * @param user
     * @param designId
     * @param contentVersion
     */
    public boolean undoContent(String user, String designId, long contentVersion) throws StorageException;

    /**
     * Restores a single content change by changing the "reverted" flag back to false.  This restores
     * that one change, returning it to the document.
     * @param user
     * @param designId
     * @param contentVersion
     */
    public boolean redoContent(String user, String designId, long contentVersion) throws StorageException;

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
     * @param subject
     * @throws StorageException
     */
    public void createCollaborationInvite(String inviteId, String designId, String userId, String username, String role,
            String subject) throws StorageException;

    /**
     * Updates the status of an invitation.  This can be used to accept, reject, or cancel an invite.
     * @param inviteId
     * @param fromStatus
     * @param toStatus
     * @param userId
     * @return true if the status was changed successfully
     * @throws StorageException
     */
    public boolean updateCollaborationInviteStatus(String inviteId, String fromStatus, String toStatus, String userId)
            throws StorageException;
    
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

    /**
     * Returns a collection of API design changes.  Since there can be many of these per API, 
     * it is required to include a FROM and TO parameter to limit the result set.
     * @param designId
     * @param from
     * @param to
     */
    public Collection<ApiDesignChange> listApiDesignActivity(String designId, int from, int to) throws StorageException;

	/**
	 * Returns a collection of API design changes made by a given user.
	 * @param user
	 * @param from
	 * @param to
	 */
	public Collection<ApiDesignChange> listUserActivity(String user, int from, int to) throws StorageException;

    /**
     * Returns a collection of API publications (recorded whenever a user publishes an API).  This
     * is a paged method similar to listApiDesignActivity().
     * @param designId
     * @param from
     * @param to
     */
    public Collection<ApiPublication> listApiDesignPublications(String designId, int from, int to) throws StorageException;

    /**
     * Returns a collection of API publications done by the given user (recorded whenever a user publishes 
     * an API).  This is a paged method similar to listApiDesignActivity().
     * @param designId
     * @param user
     * @param from
     * @param to
     * @throws StorageException
     */
    public Collection<ApiPublication> listApiDesignPublicationsBy(String designId, String user, int from, int to) throws StorageException;

    /**
     * Returns a collection of API mocks (recorded whenever a user mocks an API).  This
     * is a paged method similar to listApiDesignActivity().
     * @param designId
     * @param from
     * @param to
     */
    public Collection<ApiMock> listApiDesignMocks(String designId, int from, int to) throws StorageException;

    /**
     * Returns a collection of API templates (recorded whenever a user promotes a template).  This
     * is a paged method similar to listApiDesignActivity().
     * @param designId
     * @param from
     * @param to
     * @return
     */
    public Collection<ApiTemplatePublication> listApiTemplatePublications(String designId, int from, int to) throws StorageException;
    
    /**
     * Returns a collection of codegen projects for the given API design.
     * @param userId
     * @param designId
     * @throws StorageException
     */
    public Collection<CodegenProject> listCodegenProjects(String userId, String designId) throws StorageException;
    
    /**
     * Returns a single codegen project by its ID.
     * @param userId
     * @param designId
     * @param projectId
     * @throws StorageException
     * @throws NotFoundException
     */
    public CodegenProject getCodegenProject(String userId, String designId, String projectId) throws StorageException, NotFoundException;
    
    /**
     * Creates a codegen project.
     * @param userId
     * @param project
     * @throws StorageException
     */
    public String createCodegenProject(String userId, CodegenProject project) throws StorageException;
    
    /**
     * Updates a codegen project.
     * @param userId
     * @param project
     * @throws StorageException
     * @throws NotFoundException
     */
    public void updateCodegenProject(String userId, CodegenProject project) throws StorageException, NotFoundException;
    
    /**
     * Deletes a single codegen project.
     * @param userId
     * @param designId
     * @param projectId
     * @throws NotFoundException
     * @throws StorageException
     */
    public void deleteCodegenProject(String userId, String designId, String projectId) throws NotFoundException, StorageException;
    
    /**
     * Deletes all codegen projects for an API design.
     * @param userId
     * @param designId
     * @throws NotFoundException
     * @throws StorageException
     */
    public void deleteCodegenProjects(String userId, String designId) throws NotFoundException, StorageException;

    /**
     * Gets the latest command for the given design id.
     * @param designId
     * @throws NotFoundException
     * @throws StorageException
     */
    public Optional<ApiDesignCommand> getLatestCommand(String designId) throws NotFoundException, StorageException;
    
    /**
     * Returns a collection of validation profiles for the given user.
     * @param userId
     * @throws StorageException
     */
    public Collection<ValidationProfile> listValidationProfiles(String userId) throws StorageException;
    
    /**
     * Creates a single new validation profile for the given user.
     * @param userId
     * @param profile
     * @throws StorageException
     */
    public long createValidationProfile(String userId, ValidationProfile profile) throws StorageException;
    
    /**
     * Updates a single new validation profile for the given user.
     * @param userId
     * @param profile
     * @throws StorageException
     */
    public void updateValidationProfile(String userId, ValidationProfile profile) throws StorageException, NotFoundException;

    /**
     * Deletes a single validation profile.
     * @param userId
     * @param profileId
     * @throws StorageException
     */
    public void deleteValidationProfile(String userId, long profileId) throws StorageException, NotFoundException;

    /**
     * Gets the sharing config for a given API design.
     * @param designId
     * @throws StorageException
     */
    public SharingConfiguration getSharingConfig(String designId) throws StorageException;
    
    /**
     * Sets the sharing configuration for the given API design.
     * @param designId
     * @param uuid
     * @param level
     * @throws StorageException
     */
    public void setSharingConfig(String designId, String uuid, SharingLevel level) throws StorageException;
    
    /**
     * Returns the sharing info given the share UUID.
     * @param uuid
     * @throws StorageException
     * @throws NotFoundException
     */
    public SharingInfo getSharingInfo(String uuid) throws StorageException, NotFoundException;

    /**
     * Inserts an API template
     * @param apiTemplate 
     * @throws StorageException
     */
    public void createApiTemplate(StoredApiTemplate apiTemplate) throws StorageException;

    /**
     * Returns the stored template for a given templateId.
     * @param templateId 
     * @throws StorageException
     */
    public StoredApiTemplate getStoredApiTemplate(String templateId) throws StorageException, NotFoundException;

    /**
     * Returns a list of all the stored templates
     * @throws StorageException
     */
    public List<StoredApiTemplate> getStoredApiTemplates() throws StorageException;

    /**
     * Returns a list of the stored templates for a given API type
     * @param type
     * @throws StorageException
     */
    public List<StoredApiTemplate> getStoredApiTemplates(ApiDesignType type) throws StorageException;

    /**
     * Updates an API template
     * @param apiTemplate
     * @throws StorageException
     */
    public void updateApiTemplate(StoredApiTemplate apiTemplate) throws StorageException, NotFoundException;

    /**
     * Deletes an API template
     * @param templateId
     * @throws StorageException
     */
    public void deleteApiTemplate(String templateId) throws StorageException, NotFoundException;

}
