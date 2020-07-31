/*
 * Copyright 2019 Red Hat
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

package io.apicurio.hub.api.codegen.jaxrs;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.apicurio.datamodels.cmd.util.ModelUtils;
import io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter;
import io.apicurio.datamodels.compat.NodeCompat;
import io.apicurio.datamodels.openapi.models.OasPathItem;

/**
 * Visitor used to organize all of the paths into a set of interface names.
 * @author eric.wittmann@gmail.com
 */
public class InterfacesVisitor extends CombinedVisitorAdapter {

    private Map<String, InterfaceInfo> interfaces = new HashMap<>();
    
    /**
     * Constructor.
     */
    public InterfacesVisitor() {
    }
    
    public List<InterfaceInfo> getInterfaces() {
        return new ArrayList<>(interfaces.values());
    }
    
    /**
     * @see io.apicurio.datamodels.combined.visitors.CombinedVisitorAdapter#visitPathItem(io.apicurio.datamodels.openapi.models.OasPathItem)
     */
    @Override
    public void visitPathItem(OasPathItem node) {
        String p = node.getPath();
        if (!p.startsWith("/")) {
            p = "/" + p;
        }
        String[] split = p.split("[\\/\\-_]");
        if (ModelUtils.isDefined(split) && split.length > 1) {
            String firstSegment = split[1];
            if (ModelUtils.isDefined(firstSegment) && !NodeCompat.equals(firstSegment, "") && firstSegment.indexOf("{") == -1) {
                String iname = this.capitalize(firstSegment) + "Resource";
                this.addPathTo(p, iname);
                return;
            }
        }
    
        // Default.
        this.addPathTo(p, "RootResource");
    }

    /**
     * Adds a path to an interface.  Creates the interface mapping if it doesn't exist yet.
     * @param path
     * @param interfaceName
     */
    private void addPathTo(String path, String interfaceName) {
        InterfaceInfo info = this.interfaces.get(interfaceName);
        if (info == null) {
            info = new InterfaceInfo();
            info.name = interfaceName;
            info.paths = new ArrayList<>();
            this.interfaces.put(interfaceName, info);
        }

        info.paths.add(path);
    }

    /**
     * Capitalizes a word.
     * @param {string} firstSegment
     * @return {string}
     */
    private String capitalize(String word) {
        String cap = word.substring(0, 1).toUpperCase() + word.substring(1);
        return cap;
    }
    
}
