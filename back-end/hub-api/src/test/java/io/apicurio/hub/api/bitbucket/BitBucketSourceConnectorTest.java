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

package io.apicurio.hub.api.bitbucket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.mashape.unirest.http.exceptions.UnirestException;
import io.apicurio.hub.api.beans.*;
import io.apicurio.hub.api.config.HubApiConfiguration;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.gitlab.GitLabException;
import io.apicurio.hub.api.gitlab.GitLabSourceConnector;
import io.apicurio.hub.api.gitlab.IGitLabSourceConnector;
import org.junit.*;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.TestUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collection;
import java.util.Map;

import static java.awt.SystemColor.info;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

/**
 * @author eric.wittmann@gmail.com
 */
public class BitBucketSourceConnectorTest {

    private static String basicAut = null;

    private IBitBucketSourceConnector service;
    private HubApiConfiguration config;


    @Before
    public void setUp() {
        service = new BitBucketSourceConnector() {
            @Override
            protected String getExternalToken() throws SourceConnectorException {
                try {
                    if (basicAut == null) {
                        // Read the Personal Access Token from standard input so we don't accidentally check it in.
                        // This is a PITA because we have to copy/paste our PAT every time we run this test.  But it's
                        // better than accidentally checking in a GitLab PAT!!
                        System.out.println("Enter your GitLab Personal Access Token:");
                        basicAut = new BufferedReader(new InputStreamReader(System.in)).readLine();
                    }
                    return basicAut;
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

            /**
             * @see BitBucketSourceConnector#getExternalTokenType()
             */
            @Override
            protected Object getExternalTokenType() {
                return BitBucketSourceConnector.TOKEN_TYPE_BASIC;
            }
        };
        config = new HubApiConfiguration();

        TestUtil.setPrivateField(service, "security", new MockSecurityContext());
        TestUtil.setPrivateField(service, "config", config);
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    @Ignore
    public void testGetTeams() throws SourceConnectorException, BitBucketException {
        Collection<BitBucketTeam> teams = service.getTeams();
        assertNotNull(teams);
        assertFalse(teams.isEmpty());

    }

    @Test
    @Ignore
    public void testGetRepositories() throws SourceConnectorException, BitBucketException {
        String team = "innodays";

        Collection<BitBucketRepository> repos = service.getRepositories(team);
        assertNotNull(repos);
        assertFalse(repos.isEmpty());
    }


    @Test
    @Ignore
    public void testGetResourceContent() throws SourceConnectorException, BitBucketException, NotFoundException {
        String url = "https://bitbucket.org/innodays/apicurio_test/src/730d4c6f9d330b8e5a496f1041a7982d9613429e/api/firstAPI.json";

        ResourceContent content = service.getResourceContent(url);
        assertNotNull(content);

    }

    @Test
    @Ignore
    public void testValidateResourceExists() throws SourceConnectorException, BitBucketException, NotFoundException {
        String url = "https://bitbucket.org/innodays/apicurio_test/src/730d4c6f9d330b8e5a496f1041a7982d9613429e/api/firstAPI.json";

        ApiDesignResourceInfo info = service.validateResourceExists(url);
        assertNotNull(info);
    }

    @Test
    @Ignore
    public void testGetCollaborators() throws SourceConnectorException, BitBucketException, NotFoundException, UnirestException {
        String url = "https://bitbucket.org/innodays/apicurio_test/src/730d4c6f9d330b8e5a496f1041a7982d9613429e/api/firstAPI.json";

        Collection<Collaborator> collaborators = service.getCollaborators(url);
        assertNotNull(collaborators);
    }

    @Test
    @Ignore
    public void testCreateResourceContent() throws SourceConnectorException, BitBucketException, NotFoundException, UnirestException {
        String url = "https://bitbucket.org/innodays/apicurio_test/src/notmaster/api/fourthAPI.json";
        String content = "{\"swagger\":\"2.0\",\"info\":{\"title\":\"hello\",\"description\":\"hello\",\"version\":\"1.0.0\"}}";

        service.createResourceContent(url, "testing new message commit message for all", content);
    }
}
