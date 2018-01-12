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

package io.apicurio.hub.core.storage.jdbc;

import java.util.List;

/**
 * Returns SQL statements used by the JDB storage implementation.  There are different
 * implementations of this interface depending on the database being used.
 * @author eric.wittmann@gmail.com
 */
public interface ISqlStatements {
    
    /**
     * A statement that returns 'true' if the database has already been initialized.
     */
    public String isDatabaseInitialized();

    /**
     * A sequence of statements needed to initialize the database.
     */
    public List<String> databaseInitialization();

    /**
     * A sequence of statements needed to upgrade the DB from one version to another.
     * @param fromVersion
     * @param toVersion
     */
    public List<String> databaseUpgrade(int fromVersion, int toVersion);


    /**
     * A statement that returns the current DB version (pulled from the "apicurio" attribute table).
     */
    public String getDatabaseVersion();

    /**
     * A statement used to insert a row into the accounts table.
     */
    public String insertLinkedAccount();
    
    /**
     * A statement used to select all API designs.
     */
    public String selectLinkedAccounts();

    /**
     * A statement used to select a single Linked Account by its type (and user).
     */
    public String selectLinkedAccountByType();

    /**
     * A statement used to delete a row from the accounts table.
     */
    public String deleteLinkedAccount();

    /**
     * A statement used to delete all rows from the accounts table (per user).
     */
    public String deleteLinkedAccounts();

    /**
     * A statement used to update information about a linked account.
     */
    public String updateLinkedAccount();

    /**
     * A statement used to insert a row into the api_designs table.
     */
    public String insertApiDesign();

    /**
     * A statement used to delete a row from the api_designs table.
     */
    public String deleteApiDesign();

    /**
     * A statement used to select all API designs.
     */
    public String selectApiDesigns();

    /**
     * A statement used to select a single API design by its unique id.
     */
    public String selectApiDesignById();

    /**
     * A statement used to update a single API design.
     */
    public String updateApiDesign();

    /**
     * A statement used to update the status of an invitation.
     */
    public String updateCollaborationInvitationStatus();

    /**
     * A statement used to insert a row into the acl table.
     */
    public String insertAcl();

    /**
     * A statement used to update a row in the acl table.
     */
    public String updateAcl();

    /**
     * A statement used to delete a row from the acl table.
     */
    public String deleteAcl();

    /**
     * A statement used to insert a content row.
     */
    public String insertContent();

    /**
     * A statement used to delete all acl rows for an api design.
     */
    public String clearAcl();

    /**
     * A statement used to delete all acl_invites rows for an api design.
     */
    public String clearInvitations();

    /**
     * A statement used to delete all api_content rows for a given api design.
     */
    public String clearContent();

    /**
     * A statement used to determine if a user has ownership permission on an API design.
     */
    public String hasOwnerPermission();
    
    /**
     * A statement used to return all rows in the ACL table for a given API design.
     */
    public String selectPermissions();

    /**
     * A statement used to determine if a user has write permission on an API design.
     */
    public String hasWritePermission();

    /**
     * A statement used to return all contributors (editors) of a given API Design.
     */
    public String selectApiDesignContributors();

    /**
     * A statement used to return the latest 'document' style api_content row for
     * a given API design.
     */
    public String selectLatestContentDocument();

    /**
     * A statement used to return all of the 'command' style api_content rows for
     * a given API Design.
     */
    public String selectContentCommands();

    /**
     * A statement used to return all of the collaboration invitations for a given API design.
     */
    public String selectCollaborationInvitations();
    
    /**
     * A statement used to return a single collaboration invitation by its ID for a given API design.
     */
    public String selectCollaborationInvitation();


    /**
     * A statement used to insert a collaboration invitation row into the db.
     */
    public String insertCollaborationInvitation();

    /**
     * A statement used to insert a new row in the 'session_uuids' table.
     */
    public String insertEditingSessionUuid();

    /**
     * A statement used to select a unique editing session UUID.
     */
    public String selectEditingSessionUuid();

    /**
     * A statement used to delete a unique editing session UUID.
     */
    public String deleteEditingSessionUuid();

}
