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

package io.apicurio.hub.core.content;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.datamodels.Library;
import io.apicurio.datamodels.cloning.ModelCloner;
import io.apicurio.datamodels.core.models.Node;
import io.apicurio.datamodels.core.util.IReferenceResolver;
import io.apicurio.datamodels.core.util.ReferenceUtil;

/**
 * A base class for all reference resolvers.  This class handles any common functionality
 * needed by all/many reference resolvers.  Specifically it handles navigating the 
 * JSON tree to find a specific node identified by the "path" portion of an external
 * reference.
 * @author eric.wittmann@gmail.com
 */
public abstract class AbstractReferenceResolver implements IReferenceResolver {

    private static final Logger logger = LoggerFactory.getLogger(AbstractReferenceResolver.class);
    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * @see io.apicurio.datamodels.core.util.IReferenceResolver#resolveRef(java.lang.String, io.apicurio.datamodels.core.models.Node)
     */
    @Override
    public Node resolveRef(String reference, Node from) {
        try {
            URI uri = new URI(reference);
            if (accepts(uri)) {
                return resolveUriRef(uri, from);
            }
            return null;
        } catch (Exception e) {
            logger.error("Error resolving external reference", e);
            return null;
        }
    }

    /**
     * Returns true if this resolver accepts the given URI, indicating that this resolver
     * is capable of resolving the reference.
     * @param uri
     */
    protected abstract boolean accepts(URI uri);

    /**
     * Resolves an HTTP URI reference.  See the class javadoc for algorithm details.
     * @param referenceUri
     * @param from
     * @throws IOException 
     * @throws MalformedURLException 
     */
    protected Node resolveUriRef(URI referenceUri, Node from) throws IOException {
        String externalContent = fetchUriContent(referenceUri);
        if (externalContent == null) {
            return null;
        }
        JsonNode externalContentRoot = parseUriContent(externalContent);
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
     * Fetch the content at the given URI using some sort of implementation-specific approach.
     * @param referenceUri
     * @throws IOException 
     * @throws MalformedURLException 
     */
    protected abstract String fetchUriContent(URI referenceUri) throws IOException;

    /**
     * Parse the given external content.  The content may be JSON or YAML.  This method should 
     * figure out which (or simply try both).
     * 
     * TODO support YAML
     * 
     * @param externalContent
     * @throws JsonProcessingException 
     * @throws JsonMappingException 
     */
    protected JsonNode parseUriContent(String externalContent) throws JsonMappingException, JsonProcessingException {
        return mapper.readTree(externalContent);
    }

    /**
     * Resolves the location within the document by evaluating the fragment and following
     * it to a node within the JSON tree.
     * 
     * @param externalContentRoot
     * @param fragment
     */
    protected JsonNode resolveNode(JsonNode externalContentRoot, String fragment) {
        return (JsonNode) ReferenceUtil.resolveFragmentFromJS(externalContentRoot, fragment);
    }

    /**
     * Converts the resolved JSON node to an instance of an Apicurio data model.
     * @param externalEntity
     * @param from
     */
    protected Node nodeToModel(JsonNode externalEntity, Node from) {
        Node emptyClone = ModelCloner.createEmptyClone(from);
        return Library.readNode(externalEntity, emptyClone);
    }

}
