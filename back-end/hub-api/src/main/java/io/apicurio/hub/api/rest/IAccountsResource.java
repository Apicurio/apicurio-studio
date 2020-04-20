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

package io.apicurio.hub.api.rest;

import java.util.Collection;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import io.apicurio.hub.api.beans.BitbucketRepository;
import io.apicurio.hub.api.beans.BitbucketTeam;
import io.apicurio.hub.api.beans.CompleteLinkedAccount;
import io.apicurio.hub.api.beans.CreateLinkedAccount;
import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.GitLabGroup;
import io.apicurio.hub.api.beans.GitLabProject;
import io.apicurio.hub.api.beans.InitiatedLinkedAccount;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;

/**
 * The interface that defines how to interact with Linked Accounts in the Hub API.
 * 
 * @author eric.wittmann@gmail.com
 */
@Path("accounts")
public interface IAccountsResource {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<LinkedAccount> listLinkedAccounts() throws ServerError;
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public InitiatedLinkedAccount createLinkedAccount(CreateLinkedAccount info) throws ServerError, AlreadyExistsException;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}")
    public LinkedAccount getLinkedAccount(@PathParam("accountType") String accountType) throws ServerError, NotFoundException;

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{accountType}")
    public void completeLinkedAccount(@PathParam("accountType") String accountType, CompleteLinkedAccount update) throws ServerError, NotFoundException;

    @DELETE
    @Path("{accountType}")
    public void deleteLinkedAccount(@PathParam("accountType") String accountType) throws ServerError, NotFoundException;


    /*
     * GitHub specific endpoints - only valid when "accountType" is "GitHub"
     */
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/organizations")
    public Collection<GitHubOrganization> getOrganizations(@PathParam("accountType") String accountType) throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/organizations/{org}/repositories")
    public Collection<GitHubRepository> getRepositories(@PathParam("accountType") String accountType, 
            @PathParam("org") String org) throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/organizations/{org}/repositories/{repo}/branches")
    public Collection<SourceCodeBranch> getRepositoryBranches(@PathParam("accountType") String accountType, 
            @PathParam("org") String org, @PathParam("repo") String repo) throws ServerError;


    /*
     * GitLab specific endpoints - only valid when "accountType" is "GitLab"
     */
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/groups")
    public Collection<GitLabGroup> getGroups(@PathParam("accountType") String accountType) throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/groups/{group}/projects")
    public Collection<GitLabProject> getProjects(@PathParam("accountType") String accountType, 
            @PathParam("group") String group) throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/projects/{projectId}/repository/branches")
    public Collection<SourceCodeBranch> getProjectBranches(@PathParam("accountType") String accountType, 
            @PathParam("projectId") String projectId) throws ServerError;

    /*
     * Bitbucket specific endpoints - only valid when "accountType" is "Bitbucket"
     */
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/teams")
    public Collection<BitbucketTeam> getTeams(@PathParam("accountType") String accountType) throws ServerError;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/teams/{team}/repositories")
    public Collection<BitbucketRepository> getBitbucketRepositories(@PathParam("accountType") String accountType, 
            @PathParam("team") String group) throws ServerError;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{accountType}/teams/{team}/repositories/{repo}/branches")
    public Collection<SourceCodeBranch> getBitbucketBranches(@PathParam("accountType") String accountType, 
            @PathParam("team") String group, @PathParam("repo") String repo) throws ServerError;

}
