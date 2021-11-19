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
     *
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
     * A statement used to delete the sharing config for a design.
     */
    public String deleteSharingConfig();

    /**
     * Gets sharing config for an API design by design id.
     */
    public String selectSharingConfig();

    /**
     * Gets sharing info for an API design by sharing UUID.
     */
    public String selectSharingInfo();

    /**
     * A statement used to update a row in the sharing table.
     */
    public String upsertSharing();

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
     * A statement used to undo some content.
     */
    public String undoContent();

    /**
     * A statement used to redo some content.
     */
    public String redoContent();

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
     * A statement used to return the latest 'document' style api_content row for
     * a given API design.
     */
    public String selectLatestContentDocumentForSharing();

    /**
     * A statement used to return a 'document' style api_content row for
     * a given API design and version.
     */
    public String selectContentDocumentForVersion();

    /**
     * A statement used to return all of the 'command' style api_content rows for
     * a given API Design (excludes reverted commands).
     */
    public String selectContentCommands();

    /**
     * A statement used to return all of the 'command' style api_content rows for
     * a given API Design, including reverted commands.
     */
    public String selectAllContentCommands();

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

    /**
     * A statement used to select rows from the api_content table (limited by a range) per API.
     */
    public String selectApiDesignActivity();

    /**
     * A statement used to select rows from the api_content table (limited by a range) per user.
     */
    public String selectUserActivity();

    /**
     * A statement used to select rows from the api_content table (limited by a range).  Selects
     * only the publication rows.
     */
    public String selectApiPublicationActivity();

    /**
     * A statement used to select rows from the api_content table (limited by a range).  Selects
     * only the publication rows.  Filters by user.
     */
    public String selectApiPublicationActivityByUser();

    /**
     * A statement used to select rows from the api_content table (limited by a range).  Selects
     * only the mock rows.
     */
    public String selectApiMockActivity();

    /**
     * A statement used to select rows from the api_content table (limited by a range).  Selects
     * only the template rows.
     */
    String selectApiTemplateActivity();

    /**
     * A statement used to select the most recent 5 APIs for a given user.
     */
    public String selectRecentApiDesigns();

    /**
     * A statement used to select the codegen projects for an API design.
     */
    public String selectCodegenProjects();

    /**
     * A statement used to select a single codegen project.
     */
    public String selectCodegenProject();

    /**
     * A statement used to insert a single row on the codegen table.
     */
    public String insertCodegenProject();

    /**
     * A statement used to update a row in the codegen table.
     */
    public String updateCodegenProject();

    /**
     * A statement used to delete a single row in the codegen table.
     */
    public String deleteCodegenProject();

    /**
     * A statement used to delete all rows in the codegen table for a single design_id.
     */
    public String deleteCodegenProjects();

    /**
     * A statement used to select the latest command for a single design_id.
     */
    public String selectLatestContentCommand();

    /**
     * A statement used to select all validation profiles for a user.
     */
    public String selectValidationProfiles();

    /**
     * A statement used to insert a single row on the validation profiles table.
     */
    public String insertValidationProfile();

    /**
     * A statement used to update a row in the validation profiles table.
     */
    public String updateValidationProfile();

    /**
     * A statement used to delete a single row in the validation profiles table.
     */
    public String deleteValidationProfile();

    /**
     * Returns true if the DB supports standard "upsert" syntax (e.g. mysql and postgresql).
     */
    public boolean supportsUpsert();

    /**
     * A statement used to select a single row from the template table.
     */
    public String selectApiTemplate();

    /**
     * A statement used to select all rows from the template table.
     */
    public String selectApiTemplates();

    /**
     * A statement used to select all rows of a given api_type from the template table.
     */
    public String selectApiTemplatesByType();

    /**
     * A statement to insert a single row on the template table
     */
    public String insertApiTemplate();

    /**
     * A statement to update a single row on the template table
     */
    public String updateApiTemplate();

    /**
     * A statement to delete a single row on the template table
     */
    public String deleteApiTemplate();
}
