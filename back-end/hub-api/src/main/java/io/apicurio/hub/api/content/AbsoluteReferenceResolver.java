/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.api.content;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.io.IOUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.compat.NodeCompat;
import io.apicurio.datamodels.compat.RegexCompat;
import io.apicurio.datamodels.core.models.Node;

/**
 * Resolves an external HTTP reference to a {@link Node}.  The algorithm is:
 * 
 * 1) Fetch HTTP content to a String representing the external resource
 * 2) Parse the external resource using Jackson
 * 3) Resolve a {@link JsonNode} using the "path" section of the URI (the part after the #)
 * 4) Parse the resulting {@link JsonNode} to a data model {@link Node}
 * 
 * An example of a reference resolvable by this class is:
 * 
 *   https://www.example.com/types/example-types.json#/schemas/FooBarType
 *   
 * This will download the content found at https://www.example.com/types/example-types.json
 * and then return any entity found at path "/schemas/FooBarType".
 * 
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class AbsoluteReferenceResolver extends AbstractReferenceResolver {
    
    private static final ObjectMapper mapper = new ObjectMapper();
    
    /**
     * Constructor.
     */
    public AbsoluteReferenceResolver() {
    }
    
    /**
     * @see io.apicurio.datamodels.core.util.IReferenceResolver#resolveRef(java.lang.String, io.apicurio.datamodels.core.models.Node)
     */
    @Override
    public Node resolveRef(String reference, Node from) {
        try {
            URI uri = new URI(reference);
            String scheme = uri.getScheme();
            if (scheme != null && scheme.toLowerCase().startsWith("http")) {
                return resolveHttpRef(uri, from);
            }
            return null;
        } catch (Exception e) {
            // TODO log this error.
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Resolves an HTTP reference.  See the class javadoc for algorithm details.
     * @param referenceUri
     * @param from
     * @throws IOException 
     * @throws MalformedURLException 
     */
    protected Node resolveHttpRef(URI referenceUri, Node from) throws MalformedURLException, IOException {
        String externalContent = fetchExternalContent(referenceUri);
        if (externalContent == null) {
            return null;
        }
        JsonNode externalContentRoot = parseExternalContent(externalContent);
        if (externalContentRoot == null) {
            return null;
        }
        JsonNode externalEntity = resolveNode(externalContentRoot, referenceUri.getFragment());
        if (externalEntity == null) {
            return null;
        }
        Node externalDataModel = nodeToModel(externalEntity, from);
        return externalDataModel;
    }

    /**
     * @param referenceUri
     * @throws IOException 
     * @throws MalformedURLException 
     */
    protected String fetchExternalContent(URI referenceUri) throws MalformedURLException, IOException {
        HttpURLConnection connection = (HttpURLConnection) referenceUri.toURL().openConnection();
        if (connection.getResponseCode() < 200 || connection.getResponseCode() > 299) {
            return null;
        }
        InputStream contentStream = connection.getInputStream();
        String encoding = connection.getContentEncoding();
        if (encoding == null) {
            encoding = StandardCharsets.UTF_8.name();
        }
        return IOUtils.toString(contentStream, encoding);
    }

    /**
     * @param externalContent
     * @throws JsonProcessingException 
     * @throws JsonMappingException 
     */
    protected JsonNode parseExternalContent(String externalContent) throws JsonMappingException, JsonProcessingException {
        return mapper.readTree(externalContent);
    }

    /**
     * @param externalContentRoot
     * @param fragment
     */
    protected JsonNode resolveNode(JsonNode externalContentRoot, String fragment) {
        List<String[]> split = RegexCompat.findMatches(fragment, "([^/]+)/?");
        JsonNode cnode = externalContentRoot;
        for (String[] mi : split) {
            String seg = mi[1];
            if (NodeCompat.equals(seg, "#")) {
                cnode = externalContentRoot;
            } else if (cnode != null) {
                cnode = cnode.get(seg);
            }
        }
        return cnode;
    }

    /**
     * @param externalEntity
     * @param from
     */
    protected Node nodeToModel(JsonNode externalEntity, Node from) {
        Node emptyClone = ModelCloner.createEmptyClone(from);
        return Library.readNode(externalEntity, emptyClone);
    }

}
