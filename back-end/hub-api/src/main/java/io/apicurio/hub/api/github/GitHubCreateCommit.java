/*
 * Copyright 2018 JBoss Inc
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

package io.apicurio.hub.api.github;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubCreateCommit {

    private String message;
    private String tree;
    private Set<String> parents = new HashSet<>();
    
    /**
     * Constructor.
     */
    public GitHubCreateCommit() {
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the tree
     */
    public String getTree() {
        return tree;
    }

    /**
     * @param tree the tree to set
     */
    public void setTree(String tree) {
        this.tree = tree;
    }

    /**
     * @return the parents
     */
    public Set<String> getParents() {
        return parents;
    }

    /**
     * @param parents the parents to set
     */
    public void setParents(Set<String> parents) {
        this.parents = parents;
    }
    
    /**
     * Sets the parent sha.
     * @param parentSha
     */
    public void setParents(String parentSha) {
        this.parents = Collections.singleton(parentSha);
    }
}
