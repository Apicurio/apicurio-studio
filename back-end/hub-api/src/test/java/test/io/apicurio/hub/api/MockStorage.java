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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiMock;
import io.apicurio.hub.core.beans.ApiPublication;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockStorage implements IStorage {
    
    private Map<String, Map<LinkedAccountType, LinkedAccount>> accounts = new HashMap<>();
    private Map<String, ApiDesign> designs = new HashMap<>();
    private Map<String, List<MockContentRow>> content = new HashMap<>();
    private Map<String, MockUuidRow> uuids = new HashMap<>();
    private Map<String, MockInviteRow> invites = new HashMap<>();
    private Map<String, String> permissions = new HashMap<>();
    private int counter = 1;
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#hasOwnerPermission(java.lang.String, java.lang.String)
     */
    @Override
    public boolean hasOwnerPermission(String userId, String designId) throws StorageException {
        String role = permissions.get(designId + ":" + userId);
        return "owner".equals(role);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#hasWritePermission(java.lang.String, java.lang.String)
     */
    @Override
    public boolean hasWritePermission(String userId, String designId) throws StorageException {
        String role = permissions.get(designId + ":" + userId);
        return role != null;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#createPermission(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void createPermission(String designId, String userId, String permission) throws StorageException {
        this.permissions.put(designId + ":" + userId, permission);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#deletePermission(java.lang.String, java.lang.String)
     */
    @Override
    public void deletePermission(String designId, String userId) throws StorageException {
        this.permissions.remove(designId + ":" + userId);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listPermissions(java.lang.String)
     */
    @Override
    public Collection<ApiDesignCollaborator> listPermissions(String designId) throws StorageException {
        List<ApiDesignCollaborator> collaborators = new ArrayList<>();
        this.permissions.keySet().forEach( key -> {
            if (key.startsWith(designId + ":")) {
                ApiDesignCollaborator collaborator = new ApiDesignCollaborator();
                collaborator.setUserId(key.substring(key.indexOf(":") + 1));
                collaborator.setRole(permissions.get(key));
                collaborator.setUserName(collaborator.getUserId());
                collaborators.add(collaborator);
            }
        });
        return collaborators;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#updatePermission(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void updatePermission(String designId, String userId, String permission) throws StorageException {
        this.permissions.put(designId + ":" + userId, permission);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#getLinkedAccount(java.lang.String, io.apicurio.hub.core.beans.LinkedAccountType)
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
     * @see io.apicurio.hub.core.storage.IStorage#updateLinkedAccount(java.lang.String, io.apicurio.hub.core.beans.LinkedAccount)
     */
    @Override
    public void updateLinkedAccount(String userId, LinkedAccount account) throws NotFoundException, StorageException {
        this.getLinkedAccount(userId, account.getType()).setUsedOn(account.getUsedOn());
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#createLinkedAccount(java.lang.String, io.apicurio.hub.core.beans.LinkedAccount)
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
     * @see io.apicurio.hub.core.storage.IStorage#deleteLinkedAccount(java.lang.String, io.apicurio.hub.core.beans.LinkedAccountType)
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
     * @see io.apicurio.hub.core.storage.IStorage#deleteLinkedAccounts(java.lang.String)
     */
    @Override
    public void deleteLinkedAccounts(String userId) throws StorageException {
        this.accounts.remove(userId);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listLinkedAccounts(java.lang.String)
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
     * @see io.apicurio.hub.core.storage.IStorage#getApiDesign(java.lang.String, java.lang.String)
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
     * @see io.apicurio.hub.core.storage.IStorage#listContributors(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<Contributor> listContributors(String user, String designId)
            throws NotFoundException, StorageException {
        
        List<MockContentRow> list = this.content.get(designId);
        if (list == null || list.isEmpty()) {
            return Collections.emptySet();
        }
        
        Map<String, Integer> collabCounters = new HashMap<>();
        for (MockContentRow row : list) {
            if (row.designId.equals(designId)) {
                Integer editCount = collabCounters.get(row.createdBy);
                if (editCount == null) {
                    editCount = new Integer(0);
                }
                editCount = new Integer(editCount.intValue() + 1);
                collabCounters.put(row.createdBy, editCount);
            }
        }
        
        List<Contributor> rval = new ArrayList<>();
        for (Entry<String, Integer> entry : collabCounters.entrySet()) {
            String collabUser = entry.getKey();
            int counter = entry.getValue();
            Contributor contributor = new Contributor();
            contributor.setName(collabUser);
            contributor.setEdits(counter);
            rval.add(contributor);
        }
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#getLatestContentDocument(java.lang.String, java.lang.String)
     */
    @Override
    public ApiDesignContent getLatestContentDocument(String userId, String designId)
            throws NotFoundException, StorageException {
        List<MockContentRow> list = this.content.get(designId);
        if (list == null || list.isEmpty()) {
            throw new NotFoundException();
        }
        
        MockContentRow found = null;
        for (MockContentRow row : list) {
            if (row.designId.equals(designId) && row.type == ApiContentType.Document) {
                found = row;
            }
        }
        
        ApiDesignContent rval = new ApiDesignContent();
        rval.setContentVersion(found.version);
        rval.setOaiDocument(found.data);
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listContentCommands(java.lang.String, java.lang.String, long)
     */
    @Override
    public List<ApiDesignCommand> listContentCommands(String user, String designId, long sinceVersion)
            throws StorageException {
        List<ApiDesignCommand> rval = new ArrayList<>();

        List<MockContentRow> list = this.content.get(designId);
        if (list == null || list.isEmpty()) {
            return rval;
        }

        for (MockContentRow row : list) {
            if (row.designId.equals(designId) && !row.reverted && row.type == ApiContentType.Command && row.version > sinceVersion) {
                ApiDesignCommand cmd = new ApiDesignCommand();
                cmd.setContentVersion(row.version);
                cmd.setCommand(row.data);
                cmd.setAuthor(row.createdBy);
                cmd.setReverted(row.reverted);
                rval.add(cmd);
            }
        }
        
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listAllContentCommands(java.lang.String, java.lang.String, long)
     */
    @Override
    public List<ApiDesignCommand> listAllContentCommands(String userId, String designId, long sinceVersion)
            throws StorageException {
        List<ApiDesignCommand> rval = new ArrayList<>();

        List<MockContentRow> list = this.content.get(designId);
        if (list == null || list.isEmpty()) {
            return rval;
        }

        for (MockContentRow row : list) {
            if (row.designId.equals(designId) && row.type == ApiContentType.Command && row.version > sinceVersion) {
                ApiDesignCommand cmd = new ApiDesignCommand();
                cmd.setContentVersion(row.version);
                cmd.setCommand(row.data);
                cmd.setAuthor(row.createdBy);
                cmd.setReverted(row.reverted);
                rval.add(cmd);
            }
        }
        
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#addContent(java.lang.String, java.lang.String, io.apicurio.hub.core.beans.ApiContentType, java.lang.String)
     */
    @Override
    public long addContent(String user, String designId, ApiContentType type, String data) throws StorageException {
        MockContentRow row = new MockContentRow();
        row.createdBy = user;
        row.data = data;
        row.type = type;
        row.designId = designId;
        this.addContentRow(designId, row);
        return row.version;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#undoContent(java.lang.String, java.lang.String, long)
     */
    @Override
    public boolean undoContent(String user, String designId, long contentVersion) throws StorageException {
        List<MockContentRow> list = this.content.get(designId);
        if (list != null) {
            for (MockContentRow row : list) {
                if (row.version == contentVersion && !row.reverted) {
                    row.reverted = true;
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#redoContent(java.lang.String, java.lang.String, long)
     */
    @Override
    public boolean redoContent(String user, String designId, long contentVersion) throws StorageException {
        List<MockContentRow> list = this.content.get(designId);
        if (list != null) {
            for (MockContentRow row : list) {
                if (row.version == contentVersion && row.reverted) {
                    row.reverted = false;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#createApiDesign(java.lang.String, io.apicurio.hub.core.beans.ApiDesign, java.lang.String)
     */
    @Override
    public String createApiDesign(String userId, ApiDesign design, String initialContent) throws StorageException {
        String designId = String.valueOf(counter++);
        design.setId(designId);
        this.designs.put(designId, design);
        
        MockContentRow contentRow = new MockContentRow();
        contentRow.designId = designId;
        contentRow.type = ApiContentType.Document;
        contentRow.data = initialContent;
        contentRow.createdBy = userId;
        this.addContentRow(designId, contentRow);
        
        this.createPermission(designId, userId, "owner");
        
        return designId;
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#deleteApiDesign(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteApiDesign(String userId, String designId) throws NotFoundException, StorageException {
        if (this.designs.remove(designId) == null) {
            throw new NotFoundException();
        }
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#updateApiDesign(java.lang.String, io.apicurio.hub.core.beans.ApiDesign)
     */
    @Override
    public void updateApiDesign(String userId, ApiDesign design) throws NotFoundException, StorageException {
        ApiDesign savedDesign = this.getApiDesign(userId, design.getId());
        savedDesign.setName(design.getName());
        savedDesign.setDescription(design.getDescription());
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#listApiDesigns(java.lang.String)
     */
    @Override
    public Collection<ApiDesign> listApiDesigns(String userId) throws StorageException {
        return this.designs.values();
    }
    
    @Override
    public Collection<ApiDesign> getRecentApiDesigns(String userId) throws StorageException {
    	Collection<ApiDesign> recent = new ArrayList<>();
    	int counter = 0;
    	for (ApiDesign design : this.designs.values()) {
			if (counter++ < 5) {
				recent.add(design);
			}
		}
        return recent;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#createEditingSessionUuid(java.lang.String, java.lang.String, java.lang.String, java.lang.String, long, long)
     */
    @Override
    public void createEditingSessionUuid(String uuid, String designId, String userId, String hash, long contentVersion,
            long expiresOn) throws StorageException {
        MockUuidRow row = new MockUuidRow();
        row.uuid = uuid;
        row.designId = designId;
        row.userId = userId;
        row.secret = hash;
        row.version = contentVersion;
        row.expiresOn = expiresOn;
        
        String key = uuid + "|" + designId + "|" + userId + "|" + hash;
        this.uuids.put(key, row);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#lookupEditingSessionUuid(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public long lookupEditingSessionUuid(String uuid, String designId, String userId, String hash)
            throws StorageException {
        String key = uuid + "|" + designId + "|" + userId + "|" + hash;
        MockUuidRow row = this.uuids.get(key);
        if (row == null) {
            throw new StorageException("Editing Session UUID not found: " + uuid);
        }
        return row.version;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#consumeEditingSessionUuid(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public boolean consumeEditingSessionUuid(String uuid, String designId, String userId, String hash)
            throws StorageException {
        String key = uuid + "|" + designId + "|" + userId + "|" + hash;
        MockUuidRow row = this.uuids.remove(key);
        if (row == null) {
            return false;
        }
        return true;
    }
    
    /**
     * Adds a content row.
     * @param designId
     * @param row
     */
    public void addContentRow(String designId, MockContentRow row) {
        List<MockContentRow> list = this.content.get(designId);
        if (list == null) {
            list = new ArrayList<>();
            this.content.put(designId, list);
        }
        list.add(row);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#createCollaborationInvite(java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void createCollaborationInvite(String inviteId, String designId, String userId, String username, String role,
            String subject) throws StorageException {
        MockInviteRow row = new MockInviteRow();
        row.inviteId = inviteId;
        row.createdBy = userId;
        row.createdOn = new Date();
        row.designId = designId;
        row.modifiedBy = null;
        row.role = role;
        row.status = "pending";
        row.subject = subject;
        this.invites.put(inviteId, row);
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#updateCollaborationInviteStatus(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public boolean updateCollaborationInviteStatus(String inviteId, String fromStatus, String toStatus, String userId)
            throws StorageException {
        MockInviteRow row = this.invites.get(inviteId);
        if (row == null) {
            return false;
        }
        if (!row.status.equals(fromStatus)) {
            return false;
        }
        row.status = toStatus;
        row.modifiedBy = userId;
        return true;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listCollaborationInvites(java.lang.String, java.lang.String)
     */
    @Override
    public List<Invitation> listCollaborationInvites(String designId, String userId) throws StorageException {
        List<Invitation> invites = new ArrayList<>();
        this.invites.values().forEach( row -> {
            if (row.designId.equals(designId)) {
                Invitation i = new Invitation();
                i.setCreatedBy(row.createdBy);
                i.setCreatedOn(row.createdOn);
                i.setDesignId(designId);
                i.setInviteId(row.inviteId);
                i.setModifiedBy(row.modifiedBy);
                i.setStatus(row.status);
                i.setRole(row.role);
                invites.add(i);
            }
        });
        return invites;
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#getCollaborationInvite(java.lang.String, java.lang.String)
     */
    @Override
    public Invitation getCollaborationInvite(String designId, String inviteId) throws StorageException, NotFoundException {
        List<Invitation> list = listCollaborationInvites(designId, inviteId);
        for (Invitation invitation : list) {
            if (invitation.getInviteId().equals(inviteId)) {
                return invitation;
            }
        }
        throw new NotFoundException();
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listApiDesignActivity(java.lang.String, int, int)
     */
    @Override
    public Collection<ApiDesignChange> listApiDesignActivity(String designId, int from, int to)
            throws StorageException {
        return null;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listUserActivity(java.lang.String, int, int)
     */
    @Override
    public Collection<ApiDesignChange> listUserActivity(String user, int from, int to) throws StorageException {
    	return null;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listApiDesignPublications(java.lang.String, int, int)
     */
    @Override
    public Collection<ApiPublication> listApiDesignPublications(String designId, int from, int to) 
            throws StorageException {
        return null;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#listApiDesignMocks(java.lang.String, int, int)
     */
    @Override
    public Collection<ApiMock> listApiDesignMocks(String designId, int from, int to) throws StorageException {
        return null;
    }
    
    public static class MockContentRow {
        private static long CONTENT_COUNTER = 0;
        
        public String designId;
        final public long version = CONTENT_COUNTER++;
        public ApiContentType type = ApiContentType.Document;
        public String data;
        public String createdBy;
        final public Date createdOn = new Date();
        public boolean reverted;
        public Date modifiedOn;
    }

    public static class MockUuidRow {
        public String uuid;
        public String designId;
        public String userId;
        public String secret;
        public long version;
        public long expiresOn;
    }

    public static class MockInviteRow {
        public String createdBy;
        public Date createdOn;
        public String designId;
        public String role;
        public String inviteId;
        public String status;
        public String modifiedBy;
        public String subject;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#createCodegenProject(java.lang.String, io.apicurio.hub.core.beans.CodegenProject)
     */
    @Override
    public String createCodegenProject(String userId, CodegenProject project) throws StorageException {
        return null;
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#listCodegenProjects(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<CodegenProject> listCodegenProjects(String userId, String designId)
            throws StorageException {
        return null;
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#getCodegenProject(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public CodegenProject getCodegenProject(String userId, String designId, String projectId)
            throws StorageException, NotFoundException {
        return null;
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#deleteCodegenProject(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void deleteCodegenProject(String userId, String designId, String projectId)
            throws NotFoundException, StorageException {
    }

    /**
     * @see io.apicurio.hub.core.storage.IStorage#deleteCodegenProjects(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteCodegenProjects(String userId, String designId)
            throws NotFoundException, StorageException {
    }
    
    /**
     * @see io.apicurio.hub.core.storage.IStorage#updateCodegenProject(java.lang.String, io.apicurio.hub.core.beans.CodegenProject)
     */
    @Override
    public void updateCodegenProject(String userId, CodegenProject project) throws StorageException {
    }

}
