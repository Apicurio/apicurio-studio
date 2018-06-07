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

import java.util.ArrayList;
import java.util.List;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubCreateTree {
    
    private String base_tree;
    private List<GitHubCreateTreeItem> tree = new ArrayList<>();
    
    /**
     * Constructor.
     */
    public GitHubCreateTree() {
    }

    /**
     * @return the base_tree
     */
    public String getBase_tree() {
        return base_tree;
    }

    /**
     * @param base_tree the base_tree to set
     */
    public void setBase_tree(String base_tree) {
        this.base_tree = base_tree;
    }

    /**
     * @return the tree
     */
    public List<GitHubCreateTreeItem> getTree() {
        return tree;
    }

    /**
     * @param tree the tree to set
     */
    public void setTree(List<GitHubCreateTreeItem> tree) {
        this.tree = tree;
    }
    
    /**
     * Adds an item.
     * @param item
     */
    public void addItem(GitHubCreateTreeItem item) {
        this.tree.add(item);
    }

}
