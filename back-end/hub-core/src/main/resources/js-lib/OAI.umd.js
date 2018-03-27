(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.OAI = global.OAI || {})));
}(this, (function (exports) { 'use strict';

/**
 * @license
 * Copyright 2017 Red Hat
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
var __modelIdCounter = 0;
/**
 * Base class for all OAS nodes.  Contains common fields and methods across all
 * nodes of all versions of the OpenAPI Specification.
 */
var OasNode = (function () {
    function OasNode() {
        this._modelId = __modelIdCounter++;
        this._attributes = new OasNodeAttributes();
    }
    /**
     * Gets the owner document.
     * @return {OasDocument}
     */
    OasNode.prototype.ownerDocument = function () {
        return this._ownerDocument;
    };
    /**
     * Gets the parent.
     * @return {OasNode}
     */
    OasNode.prototype.parent = function () {
        return this._parent;
    };
    /**
     * Gets the model's unique ID.
     * @return {number}
     */
    OasNode.prototype.modelId = function () {
        return this._modelId;
    };
    /**
     * Gets or sets a node attribute.  When setting the attribute, the previous value
     * will be returned. Otherwise the current value is returned.
     * @param name
     * @param value
     * @return {any}
     */
    OasNode.prototype.n_attribute = function (name, value) {
        if (value === undefined) {
            return this._attributes[name];
        }
        else {
            var pvalue = this._attributes[name];
            this._attributes[name] = value;
            return pvalue;
        }
    };
    return OasNode;
}());
var OasNodeAttributes = (function () {
    function OasNodeAttributes() {
    }
    return OasNodeAttributes;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$2 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an extension node in an OAS document.  For example, in OAS version 2, any
 * property that begins with "x-" is a valid extension node (vendor extension).
 */
var OasExtension = (function (_super) {
    __extends$2(OasExtension, _super);
    function OasExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given node visitor.  Calls the appropriate method on the visitor.
     * @param visitor
     */
    OasExtension.prototype.accept = function (visitor) {
        visitor.visitExtension(this);
    };
    return OasExtension;
}(OasNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$1 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Base class for all extensible OAS nodes.  Most nodes allow extension properties that
 * being with x-* (OAS 2.0).
 */
var OasExtensibleNode = (function (_super) {
    __extends$1(OasExtensibleNode, _super);
    function OasExtensibleNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns all the extensions.
     * @return {OasExtension[]}
     */
    OasExtensibleNode.prototype.extensions = function () {
        return this._extensions;
    };
    /**
     * Creates an extension.
     * @return {OasExtension}
     */
    OasExtensibleNode.prototype.createExtension = function () {
        var rval = new OasExtension();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Adds an extension.
     * @param name
     * @param value
     */
    OasExtensibleNode.prototype.addExtension = function (name, value) {
        var ext = this.createExtension();
        ext.name = name;
        ext.value = value;
        if (!this._extensions) {
            this._extensions = [];
        }
        this._extensions.push(ext);
        return ext;
    };
    return OasExtensibleNode;
}(OasNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Base class for all OAS documents.  A version-specific implementation of this class
 * is expected for each version of the specification supported by the library.
 */
var OasDocument = (function (_super) {
    __extends(OasDocument, _super);
    function OasDocument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasDocument.prototype.accept = function (visitor) {
        visitor.visitDocument(this);
    };
    /**
     * Returns true if the document is an OpenAPI/Swagger 2.0 document.
     * @return {boolean}
     */
    OasDocument.prototype.is2xDocument = function () {
        return this.getSpecVersion() === "2.0";
    };
    /**
     * Returns true if the document is an OpenAPI 3.x document.
     * @return {boolean}
     */
    OasDocument.prototype.is3xDocument = function () {
        return this.getSpecVersion().indexOf("3.") === 0;
    };
    return OasDocument;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
/**
 * Represents a canonical path to a node within a OAS document model.  The node path
 * can be used to identify and locate a single model in the document tree.
 */
var OasNodePath = (function () {
    function OasNodePath(path) {
        this._segments = [];
        if (path && path.indexOf("/") === 0 && path !== "/") {
            var currentScanType = "path";
            var currentIdx = 1;
            while (currentIdx < path.length) {
                var segStart = currentIdx;
                var segEnd = void 0;
                if (currentScanType === "path") {
                    var nextPathSep = path.indexOf("/", segStart);
                    var nextBrace = path.indexOf("[", segStart);
                    if (nextPathSep === -1) {
                        nextPathSep = path.length;
                    }
                    if (nextBrace === -1) {
                        nextBrace = path.length;
                    }
                    if (nextPathSep <= nextBrace) {
                        segEnd = nextPathSep;
                    }
                    else {
                        segEnd = nextBrace;
                    }
                }
                else {
                    var nextCloseBrace = path.indexOf("]", segStart);
                    if (nextCloseBrace === -1) {
                        nextCloseBrace = path.length;
                    }
                    segEnd = nextCloseBrace + 1;
                }
                var seg = path.substring(segStart, segEnd);
                var segment = OasNodePathSegment.fromString(seg);
                this._segments.push(segment);
                // Default next values.
                currentScanType = "path";
                currentIdx = segEnd + 1;
                // Find real next values.
                if (path.charAt(segEnd) === '/') {
                    currentScanType = "path";
                    currentIdx = segEnd + 1;
                }
                else if (path.charAt(segEnd) === '[') {
                    currentScanType = "index";
                    currentIdx = segEnd;
                }
                else if (path.charAt(segEnd) === ']') {
                    if (path.charAt(segEnd + 1) === '[') {
                        currentScanType = "index";
                        currentIdx = segEnd + 1;
                    }
                    else if (path.charAt(segEnd + 1) === '/') {
                        currentScanType = "path";
                        currentIdx = segEnd + 1;
                    }
                }
            }
        }
    }
    /**
     * Adds a segment to the beginning of the path.
     * @param value
     * @param index
     */
    OasNodePath.prototype.prependSegment = function (value, index) {
        this._segments.unshift(new OasNodePathSegment(value, index));
    };
    /**
     * Adds a segment to the end of the path.
     * @param value
     * @param index
     */
    OasNodePath.prototype.appendSegment = function (value, index) {
        this._segments.push(new OasNodePathSegment(value, index));
    };
    /**
     * Resolves a path to its target node within the document model.  This basically
     * walks the tree according to the path segments until it reaches the node being
     * referenced.  If the path does not point to a valid node, then this method
     * returns undefined.
     * @param document
     * @return {undefined}
     */
    OasNodePath.prototype.resolve = function (document) {
        var node = document;
        for (var _i = 0, _a = this._segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            node = segment.resolve(node);
        }
        return node;
    };
    /**
     * Returns true if this path "contains" the given node.  The path is said to contain
     * a node if the node is visited while resolving it.  In other words, if one of the
     * segments of the path represents the node, then this will return true, otherwise it
     * will return false.
     * @param {OasNode} node
     * @return {boolean}
     */
    OasNodePath.prototype.contains = function (node) {
        var tnode = node.ownerDocument();
        // Of course the root document is always a match.
        if (tnode === node) {
            return true;
        }
        for (var _i = 0, _a = this._segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            tnode = segment.resolve(tnode);
            if (tnode === node) {
                return true;
            }
        }
        return false;
    };
    /**
     * Converts the path to a string.
     */
    OasNodePath.prototype.toString = function () {
        if (this._segments.length === 0) {
            return "/";
        }
        var rval = "";
        for (var _i = 0, _a = this._segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            if (segment.isIndex()) {
                rval += '[' + segment.value() + ']';
            }
            else {
                rval += '/' + segment.value();
            }
        }
        return rval;
    };
    return OasNodePath;
}());
/**
 * Represents a single segment in a model node path.
 */
var OasNodePathSegment = (function () {
    function OasNodePathSegment(value, index) {
        this._index = false;
        this._value = value;
        if (index) {
            this._index = true;
        }
    }
    OasNodePathSegment.prototype.value = function () {
        return this._value;
    };
    OasNodePathSegment.prototype.isIndex = function () {
        return this._index;
    };
    OasNodePathSegment.prototype.resolve = function (node) {
        if (node === null) {
            return null;
        }
        var childNode = null;
        if (this.isIndex() && node["__instanceof_IOasIndexedNode"]) {
            childNode = node.getItem(this.value());
        }
        else {
            childNode = node[this.value()];
            if (childNode === undefined) {
                childNode = null;
            }
        }
        return childNode;
    };
    /**
     * Creates a new segment from a string.
     * @param segment
     * @return {OasNodePathSegment}
     */
    OasNodePathSegment.fromString = function (segment) {
        if (!segment) {
            return new OasNodePathSegment(null);
        }
        if (segment.indexOf("[") !== 0) {
            return new OasNodePathSegment(segment);
        }
        else {
            var bStart = segment.indexOf("[");
            var bEnd = segment.indexOf("]", bStart);
            var value = segment.substring(bStart + 1, bEnd);
            return new OasNodePathSegment(value, true);
        }
    };
    return OasNodePathSegment;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$3 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Contact object.
 */
var OasContact = (function (_super) {
    __extends$3(OasContact, _super);
    function OasContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasContact.prototype.accept = function (visitor) {
        visitor.visitContact(this);
    };
    return OasContact;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$4 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS External Documentation object.
 */
var OasExternalDocumentation = (function (_super) {
    __extends$4(OasExternalDocumentation, _super);
    function OasExternalDocumentation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasExternalDocumentation.prototype.accept = function (visitor) {
        visitor.visitExternalDocumentation(this);
    };
    return OasExternalDocumentation;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$5 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Header object.  Example:
 */
var OasHeader = (function (_super) {
    __extends$5(OasHeader, _super);
    /**
     * Constructor.
     * @param headerName
     */
    function OasHeader(headerName) {
        var _this = _super.call(this) || this;
        _this._headerName = headerName;
        return _this;
    }
    /**
     * Gets the header name.
     * @return {string}
     */
    OasHeader.prototype.headerName = function () {
        return this._headerName;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasHeader.prototype.accept = function (visitor) {
        visitor.visitHeader(this);
    };
    return OasHeader;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$6 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Info object.
 */
var OasInfo = (function (_super) {
    __extends$6(OasInfo, _super);
    function OasInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasInfo.prototype.accept = function (visitor) {
        visitor.visitInfo(this);
    };
    return OasInfo;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$7 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS License object.
 */
var OasLicense = (function (_super) {
    __extends$7(OasLicense, _super);
    function OasLicense() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasLicense.prototype.accept = function (visitor) {
        visitor.visitLicense(this);
    };
    return OasLicense;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 17 Red Hat
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
var __extends$8 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Operation object.
 */
var OasOperation = (function (_super) {
    __extends$8(OasOperation, _super);
    /**
     * Constructor.
     * @param method
     */
    function OasOperation(method) {
        var _this = _super.call(this) || this;
        _this._method = method;
        return _this;
    }
    /**
     * Gets the method for this operation (get, put, post, etc).
     * @return {string}
     */
    OasOperation.prototype.method = function () {
        return this._method;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasOperation.prototype.accept = function (visitor) {
        visitor.visitOperation(this);
    };
    /**
     * Returns a list of parameters with a particular value of "in" (e.g. path, formData, body, etc...).
     * @param _in
     * @return {any}
     */
    OasOperation.prototype.getParameters = function (_in) {
        if (_in === undefined || _in === null || this.parameters === undefined || this.parameters === null) {
            return [];
        }
        else {
            return this.parameters.filter(function (param) {
                return param.in === _in;
            });
        }
    };
    /**
     * Returns a single, unique parameter identified by "in" and "name" (which are the two
     * properties that uniquely identify a parameter).  Returns null if no parameter is found.
     * @param _in
     * @param name
     * @return {OasParameterBase}
     */
    OasOperation.prototype.parameter = function (_in, name) {
        var rval = null;
        this.getParameters(_in).forEach(function (param) {
            if (param.name === name) {
                rval = param;
            }
        });
        return rval;
    };
    /**
     * Adds a parameter.
     * @param parameter
     */
    OasOperation.prototype.addParameter = function (parameter) {
        if (this.parameters == null) {
            this.parameters = [];
        }
        this.parameters.push(parameter);
        return parameter;
    };
    /**
     * Adds a security requirement child.
     * @param securityRequirement
     */
    OasOperation.prototype.addSecurityRequirement = function (securityRequirement) {
        if (this.security == null) {
            this.security = [];
        }
        this.security.push(securityRequirement);
        return securityRequirement;
    };
    return OasOperation;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$9 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Parameter object.
 */
var OasParameterBase = (function (_super) {
    __extends$9(OasParameterBase, _super);
    function OasParameterBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OasParameterBase;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$10 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Path Item object.
 */
var OasPathItem = (function (_super) {
    __extends$10(OasPathItem, _super);
    /**
     * Constructor.
     * @param path
     */
    function OasPathItem(path) {
        var _this = _super.call(this) || this;
        _this._path = path;
        return _this;
    }
    /**
     * Returns the path this object is mapped to.
     * @return {string}
     */
    OasPathItem.prototype.path = function () {
        return this._path;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasPathItem.prototype.accept = function (visitor) {
        visitor.visitPathItem(this);
    };
    /**
     * Adds a parameter.
     * @param param
     */
    OasPathItem.prototype.addParameter = function (param) {
        if (!this.parameters) {
            this.parameters = [];
        }
        this.parameters.push(param);
        return param;
    };
    /**
     * Returns a list of parameters with a particular value of "in" (e.g. path, formData, body, etc...).
     * @param _in
     * @return {any}
     */
    OasPathItem.prototype.getParameters = function (_in) {
        if (_in === undefined || _in === null || this.parameters === undefined || this.parameters === null) {
            return [];
        }
        else {
            return this.parameters.filter(function (param) {
                return param.in === _in;
            });
        }
    };
    /**
     * Returns a single, unique parameter identified by "in" and "name" (which are the two
     * properties that uniquely identify a parameter).  Returns null if no parameter is found.
     * @param _in
     * @param name
     * @return {OasParameterBase}
     */
    OasPathItem.prototype.parameter = function (_in, name) {
        var rval = null;
        this.getParameters(_in).forEach(function (param) {
            if (param.name === name) {
                rval = param;
            }
        });
        return rval;
    };
    return OasPathItem;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$11 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.
 */
var OasPaths = (function (_super) {
    __extends$11(OasPaths, _super);
    function OasPaths() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        _this._pathItems = new OasPathItems();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasPaths.prototype.accept = function (visitor) {
        visitor.visitPaths(this);
    };
    /**
     * Returns a single path item by name.
     * @param name
     * @return {OasPathItem}
     */
    OasPaths.prototype.pathItem = function (name) {
        return this._pathItems[name];
    };
    /**
     * Returns an array of all the path items.
     */
    OasPaths.prototype.pathItems = function () {
        var names = this.pathItemNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.pathItem(name_1));
        }
        return rval;
    };
    /**
     * Adds a path item.
     * @param name
     * @param pathItem
     */
    OasPaths.prototype.addPathItem = function (name, pathItem) {
        this._pathItems[name] = pathItem;
        return pathItem;
    };
    /**
     * Gets a list of all the path names.
     */
    OasPaths.prototype.pathItemNames = function () {
        var rval = [];
        for (var pname in this._pathItems) {
            rval.push(pname);
        }
        return rval;
    };
    /**
     * Removes a single path item child model by name.
     * @param path
     */
    OasPaths.prototype.removePathItem = function (path) {
        var rval = this._pathItems[path];
        if (rval) {
            delete this._pathItems[path];
        }
        return rval;
    };
    OasPaths.prototype.getItem = function (name) {
        return this.pathItem(name);
    };
    OasPaths.prototype.getItems = function () {
        return this.pathItems();
    };
    OasPaths.prototype.getItemNames = function () {
        return this.pathItemNames();
    };
    OasPaths.prototype.addItem = function (name, item) {
        this.addPathItem(name, item);
    };
    OasPaths.prototype.deleteItem = function (name) {
        return this.removePathItem(name);
    };
    return OasPaths;
}(OasExtensibleNode));
var OasPathItems = (function () {
    function OasPathItems() {
    }
    return OasPathItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$12 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Response object.  Example:
 */
var OasResponse = (function (_super) {
    __extends$12(OasResponse, _super);
    function OasResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OasResponse;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$13 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.
 */
var OasResponses = (function (_super) {
    __extends$13(OasResponses, _super);
    function OasResponses() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasResponses.prototype.accept = function (visitor) {
        visitor.visitResponses(this);
    };
    /**
     * Returns a single response by status code.
     * @param statusCode
     * @return {OasResponse}
     */
    OasResponses.prototype.response = function (statusCode) {
        if (this._responses) {
            return this._responses[statusCode];
        }
        else {
            return null;
        }
    };
    /**
     * Returns an array of all the responses.
     */
    OasResponses.prototype.responses = function () {
        var names = this.responseStatusCodes();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.response(name_1));
        }
        if (this.default !== undefined && this.default !== null) {
            rval.push(this.default);
        }
        return rval;
    };
    /**
     * Adds a response.
     * @param name
     * @param response
     */
    OasResponses.prototype.addResponse = function (statusCode, response) {
        if (this._responses == null) {
            this._responses = new OasResponseItems();
        }
        this._responses[statusCode] = response;
        return response;
    };
    /**
     * Removes a single response child model.
     * @param statusCode
     */
    OasResponses.prototype.removeResponse = function (statusCode) {
        var rval = this._responses[statusCode];
        if (this._responses && rval) {
            delete this._responses[statusCode];
        }
        return rval;
    };
    /**
     * Gets a list of all the response status codes.
     */
    OasResponses.prototype.responseStatusCodes = function () {
        var rval = [];
        for (var pname in this._responses) {
            rval.push(pname);
        }
        return rval;
    };
    OasResponses.prototype.getItem = function (name) {
        return this.response(name);
    };
    OasResponses.prototype.getItems = function () {
        return this.responses();
    };
    OasResponses.prototype.getItemNames = function () {
        return this.responseStatusCodes();
    };
    OasResponses.prototype.addItem = function (name, item) {
        this.addResponse(name, item);
    };
    OasResponses.prototype.deleteItem = function (name) {
        return this.removeResponse(name);
    };
    return OasResponses;
}(OasExtensibleNode));
var OasResponseItems = (function () {
    function OasResponseItems() {
    }
    return OasResponseItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$14 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Schema object.
 */
var OasSchema = (function (_super) {
    __extends$14(OasSchema, _super);
    function OasSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasSchema.prototype.accept = function (visitor) {
        visitor.visitSchema(this);
    };
    /**
     * Gets a list of all property names.
     * @return {string[]}
     */
    OasSchema.prototype.propertyNames = function () {
        var rval = [];
        for (var name_1 in this.properties) {
            rval.push(name_1);
        }
        return rval;
    };
    /**
     * Gets a list of all the properties.
     * @return {OasPropertySchema[]}
     */
    OasSchema.prototype.getProperties = function () {
        var names = this.propertyNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_2 = names_1[_i];
            rval.push(this.property(name_2));
        }
        return rval;
    };
    /**
     * Add a property.
     * @param propertyName
     * @param schema
     */
    OasSchema.prototype.addProperty = function (propertyName, schema) {
        if (this.properties == null) {
            this.properties = new OasSchemaProperties();
        }
        this.properties[propertyName] = schema;
        return schema;
    };
    /**
     * Removes a property by name.
     * @param propertyName
     */
    OasSchema.prototype.removeProperty = function (propertyName) {
        var rval = undefined;
        if (this.properties) {
            rval = this.properties[propertyName];
            if (rval) {
                delete this.properties[propertyName];
            }
        }
        return rval;
    };
    /**
     * Gets a single property.
     * @param propertyName
     * @return {null}
     */
    OasSchema.prototype.property = function (propertyName) {
        if (this.properties && this.properties[propertyName]) {
            return this.properties[propertyName];
        }
        else {
            return null;
        }
    };
    return OasSchema;
}(OasExtensibleNode));
var OasSchemaProperties = (function () {
    function OasSchemaProperties() {
    }
    return OasSchemaProperties;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$15 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Security Requirement object.
 */
var OasSecurityRequirement = (function (_super) {
    __extends$15(OasSecurityRequirement, _super);
    function OasSecurityRequirement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._items = new OasSecurityRequirementItems();
        return _this;
    }
    /**
     * Gets the names of all the security requirements.
     * @return {string[]}
     */
    OasSecurityRequirement.prototype.securityRequirementNames = function () {
        var rval = [];
        for (var pname in this._items) {
            rval.push(pname);
        }
        return rval;
    };
    /**
     * Gets the scopes defined for this security requirement.  This is only valid if the
     * type of security is oauth2.
     * @return {string[]}
     */
    OasSecurityRequirement.prototype.scopes = function (name) {
        return this._items[name];
    };
    /**
     * Adds a security requirement item.
     * @param name
     * @param scopes
     */
    OasSecurityRequirement.prototype.addSecurityRequirementItem = function (name, scopes) {
        if (!scopes) {
            scopes = [];
        }
        this._items[name] = scopes;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasSecurityRequirement.prototype.accept = function (visitor) {
        visitor.visitSecurityRequirement(this);
    };
    return OasSecurityRequirement;
}(OasNode));
var OasSecurityRequirementItems = (function () {
    function OasSecurityRequirementItems() {
    }
    return OasSecurityRequirementItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$16 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Security Scheme object.
 */
var OasSecurityScheme = (function (_super) {
    __extends$16(OasSecurityScheme, _super);
    /**
     * Must construct this with a name.
     * @param name
     */
    function OasSecurityScheme(name) {
        var _this = _super.call(this) || this;
        _this._schemeName = name;
        return _this;
    }
    /**
     * Returns the name of the scheme.
     * @return {string}
     */
    OasSecurityScheme.prototype.schemeName = function () {
        return this._schemeName;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasSecurityScheme.prototype.accept = function (visitor) {
        visitor.visitSecurityScheme(this);
    };
    return OasSecurityScheme;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$17 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS Tag object.
 */
var OasTag = (function (_super) {
    __extends$17(OasTag, _super);
    function OasTag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasTag.prototype.accept = function (visitor) {
        visitor.visitTag(this);
    };
    return OasTag;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$18 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS XML object.
 */
var OasXML = (function (_super) {
    __extends$18(OasXML, _super);
    function OasXML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    OasXML.prototype.accept = function (visitor) {
        visitor.visitXML(this);
    };
    return OasXML;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$19 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Contact object.  Example:
 *
 * {
 *   "name": "API Support",
 *   "url": "http://www.swagger.io/support",
 *   "email": "support@swagger.io"
 * }
 */
var Oas20Contact = (function (_super) {
    __extends$19(Oas20Contact, _super);
    function Oas20Contact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas20Contact;
}(OasContact));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$22 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 External Documentation object.  Example:
 *
 * {
 *   "description": "Find more info here",
 *   "url": "https://swagger.io"
 * }
 */
var Oas20ExternalDocumentation = (function (_super) {
    __extends$22(Oas20ExternalDocumentation, _super);
    function Oas20ExternalDocumentation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas20ExternalDocumentation;
}(OasExternalDocumentation));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$23 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 XML object.  Example:
 *
 * {
 *   "Person": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int32",
 *         "xml": {
 *           "attribute": true
 *         }
 *       },
 *       "name": {
 *         "type": "string",
 *         "xml": {
 *           "namespace": "http://swagger.io/schema/sample",
 *           "prefix": "sample"
 *         }
 *       }
 *     }
 *   }
 * }
 */
var Oas20XML = (function (_super) {
    __extends$23(Oas20XML, _super);
    function Oas20XML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas20XML;
}(OasXML));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$21 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Schema object.  Example:
 *
 * {
 *   "type": "object",
 *   "required": [
 *     "name"
 *   ],
 *   "properties": {
 *     "name": {
 *       "type": "string"
 *     },
 *     "address": {
 *       "$ref": "#/definitions/Address"
 *     },
 *     "age": {
 *       "type": "integer",
 *       "format": "int32",
 *       "minimum": 0
 *     }
 *   }
 */
var Oas20Schema = (function (_super) {
    __extends$21(Oas20Schema, _super);
    function Oas20Schema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates a child external documentation model.
     * @return {Oas20ExternalDocumentation}
     */
    Oas20Schema.prototype.createExternalDocumentation = function () {
        var rval = new Oas20ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child XML model.
     * @return {Oas20XML}
     */
    Oas20Schema.prototype.createXML = function () {
        var rval = new Oas20XML();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    Oas20Schema.prototype.createAllOfSchema = function () {
        var rval = new Oas20AllOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    Oas20Schema.prototype.createItemsSchema = function () {
        var rval = new Oas20ItemsSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    Oas20Schema.prototype.createAdditionalPropertiesSchema = function () {
        var rval = new Oas20AdditionalPropertiesSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    Oas20Schema.prototype.createPropertySchema = function (propertyName) {
        var rval = new Oas20PropertySchema(propertyName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Schema;
}(OasSchema));
/**
 * Subclass of Schema to indicate that this is actually a Property schema (a schema
 * defined as a property of another schema).  References:
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.16
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas20PropertySchema = (function (_super) {
    __extends$21(Oas20PropertySchema, _super);
    /**
     * Constructor.
     * @param propertyName
     */
    function Oas20PropertySchema(propertyName) {
        var _this = _super.call(this) || this;
        _this._propertyName = propertyName;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20PropertySchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitPropertySchema(this);
    };
    /**
     * Gets the schema's property name.
     * @return {string}
     */
    Oas20PropertySchema.prototype.propertyName = function () {
        return this._propertyName;
    };
    return Oas20PropertySchema;
}(Oas20Schema));
/**
 * Subclass of Schema to indicate that this is actually an "All Of" schema (a schema
 * included in the array of "allOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 *
 * Example:
 *
 * {
 *   "allOf": [
 *     { "type": "string" },
 *     { "maxLength": 5 }
 *   ]
 * }
 */
var Oas20AllOfSchema = (function (_super) {
    __extends$21(Oas20AllOfSchema, _super);
    function Oas20AllOfSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20AllOfSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitAllOfSchema(this);
    };
    return Oas20AllOfSchema;
}(Oas20Schema));
/**
 * Subclass of Schema to indicate that this is actually an "items" schema (a schema
 * that is assigned to the 'items' property).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.9
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 *
 * Example:
 *
 * {
 *   "items": [
 *     { "type": "string" },
 *     { "maxLength": 5 }
 *   ]
 * }
 */
var Oas20ItemsSchema = (function (_super) {
    __extends$21(Oas20ItemsSchema, _super);
    function Oas20ItemsSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20ItemsSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitItemsSchema(this);
    };
    return Oas20ItemsSchema;
}(Oas20Schema));
/**
 * Subclass of Schema to indicate that this is actually an Additional Properties schema (a schema
 * defined as a property of another schema).  References:
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.18
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas20AdditionalPropertiesSchema = (function (_super) {
    __extends$21(Oas20AdditionalPropertiesSchema, _super);
    function Oas20AdditionalPropertiesSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20AdditionalPropertiesSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitAdditionalPropertiesSchema(this);
    };
    return Oas20AdditionalPropertiesSchema;
}(Oas20Schema));
/**
 * Subclass of Schema to indicate that this is actually a Definition schema (a schema defined in
 * the "definitions" section of the OpenAPI document).  References:
 *
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#definitionsObject
 */
var Oas20SchemaDefinition = (function (_super) {
    __extends$21(Oas20SchemaDefinition, _super);
    /**
     * Constructor.
     * @param definitionName
     */
    function Oas20SchemaDefinition(definitionName) {
        var _this = _super.call(this) || this;
        _this._definitionName = definitionName;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20SchemaDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitSchemaDefinition(this);
    };
    /**
     * Gets the schema's property name.
     * @return {string}
     */
    Oas20SchemaDefinition.prototype.definitionName = function () {
        return this._definitionName;
    };
    return Oas20SchemaDefinition;
}(Oas20Schema));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$20 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Definitions object.  The Definitions object can have any number of child
 * definitions, where the field name is the name of the definition and the value is a schema.
 *
 * {
 *   "Category": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int64"
 *       },
 *       "name": {
 *         "type": "string"
 *       }
 *     }
 *   },
 *   "Tag": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int64"
 *       },
 *       "name": {
 *         "type": "string"
 *       }
 *     }
 *   }
 * }
 */
var Oas20Definitions = (function (_super) {
    __extends$20(Oas20Definitions, _super);
    function Oas20Definitions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        _this._definitions = new Oas20DefinitionItems();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Definitions.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitDefinitions(this);
    };
    /**
     * Returns a single definition schema by name.
     * @param name
     * @return {Oas20SchemaDefinition}
     */
    Oas20Definitions.prototype.definition = function (name) {
        return this._definitions[name];
    };
    /**
     * Returns an array of all the definitions.
     */
    Oas20Definitions.prototype.definitions = function () {
        var names = this.definitionNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.definition(name_1));
        }
        return rval;
    };
    /**
     * Adds a definition.
     * @param name
     * @param schema
     */
    Oas20Definitions.prototype.addDefinition = function (name, schema) {
        this._definitions[name] = schema;
        return schema;
    };
    /**
     * Removes a definition by name.
     * @param name
     */
    Oas20Definitions.prototype.removeDefinition = function (name) {
        var rval = this._definitions[name];
        if (this._definitions && rval) {
            delete this._definitions[name];
        }
        return rval;
    };
    /**
     * Gets a list of all the definition names.
     */
    Oas20Definitions.prototype.definitionNames = function () {
        var rval = [];
        for (var name_2 in this._definitions) {
            rval.push(name_2);
        }
        return rval;
    };
    /**
     * Creates an OAS 2.0 Schema object.
     * @param name
     * @return {Oas20SchemaDefinition}
     */
    Oas20Definitions.prototype.createSchemaDefinition = function (name) {
        var rval = new Oas20SchemaDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    Oas20Definitions.prototype.getItem = function (name) {
        return this.definition(name);
    };
    Oas20Definitions.prototype.getItems = function () {
        return this.definitions();
    };
    Oas20Definitions.prototype.getItemNames = function () {
        return this.definitionNames();
    };
    Oas20Definitions.prototype.addItem = function (name, item) {
        this.addDefinition(name, item);
    };
    Oas20Definitions.prototype.deleteItem = function (name) {
        return this.removeDefinition(name);
    };
    return Oas20Definitions;
}(OasNode));
var Oas20DefinitionItems = (function () {
    function Oas20DefinitionItems() {
    }
    return Oas20DefinitionItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$26 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 License object.  Example:
 *
 * {
 *   "name": "Apache 2.0",
 *   "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 * }
 */
var Oas20License = (function (_super) {
    __extends$26(Oas20License, _super);
    function Oas20License() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas20License;
}(OasLicense));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$25 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Info object.  Example:
 *
 * {
 *   "title": "Swagger Sample App",
 *   "description": "This is a sample server Petstore server.",
 *   "termsOfService": "http://swagger.io/terms/",
 *   "contact": {
 *     "name": "API Support",
 *     "url": "http://www.swagger.io/support",
 *     "email": "support@swagger.io"
 *   },
 *   "license": {
 *     "name": "Apache 2.0",
 *     "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 *   },
 *   "version": "1.0.1"
 * }
 */
var Oas20Info = (function (_super) {
    __extends$25(Oas20Info, _super);
    function Oas20Info() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 2.0 contact object.
     * @return {Oas20Contact}
     */
    Oas20Info.prototype.createContact = function () {
        var rval = new Oas20Contact();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 license object.
     * @return {Oas20License}
     */
    Oas20Info.prototype.createLicense = function () {
        var rval = new Oas20License();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Info;
}(OasInfo));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$27 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Tag object.  Example:
 *
 * {
 *     "name": "pet",
 *     "description": "Pets operations"
 * }
 */
var Oas20Tag = (function (_super) {
    __extends$27(Oas20Tag, _super);
    function Oas20Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 2.0 External Documentation object.
     * @return {Oas20ExternalDocumentation}
     */
    Oas20Tag.prototype.createExternalDocumentation = function () {
        var rval = new Oas20ExternalDocumentation();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    Oas20Tag.prototype.setExternalDocumentation = function (description, url) {
        var edoc = this.createExternalDocumentation();
        edoc.description = description;
        edoc.url = url;
        this.externalDocs = edoc;
        return edoc;
    };
    return Oas20Tag;
}(OasTag));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$28 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Security Requirement object.  Example:
 *
 * {
 *   "petstore_auth": [
 *     "write:pets",
 *     "read:pets"
 *   ]
 * }
 */
var Oas20SecurityRequirement = (function (_super) {
    __extends$28(Oas20SecurityRequirement, _super);
    function Oas20SecurityRequirement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas20SecurityRequirement;
}(OasSecurityRequirement));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$31 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 OAuth Scopes object.  Example:
 *
 * {
 *   "write:pets": "modify pets in your account",
 *   "read:pets": "read your pets"
 * }
 */
var Oas20Scopes = (function (_super) {
    __extends$31(Oas20Scopes, _super);
    function Oas20Scopes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._items = new Oas20ScopeItems();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Scopes.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitScopes(this);
    };
    /**
     * Returns all the scopes.
     * @return {string[]}
     */
    Oas20Scopes.prototype.scopes = function () {
        var rval = [];
        for (var scope in this._items) {
            rval.push(scope);
        }
        return rval;
    };
    /**
     * Gets a scope description.
     * @param scope
     * @return {string}
     */
    Oas20Scopes.prototype.getScopeDescription = function (scope) {
        return this._items[scope];
    };
    /**
     * Adds a scope to the map.
     * @param scope
     * @param description
     */
    Oas20Scopes.prototype.addScope = function (scope, description) {
        this._items[scope] = description;
    };
    /**
     * Removes a scope.
     * @param scope
     */
    Oas20Scopes.prototype.removeScope = function (scope) {
        var rval = this._items[scope];
        if (rval) {
            delete this._items[scope];
        }
        return rval;
    };
    return Oas20Scopes;
}(OasExtensibleNode));
var Oas20ScopeItems = (function () {
    function Oas20ScopeItems() {
    }
    return Oas20ScopeItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$30 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Security Scheme object.  Example:
 *
 * {
 *   "type": "oauth2",
 *   "authorizationUrl": "http://swagger.io/api/oauth/dialog",
 *   "flow": "implicit",
 *   "scopes": {
 *     "write:pets": "modify pets in your account",
 *     "read:pets": "read your pets"
 *   }
 * }
 */
var Oas20SecurityScheme = (function (_super) {
    __extends$30(Oas20SecurityScheme, _super);
    /**
     * Must construct this with a name.
     * @param name
     */
    function Oas20SecurityScheme(name) {
        return _super.call(this, name) || this;
    }
    /**
     * Creates a scopes object.
     */
    Oas20SecurityScheme.prototype.createScopes = function () {
        var rval = new Oas20Scopes();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20SecurityScheme;
}(OasSecurityScheme));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$29 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Security Definitions object.  Example:
 *
 * {
 *   "api_key": {
 *     "type": "apiKey",
 *     "name": "api_key",
 *     "in": "header"
 *   },
 *   "petstore_auth": {
 *     "type": "oauth2",
 *     "authorizationUrl": "http://swagger.io/api/oauth/dialog",
 *     "flow": "implicit",
 *     "scopes": {
 *       "write:pets": "modify pets in your account",
 *       "read:pets": "read your pets"
 *     }
 *   }
 * }
 */
var Oas20SecurityDefinitions = (function (_super) {
    __extends$29(Oas20SecurityDefinitions, _super);
    function Oas20SecurityDefinitions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        _this._items = new Oas20SecuritySchemeItems();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20SecurityDefinitions.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitSecurityDefinitions(this);
    };
    /**
     * Gets a list of all the security scheme names.
     */
    Oas20SecurityDefinitions.prototype.securitySchemeNames = function () {
        var rval = [];
        for (var pname in this._items) {
            rval.push(pname);
        }
        return rval;
    };
    /**
     * Returns a single security scheme by name.
     * @param name
     * @return {Oas20SecurityScheme}
     */
    Oas20SecurityDefinitions.prototype.securityScheme = function (name) {
        return this._items[name];
    };
    /**
     * Returns an array of all the security schemes.
     */
    Oas20SecurityDefinitions.prototype.securitySchemes = function () {
        var names = this.securitySchemeNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.securityScheme(name_1));
        }
        return rval;
    };
    /**
     * Adds a security scheme child node.
     * @param name
     * @param scheme
     */
    Oas20SecurityDefinitions.prototype.addSecurityScheme = function (name, scheme) {
        this._items[name] = scheme;
    };
    /**
     * Removes a single security scheme by name.
     * @param name
     */
    Oas20SecurityDefinitions.prototype.removeSecurityScheme = function (name) {
        var rval = this._items[name];
        if (this._items && rval) {
            delete this._items[name];
        }
        return rval;
    };
    /**
     * Creates a child security scheme object and adds it to the list.
     * @param name
     * @return {Oas20SecurityScheme}
     */
    Oas20SecurityDefinitions.prototype.createSecurityScheme = function (name) {
        var rval = new Oas20SecurityScheme(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    Oas20SecurityDefinitions.prototype.getItem = function (name) {
        return this.securityScheme(name);
    };
    Oas20SecurityDefinitions.prototype.getItems = function () {
        return this.securitySchemes();
    };
    Oas20SecurityDefinitions.prototype.getItemNames = function () {
        return this.securitySchemeNames();
    };
    Oas20SecurityDefinitions.prototype.addItem = function (name, item) {
        this.addSecurityScheme(name, item);
    };
    Oas20SecurityDefinitions.prototype.deleteItem = function (name) {
        return this.removeSecurityScheme(name);
    };
    return Oas20SecurityDefinitions;
}(OasNode));
var Oas20SecuritySchemeItems = (function () {
    function Oas20SecuritySchemeItems() {
    }
    return Oas20SecuritySchemeItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$36 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Items object.  Example:
 */
var Oas20Items = (function (_super) {
    __extends$36(Oas20Items, _super);
    function Oas20Items() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Items.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitItems(this);
    };
    /**
     * Creates a child items model.
     * @return {Oas20Items}
     */
    Oas20Items.prototype.createItems = function () {
        var rval = new Oas20Items();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Items;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$35 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Parameter object.  Example:
 *
 * {
 *   "name": "user",
 *   "in": "body",
 *   "description": "user to add to the system",
 *   "required": true,
 *   "schema": {
 *     "$ref": "#/definitions/User"
 *   }
 * }
 */
var Oas20ParameterBase = (function (_super) {
    __extends$35(Oas20ParameterBase, _super);
    function Oas20ParameterBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates a child schema model.
     * @return {Oas20Schema}
     */
    Oas20ParameterBase.prototype.createSchema = function () {
        var rval = new Oas20Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child items model.
     * @return {Oas20Items}
     */
    Oas20ParameterBase.prototype.createItems = function () {
        var rval = new Oas20Items();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20ParameterBase;
}(OasParameterBase));
/**
 * Extends the base parameter to model a parameter that is a child of the OAS 2.0 Parameters Definitions
 * object.
 */
var Oas20ParameterDefinition = (function (_super) {
    __extends$35(Oas20ParameterDefinition, _super);
    /**
     * Constructor.
     * @param parameterName
     */
    function Oas20ParameterDefinition(parameterName) {
        var _this = _super.call(this) || this;
        _this._parameterName = parameterName;
        return _this;
    }
    /**
     * Gets the parameter name.
     * @return {string}
     */
    Oas20ParameterDefinition.prototype.parameterName = function () {
        return this._parameterName;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20ParameterDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitParameterDefinition(this);
    };
    return Oas20ParameterDefinition;
}(Oas20ParameterBase));
/**
 * Extends the base parameter to add support for references.
 */
var Oas20Parameter = (function (_super) {
    __extends$35(Oas20Parameter, _super);
    function Oas20Parameter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Parameter.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitParameter(this);
    };
    return Oas20Parameter;
}(Oas20ParameterBase));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$40 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Header object.  Example:
 *
 * {
 *   "description": "The number of allowed requests in the current period",
 *   "type": "integer"
 * }
 */
var Oas20Header = (function (_super) {
    __extends$40(Oas20Header, _super);
    /**
     * Constructor.
     * @param headerName
     */
    function Oas20Header(headerName) {
        return _super.call(this, headerName) || this;
    }
    /**
     * Creates a child items model.
     * @return {Oas20Items}
     */
    Oas20Header.prototype.createItems = function () {
        var rval = new Oas20Items();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Header;
}(OasHeader));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$39 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Headers object.  Example:
 *
 * {
 *     "X-Rate-Limit-Limit": {
 *         "description": "The number of allowed requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Remaining": {
 *         "description": "The number of remaining requests in the current period",
 *         "type": "integer"
 *     },
 *     "X-Rate-Limit-Reset": {
 *         "description": "The number of seconds left in the current period",
 *         "type": "integer"
 *     }
 * }
 */
var Oas20Headers = (function (_super) {
    __extends$39(Oas20Headers, _super);
    function Oas20Headers() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Headers.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitHeaders(this);
    };
    /**
     * Creates a header model.
     * @param headerName
     * @return {Oas20Header}
     */
    Oas20Headers.prototype.createHeader = function (headerName) {
        var rval = new Oas20Header(headerName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Gets a single header by name.
     * @param headerName
     * @return {OasHeader}
     */
    Oas20Headers.prototype.header = function (headerName) {
        return this._headers[headerName];
    };
    /**
     * Returns an array of all the headers.
     */
    Oas20Headers.prototype.headers = function () {
        var names = this.headerNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.header(name_1));
        }
        return rval;
    };
    /**
     * Returns all the header names.
     * @return {string[]}
     */
    Oas20Headers.prototype.headerNames = function () {
        var rval = [];
        for (var name_2 in this._headers) {
            rval.push(name_2);
        }
        return rval;
    };
    /**
     * Removes a single header.
     * @param headerName
     */
    Oas20Headers.prototype.removeHeader = function (headerName) {
        var rval = this._headers[headerName];
        if (this._headers && rval) {
            delete this._headers[headerName];
        }
        return rval;
    };
    /**
     * Adds a header.
     * @param headerName
     * @param header
     */
    Oas20Headers.prototype.addHeader = function (headerName, header) {
        if (this._headers == null) {
            this._headers = new OasHeaderItems();
        }
        this._headers[headerName] = header;
        return header;
    };
    Oas20Headers.prototype.getItem = function (name) {
        return this.header(name);
    };
    Oas20Headers.prototype.getItems = function () {
        return this.headers();
    };
    Oas20Headers.prototype.getItemNames = function () {
        return this.headerNames();
    };
    Oas20Headers.prototype.addItem = function (name, item) {
        this.addHeader(name, item);
    };
    Oas20Headers.prototype.deleteItem = function (name) {
        return this.removeHeader(name);
    };
    return Oas20Headers;
}(OasNode));
var OasHeaderItems = (function () {
    function OasHeaderItems() {
    }
    return OasHeaderItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$41 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Example object.  Example:
 *
 * {
 *   "application/json": {
 *     "name": "Puma",
 *     "type": "Dog",
 *     "color": "Black",
 *     "gender": "Female",
 *     "breed": "Mixed"
 *   }
 * }
 */
var Oas20Example = (function (_super) {
    __extends$41(Oas20Example, _super);
    function Oas20Example() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Example.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitExample(this);
    };
    /**
     * Returns an array of all the example content types.
     * @return {string[]}
     */
    Oas20Example.prototype.exampleContentTypes = function () {
        var rval = [];
        for (var ct in this._examples) {
            rval.push(ct);
        }
        return rval;
    };
    /**
     * Gets a single example.
     * @param contentType
     * @return {any}
     */
    Oas20Example.prototype.example = function (contentType) {
        if (this._examples) {
            return this._examples[contentType];
        }
        else {
            return null;
        }
    };
    /**
     * Adds an example.
     * @param contentType
     * @param example
     */
    Oas20Example.prototype.addExample = function (contentType, example) {
        if (!this._examples) {
            this._examples = new Oas20ExampleItems();
        }
        this._examples[contentType] = example;
    };
    /**
     * Removes a single example.
     * @param contentType
     */
    Oas20Example.prototype.removeExample = function (contentType) {
        var rval = undefined;
        if (this._examples) {
            rval = this._examples[contentType];
            if (rval) {
                delete this._examples[contentType];
            }
        }
        return rval;
    };
    return Oas20Example;
}(OasNode));
var Oas20ExampleItems = (function () {
    function Oas20ExampleItems() {
    }
    return Oas20ExampleItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$38 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Response object.  Example:
 *
 * {
 *   "description": "A complex object array response",
 *   "schema": {
 *     "type": "array",
 *     "items": {
 *       "$ref": "#/definitions/VeryComplexType"
 *     }
 *   }
 * }
 */
var Oas20ResponseBase = (function (_super) {
    __extends$38(Oas20ResponseBase, _super);
    function Oas20ResponseBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 2.0 schema object.
     * @return {Oas20Schema}
     */
    Oas20ResponseBase.prototype.createSchema = function () {
        var rval = new Oas20Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 headers object.
     * @return {Oas20Operation}
     */
    Oas20ResponseBase.prototype.createHeaders = function () {
        var rval = new Oas20Headers();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 schema object.
     * @return {Oas20Operation}
     */
    Oas20ResponseBase.prototype.createExample = function () {
        var rval = new Oas20Example();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20ResponseBase;
}(OasResponse));
/**
 * Extends the base Response class in order to also support references and to
 * track the status code the response is mapped to.  This class is used when a
 * response appears as part of a path/operation.
 */
var Oas20Response = (function (_super) {
    __extends$38(Oas20Response, _super);
    /**
     * Constructor.
     * @param statusCode
     */
    function Oas20Response(statusCode) {
        var _this = _super.call(this) || this;
        if (statusCode) {
            _this._statusCode = statusCode;
        }
        else {
            _this._statusCode = null;
        }
        return _this;
    }
    /**
     * Gets the status code.
     * @return {string}
     */
    Oas20Response.prototype.statusCode = function () {
        return this._statusCode;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20Response.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitResponse(this);
    };
    return Oas20Response;
}(Oas20ResponseBase));
/**
 * Extends the base Response class in order to track the name of the response.  This class
 * is used when the response is a globally defined, named response.
 */
var Oas20ResponseDefinition = (function (_super) {
    __extends$38(Oas20ResponseDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas20ResponseDefinition(name) {
        var _this = _super.call(this) || this;
        if (name) {
            _this._name = name;
        }
        else {
            _this._name = null;
        }
        return _this;
    }
    /**
     * Gets the response name.
     * @return {string}
     */
    Oas20ResponseDefinition.prototype.name = function () {
        return this._name;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20ResponseDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitResponseDefinition(this);
    };
    return Oas20ResponseDefinition;
}(Oas20ResponseBase));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$37 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.  Example:
 *
 * {
 *   "200": {
 *     "description": "a pet to be returned",
 *     "schema": {
 *       "$ref": "#/definitions/Pet"
 *     }
 *   },
 *   "default": {
 *     "description": "Unexpected error",
 *     "schema": {
 *       "$ref": "#/definitions/ErrorModel"
 *     }
 *   }
 * }
 */
var Oas20Responses = (function (_super) {
    __extends$37(Oas20Responses, _super);
    function Oas20Responses() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 2.0 response object.
     * @param statusCode
     * @return {Oas20Response}
     */
    Oas20Responses.prototype.createResponse = function (statusCode) {
        var rval = new Oas20Response(statusCode);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Responses;
}(OasResponses));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$34 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Operation object.  Example:
 *
 * {
 *   "tags": [
 *     "pet"
 *   ],
 *   "summary": "Updates a pet in the store with form data",
 *   "description": "",
 *   "operationId": "updatePetWithForm",
 *   "consumes": [
 *     "application/x-www-form-urlencoded"
 *   ],
 *   "produces": [
 *     "application/json",
 *     "application/xml"
 *   ],
 *   "parameters": [
 *     {
 *       "name": "petId",
 *       "in": "path",
 *       "description": "ID of pet that needs to be updated",
 *       "required": true,
 *       "type": "string"
 *     },
 *     {
 *       "name": "name",
 *       "in": "formData",
 *       "description": "Updated name of the pet",
 *       "required": false,
 *       "type": "string"
 *     },
 *     {
 *       "name": "status",
 *       "in": "formData",
 *       "description": "Updated status of the pet",
 *       "required": false,
 *       "type": "string"
 *     }
 *   ],
 *   "responses": {
 *     "200": {
 *       "description": "Pet updated."
 *     },
 *     "405": {
 *       "description": "Invalid input"
 *     }
 *   },
 *   "security": [
 *     {
 *       "petstore_auth": [
 *         "write:pets",
 *         "read:pets"
 *       ]
 *     }
 *   ]
 * }
 */
var Oas20Operation = (function (_super) {
    __extends$34(Oas20Operation, _super);
    /**
     * Constructor.
     * @param method
     */
    function Oas20Operation(method) {
        return _super.call(this, method) || this;
    }
    /**
     * Creates a child external documentation model.
     * @return {Oas20ExternalDocumentation}
     */
    Oas20Operation.prototype.createExternalDocumentation = function () {
        var rval = new Oas20ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child parameter model.
     * @return {Oas20Parameter}
     */
    Oas20Operation.prototype.createParameter = function () {
        var rval = new Oas20Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child responses model.
     * @return {Oas20Responses}
     */
    Oas20Operation.prototype.createResponses = function () {
        var rval = new Oas20Responses();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child security requirement model.
     * @return {Oas20SecurityRequirement}
     */
    Oas20Operation.prototype.createSecurityRequirement = function () {
        var rval = new Oas20SecurityRequirement();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Operation;
}(OasOperation));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$33 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Path Item object.  Example:
 *
 * {
 *   "get": {
 *     "description": "Returns pets based on ID",
 *     "summary": "Find pets by ID",
 *     "operationId": "getPetsById",
 *     "produces": [
 *       "application/json",
 *       "text/html"
 *     ],
 *     "responses": {
 *       "200": {
 *         "description": "pet response",
 *         "schema": {
 *          "type": "array",
 *           "items": {
 *             "$ref": "#/definitions/Pet"
 *           }
 *         }
 *       },
 *       "default": {
 *         "description": "error payload",
 *         "schema": {
 *           "$ref": "#/definitions/ErrorModel"
 *         }
 *       }
 *     }
 *   },
 *   "parameters": [
 *     {
 *       "name": "id",
 *       "in": "path",
 *       "description": "ID of pet to use",
 *       "required": true,
 *       "type": "array",
 *       "items": {
 *         "type": "string"
 *       },
 *       "collectionFormat": "csv"
 *     }
 *   ]
 * }
 *
 */
var Oas20PathItem = (function (_super) {
    __extends$33(Oas20PathItem, _super);
    /**
     * Constructor.
     * @param path
     */
    function Oas20PathItem(path) {
        return _super.call(this, path) || this;
    }
    /**
     * Creates an OAS 2.0 operation object.
     * @param method
     * @return {Oas20Operation}
     */
    Oas20PathItem.prototype.createOperation = function (method) {
        var rval = new Oas20Operation(method);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child parameter.
     * @return {Oas20Parameter}
     */
    Oas20PathItem.prototype.createParameter = function () {
        var rval = new Oas20Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20PathItem;
}(OasPathItem));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$32 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.  Example:
 *
 * {
 *   "/pets": {
 *     "get": {
 *       "description": "Returns all pets from the system that the user has access to",
 *       "produces": [
 *         "application/json"
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "A list of pets.",
 *           "schema": {
 *             "type": "array",
 *             "items": {
 *               "$ref": "#/definitions/pet"
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 *
 */
var Oas20Paths = (function (_super) {
    __extends$32(Oas20Paths, _super);
    function Oas20Paths() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 2.0 path item object.
     * @param path
     * @return {Oas20PathItem}
     */
    Oas20Paths.prototype.createPathItem = function (path) {
        var rval = new Oas20PathItem(path);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas20Paths;
}(OasPaths));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$42 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Parameters Definitions object.  The Parameters Definitions object can have any
 * number of child parameters, where the field name is the name of the parameter and the value is a Parameter
 * object.  Example:
 *
 * {
 *   "skipParam": {
 *     "name": "skip",
 *     "in": "query",
 *     "description": "number of items to skip",
 *     "required": true,
 *     "type": "integer",
 *     "format": "int32"
 *   },
 *   "limitParam": {
 *     "name": "limit",
 *     "in": "query",
 *     "description": "max records to return",
 *     "required": true,
 *     "type": "integer",
 *     "format": "int32"
 *   }
 * }
 */
var Oas20ParametersDefinitions = (function (_super) {
    __extends$42(Oas20ParametersDefinitions, _super);
    function Oas20ParametersDefinitions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        _this._parameters = new Oas20ParametersDefinitionsItems();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20ParametersDefinitions.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitParametersDefinitions(this);
    };
    /**
     * Returns a single parameter by name.
     * @param name
     * @return {Oas20ParameterDefinition}
     */
    Oas20ParametersDefinitions.prototype.parameter = function (name) {
        return this._parameters[name];
    };
    /**
     * Returns an array of all the parameters.
     */
    Oas20ParametersDefinitions.prototype.parameters = function () {
        var names = this.parameterNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.parameter(name_1));
        }
        return rval;
    };
    /**
     * Adds a parameter.
     * @param name
     * @param parameter
     */
    Oas20ParametersDefinitions.prototype.addParameter = function (name, parameter) {
        this._parameters[name] = parameter;
        return parameter;
    };
    /**
     * Removes a parameter by name.
     * @param name
     */
    Oas20ParametersDefinitions.prototype.removeParameter = function (name) {
        var rval = this._parameters[name];
        if (rval) {
            delete this._parameters[name];
        }
        return rval;
    };
    /**
     * Gets a list of all the parameter names.
     */
    Oas20ParametersDefinitions.prototype.parameterNames = function () {
        var rval = [];
        for (var name_2 in this._parameters) {
            rval.push(name_2);
        }
        return rval;
    };
    /**
     * Creates an OAS 2.0 Parameter object.
     * @param name
     * @return {Oas20ParameterDefinition}
     */
    Oas20ParametersDefinitions.prototype.createParameter = function (name) {
        var rval = new Oas20ParameterDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    Oas20ParametersDefinitions.prototype.getItem = function (name) {
        return this.parameter(name);
    };
    Oas20ParametersDefinitions.prototype.getItems = function () {
        return this.parameters();
    };
    Oas20ParametersDefinitions.prototype.getItemNames = function () {
        return this.parameterNames();
    };
    Oas20ParametersDefinitions.prototype.addItem = function (name, item) {
        this.addParameter(name, item);
    };
    Oas20ParametersDefinitions.prototype.deleteItem = function (name) {
        return this.removeParameter(name);
    };
    return Oas20ParametersDefinitions;
}(OasNode));
var Oas20ParametersDefinitionsItems = (function () {
    function Oas20ParametersDefinitionsItems() {
    }
    return Oas20ParametersDefinitionsItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$43 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Responses Definitions object.  The Responses Definitions object can have any
 * number of child responses, where the field name is the name of the response and the value is a Response
 * object.  Example:
 *
 * {
 *   "NotFound": {
 *     "description": "Entity not found."
 *   },
 *   "IllegalInput": {
 *     "description": "Illegal input for operation."
 *   },
 *   "GeneralError": {
 *     "description": "General Error",
 *     "schema": {
 *         "$ref": "#/definitions/GeneralError"
 *     }
 *   }
 * }
 */
var Oas20ResponsesDefinitions = (function (_super) {
    __extends$43(Oas20ResponsesDefinitions, _super);
    function Oas20ResponsesDefinitions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__instanceof_IOasIndexedNode = true;
        _this._responses = new Oas20ResponsesDefinitionsItems();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas20ResponsesDefinitions.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitResponsesDefinitions(this);
    };
    /**
     * Returns a single response by name.
     * @param name
     * @return {Oas20ResponseDefinition}
     */
    Oas20ResponsesDefinitions.prototype.response = function (name) {
        return this._responses[name];
    };
    /**
     * Returns an array of all the responses.
     */
    Oas20ResponsesDefinitions.prototype.responses = function () {
        var names = this.responseNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.response(name_1));
        }
        return rval;
    };
    /**
     * Adds a response.
     * @param name
     * @param response
     */
    Oas20ResponsesDefinitions.prototype.addResponse = function (name, response) {
        this._responses[name] = response;
        return response;
    };
    /**
     * Removes a response by name.
     * @param name
     */
    Oas20ResponsesDefinitions.prototype.removeResponse = function (name) {
        var rval = this._responses[name];
        if (rval) {
            delete this._responses[name];
        }
        return rval;
    };
    /**
     * Gets a list of all the response names.
     */
    Oas20ResponsesDefinitions.prototype.responseNames = function () {
        var rval = [];
        for (var name_2 in this._responses) {
            rval.push(name_2);
        }
        return rval;
    };
    /**
     * Creates an OAS 2.0 Response object.
     * @param name
     * @return {Oas20ResponseDefinition}
     */
    Oas20ResponsesDefinitions.prototype.createResponse = function (name) {
        var rval = new Oas20ResponseDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    Oas20ResponsesDefinitions.prototype.getItem = function (name) {
        return this.response(name);
    };
    Oas20ResponsesDefinitions.prototype.getItems = function () {
        return this.responses();
    };
    Oas20ResponsesDefinitions.prototype.getItemNames = function () {
        return this.responseNames();
    };
    Oas20ResponsesDefinitions.prototype.addItem = function (name, item) {
        this.addResponse(name, item);
    };
    Oas20ResponsesDefinitions.prototype.deleteItem = function (name) {
        return this.removeResponse(name);
    };
    return Oas20ResponsesDefinitions;
}(OasNode));
var Oas20ResponsesDefinitionsItems = (function () {
    function Oas20ResponsesDefinitionsItems() {
    }
    return Oas20ResponsesDefinitionsItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$24 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 document.
 */
var Oas20Document = (function (_super) {
    __extends$24(Oas20Document, _super);
    function Oas20Document() {
        var _this = _super.call(this) || this;
        _this.swagger = "2.0";
        _this._ownerDocument = _this;
        return _this;
    }
    /**
     * Returns the spec version of this document.
     */
    Oas20Document.prototype.getSpecVersion = function () {
        return this.swagger;
    };
    /**
     * Creates an OAS 2.0 info object.
     * @return {Oas20Info}
     */
    Oas20Document.prototype.createInfo = function () {
        var rval = new Oas20Info();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 Definitions object.
     * @return {Oas20Info}
     */
    Oas20Document.prototype.createDefinitions = function () {
        var rval = new Oas20Definitions();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 Tag object.
     * @return {Oas20Info}
     */
    Oas20Document.prototype.createTag = function () {
        var rval = new Oas20Tag();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a tag.
     * @param name
     * @param description
     * @return {Oas20Tag}
     */
    Oas20Document.prototype.addTag = function (name, description) {
        var tag = this.createTag();
        tag.name = name;
        tag.description = description;
        if (!this.tags) {
            this.tags = [];
        }
        this.tags.push(tag);
        return tag;
    };
    /**
     * Creates an OAS 2.0 Security Definition object.
     * @return {Oas20SecurityDefinition}
     */
    Oas20Document.prototype.createSecurityDefinitions = function () {
        var rval = new Oas20SecurityDefinitions();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 Security Requirement object.
     * @return {Oas20SecurityRequirement}
     */
    Oas20Document.prototype.createSecurityRequirement = function () {
        var rval = new Oas20SecurityRequirement();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 External Documentation object.
     * @return {Oas20ExternalDocumentation}
     */
    Oas20Document.prototype.createExternalDocumentation = function () {
        var rval = new Oas20ExternalDocumentation();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    Oas20Document.prototype.setExternalDocumentation = function (description, url) {
        var edoc = this.createExternalDocumentation();
        edoc.description = description;
        edoc.url = url;
        this.externalDocs = edoc;
        return edoc;
    };
    /**
     * Creates an OAS 2.0 Paths object.
     * @return {Oas20Paths}
     */
    Oas20Document.prototype.createPaths = function () {
        var rval = new Oas20Paths();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 Responses Definitions object.
     * @return {Oas20ResponsesDefinitions}
     */
    Oas20Document.prototype.createResponsesDefinitions = function () {
        var rval = new Oas20ResponsesDefinitions();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 2.0 Responses Definitions object.
     * @return {Oas20ParametersDefinitions}
     */
    Oas20Document.prototype.createParametersDefinitions = function () {
        var rval = new Oas20ParametersDefinitions();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    return Oas20Document;
}(OasDocument));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$48 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Server Variable object.
 */
var Oas30ServerVariable = (function (_super) {
    __extends$48(Oas30ServerVariable, _super);
    function Oas30ServerVariable(name) {
        var _this = _super.call(this) || this;
        _this._name = name;
        return _this;
    }
    /**
     * Gets the server variable's name.
     * @return {string}
     */
    Oas30ServerVariable.prototype.name = function () {
        return this._name;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ServerVariable.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitServerVariable(this);
    };
    return Oas30ServerVariable;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$47 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Server object.  Example:
 *
  * {
  *   "url": "https://{username}.gigantic-server.com:{port}/{basePath}",
  *   "description": "The production API server",
  *   "variables": {
  *     "username": {
  *       "default": "demo",
  *       "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"
  *     },
  *     "port": {
  *       "enum": [
  *         8443,
  *         443
  *       ],
  *       "default": 8443
  *     },
  *     "basePath": {
  *       "default": "v2"
  *     }
  *   }
  * }
 */
var Oas30Server = (function (_super) {
    __extends$47(Oas30Server, _super);
    function Oas30Server() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.variables = new Oas30ServerVariables();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Server.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitServer(this);
    };
    /**
     * Creates a server variable.
     * @param name
     * @return {Oas30ServerVariable}
     */
    Oas30Server.prototype.createServerVariable = function (name) {
        var rval = new Oas30ServerVariable(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a server variable.
     * @param name
     * @param serverVariable
     */
    Oas30Server.prototype.addServerVariable = function (name, serverVariable) {
        this.variables[name] = serverVariable;
    };
    /**
     * Gets a single server variable by name.
     * @param name
     * @return {Oas30ServerVariable}
     */
    Oas30Server.prototype.getServerVariable = function (name) {
        return this.variables[name];
    };
    /**
     * Removes a single server variable and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ServerVariable}
     */
    Oas30Server.prototype.removeServerVariable = function (name) {
        var rval = this.variables[name];
        if (rval) {
            delete this.variables[name];
        }
        return rval;
    };
    /**
     * Gets a list of all server variables.
     * @return {Oas30ServerVariable[]}
     */
    Oas30Server.prototype.getServerVariables = function () {
        var rval = [];
        for (var name_1 in this.variables) {
            rval.push(this.variables[name_1]);
        }
        return rval;
    };
    return Oas30Server;
}(OasExtensibleNode));
/**
 * A single server specified in a Link object.
 */
var Oas30LinkServer = (function (_super) {
    __extends$47(Oas30LinkServer, _super);
    function Oas30LinkServer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30LinkServer.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitLinkServer(this);
    };
    return Oas30LinkServer;
}(Oas30Server));
var Oas30ServerVariables = (function () {
    function Oas30ServerVariables() {
    }
    return Oas30ServerVariables;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$52 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 XML object.  Example:
 *
 * {
 *   "Person": {
 *     "type": "object",
 *     "properties": {
 *       "id": {
 *         "type": "integer",
 *         "format": "int32",
 *         "xml": {
 *           "attribute": true
 *         }
 *       },
 *       "name": {
 *         "type": "string",
 *         "xml": {
 *           "namespace": "http://example.com/schema/sample",
 *           "prefix": "sample"
 *         }
 *       }
 *     }
 *   }
 * }
 */
var Oas30XML = (function (_super) {
    __extends$52(Oas30XML, _super);
    function Oas30XML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas30XML;
}(OasXML));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$53 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 External Documentation object.  Example:
 *
 * {
 *   "description": "Find more info here",
 *   "url": "https://example.com"
 * }
 */
var Oas30ExternalDocumentation = (function (_super) {
    __extends$53(Oas30ExternalDocumentation, _super);
    function Oas30ExternalDocumentation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas30ExternalDocumentation;
}(OasExternalDocumentation));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$54 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Discriminator object.  Example:
 *
 * {
 *   "MySchema": {
 *     "oneOf": [
 *       {
 *         "$ref": "#/components/schemas/Cat"
 *       },
 *       {
 *         "$ref": "#/components/schemas/Dog"
 *       },
 *       {
 *         "$ref": "#/components/schemas/Lizard"
 *       },
 *       {
 *         "$ref": "https://gigantic-server.com/schemas/Monster/schema.json"
 *       }
 *     ],
 *     "discriminator": {
 *       "propertyName": "pet_type",
 *       "mapping": {
 *         "dog": "#/components/schemas/Dog",
 *         "monster": "https://gigantic-server.com/schemas/Monster/schema.json"
 *       }
 *     }
 *   }
 * }
 */
var Oas30Discriminator = (function (_super) {
    __extends$54(Oas30Discriminator, _super);
    function Oas30Discriminator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Discriminator.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitDiscriminator(this);
    };
    /**
     * Gets a mapping value by its key.
     * @param key
     * @return {any}
     */
    Oas30Discriminator.prototype.getMapping = function (key) {
        if (this.mapping) {
            return this.mapping[key];
        }
        return null;
    };
    /**
     * Adds a mapping.
     * @param key
     * @param value
     */
    Oas30Discriminator.prototype.addMapping = function (key, value) {
        if (!this.mapping) {
            this.mapping = {};
        }
        this.mapping[key] = value;
    };
    return Oas30Discriminator;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$51 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Schema object.  Example:
 *
 * {
 *   "type": "object",
 *   "required": [
 *     "name"
 *   ],
 *   "properties": {
 *     "name": {
 *       "type": "string"
 *     },
 *     "address": {
 *       "$ref": "#/definitions/Address"
 *     },
 *     "age": {
 *       "type": "integer",
 *       "format": "int32",
 *       "minimum": 0
 *     }
 *   }
 */
var Oas30Schema = (function (_super) {
    __extends$51(Oas30Schema, _super);
    function Oas30Schema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates a child Discriminator model.
     * @return {Oas30Discriminator}
     */
    Oas30Schema.prototype.createDiscriminator = function () {
        var rval = new Oas30Discriminator();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child external documentation model.
     * @return {Oas30ExternalDocumentation}
     */
    Oas30Schema.prototype.createExternalDocumentation = function () {
        var rval = new Oas30ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child XML model.
     * @return {Oas30XML}
     */
    Oas30Schema.prototype.createXML = function () {
        var rval = new Oas30XML();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createAllOfSchema = function () {
        var rval = new Oas30AllOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createOneOfSchema = function () {
        var rval = new Oas30OneOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createAnyOfSchema = function () {
        var rval = new Oas30AnyOfSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createNotSchema = function () {
        var rval = new Oas30NotSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createItemsSchema = function () {
        var rval = new Oas30ItemsSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createAdditionalPropertiesSchema = function () {
        var rval = new Oas30AdditionalPropertiesSchema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30Schema.prototype.createPropertySchema = function (propertyName) {
        var rval = new Oas30PropertySchema(propertyName);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30Schema;
}(OasSchema));
/**
 * Subclass of Schema to indicate that this is actually a Property schema (a schema
 * defined as a property of another schema).  References:
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.16
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas30PropertySchema = (function (_super) {
    __extends$51(Oas30PropertySchema, _super);
    /**
     * Constructor.
     * @param propertyName
     */
    function Oas30PropertySchema(propertyName) {
        var _this = _super.call(this) || this;
        _this._propertyName = propertyName;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30PropertySchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitPropertySchema(this);
    };
    /**
     * Gets the schema's property name.
     * @return {string}
     */
    Oas30PropertySchema.prototype.propertyName = function () {
        return this._propertyName;
    };
    return Oas30PropertySchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually an "All Of" schema (a schema
 * included in the array of "allOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 *
 * Example:
 *
 * {
 *   "allOf": [
 *     { "type": "string" },
 *     { "maxLength": 5 }
 *   ]
 * }
 */
var Oas30AllOfSchema = (function (_super) {
    __extends$51(Oas30AllOfSchema, _super);
    function Oas30AllOfSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30AllOfSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitAllOfSchema(this);
    };
    return Oas30AllOfSchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually an "Any Of" schema (a schema
 * included in the array of "anyOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas30AnyOfSchema = (function (_super) {
    __extends$51(Oas30AnyOfSchema, _super);
    function Oas30AnyOfSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30AnyOfSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitAnyOfSchema(this);
    };
    return Oas30AnyOfSchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually an "One Of" schema (a schema
 * included in the array of "oneOf" schemas, which is a property of any valid schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas30OneOfSchema = (function (_super) {
    __extends$51(Oas30OneOfSchema, _super);
    function Oas30OneOfSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30OneOfSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitOneOfSchema(this);
    };
    return Oas30OneOfSchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually a "Not" schema (a schema
 * set in the "not" property of a schema).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.22
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas30NotSchema = (function (_super) {
    __extends$51(Oas30NotSchema, _super);
    function Oas30NotSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30NotSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitNotSchema(this);
    };
    return Oas30NotSchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually an "items" schema (a schema
 * that is assigned to the 'items' property).
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.9
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 *
 * Example:
 *
 * {
 *   "items": [
 *     { "type": "string" },
 *     { "maxLength": 5 }
 *   ]
 * }
 */
var Oas30ItemsSchema = (function (_super) {
    __extends$51(Oas30ItemsSchema, _super);
    function Oas30ItemsSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ItemsSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitItemsSchema(this);
    };
    return Oas30ItemsSchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually an Additional Properties schema (a schema
 * defined as a property of another schema).  References:
 *
 * http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.18
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
 */
var Oas30AdditionalPropertiesSchema = (function (_super) {
    __extends$51(Oas30AdditionalPropertiesSchema, _super);
    function Oas30AdditionalPropertiesSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30AdditionalPropertiesSchema.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitAdditionalPropertiesSchema(this);
    };
    return Oas30AdditionalPropertiesSchema;
}(Oas30Schema));
/**
 * Subclass of Schema to indicate that this is actually a Definition (a schema defined in
 * the "components" section of the OpenAPI document).
 */
var Oas30SchemaDefinition = (function (_super) {
    __extends$51(Oas30SchemaDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30SchemaDefinition(name) {
        var _this = _super.call(this) || this;
        _this._name = name;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30SchemaDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitSchemaDefinition(this);
    };
    /**
     * Gets the schema's property name.
     * @return {string}
     */
    Oas30SchemaDefinition.prototype.name = function () {
        return this._name;
    };
    return Oas30SchemaDefinition;
}(Oas30Schema));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$55 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Oas30ExampleItems = (function () {
    function Oas30ExampleItems() {
    }
    return Oas30ExampleItems;
}());
/**
 * Models an OAS 3.0 Example object.  Example:
 */
var Oas30Example = (function (_super) {
    __extends$55(Oas30Example, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30Example(name) {
        var _this = _super.call(this) || this;
        _this._name = name;
        return _this;
    }
    /**
     * Returns the name of the example.
     * @return {string}
     */
    Oas30Example.prototype.name = function () {
        return this._name;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Example.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitExample(this);
    };
    return Oas30Example;
}(OasExtensibleNode));
/**
 * Models an Example Definition (in the components section of the OpenAPI 3.0.x document).
 */
var Oas30ExampleDefinition = (function (_super) {
    __extends$55(Oas30ExampleDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30ExampleDefinition(name) {
        return _super.call(this, name) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ExampleDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitExampleDefinition(this);
    };
    return Oas30ExampleDefinition;
}(Oas30Example));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$58 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Parameter object.  Example:
 *
 * {
 *   "name": "token",
 *   "in": "header",
 *   "description": "token to be passed as a header",
 *   "required": true,
 *   "schema": {
 *     "type": "array",
 *     "items": {
 *       "type": "integer",
 *       "format": "int64"
 *     }
 *   },
 *   "style": "commaDelimited"
 * }
 */
var Oas30ParameterBase = (function (_super) {
    __extends$58(Oas30ParameterBase, _super);
    function Oas30ParameterBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.content = new Oas30ParameterContent();
        return _this;
    }
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30ParameterBase.prototype.createSchema = function () {
        var rval = new Oas30Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child Example model.
     * @return {Oas30Example}
     */
    Oas30ParameterBase.prototype.createExample = function (name) {
        var rval = new Oas30Example(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds the Example to the map of examples.
     * @param example
     */
    Oas30ParameterBase.prototype.addExample = function (example) {
        if (!this.examples) {
            this.examples = new Oas30ExampleItems();
        }
        this.examples[example.name()] = example;
    };
    /**
     * Removes an Example and returns it.
     * @param name
     * @return {Oas30Example}
     */
    Oas30ParameterBase.prototype.removeExample = function (name) {
        var rval = null;
        if (this.examples) {
            rval = this.examples[name];
            delete this.examples[name];
        }
        return rval;
    };
    /**
     * Gets a single example by name.
     * @param name
     * @return {any}
     */
    Oas30ParameterBase.prototype.getExample = function (name) {
        if (this.examples) {
            return this.examples[name];
        }
        else {
            return null;
        }
    };
    /**
     * Gets all examples.
     * @return {Oas30Example[]}
     */
    Oas30ParameterBase.prototype.getExamples = function () {
        var examples = [];
        if (this.examples) {
            for (var exampleName in this.examples) {
                var example = this.examples[exampleName];
                examples.push(example);
            }
        }
        return examples;
    };
    /**
     * Creates a media type.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30ParameterBase.prototype.createMediaType = function (name) {
        var rval = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a media type.
     * @param name
     * @param mediaType
     */
    Oas30ParameterBase.prototype.addMediaType = function (name, mediaType) {
        this.content[name] = mediaType;
    };
    /**
     * Gets a single media type by name.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30ParameterBase.prototype.getMediaType = function (name) {
        return this.content[name];
    };
    /**
     * Removes a single media type and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30ParameterBase.prototype.removeMediaType = function (name) {
        var rval = this.content[name];
        if (rval) {
            delete this.content[name];
        }
        return rval;
    };
    /**
     * Gets a list of all media types.
     * @return {Oas30MediaType[]}
     */
    Oas30ParameterBase.prototype.getMediaTypes = function () {
        var rval = [];
        for (var name_1 in this.content) {
            rval.push(this.content[name_1]);
        }
        return rval;
    };
    return Oas30ParameterBase;
}(OasParameterBase));
/**
 * Extends the base parameter to model a parameter that is a child of the OAS 3.0 Parameters Definitions
 * object.
 */
var Oas30ParameterDefinition = (function (_super) {
    __extends$58(Oas30ParameterDefinition, _super);
    /**
     * Constructor.
     * @param parameterName
     */
    function Oas30ParameterDefinition(parameterName) {
        var _this = _super.call(this) || this;
        _this._parameterName = parameterName;
        return _this;
    }
    /**
     * Gets the parameter name.
     * @return {string}
     */
    Oas30ParameterDefinition.prototype.parameterName = function () {
        return this._parameterName;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ParameterDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitParameterDefinition(this);
    };
    return Oas30ParameterDefinition;
}(Oas30ParameterBase));
/**
 * Extends the base parameter to add support for references.
 */
var Oas30Parameter = (function (_super) {
    __extends$58(Oas30Parameter, _super);
    function Oas30Parameter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Parameter.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitParameter(this);
    };
    return Oas30Parameter;
}(Oas30ParameterBase));
var Oas30ParameterContent = (function () {
    function Oas30ParameterContent() {
    }
    return Oas30ParameterContent;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$57 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Header object.  Example:
 *
 * {
 *   "description": "The number of allowed requests in the current period",
 *   "required": true,
 *   "schema": {
 *     "type": "string"
 *   }
 * }
 */
var Oas30Header = (function (_super) {
    __extends$57(Oas30Header, _super);
    /**
     * Constructor.
     * @param headerName
     */
    function Oas30Header(headerName) {
        var _this = _super.call(this, headerName) || this;
        _this.content = new Oas30ParameterContent();
        return _this;
    }
    /**
     * Creates a child items model.
     * @return {Oas30Schema}
     */
    Oas30Header.prototype.createSchema = function () {
        var rval = new Oas30Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child Example model.
     * @return {Oas30Example}
     */
    Oas30Header.prototype.createExample = function (name) {
        var rval = new Oas30Example(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds the Example to the map of examples.
     * @param example
     */
    Oas30Header.prototype.addExample = function (example) {
        if (!this.examples) {
            this.examples = new Oas30ExampleItems();
        }
        this.examples[example.name()] = example;
    };
    /**
     * Removes an Example and returns it.
     * @param name
     * @return {Oas30Example}
     */
    Oas30Header.prototype.removeExample = function (name) {
        var rval = null;
        if (this.examples) {
            rval = this.examples[name];
            delete this.examples[name];
        }
        return rval;
    };
    /**
     * Gets a single example by name.
     * @param name
     * @return {any}
     */
    Oas30Header.prototype.getExample = function (name) {
        if (this.examples) {
            return this.examples[name];
        }
        else {
            return null;
        }
    };
    /**
     * Gets all examples.
     * @return {Oas30Example[]}
     */
    Oas30Header.prototype.getExamples = function () {
        var examples = [];
        if (this.examples) {
            for (var exampleName in this.examples) {
                var example = this.examples[exampleName];
                examples.push(example);
            }
        }
        return examples;
    };
    /**
     * Creates a media type.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30Header.prototype.createMediaType = function (name) {
        var rval = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a media type.
     * @param name
     * @param mediaType
     */
    Oas30Header.prototype.addMediaType = function (name, mediaType) {
        this.content[name] = mediaType;
    };
    /**
     * Gets a single media type by name.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30Header.prototype.getMediaType = function (name) {
        return this.content[name];
    };
    /**
     * Removes a single media type and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30Header.prototype.removeMediaType = function (name) {
        var rval = this.content[name];
        if (rval) {
            delete this.content[name];
        }
        return rval;
    };
    /**
     * Gets a list of all media types.
     * @return {Oas30MediaType[]}
     */
    Oas30Header.prototype.getMediaTypes = function () {
        var rval = [];
        for (var name_1 in this.content) {
            rval.push(this.content[name_1]);
        }
        return rval;
    };
    return Oas30Header;
}(OasHeader));
/**
 * Models a header definition found in the components section of an OAS document.
 */
var Oas30HeaderDefinition = (function (_super) {
    __extends$57(Oas30HeaderDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30HeaderDefinition(name) {
        return _super.call(this, name) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30HeaderDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitHeaderDefinition(this);
    };
    /**
     * Gets the schema's property name.
     * @return {string}
     */
    Oas30HeaderDefinition.prototype.name = function () {
        return this.headerName();
    };
    return Oas30HeaderDefinition;
}(Oas30Header));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$56 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Encoding object.
 */
var Oas30Encoding = (function (_super) {
    __extends$56(Oas30Encoding, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30Encoding(name) {
        var _this = _super.call(this) || this;
        _this.headers = new Oas30EncodingHeaders();
        _this._name = name;
        return _this;
    }
    Oas30Encoding.prototype.name = function () {
        return this._name;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Encoding.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitEncoding(this);
    };
    /**
     * Creates a header.
     * @param name
     * @return {Oas30Header}
     */
    Oas30Encoding.prototype.createHeader = function (name) {
        var rval = new Oas30Header(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a header.
     * @param name
     * @param header
     */
    Oas30Encoding.prototype.addHeader = function (name, header) {
        this.headers[name] = header;
    };
    /**
     * Gets a single header by name.
     * @param name
     * @return {Oas30Header}
     */
    Oas30Encoding.prototype.getHeader = function (name) {
        return this.headers[name];
    };
    /**
     * Removes a single header and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Header}
     */
    Oas30Encoding.prototype.removeHeader = function (name) {
        var rval = this.headers[name];
        if (rval) {
            delete this.headers[name];
        }
        return rval;
    };
    /**
     * Gets a list of all headers.
     * @return {Oas30Header[]}
     */
    Oas30Encoding.prototype.getHeaders = function () {
        var rval = [];
        for (var name_1 in this.headers) {
            rval.push(this.headers[name_1]);
        }
        return rval;
    };
    return Oas30Encoding;
}(OasExtensibleNode));
var Oas30EncodingHeaders = (function () {
    function Oas30EncodingHeaders() {
    }
    return Oas30EncodingHeaders;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$50 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 MediaType object.  Example:
 *
 * {
 *   "application/json": {
 *     "schema": {
 *          "$ref": "#/components/schemas/Pet"
 *     },
 *     "examples": {
 *       "cat" : {
 *         "summary": "An example of a cat",
 *         "value":
 *           {
 *             "name": "Fluffy",
 *             "petType": "Cat",
 *             "color": "White",
 *             "gender": "male",
 *             "breed": "Persian"
 *           }
 *       },
 *       "dog": {
 *         "summary": "An example of a dog with a cat's name",
 *         "value" :  {
 *           "name": "Puma",
 *           "petType": "Dog",
 *           "color": "Black",
 *           "gender": "Female",
 *           "breed": "Mixed"
 *         },
 *       "frog": {
 *           "$ref": "#/components/examples/frog-example"
 *         }
 *       }
 *     }
 *   }
 * }
 */
var Oas30MediaType = (function (_super) {
    __extends$50(Oas30MediaType, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30MediaType(name) {
        var _this = _super.call(this) || this;
        _this.encoding = new Oas30EncodingItems();
        _this._name = name;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30MediaType.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitMediaType(this);
    };
    Oas30MediaType.prototype.name = function () {
        return this._name;
    };
    /**
     * Creates a child schema model.
     * @return {Oas30Schema}
     */
    Oas30MediaType.prototype.createSchema = function () {
        var rval = new Oas30Schema();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a encoding.
     * @param name
     * @return {Oas30Encoding}
     */
    Oas30MediaType.prototype.createEncoding = function (name) {
        var rval = new Oas30Encoding(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a encoding.
     * @param name
     * @param encoding
     */
    Oas30MediaType.prototype.addEncoding = function (name, encoding) {
        this.encoding[name] = encoding;
    };
    /**
     * Gets a single encoding by name.
     * @param name
     * @return {Oas30Encoding}
     */
    Oas30MediaType.prototype.getEncoding = function (name) {
        return this.encoding[name];
    };
    /**
     * Removes a single encoding and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Encoding}
     */
    Oas30MediaType.prototype.removeEncoding = function (name) {
        var rval = this.encoding[name];
        if (rval) {
            delete this.encoding[name];
        }
        return rval;
    };
    /**
     * Gets a list of all encodings.
     * @return {Oas30Encoding[]}
     */
    Oas30MediaType.prototype.getEncodings = function () {
        var rval = [];
        for (var name_1 in this.encoding) {
            rval.push(this.encoding[name_1]);
        }
        return rval;
    };
    /**
     * Creates a child Example model.
     * @return {Oas30Example}
     */
    Oas30MediaType.prototype.createExample = function (name) {
        var rval = new Oas30Example(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds the Example to the map of examples.
     * @param example
     */
    Oas30MediaType.prototype.addExample = function (example) {
        if (!this.examples) {
            this.examples = new Oas30ExampleItems();
        }
        this.examples[example.name()] = example;
    };
    /**
     * Removes an Example and returns it.
     * @param name
     * @return {Oas30Example}
     */
    Oas30MediaType.prototype.removeExample = function (name) {
        var rval = null;
        if (this.examples) {
            rval = this.examples[name];
            delete this.examples[name];
        }
        return rval;
    };
    /**
     * Gets a single example by name.
     * @param name
     * @return {any}
     */
    Oas30MediaType.prototype.getExample = function (name) {
        if (this.examples) {
            return this.examples[name];
        }
        else {
            return null;
        }
    };
    /**
     * Gets all examples.
     * @return {Oas30Example[]}
     */
    Oas30MediaType.prototype.getExamples = function () {
        var examples = [];
        if (this.examples) {
            for (var exampleName in this.examples) {
                var example = this.examples[exampleName];
                examples.push(example);
            }
        }
        return examples;
    };
    return Oas30MediaType;
}(OasExtensibleNode));
var Oas30EncodingItems = (function () {
    function Oas30EncodingItems() {
    }
    return Oas30EncodingItems;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$49 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 RequestBody object.  Example:
 *
 * {
 *  "description": "user to add to the system",
 *  "content": {
 *    "application/json": {
 *      "schema": {
 *        "$ref": "#/components/schemas/User"
 *      },
 *      "examples": {
 *          "user" : {
 *            "summary": "User Example",
 *            "externalValue": "http://foo.bar/examples/user-example.json"
 *          }
 *        }
 *    },
 *    "application/xml": {
 *      "schema": {
 *        "$ref": "#/components/schemas/User"
 *      },
 *      "examples": {
 *          "user" : {
 *            "summary": "User example in XML",
 *            "externalValue": "http://foo.bar/examples/user-example.xml"
 *          }
 *        }
 *    },
 *    "text/plain": {
 *      "examples": {
 *        "user" : {
 *            "summary": "User example in Plain text",
 *            "externalValue": "http://foo.bar/examples/user-example.txt"
 *        }
 *      }
 *    },
 *    "text/*": {
 *      "examples": {
 *        "user" : {
 *            "summary": "User example in other format",
 *            "externalValue": "http://foo.bar/examples/user-example.whatever"
 *        }
 *      }
 *    }
 *  }
 *}
 *
 */
var Oas30RequestBody = (function (_super) {
    __extends$49(Oas30RequestBody, _super);
    function Oas30RequestBody() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.content = new Oas30RequestBodyContent();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30RequestBody.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitRequestBody(this);
    };
    /**
     * Creates a media type.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30RequestBody.prototype.createMediaType = function (name) {
        var rval = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a media type.
     * @param name
     * @param mediaType
     */
    Oas30RequestBody.prototype.addMediaType = function (name, mediaType) {
        this.content[name] = mediaType;
    };
    /**
     * Gets a single media type by name.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30RequestBody.prototype.getMediaType = function (name) {
        return this.content[name];
    };
    /**
     * Removes a single media type and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30RequestBody.prototype.removeMediaType = function (name) {
        var rval = this.content[name];
        if (rval) {
            delete this.content[name];
        }
        return rval;
    };
    /**
     * Gets a list of all media types.
     * @return {Oas30MediaType[]}
     */
    Oas30RequestBody.prototype.getMediaTypes = function () {
        var rval = [];
        for (var name_1 in this.content) {
            rval.push(this.content[name_1]);
        }
        return rval;
    };
    return Oas30RequestBody;
}(OasExtensibleNode));
/**
 * Models a request body definition found in the components section of an OAS document.
 */
var Oas30RequestBodyDefinition = (function (_super) {
    __extends$49(Oas30RequestBodyDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30RequestBodyDefinition(name) {
        var _this = _super.call(this) || this;
        _this._name = name;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30RequestBodyDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitRequestBodyDefinition(this);
    };
    /**
     * Gets the schema's property name.
     * @return {string}
     */
    Oas30RequestBodyDefinition.prototype.name = function () {
        return this._name;
    };
    return Oas30RequestBodyDefinition;
}(Oas30RequestBody));
var Oas30RequestBodyContent = (function () {
    function Oas30RequestBodyContent() {
    }
    return Oas30RequestBodyContent;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$62 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Link Parameter Expression object.
 */
var Oas30LinkParameterExpression = (function (_super) {
    __extends$62(Oas30LinkParameterExpression, _super);
    /**
     * Constructor.
     * @param name
     * @param value
     */
    function Oas30LinkParameterExpression(name, value) {
        var _this = _super.call(this) || this;
        _this._name = name;
        _this._value = value;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30LinkParameterExpression.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitLinkParameterExpression(this);
    };
    /**
     * Gets the name of the expression.
     * @return {string}
     */
    Oas30LinkParameterExpression.prototype.name = function () {
        return this._name;
    };
    /**
     * Get the expression value.
     * @return {string}
     */
    Oas30LinkParameterExpression.prototype.value = function () {
        return this._value;
    };
    /**
     * Returns true if the expression is a dynamic link parameter expression that must be evaluated.
     * @return {boolean}
     */
    Oas30LinkParameterExpression.prototype.isExpression = function () {
        return typeof this.value() === "string" && this.value().indexOf("$") === 0;
    };
    /**
     * Returns true if the expression is just a constant value.
     * @return {boolean}
     */
    Oas30LinkParameterExpression.prototype.isConstant = function () {
        return !this.isExpression();
    };
    return Oas30LinkParameterExpression;
}(OasNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$63 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Link Request Body Expression object.
 */
var Oas30LinkRequestBodyExpression = (function (_super) {
    __extends$63(Oas30LinkRequestBodyExpression, _super);
    /**
     * Constructor.
     * @param value
     */
    function Oas30LinkRequestBodyExpression(value) {
        var _this = _super.call(this) || this;
        _this._value = value;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30LinkRequestBodyExpression.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitLinkRequestBodyExpression(this);
    };
    /**
     * Get the expression value.
     * @return {string}
     */
    Oas30LinkRequestBodyExpression.prototype.value = function () {
        return this._value;
    };
    /**
     * Returns true if the expression is a dynamic link parameter expression that must be evaluated.
     * @return {boolean}
     */
    Oas30LinkRequestBodyExpression.prototype.isExpression = function () {
        return typeof this.value() === "string" && this.value().indexOf("$") === 0;
    };
    /**
     * Returns true if the expression is just a constant value.
     * @return {boolean}
     */
    Oas30LinkRequestBodyExpression.prototype.isConstant = function () {
        return !this.isExpression();
    };
    return Oas30LinkRequestBodyExpression;
}(OasNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$61 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Link object.
 */
var Oas30Link = (function (_super) {
    __extends$61(Oas30Link, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30Link(name) {
        var _this = _super.call(this) || this;
        _this.parameters = new Oas30LinkParameters();
        _this._name = name;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Link.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitLink(this);
    };
    /**
     * Gets the name of the link.
     * @return {string}
     */
    Oas30Link.prototype.name = function () {
        return this._name;
    };
    /**
     * Creates a link parameter expression.
     * @param name
     * @param value
     * @return {Oas30LinkParameterExpression}
     */
    Oas30Link.prototype.createLinkParameterExpression = function (name, value) {
        var rval = new Oas30LinkParameterExpression(name, value);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a link parameter expression.
     * @param name
     * @param expression
     */
    Oas30Link.prototype.addLinkParameterExpression = function (name, expression) {
        this.parameters[name] = expression;
    };
    /**
     * Adds a link parameter expression.
     * @param name
     * @param expression
     * @return {Oas30LinkParameterExpression}
     */
    Oas30Link.prototype.addLinkParameter = function (name, expression) {
        var model = this.createLinkParameterExpression(name, expression);
        this.addLinkParameterExpression(name, model);
        return model;
    };
    /**
     * Gets a single link parameter expression by name.
     * @param name
     * @return {Oas30LinkParameterExpression}
     */
    Oas30Link.prototype.getLinkParameterExpression = function (name) {
        return this.parameters[name];
    };
    /**
     * Removes a single link parameter expression and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30LinkParameterExpression}
     */
    Oas30Link.prototype.removeLinkParameterExpression = function (name) {
        var rval = this.parameters[name];
        if (rval) {
            delete this.parameters[name];
        }
        return rval;
    };
    /**
     * Gets a list of all link parameter expressions.
     * @return {Oas30LinkParameterExpression[]}
     */
    Oas30Link.prototype.getLinkParameterExpressions = function () {
        var rval = [];
        for (var name_1 in this.parameters) {
            rval.push(this.parameters[name_1]);
        }
        return rval;
    };
    /**
     * Creates a link request body expression.
     * @param name
     * @param value
     * @return {Oas30LinkRequestBodyExpression}
     */
    Oas30Link.prototype.createLinkRequestBodyExpression = function (value) {
        var rval = new Oas30LinkRequestBodyExpression(value);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30LinkServer}
     */
    Oas30Link.prototype.createServer = function () {
        var rval = new Oas30LinkServer();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30Link;
}(OasExtensibleNode));
/**
 * Models a link definition found in the components section of an OAS document.
 */
var Oas30LinkDefinition = (function (_super) {
    __extends$61(Oas30LinkDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30LinkDefinition(name) {
        return _super.call(this, name) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30LinkDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitLinkDefinition(this);
    };
    return Oas30LinkDefinition;
}(Oas30Link));
var Oas30LinkParameters = (function () {
    function Oas30LinkParameters() {
    }
    return Oas30LinkParameters;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$60 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Response object.  Example:
 *
 * {
 *   "description": "A complex object array response",
 *   "schema": {
 *     "type": "array",
 *     "items": {
 *       "$ref": "#/definitions/VeryComplexType"
 *     }
 *   }
 * }
 */
var Oas30ResponseBase = (function (_super) {
    __extends$60(Oas30ResponseBase, _super);
    function Oas30ResponseBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headers = new Oas30ResponseHeaders();
        _this.content = new Oas30ResponseContent();
        _this.links = new Oas30Links();
        return _this;
    }
    /**
     * Creates a header.
     * @param name
     * @return {Oas30Header}
     */
    Oas30ResponseBase.prototype.createHeader = function (name) {
        var rval = new Oas30Header(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a header.
     * @param name
     * @param header
     */
    Oas30ResponseBase.prototype.addHeader = function (name, header) {
        this.headers[name] = header;
    };
    /**
     * Gets a single header by name.
     * @param name
     * @return {Oas30Header}
     */
    Oas30ResponseBase.prototype.getHeader = function (name) {
        return this.headers[name];
    };
    /**
     * Removes a single header and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Header}
     */
    Oas30ResponseBase.prototype.removeHeader = function (name) {
        var rval = this.headers[name];
        if (rval) {
            delete this.headers[name];
        }
        return rval;
    };
    /**
     * Gets a list of all headers.
     * @return {Oas30Header[]}
     */
    Oas30ResponseBase.prototype.getHeaders = function () {
        var rval = [];
        for (var name_1 in this.headers) {
            rval.push(this.headers[name_1]);
        }
        return rval;
    };
    /**
     * Creates a media type.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30ResponseBase.prototype.createMediaType = function (name) {
        var rval = new Oas30MediaType(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a media type.
     * @param name
     * @param mediaType
     */
    Oas30ResponseBase.prototype.addMediaType = function (name, mediaType) {
        this.content[name] = mediaType;
    };
    /**
     * Gets a single media type by name.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30ResponseBase.prototype.getMediaType = function (name) {
        return this.content[name];
    };
    /**
     * Removes a single media type and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30MediaType}
     */
    Oas30ResponseBase.prototype.removeMediaType = function (name) {
        var rval = this.content[name];
        if (rval) {
            delete this.content[name];
        }
        return rval;
    };
    /**
     * Gets a list of all media types.
     * @return {Oas30MediaType[]}
     */
    Oas30ResponseBase.prototype.getMediaTypes = function () {
        var rval = [];
        for (var name_2 in this.content) {
            rval.push(this.content[name_2]);
        }
        return rval;
    };
    /**
     * Creates a link.
     * @param name
     * @return {Oas30Link}
     */
    Oas30ResponseBase.prototype.createLink = function (name) {
        var rval = new Oas30Link(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a link.
     * @param name
     * @param link
     */
    Oas30ResponseBase.prototype.addLink = function (name, link) {
        this.links[name] = link;
    };
    /**
     * Gets a single link by name.
     * @param name
     * @return {Oas30Link}
     */
    Oas30ResponseBase.prototype.getLink = function (name) {
        return this.links[name];
    };
    /**
     * Removes a single link and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Link}
     */
    Oas30ResponseBase.prototype.removeLink = function (name) {
        var rval = this.links[name];
        if (rval) {
            delete this.links[name];
        }
        return rval;
    };
    /**
     * Gets a list of all links.
     * @return {Oas30Link[]}
     */
    Oas30ResponseBase.prototype.getLinks = function () {
        var rval = [];
        for (var name_3 in this.links) {
            rval.push(this.links[name_3]);
        }
        return rval;
    };
    return Oas30ResponseBase;
}(OasResponse));
/**
 * Extends the base Response class in order to also support references and to
 * track the status code the response is mapped to.  This class is used when a
 * response appears as part of a path/operation.
 */
var Oas30Response = (function (_super) {
    __extends$60(Oas30Response, _super);
    /**
     * Constructor.
     * @param statusCode
     */
    function Oas30Response(statusCode) {
        var _this = _super.call(this) || this;
        if (statusCode) {
            _this._statusCode = statusCode;
        }
        else {
            _this._statusCode = null;
        }
        return _this;
    }
    /**
     * Gets the status code.
     * @return {string}
     */
    Oas30Response.prototype.statusCode = function () {
        return this._statusCode;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Response.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitResponse(this);
    };
    return Oas30Response;
}(Oas30ResponseBase));
/**
 * Extends the base Response class in order to track the name of the response.  This class
 * is used when the response is a globally defined, named response.
 */
var Oas30ResponseDefinition = (function (_super) {
    __extends$60(Oas30ResponseDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30ResponseDefinition(name) {
        var _this = _super.call(this) || this;
        if (name) {
            _this._name = name;
        }
        else {
            _this._name = null;
        }
        return _this;
    }
    /**
     * Gets the response name.
     * @return {string}
     */
    Oas30ResponseDefinition.prototype.name = function () {
        return this._name;
    };
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ResponseDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitResponseDefinition(this);
    };
    return Oas30ResponseDefinition;
}(Oas30ResponseBase));
var Oas30ResponseHeaders = (function () {
    function Oas30ResponseHeaders() {
    }
    return Oas30ResponseHeaders;
}());
var Oas30ResponseContent = (function () {
    function Oas30ResponseContent() {
    }
    return Oas30ResponseContent;
}());
var Oas30Links = (function () {
    function Oas30Links() {
    }
    return Oas30Links;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$59 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 2.0 Responses object.  The Responses object can have any number of child
 * responses, where the field names are either 'default' or an HTTP status code.  Example:
 *
 * {
 *   "200": {
 *     "description": "a pet to be returned",
 *     "content": {
 *       "application/json": {
 *         "schema": {
 *           "$ref": "#/components/schemas/Pet"
 *         }
 *       }
 *     }
 *   },
 *   "default": {
 *     "description": "Unexpected error",
 *     "content": {
 *       "application/json": {
 *         "schema": {
 *           "$ref": "#/components/schemas/ErrorModel"
 *         }
 *       }
 *     }
 *   }
 * }
 */
var Oas30Responses = (function (_super) {
    __extends$59(Oas30Responses, _super);
    function Oas30Responses() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 3.0 Response object.
     * @param statusCode
     * @return {Oas30Response}
     */
    Oas30Responses.prototype.createResponse = function (statusCode) {
        var rval = new Oas30Response(statusCode);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30Responses;
}(OasResponses));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$64 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Security Requirement object.  Example:
 *
 * {
 *   "petstore_auth": [
 *     "write:pets",
 *     "read:pets"
 *   ]
 * }
 */
var Oas30SecurityRequirement = (function (_super) {
    __extends$64(Oas30SecurityRequirement, _super);
    function Oas30SecurityRequirement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas30SecurityRequirement;
}(OasSecurityRequirement));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$46 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Operation object.  Example:
 *
 * {
 *  "tags": [
 *    "pet"
 *  ],
 *  "summary": "Updates a pet in the store with form data",
 *  "operationId": "updatePetWithForm",
 *  "parameters": [
 *    {
 *      "name": "petId",
 *      "in": "path",
 *      "description": "ID of pet that needs to be updated",
 *      "required": true,
 *      "type": "string"
 *    }
 *  ],
 *  "requestBody": {
 *    "content": {
 *      "application/x-www-form-urlencoded": {
 *        "schema": {
 *          "type": "object",
 *           "properties": {
 *              "name": {
 *                "description": "Updated name of the pet",
 *                "type": "string"
 *              },
 *              "status": {
 *                "description": "Updated status of the pet",
 *                "type": "string"
 *             }
 *           },
 *        "required": ["status"]
 *        }
 *      }
 *    }
 *  },
 *  "responses": {
 *    "200": {
 *      "description": "Pet updated.",
 *      "content": {
 *        "application/json": {},
 *        "application/xml": {}
 *      }
 *    },
 *    "405": {
 *      "description": "Invalid input",
 *      "content": {
 *        "application/json": {},
 *        "application/xml": {}
 *      }
 *    }
 *  },
 *  "security": [
 *    {
 *      "petstore_auth": [
 *        "write:pets",
 *        "read:pets"
 *      ]
 *    }
 *  ]
 * }
 */
var Oas30Operation = (function (_super) {
    __extends$46(Oas30Operation, _super);
    /**
     * Constructor.
     * @param method
     */
    function Oas30Operation(method) {
        var _this = _super.call(this, method) || this;
        _this.callbacks = new Oas30Callbacks();
        return _this;
    }
    /**
     * Creates a child external documentation model.
     * @return {Oas30ExternalDocumentation}
     */
    Oas30Operation.prototype.createExternalDocumentation = function () {
        var rval = new Oas30ExternalDocumentation();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child parameter model.
     * @return {Oas30Parameter}
     */
    Oas30Operation.prototype.createParameter = function () {
        var rval = new Oas30Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child responses model.
     * @return {Oas30Responses}
     */
    Oas30Operation.prototype.createResponses = function () {
        var rval = new Oas30Responses();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child security requirement model.
     * @return {Oas30SecurityRequirement}
     */
    Oas30Operation.prototype.createSecurityRequirement = function () {
        var rval = new Oas30SecurityRequirement();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a callback.
     * @param name
     * @return {Oas30Callback}
     */
    Oas30Operation.prototype.createCallback = function (name) {
        var rval = new Oas30Callback(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a callback.
     * @param name
     * @param callback
     */
    Oas30Operation.prototype.addCallback = function (name, callback) {
        this.callbacks[name] = callback;
    };
    /**
     * Gets a single callback by name.
     * @param name
     * @return {Oas30Callback}
     */
    Oas30Operation.prototype.getCallback = function (name) {
        return this.callbacks[name];
    };
    /**
     * Removes a single callback and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30Callback}
     */
    Oas30Operation.prototype.removeCallback = function (name) {
        var rval = this.callbacks[name];
        if (rval) {
            delete this.callbacks[name];
        }
        return rval;
    };
    /**
     * Gets a list of all callbacks.
     * @return {Oas30Callback[]}
     */
    Oas30Operation.prototype.getCallbacks = function () {
        var rval = [];
        for (var name_1 in this.callbacks) {
            rval.push(this.callbacks[name_1]);
        }
        return rval;
    };
    /**
     * Creates a child RequestBody model.
     * @return {Oas30Callbacks}
     */
    Oas30Operation.prototype.createRequestBody = function () {
        var rval = new Oas30RequestBody();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30Info}
     */
    Oas30Operation.prototype.createServer = function () {
        var rval = new Oas30Server();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30Operation;
}(OasOperation));
var Oas30Callbacks = (function () {
    function Oas30Callbacks() {
    }
    return Oas30Callbacks;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$45 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Path Item object.  Example:
 *
 * {
 *  "get": {
 *    "description": "Returns pets based on ID",
 *    "summary": "Find pets by ID",
 *    "operationId": "getPetsById",
 *    "responses": {
 *      "200": {
 *        "description": "pet response",
 *        "content": {
 *          "application/json": {
 *            "schema": {
 *              "type": "array",
 *              "items": {
 *                "$ref": "#/components/schemas/Pet"
 *              }
 *            }
 *          }
 *        }
 *      },
 *      "default": {
 *        "description": "error payload",
 *        "content": {
 *          "text/html": {
 *            "schema": {
 *              "$ref": "#/components/schemas/ErrorModel"
 *            }
 *          }
 *        }
 *      }
 *    }
 *  },
 *  "parameters": [
 *    {
 *      "name": "id",
 *      "in": "path",
 *      "description": "ID of pet to use",
 *      "required": true,
 *      "type": "array",
 *      "items": {
 *        "type": "string"
 *      },
 *      "style": "commaDelimited"
 *    }
 *  ]
 *}
 */
var Oas30PathItem = (function (_super) {
    __extends$45(Oas30PathItem, _super);
    /**
     * Constructor.
     * @param path
     */
    function Oas30PathItem(path) {
        return _super.call(this, path) || this;
    }
    /**
     * Creates an OAS 3.0 operation object.
     * @param method
     * @return {Oas30Operation}
     */
    Oas30PathItem.prototype.createOperation = function (method) {
        var rval = new Oas30Operation(method);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates a child parameter.
     * @return {Oas30Parameter}
     */
    Oas30PathItem.prototype.createParameter = function () {
        var rval = new Oas30Parameter();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30Info}
     */
    Oas30PathItem.prototype.createServer = function () {
        var rval = new Oas30Server();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30PathItem;
}(OasPathItem));
/**
 * A path item defined within a callback.
 */
var Oas30CallbackPathItem = (function (_super) {
    __extends$45(Oas30CallbackPathItem, _super);
    function Oas30CallbackPathItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30CallbackPathItem.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitCallbackPathItem(this);
    };
    return Oas30CallbackPathItem;
}(Oas30PathItem));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$44 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Callback object.
 */
var Oas30Callback = (function (_super) {
    __extends$44(Oas30Callback, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30Callback(name) {
        var _this = _super.call(this) || this;
        _this.__instanceof_IOasIndexedNode = true;
        _this._pathItems = new OasPathItems();
        _this._name = name;
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Callback.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitCallback(this);
    };
    /**
     * Gets the name of the callback.
     * @return {string}
     */
    Oas30Callback.prototype.name = function () {
        return this._name;
    };
    /**
     * Returns a single path item by name.
     * @param name
     * @return {Oas30CallbackPathItem}
     */
    Oas30Callback.prototype.pathItem = function (name) {
        return this._pathItems[name];
    };
    /**
     * Returns an array of all the path items.
     */
    Oas30Callback.prototype.pathItems = function () {
        var names = this.pathItemNames();
        var rval = [];
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            rval.push(this.pathItem(name_1));
        }
        return rval;
    };
    /**
     * Adds a path item.
     * @param name
     * @param pathItem
     */
    Oas30Callback.prototype.addPathItem = function (name, pathItem) {
        this._pathItems[name] = pathItem;
        return pathItem;
    };
    /**
     * Gets a list of all the path names.
     */
    Oas30Callback.prototype.pathItemNames = function () {
        var rval = [];
        for (var pname in this._pathItems) {
            rval.push(pname);
        }
        return rval;
    };
    /**
     * Removes a single path item child model by name.
     * @param path
     */
    Oas30Callback.prototype.removePathItem = function (path) {
        var rval = this._pathItems[path];
        if (rval) {
            delete this._pathItems[path];
        }
        return rval;
    };
    /**
     * Creates an OAS path item object.
     * @param path
     * @return {Oas30PathItem}
     */
    Oas30Callback.prototype.createPathItem = function (path) {
        var rval = new Oas30CallbackPathItem(path);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    Oas30Callback.prototype.getItem = function (name) {
        return this.pathItem(name);
    };
    Oas30Callback.prototype.getItems = function () {
        return this.pathItems();
    };
    Oas30Callback.prototype.getItemNames = function () {
        return this.pathItemNames();
    };
    Oas30Callback.prototype.addItem = function (name, item) {
        this.addPathItem(name, item);
    };
    Oas30Callback.prototype.deleteItem = function (name) {
        return this.removePathItem(name);
    };
    return Oas30Callback;
}(OasExtensibleNode));
/**
 * Models a callback definition found in the components section of an OAS document.
 */
var Oas30CallbackDefinition = (function (_super) {
    __extends$44(Oas30CallbackDefinition, _super);
    /**
     * Constructor.
     * @param name
     */
    function Oas30CallbackDefinition(name) {
        return _super.call(this, name) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30CallbackDefinition.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitCallbackDefinition(this);
    };
    return Oas30CallbackDefinition;
}(Oas30Callback));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$68 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 OAuth Flow object.
 */
var Oas30OAuthFlow = (function (_super) {
    __extends$68(Oas30OAuthFlow, _super);
    function Oas30OAuthFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas30OAuthFlow.prototype.addScope = function (scope, description) {
        if (!this.scopes) {
            this.scopes = {};
        }
        this.scopes[scope] = description;
    };
    Oas30OAuthFlow.prototype.removeScope = function (scope) {
        if (this.scopes) {
            delete this.scopes[scope];
        }
    };
    Oas30OAuthFlow.prototype.getScopes = function () {
        var scopes = this.scopes;
        if (!scopes) {
            scopes = {};
        }
        var rval = [];
        for (var scope in scopes) {
            rval.push(scope);
        }
        return rval;
    };
    return Oas30OAuthFlow;
}(OasExtensibleNode));
/**
 * Implicit OAuth flow.
 */
var Oas30ImplicitOAuthFlow = (function (_super) {
    __extends$68(Oas30ImplicitOAuthFlow, _super);
    function Oas30ImplicitOAuthFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ImplicitOAuthFlow.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitImplicitOAuthFlow(this);
    };
    return Oas30ImplicitOAuthFlow;
}(Oas30OAuthFlow));
/**
 * Password OAuth flow.
 */
var Oas30PasswordOAuthFlow = (function (_super) {
    __extends$68(Oas30PasswordOAuthFlow, _super);
    function Oas30PasswordOAuthFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30PasswordOAuthFlow.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitPasswordOAuthFlow(this);
    };
    return Oas30PasswordOAuthFlow;
}(Oas30OAuthFlow));
/**
 * ClientCredentials OAuth flow.
 */
var Oas30ClientCredentialsOAuthFlow = (function (_super) {
    __extends$68(Oas30ClientCredentialsOAuthFlow, _super);
    function Oas30ClientCredentialsOAuthFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30ClientCredentialsOAuthFlow.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitClientCredentialsOAuthFlow(this);
    };
    return Oas30ClientCredentialsOAuthFlow;
}(Oas30OAuthFlow));
/**
 * AuthorizationCode OAuth flow.
 */
var Oas30AuthorizationCodeOAuthFlow = (function (_super) {
    __extends$68(Oas30AuthorizationCodeOAuthFlow, _super);
    function Oas30AuthorizationCodeOAuthFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30AuthorizationCodeOAuthFlow.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitAuthorizationCodeOAuthFlow(this);
    };
    return Oas30AuthorizationCodeOAuthFlow;
}(Oas30OAuthFlow));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$67 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 OAuth Flows object.
 */
var Oas30OAuthFlows = (function (_super) {
    __extends$67(Oas30OAuthFlows, _super);
    function Oas30OAuthFlows() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30OAuthFlows.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitOAuthFlows(this);
    };
    /**
     * Creates an OAuth Flow object.
     * @return {Oas30ImplicitOAuthFlow}
     */
    Oas30OAuthFlows.prototype.createImplicitOAuthFlow = function () {
        var rval = new Oas30ImplicitOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAuth Flow object.
     * @return {Oas30PasswordOAuthFlow}
     */
    Oas30OAuthFlows.prototype.createPasswordOAuthFlow = function () {
        var rval = new Oas30PasswordOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAuth Flow object.
     * @return {Oas30ClientCredentialsOAuthFlow}
     */
    Oas30OAuthFlows.prototype.createClientCredentialsOAuthFlow = function () {
        var rval = new Oas30ClientCredentialsOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAuth Flow object.
     * @return {Oas30AuthorizationCodeOAuthFlow}
     */
    Oas30OAuthFlows.prototype.createAuthorizationCodeOAuthFlow = function () {
        var rval = new Oas30AuthorizationCodeOAuthFlow();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30OAuthFlows;
}(OasExtensibleNode));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$66 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Security Scheme object.  Example:
 *
 * {
 *   "type": "oauth2",
 *   "flows": {
 *     "implicit": {
 *       "authorizationUrl": "https://example.com/api/oauth/dialog",
 *       "scopes": {
 *         "write:pets": "modify pets in your account",
 *         "read:pets": "read your pets"
 *       }
 *     }
 *   }
 * }
 */
var Oas30SecurityScheme = (function (_super) {
    __extends$66(Oas30SecurityScheme, _super);
    /**
     * Must construct this with a name.
     * @param name
     */
    function Oas30SecurityScheme(name) {
        return _super.call(this, name) || this;
    }
    /**
     * Creates a OAuth Flows object.
     */
    Oas30SecurityScheme.prototype.createOAuthFlows = function () {
        var rval = new Oas30OAuthFlows();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30SecurityScheme;
}(OasSecurityScheme));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$65 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Components object.  Example:
 *
 * {
 *   "schemas": {
 *       "Category": {
 *         "type": "object",
 *         "properties": {
 *           "id": {
 *             "type": "integer",
 *             "format": "int64"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         }
 *       },
 *       "Tag": {
 *         "type": "object",
 *         "properties": {
 *           "id": {
 *             "type": "integer",
 *             "format": "int64"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         }
 *       }
 *     }
 *   },
 *  "parameters": {
 *     "skipParam": {
 *       "name": "skip",
 *       "in": "query",
 *       "description": "number of items to skip",
 *       "required": true,
 *       "schema": {
 *         "type": "integer",
 *         "format": "int32"
 *       }
 *     },
 *     "limitParam": {
 *       "name": "limit",
 *       "in": "query",
 *       "description": "max records to return",
 *       "required": true,
 *       "schema" : {
 *         "type": "integer",
 *         "format": "int32"
 *       }
 *     }
 *   },
 *  "responses": {
 *     "NotFound": {
 *       "description": "Entity not found."
 *     },
 *     "IllegalInput": {
 *       "description": "Illegal input for operation."
 *     },
 *     "GeneralError": {
 *       "description": "General Error",
 *       "content": {
 *         "application/json": {
 *           "schema": {
 *             "$ref": "#/components/schemas/GeneralError"
 *           }
 *         }
 *       }
 *     }
 *   },
 *  "securitySchemes": {
 *     "api_key": {
 *       "type": "apiKey",
 *       "name": "api_key",
 *       "in": "header"
 *     },
 *     "petstore_auth": {
 *       "type": "oauth2",
 *       "flows": {
 *         "implicit": {
 *           "authorizationUrl": "http://example.org/api/oauth/dialog",
 *           "scopes": {
 *             "write:pets": "modify pets in your account",
 *             "read:pets": "read your pets"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
var Oas30Components = (function (_super) {
    __extends$65(Oas30Components, _super);
    function Oas30Components() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.schemas = new Oas30SchemaComponents();
        _this.responses = new Oas30ResponseComponents();
        _this.parameters = new Oas30ParameterComponents();
        _this.examples = new Oas30ExampleComponents();
        _this.requestBodies = new Oas30RequestBodyComponents();
        _this.headers = new Oas30HeaderComponents();
        _this.securitySchemes = new Oas30SecuritySchemeComponents();
        _this.links = new Oas30LinkComponents();
        _this.callbacks = new Oas30CallbackComponents();
        return _this;
    }
    /**
     * Accepts the given OAS node visitor and calls the appropriate method on it to visit this node.
     * @param visitor
     */
    Oas30Components.prototype.accept = function (visitor) {
        var viz = visitor;
        viz.visitComponents(this);
    };
    /**
     * Creates a schema definition.
     * @param name
     * @return {Oas30SchemaDefinition}
     */
    Oas30Components.prototype.createSchemaDefinition = function (name) {
        var rval = new Oas30SchemaDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a schema definition.
     * @param name
     * @param schemaDefinition
     */
    Oas30Components.prototype.addSchemaDefinition = function (name, schemaDefinition) {
        this.schemas[name] = schemaDefinition;
    };
    /**
     * Gets a single schema definition by name.
     * @param name
     * @return {Oas30SchemaDefinition}
     */
    Oas30Components.prototype.getSchemaDefinition = function (name) {
        return this.schemas[name];
    };
    /**
     * Removes a single schema definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30SchemaDefinition}
     */
    Oas30Components.prototype.removeSchemaDefinition = function (name) {
        var rval = this.schemas[name];
        if (rval) {
            delete this.schemas[name];
        }
        return rval;
    };
    /**
     * Gets a list of all schema definitions.
     * @return {Oas30SchemaDefinition[]}
     */
    Oas30Components.prototype.getSchemaDefinitions = function () {
        var rval = [];
        for (var name_1 in this.schemas) {
            rval.push(this.schemas[name_1]);
        }
        return rval;
    };
    /**
     * Creates a response definition.
     * @param name
     * @return {Oas30ResponseDefinition}
     */
    Oas30Components.prototype.createResponseDefinition = function (name) {
        var rval = new Oas30ResponseDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a response definition.
     * @param name
     * @param responseDefinition
     */
    Oas30Components.prototype.addResponseDefinition = function (name, responseDefinition) {
        this.responses[name] = responseDefinition;
    };
    /**
     * Gets a single response definition by name.
     * @param name
     * @return {Oas30ResponseDefinition}
     */
    Oas30Components.prototype.getResponseDefinition = function (name) {
        return this.responses[name];
    };
    /**
     * Removes a single response definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ResponseDefinition}
     */
    Oas30Components.prototype.removeResponseDefinition = function (name) {
        var rval = this.responses[name];
        if (rval) {
            delete this.responses[name];
        }
        return rval;
    };
    /**
     * Gets a list of all response definitions.
     * @return {Oas30ResponseDefinition[]}
     */
    Oas30Components.prototype.getResponseDefinitions = function () {
        var rval = [];
        for (var name_2 in this.responses) {
            rval.push(this.responses[name_2]);
        }
        return rval;
    };
    /**
     * Creates a parameter definition.
     * @param name
     * @return {Oas30ParameterDefinition}
     */
    Oas30Components.prototype.createParameterDefinition = function (name) {
        var rval = new Oas30ParameterDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a parameter definition.
     * @param name
     * @param parameterDefinition
     */
    Oas30Components.prototype.addParameterDefinition = function (name, parameterDefinition) {
        this.parameters[name] = parameterDefinition;
    };
    /**
     * Gets a single parameter definition by name.
     * @param name
     * @return {Oas30ParameterDefinition}
     */
    Oas30Components.prototype.getParameterDefinition = function (name) {
        return this.parameters[name];
    };
    /**
     * Removes a single parameter definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ParameterDefinition}
     */
    Oas30Components.prototype.removeParameterDefinition = function (name) {
        var rval = this.parameters[name];
        if (rval) {
            delete this.parameters[name];
        }
        return rval;
    };
    /**
     * Gets a list of all parameter definitions.
     * @return {Oas30ParameterDefinition[]}
     */
    Oas30Components.prototype.getParameterDefinitions = function () {
        var rval = [];
        for (var name_3 in this.parameters) {
            rval.push(this.parameters[name_3]);
        }
        return rval;
    };
    /**
     * Creates a example definition.
     * @param name
     * @return {Oas30ExampleDefinition}
     */
    Oas30Components.prototype.createExampleDefinition = function (name) {
        var rval = new Oas30ExampleDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a example definition.
     * @param name
     * @param exampleDefinition
     */
    Oas30Components.prototype.addExampleDefinition = function (name, exampleDefinition) {
        this.examples[name] = exampleDefinition;
    };
    /**
     * Gets a single example definition by name.
     * @param name
     * @return {Oas30ExampleDefinition}
     */
    Oas30Components.prototype.getExampleDefinition = function (name) {
        return this.examples[name];
    };
    /**
     * Removes a single example definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30ExampleDefinition}
     */
    Oas30Components.prototype.removeExampleDefinition = function (name) {
        var rval = this.examples[name];
        if (rval) {
            delete this.examples[name];
        }
        return rval;
    };
    /**
     * Gets a list of all example definitions.
     * @return {Oas30ExampleDefinition[]}
     */
    Oas30Components.prototype.getExampleDefinitions = function () {
        var rval = [];
        for (var name_4 in this.examples) {
            rval.push(this.examples[name_4]);
        }
        return rval;
    };
    /**
     * Creates a request body definition.
     * @param name
     * @return {Oas30RequestBodyDefinition}
     */
    Oas30Components.prototype.createRequestBodyDefinition = function (name) {
        var rval = new Oas30RequestBodyDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a request body definition.
     * @param name
     * @param requestBodyDefinition
     */
    Oas30Components.prototype.addRequestBodyDefinition = function (name, requestBodyDefinition) {
        this.requestBodies[name] = requestBodyDefinition;
    };
    /**
     * Gets a single request body definition by name.
     * @param name
     * @return {Oas30RequestBodyDefinition}
     */
    Oas30Components.prototype.getRequestBodyDefinition = function (name) {
        return this.requestBodies[name];
    };
    /**
     * Removes a single request body definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30RequestBodyDefinition}
     */
    Oas30Components.prototype.removeRequestBodyDefinition = function (name) {
        var rval = this.requestBodies[name];
        if (rval) {
            delete this.requestBodies[name];
        }
        return rval;
    };
    /**
     * Gets a list of all request body definitions.
     * @return {Oas30RequestBodyDefinition[]}
     */
    Oas30Components.prototype.getRequestBodyDefinitions = function () {
        var rval = [];
        for (var name_5 in this.requestBodies) {
            rval.push(this.requestBodies[name_5]);
        }
        return rval;
    };
    /**
     * Creates a header definition.
     * @param name
     * @return {Oas30HeaderDefinition}
     */
    Oas30Components.prototype.createHeaderDefinition = function (name) {
        var rval = new Oas30HeaderDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a header definition.
     * @param name
     * @param headerDefinition
     */
    Oas30Components.prototype.addHeaderDefinition = function (name, headerDefinition) {
        this.headers[name] = headerDefinition;
    };
    /**
     * Gets a single header definition by name.
     * @param name
     * @return {Oas30HeaderDefinition}
     */
    Oas30Components.prototype.getHeaderDefinition = function (name) {
        return this.headers[name];
    };
    /**
     * Removes a single header definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30HeaderDefinition}
     */
    Oas30Components.prototype.removeHeaderDefinition = function (name) {
        var rval = this.headers[name];
        if (rval) {
            delete this.headers[name];
        }
        return rval;
    };
    /**
     * Gets a list of all header definitions.
     * @return {Oas30HeaderDefinition[]}
     */
    Oas30Components.prototype.getHeaderDefinitions = function () {
        var rval = [];
        for (var name_6 in this.headers) {
            rval.push(this.headers[name_6]);
        }
        return rval;
    };
    /**
     * Creates a security scheme definition.
     * @param name
     * @return {Oas30SecurityScheme}
     */
    Oas30Components.prototype.createSecurityScheme = function (name) {
        var rval = new Oas30SecurityScheme(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a security scheme definition.
     * @param name
     * @param securityScheme
     */
    Oas30Components.prototype.addSecurityScheme = function (name, securityScheme) {
        this.securitySchemes[name] = securityScheme;
    };
    /**
     * Gets a single security scheme definition by name.
     * @param name
     * @return {Oas30SecurityScheme}
     */
    Oas30Components.prototype.getSecurityScheme = function (name) {
        return this.securitySchemes[name];
    };
    /**
     * Removes a single security scheme definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30SecurityScheme}
     */
    Oas30Components.prototype.removeSecurityScheme = function (name) {
        var rval = this.securitySchemes[name];
        if (rval) {
            delete this.securitySchemes[name];
        }
        return rval;
    };
    /**
     * Gets a list of all security scheme definitions.
     * @return {Oas30SecurityScheme[]}
     */
    Oas30Components.prototype.getSecuritySchemes = function () {
        var rval = [];
        for (var name_7 in this.securitySchemes) {
            rval.push(this.securitySchemes[name_7]);
        }
        return rval;
    };
    /**
     * Creates a link definition.
     * @param name
     * @return {Oas30LinkDefinition}
     */
    Oas30Components.prototype.createLinkDefinition = function (name) {
        var rval = new Oas30LinkDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a link definition.
     * @param name
     * @param linkDefinition
     */
    Oas30Components.prototype.addLinkDefinition = function (name, linkDefinition) {
        this.links[name] = linkDefinition;
    };
    /**
     * Gets a single link definition by name.
     * @param name
     * @return {Oas30LinkDefinition}
     */
    Oas30Components.prototype.getLinkDefinition = function (name) {
        return this.links[name];
    };
    /**
     * Removes a single link definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30LinkDefinition}
     */
    Oas30Components.prototype.removeLinkDefinition = function (name) {
        var rval = this.links[name];
        if (rval) {
            delete this.links[name];
        }
        return rval;
    };
    /**
     * Gets a list of all link definitions.
     * @return {Oas30LinkDefinition[]}
     */
    Oas30Components.prototype.getLinkDefinitions = function () {
        var rval = [];
        for (var name_8 in this.links) {
            rval.push(this.links[name_8]);
        }
        return rval;
    };
    /**
     * Creates a callback definition.
     * @param name
     * @return {Oas30CallbackDefinition}
     */
    Oas30Components.prototype.createCallbackDefinition = function (name) {
        var rval = new Oas30CallbackDefinition(name);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a callback definition.
     * @param name
     * @param callbackDefinition
     */
    Oas30Components.prototype.addCallbackDefinition = function (name, callbackDefinition) {
        this.callbacks[name] = callbackDefinition;
    };
    /**
     * Gets a single callback definition by name.
     * @param name
     * @return {Oas30CallbackDefinition}
     */
    Oas30Components.prototype.getCallbackDefinition = function (name) {
        return this.callbacks[name];
    };
    /**
     * Removes a single callback definition and returns it.  This may return null or undefined if none found.
     * @param name
     * @return {Oas30CallbackDefinition}
     */
    Oas30Components.prototype.removeCallbackDefinition = function (name) {
        var rval = this.callbacks[name];
        if (rval) {
            delete this.callbacks[name];
        }
        return rval;
    };
    /**
     * Gets a list of all callback definitions.
     * @return {Oas30CallbackDefinition[]}
     */
    Oas30Components.prototype.getCallbackDefinitions = function () {
        var rval = [];
        for (var name_9 in this.callbacks) {
            rval.push(this.callbacks[name_9]);
        }
        return rval;
    };
    return Oas30Components;
}(OasExtensibleNode));
var Oas30SchemaComponents = (function () {
    function Oas30SchemaComponents() {
    }
    return Oas30SchemaComponents;
}());
var Oas30ResponseComponents = (function () {
    function Oas30ResponseComponents() {
    }
    return Oas30ResponseComponents;
}());
var Oas30ParameterComponents = (function () {
    function Oas30ParameterComponents() {
    }
    return Oas30ParameterComponents;
}());
var Oas30ExampleComponents = (function () {
    function Oas30ExampleComponents() {
    }
    return Oas30ExampleComponents;
}());
var Oas30RequestBodyComponents = (function () {
    function Oas30RequestBodyComponents() {
    }
    return Oas30RequestBodyComponents;
}());
var Oas30HeaderComponents = (function () {
    function Oas30HeaderComponents() {
    }
    return Oas30HeaderComponents;
}());
var Oas30SecuritySchemeComponents = (function () {
    function Oas30SecuritySchemeComponents() {
    }
    return Oas30SecuritySchemeComponents;
}());
var Oas30LinkComponents = (function () {
    function Oas30LinkComponents() {
    }
    return Oas30LinkComponents;
}());
var Oas30CallbackComponents = (function () {
    function Oas30CallbackComponents() {
    }
    return Oas30CallbackComponents;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$69 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Contact object.  Example:
 *
 * {
 *   "name": "API Support",
 *   "url": "http://www.example.com/support",
 *   "email": "support@example.com"
 * }
 */
var Oas30Contact = (function (_super) {
    __extends$69(Oas30Contact, _super);
    function Oas30Contact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas30Contact;
}(OasContact));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$72 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 License object.  Example:
 *
 * {
 *   "name": "Apache 2.0",
 *   "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 * }
 */
var Oas30License = (function (_super) {
    __extends$72(Oas30License, _super);
    function Oas30License() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Oas30License;
}(OasLicense));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$71 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Info object.  Example:
 *
 *  {
 *    "title": "Sample Pet Store App",
 *    "description": "This is a sample server for a pet store.",
 *    "termsOfService": "http://example.com/terms/",
 *    "contact": {
 *      "name": "API Support",
 *      "url": "http://www.example.com/support",
 *      "email": "support@example.com"
 *    },
 *    "license": {
 *      "name": "Apache 2.0",
 *      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
 *    },
 *    "version": "1.0.1"
 *  }
 */
var Oas30Info = (function (_super) {
    __extends$71(Oas30Info, _super);
    function Oas30Info() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 3.0 Contact object.
     * @return {Oas30Contact}
     */
    Oas30Info.prototype.createContact = function () {
        var rval = new Oas30Contact();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 License object.
     * @return {Oas30License}
     */
    Oas30Info.prototype.createLicense = function () {
        var rval = new Oas30License();
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30Info;
}(OasInfo));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$73 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Tag object.  Example:
 *
 * {
 *     "name": "pet",
 *     "description": "Pets operations"
 * }
 */
var Oas30Tag = (function (_super) {
    __extends$73(Oas30Tag, _super);
    function Oas30Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 3.0 External Documentation object.
     * @return {Oas30ExternalDocumentation}
     */
    Oas30Tag.prototype.createExternalDocumentation = function () {
        var rval = new Oas30ExternalDocumentation();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    Oas30Tag.prototype.setExternalDocumentation = function (description, url) {
        var edoc = this.createExternalDocumentation();
        edoc.description = description;
        edoc.url = url;
        this.externalDocs = edoc;
        return edoc;
    };
    return Oas30Tag;
}(OasTag));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$74 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0 Paths object.  The Paths object can have any number of child
 * paths, where the field name begins with '/'.  Example:
 *
 * {
 *  "/pets": {
 *    "get": {
 *      "description": "Returns all pets from the system that the user has access to",
 *      "responses": {
 *        "200": {
 *          "description": "A list of pets.",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "type": "array",
 *                "items": {
 *                  "$ref": "#/components/schemas/pet"
 *                }
 *              }
 *            }
 *          }
 *        }
 *      }
 *    }
 *  }
 *}
 */
var Oas30Paths = (function (_super) {
    __extends$74(Oas30Paths, _super);
    function Oas30Paths() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates an OAS 3.0 path item object.
     * @param path
     * @return {Oas30PathItem}
     */
    Oas30Paths.prototype.createPathItem = function (path) {
        var rval = new Oas30PathItem(path);
        rval._ownerDocument = this._ownerDocument;
        rval._parent = this;
        return rval;
    };
    return Oas30Paths;
}(OasPaths));

/**
 * @license
 * Copyright 2017 Red Hat
 *
 * Licensed under the Apache License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-3.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends$70 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Models an OAS 3.0.x document.
 */
var Oas30Document = (function (_super) {
    __extends$70(Oas30Document, _super);
    function Oas30Document() {
        var _this = _super.call(this) || this;
        _this.openapi = "3.0.1";
        _this._ownerDocument = _this;
        return _this;
    }
    /**
     * Returns the spec version of this document.
     */
    Oas30Document.prototype.getSpecVersion = function () {
        return this.openapi;
    };
    /**
     * Creates an OAS 3.0 info object.
     * @return {Oas30Info}
     */
    Oas30Document.prototype.createInfo = function () {
        var rval = new Oas30Info();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 Server object.
     * @return {Oas30Server}
     */
    Oas30Document.prototype.createServer = function () {
        var rval = new Oas30Server();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a server.
     * @param url
     * @param description
     * @return {Oas30Server}
     */
    Oas30Document.prototype.addServer = function (url, description) {
        var server = this.createServer();
        server.url = url;
        server.description = description;
        if (!this.servers) {
            this.servers = [];
        }
        this.servers.push(server);
        return server;
    };
    /**
     * Creates an OAS 3.0 Paths object.
     * @return {Oas30Paths}
     */
    Oas30Document.prototype.createPaths = function () {
        var rval = new Oas30Paths();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 Security Requirement object.
     * @return {Oas30SecurityRequirement}
     */
    Oas30Document.prototype.createSecurityRequirement = function () {
        var rval = new Oas30SecurityRequirement();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Creates an OAS 3.0 Tag object.
     * @return {Oas30Tag}
     */
    Oas30Document.prototype.createTag = function () {
        var rval = new Oas30Tag();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    /**
     * Adds a tag.
     * @param name
     * @param description
     * @return {Oas30Tag}
     */
    Oas30Document.prototype.addTag = function (name, description) {
        var tag = this.createTag();
        tag.name = name;
        tag.description = description;
        if (!this.tags) {
            this.tags = [];
        }
        this.tags.push(tag);
        return tag;
    };
    /**
     * Creates an OAS 3.0 External Documentation object.
     * @return {Oas30ExternalDocumentation}
     */
    Oas30Document.prototype.createExternalDocumentation = function () {
        var rval = new Oas30ExternalDocumentation();
        rval._ownerDocument = this.ownerDocument();
        rval._parent = this;
        return rval;
    };
    /**
     * Sets the external documentation information.
     * @param description
     * @param url
     */
    Oas30Document.prototype.setExternalDocumentation = function (description, url) {
        var edoc = this.createExternalDocumentation();
        edoc.description = description;
        edoc.url = url;
        this.externalDocs = edoc;
        return edoc;
    };
    /**
     * Creates an OAS 3.0 Components object.
     * @return {Oas30Components}
     */
    Oas30Document.prototype.createComponents = function () {
        var rval = new Oas30Components();
        rval._ownerDocument = this;
        rval._parent = this;
        return rval;
    };
    return Oas30Document;
}(OasDocument));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$75 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * This class reads a javascript object and turns it into a OAS model.
 */
var OasJS2ModelReader = (function () {
    function OasJS2ModelReader() {
    }
    /**
     * Returns true if the given thing is defined.
     * @param thing
     * @return {boolean}
     */
    OasJS2ModelReader.prototype.isDefined = function (thing) {
        if (typeof thing === "undefined" || thing === null) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Reads an OAS Document object from the given javascript data.
     * @param document
     * @param documentModel
     */
    OasJS2ModelReader.prototype.readDocument = function (document, documentModel) {
        var info = document["info"];
        var paths = document["paths"];
        var security = document["security"];
        var tags = document["tags"];
        var externalDocs = document["externalDocs"];
        if (this.isDefined(info)) {
            var infoModel = documentModel.createInfo();
            this.readInfo(info, infoModel);
            documentModel.info = infoModel;
        }
        if (this.isDefined(paths)) {
            var pathsModel = documentModel.createPaths();
            this.readPaths(paths, pathsModel);
            documentModel.paths = pathsModel;
        }
        if (this.isDefined(security)) {
            var securityModels = [];
            for (var _i = 0, security_1 = security; _i < security_1.length; _i++) {
                var sec = security_1[_i];
                var secModel = documentModel.createSecurityRequirement();
                this.readSecurityRequirement(sec, secModel);
                securityModels.push(secModel);
            }
            documentModel.security = securityModels;
        }
        if (this.isDefined(tags)) {
            var tagModels = [];
            for (var _a = 0, tags_1 = tags; _a < tags_1.length; _a++) {
                var tag = tags_1[_a];
                var tagModel = documentModel.createTag();
                this.readTag(tag, tagModel);
                tagModels.push(tagModel);
            }
            documentModel.tags = tagModels;
        }
        if (this.isDefined(externalDocs)) {
            var externalDocsModel = documentModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            documentModel.externalDocs = externalDocsModel;
        }
        this.readExtensions(document, documentModel);
    };
    /**
     * Reads a OAS Info object from the given javascript data.
     * @param info
     * @param infoModel
     */
    OasJS2ModelReader.prototype.readInfo = function (info, infoModel) {
        var title = info["title"];
        var description = info["description"];
        var termsOfService = info["termsOfService"];
        var contact = info["contact"];
        var license = info["license"];
        var version = info["version"];
        if (this.isDefined(title)) {
            infoModel.title = title;
        }
        if (this.isDefined(description)) {
            infoModel.description = description;
        }
        if (this.isDefined(termsOfService)) {
            infoModel.termsOfService = termsOfService;
        }
        if (this.isDefined(contact)) {
            var contactModel = infoModel.createContact();
            this.readContact(contact, contactModel);
            infoModel.contact = contactModel;
        }
        if (this.isDefined(license)) {
            var licenseModel = infoModel.createLicense();
            this.readLicense(license, licenseModel);
            infoModel.license = licenseModel;
        }
        if (this.isDefined(version)) {
            infoModel.version = version;
        }
        this.readExtensions(info, infoModel);
    };
    /**
     * Reads a OAS Contact object from the given javascript data.
     * @param contact
     * @param contactModel
     */
    OasJS2ModelReader.prototype.readContact = function (contact, contactModel) {
        var name = contact["name"];
        var url = contact["url"];
        var email = contact["email"];
        if (this.isDefined(name)) {
            contactModel.name = name;
        }
        if (this.isDefined(url)) {
            contactModel.url = url;
        }
        if (this.isDefined(email)) {
            contactModel.email = email;
        }
        this.readExtensions(contact, contactModel);
    };
    /**
     * Reads a OAS License object from the given javascript data.
     * @param license
     * @param licenseModel
     */
    OasJS2ModelReader.prototype.readLicense = function (license, licenseModel) {
        var name = license["name"];
        var url = license["url"];
        if (this.isDefined(name)) {
            licenseModel.name = name;
        }
        if (this.isDefined(url)) {
            licenseModel.url = url;
        }
        this.readExtensions(license, licenseModel);
    };
    /**
     * Reads an OAS Paths object from the given JS data.
     * @param paths
     * @param pathsModel
     */
    OasJS2ModelReader.prototype.readPaths = function (paths, pathsModel) {
        for (var path in paths) {
            if (path.indexOf("x-") === 0) {
                continue;
            }
            var pathItem = paths[path];
            var pathItemModel = pathsModel.createPathItem(path);
            this.readPathItem(pathItem, pathItemModel);
            pathsModel.addPathItem(path, pathItemModel);
        }
        this.readExtensions(paths, pathsModel);
    };
    /**
     * Reads an OAS PathItem object from the given JS data.
     * @param pathItem
     * @param pathItemModel
     */
    OasJS2ModelReader.prototype.readPathItem = function (pathItem, pathItemModel) {
        var $ref = pathItem["$ref"];
        var get = pathItem["get"];
        var put = pathItem["put"];
        var post = pathItem["post"];
        var delete_ = pathItem["delete"];
        var options = pathItem["options"];
        var head = pathItem["head"];
        var patch = pathItem["patch"];
        var parameters = pathItem["parameters"];
        if (this.isDefined($ref)) {
            pathItemModel.$ref = $ref;
        }
        if (this.isDefined(get)) {
            var opModel = pathItemModel.createOperation("get");
            this.readOperation(get, opModel);
            pathItemModel.get = opModel;
        }
        if (this.isDefined(put)) {
            var opModel = pathItemModel.createOperation("put");
            this.readOperation(put, opModel);
            pathItemModel.put = opModel;
        }
        if (this.isDefined(post)) {
            var opModel = pathItemModel.createOperation("post");
            this.readOperation(post, opModel);
            pathItemModel.post = opModel;
        }
        if (this.isDefined(delete_)) {
            var opModel = pathItemModel.createOperation("delete");
            this.readOperation(delete_, opModel);
            pathItemModel.delete = opModel;
        }
        if (this.isDefined(options)) {
            var opModel = pathItemModel.createOperation("options");
            this.readOperation(options, opModel);
            pathItemModel.options = opModel;
        }
        if (this.isDefined(head)) {
            var opModel = pathItemModel.createOperation("head");
            this.readOperation(head, opModel);
            pathItemModel.head = opModel;
        }
        if (this.isDefined(patch)) {
            var opModel = pathItemModel.createOperation("patch");
            this.readOperation(patch, opModel);
            pathItemModel.patch = opModel;
        }
        if (this.isDefined(parameters)) {
            for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
                var parameter = parameters_1[_i];
                var paramModel = pathItemModel.createParameter();
                this.readParameter(parameter, paramModel);
                pathItemModel.addParameter(paramModel);
            }
        }
        this.readExtensions(pathItem, pathItemModel);
    };
    /**
     * Reads an OAS Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    OasJS2ModelReader.prototype.readOperation = function (operation, operationModel) {
        var tags = operation["tags"];
        var summary = operation["summary"];
        var description = operation["description"];
        var externalDocs = operation["externalDocs"];
        var operationId = operation["operationId"];
        var parameters = operation["parameters"];
        var responses = operation["responses"];
        var deprecated = operation["deprecated"];
        var security = operation["security"];
        if (this.isDefined(tags)) {
            operationModel.tags = tags;
        }
        if (this.isDefined(summary)) {
            operationModel.summary = summary;
        }
        if (this.isDefined(description)) {
            operationModel.description = description;
        }
        if (this.isDefined(externalDocs)) {
            var externalDocsModel = operationModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            operationModel.externalDocs = externalDocsModel;
        }
        if (this.isDefined(operationId)) {
            operationModel.operationId = operationId;
        }
        if (this.isDefined(parameters)) {
            for (var _i = 0, parameters_2 = parameters; _i < parameters_2.length; _i++) {
                var parameter = parameters_2[_i];
                var paramModel = operationModel.createParameter();
                this.readParameter(parameter, paramModel);
                operationModel.addParameter(paramModel);
            }
        }
        if (this.isDefined(responses)) {
            var responsesModel = operationModel.createResponses();
            this.readResponses(responses, responsesModel);
            operationModel.responses = responsesModel;
        }
        if (this.isDefined(deprecated)) {
            operationModel.deprecated = deprecated;
        }
        if (this.isDefined(security)) {
            for (var _a = 0, security_2 = security; _a < security_2.length; _a++) {
                var securityRequirement = security_2[_a];
                var securityRequirementModel = operationModel.createSecurityRequirement();
                this.readSecurityRequirement(securityRequirement, securityRequirementModel);
                operationModel.addSecurityRequirement(securityRequirementModel);
            }
        }
        this.readExtensions(operation, operationModel);
    };
    /**
     * Reads an OAS Responses object from the given JS data.
     * @param responses
     * @param responsesModel
     */
    OasJS2ModelReader.prototype.readResponses = function (responses, responsesModel) {
        var default_ = responses["default"];
        if (this.isDefined(default_)) {
            var defaultModel = responsesModel.createResponse();
            this.readResponse(default_, defaultModel);
            responsesModel.default = defaultModel;
        }
        for (var statusCode in responses) {
            if (statusCode.indexOf("x-") === 0) {
                continue;
            }
            if (statusCode === "default") {
                continue;
            }
            var response = responses[statusCode];
            var responseModel = responsesModel.createResponse(statusCode);
            this.readResponse(response, responseModel);
            responsesModel.addResponse(statusCode, responseModel);
        }
        this.readExtensions(responses, responsesModel);
    };
    /**
     * Reads an OAS Schema object from the given JS data.
     * @param schema
     * @param schemaModel
     */
    OasJS2ModelReader.prototype.readSchema = function (schema, schemaModel) {
        var _this = this;
        var $ref = schema["$ref"];
        var format = schema["format"];
        var title = schema["title"];
        var description = schema["description"];
        var default_ = schema["default"];
        var multipleOf = schema["multipleOf"];
        var maximum = schema["maximum"];
        var exclusiveMaximum = schema["exclusiveMaximum"];
        var minimum = schema["minimum"];
        var exclusiveMinimum = schema["exclusiveMinimum"];
        var maxLength = schema["maxLength"]; // Require: integer
        var minLength = schema["minLength"]; // Require: integer
        var pattern = schema["pattern"];
        var maxItems = schema["maxItems"]; // Require: integer
        var minItems = schema["minItems"]; // Require: integer
        var uniqueItems = schema["uniqueItems"];
        var maxProperties = schema["maxProperties"];
        var minProperties = schema["minProperties"];
        var required = schema["required"];
        var enum_ = schema["enum"];
        var type = schema["type"];
        var items = schema["items"];
        var allOf = schema["allOf"];
        var properties = schema["properties"];
        var additionalProperties = schema["additionalProperties"];
        var readOnly = schema["readOnly"];
        var xml = schema["xml"];
        var externalDocs = schema["externalDocs"];
        var example = schema["example"];
        if (this.isDefined($ref)) {
            schemaModel.$ref = $ref;
        }
        if (this.isDefined(format)) {
            schemaModel.format = format;
        }
        if (this.isDefined(title)) {
            schemaModel.title = title;
        }
        if (this.isDefined(description)) {
            schemaModel.description = description;
        }
        if (this.isDefined(default_)) {
            schemaModel.default = default_;
        }
        if (this.isDefined(multipleOf)) {
            schemaModel.multipleOf = multipleOf;
        }
        if (this.isDefined(maximum)) {
            schemaModel.maximum = maximum;
        }
        if (this.isDefined(exclusiveMaximum)) {
            schemaModel.exclusiveMaximum = exclusiveMaximum;
        }
        if (this.isDefined(minimum)) {
            schemaModel.minimum = minimum;
        }
        if (this.isDefined(exclusiveMinimum)) {
            schemaModel.exclusiveMinimum = exclusiveMinimum;
        }
        if (this.isDefined(maxLength)) {
            schemaModel.maxLength = maxLength;
        }
        if (this.isDefined(minLength)) {
            schemaModel.minLength = minLength;
        }
        if (this.isDefined(pattern)) {
            schemaModel.pattern = pattern;
        }
        if (this.isDefined(maxItems)) {
            schemaModel.maxItems = maxItems;
        }
        if (this.isDefined(minItems)) {
            schemaModel.minItems = minItems;
        }
        if (this.isDefined(uniqueItems)) {
            schemaModel.uniqueItems = uniqueItems;
        }
        if (this.isDefined(maxProperties)) {
            schemaModel.maxProperties = maxProperties;
        }
        if (this.isDefined(minProperties)) {
            schemaModel.minProperties = minProperties;
        }
        if (this.isDefined(required)) {
            schemaModel.required = required;
        }
        if (this.isDefined(enum_)) {
            schemaModel.enum = enum_;
        }
        if (this.isDefined(type)) {
            schemaModel.type = type;
        }
        if (this.isDefined(items)) {
            if (Array.isArray(items)) {
                schemaModel.items = items.map(function (item) {
                    var itemsSchemaModel = schemaModel.createItemsSchema();
                    _this.readSchema(item, itemsSchemaModel);
                    return itemsSchemaModel;
                });
            }
            else {
                var itemsSchemaModel = schemaModel.createItemsSchema();
                this.readSchema(items, itemsSchemaModel);
                schemaModel.items = itemsSchemaModel;
            }
        }
        if (this.isDefined(allOf)) {
            var schemaModels = [];
            for (var _i = 0, allOf_1 = allOf; _i < allOf_1.length; _i++) {
                var allOfSchema = allOf_1[_i];
                var allOfSchemaModel = schemaModel.createAllOfSchema();
                this.readSchema(allOfSchema, allOfSchemaModel);
                schemaModels.push(allOfSchemaModel);
            }
            schemaModel.allOf = schemaModels;
        }
        if (this.isDefined(properties)) {
            for (var propertyName in properties) {
                var propertySchema = properties[propertyName];
                var propertySchemaModel = schemaModel.createPropertySchema(propertyName);
                this.readSchema(propertySchema, propertySchemaModel);
                schemaModel.addProperty(propertyName, propertySchemaModel);
            }
        }
        if (this.isDefined(additionalProperties)) {
            if (typeof additionalProperties === "boolean") {
                schemaModel.additionalProperties = additionalProperties;
            }
            else {
                var additionalPropertiesModel = schemaModel.createAdditionalPropertiesSchema();
                this.readSchema(additionalProperties, additionalPropertiesModel);
                schemaModel.additionalProperties = additionalPropertiesModel;
            }
        }
        if (this.isDefined(readOnly)) {
            schemaModel.readOnly = readOnly;
        }
        if (this.isDefined(xml)) {
            var xmlModel = schemaModel.createXML();
            this.readXML(xml, xmlModel);
            schemaModel.xml = xmlModel;
        }
        if (this.isDefined(externalDocs)) {
            var externalDocsModel = schemaModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            schemaModel.externalDocs = externalDocsModel;
        }
        if (this.isDefined(example)) {
            schemaModel.example = example;
        }
        this.readExtensions(items, schemaModel);
    };
    /**
     * Reads an OAS XML object from the given JS data.
     * @param xml
     * @param xmlModel
     */
    OasJS2ModelReader.prototype.readXML = function (xml, xmlModel) {
        var name = xml["name"];
        var namespace = xml["namespace"];
        var prefix = xml["prefix"];
        var attribute = xml["attribute"];
        var wrapped = xml["wrapped"];
        if (this.isDefined(name)) {
            xmlModel.name = name;
        }
        if (this.isDefined(namespace)) {
            xmlModel.namespace = namespace;
        }
        if (this.isDefined(prefix)) {
            xmlModel.prefix = prefix;
        }
        if (this.isDefined(attribute)) {
            xmlModel.attribute = attribute;
        }
        if (this.isDefined(wrapped)) {
            xmlModel.wrapped = wrapped;
        }
        this.readExtensions(xml, xmlModel);
    };
    /**
     * Reads an OAS 2.0 Security Schema object from the given javascript data.
     * @param scheme
     * @param schemeModel
     */
    OasJS2ModelReader.prototype.readSecurityScheme = function (scheme, schemeModel) {
        var type = scheme["type"];
        var description = scheme["description"];
        var name = scheme["name"];
        var in_ = scheme["in"];
        if (this.isDefined(type)) {
            schemeModel.type = type;
        }
        if (this.isDefined(description)) {
            schemeModel.description = description;
        }
        if (this.isDefined(name)) {
            schemeModel.name = name;
        }
        if (this.isDefined(in_)) {
            schemeModel.in = in_;
        }
        this.readExtensions(scheme, schemeModel);
    };
    /**
     * Reads an OAS Security Requirement object from the given javascript data.
     * @param sec
     * @param secModel
     */
    OasJS2ModelReader.prototype.readSecurityRequirement = function (sec, secModel) {
        for (var name_1 in sec) {
            secModel.addSecurityRequirementItem(name_1, sec[name_1]);
        }
    };
    /**
     * Reads a OAS Tag object from the given javascript data.
     * @param tag
     * @param tagModel
     */
    OasJS2ModelReader.prototype.readTag = function (tag, tagModel) {
        var name = tag["name"];
        var description = tag["description"];
        var externalDocs = tag["externalDocs"];
        if (this.isDefined(name)) {
            tagModel.name = name;
        }
        if (this.isDefined(description)) {
            tagModel.description = description;
        }
        if (this.isDefined(externalDocs)) {
            var externalDocsModel = tagModel.createExternalDocumentation();
            this.readExternalDocumentation(externalDocs, externalDocsModel);
            tagModel.externalDocs = externalDocsModel;
        }
        this.readExtensions(tag, tagModel);
    };
    /**
     * Reads an OAS External Documentation object from the given javascript data.
     * @param externalDocs
     * @param externalDocsModel
     */
    OasJS2ModelReader.prototype.readExternalDocumentation = function (externalDocs, externalDocsModel) {
        var description = externalDocs["description"];
        var url = externalDocs["url"];
        if (this.isDefined(description)) {
            externalDocsModel.description = description;
        }
        if (this.isDefined(url)) {
            externalDocsModel.url = url;
        }
        this.readExtensions(externalDocs, externalDocsModel);
    };
    /**
     * Reads all of the extension nodes.  An extension node is characterized by a property
     * that begins with "x-".
     * @param jsData
     * @param model
     */
    OasJS2ModelReader.prototype.readExtensions = function (jsData, model) {
        for (var key in jsData) {
            if (key.indexOf("x-") === 0) {
                var val = jsData[key];
                model.addExtension(key, val);
            }
        }
    };
    return OasJS2ModelReader;
}());
/**
 * This class reads a javascript object and turns it into a OAS 2.0 model.  It is obviously
 * assumed that the javascript data actually does represent an OAS 2.0 document.
 */
var Oas20JS2ModelReader = (function (_super) {
    __extends$75(Oas20JS2ModelReader, _super);
    function Oas20JS2ModelReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reads the given javascript data and returns an OAS 2.0 document.  Throws an error if
     * the root 'swagger' property is not found or if its value is not "2.0".
     * @param jsData
     */
    Oas20JS2ModelReader.prototype.read = function (jsData) {
        var docModel = new Oas20Document();
        this.readDocument(jsData, docModel);
        return docModel;
    };
    /**
     * Reads an OAS 2.0 Document object from the given javascript data.
     * @param document
     * @param documentModel
     */
    Oas20JS2ModelReader.prototype.readDocument = function (document, documentModel) {
        var swagger = document["swagger"];
        if (swagger != "2.0") {
            throw Error("Unsupported specification version: " + swagger);
        }
        _super.prototype.readDocument.call(this, document, documentModel);
        var host = document["host"];
        var basePath = document["basePath"];
        var schemes = document["schemes"];
        var consumes = document["consumes"];
        var produces = document["produces"];
        var definitions = document["definitions"];
        var parameters = document["parameters"];
        var responses = document["responses"];
        var securityDefinitions = document["securityDefinitions"];
        if (this.isDefined(host)) {
            documentModel.host = host;
        }
        if (this.isDefined(basePath)) {
            documentModel.basePath = basePath;
        }
        if (this.isDefined(schemes)) {
            documentModel.schemes = schemes;
        }
        if (this.isDefined(consumes)) {
            documentModel.consumes = consumes;
        }
        if (this.isDefined(produces)) {
            documentModel.produces = produces;
        }
        if (this.isDefined(definitions)) {
            var definitionsModel = documentModel.createDefinitions();
            this.readDefinitions(definitions, definitionsModel);
            documentModel.definitions = definitionsModel;
        }
        if (this.isDefined(parameters)) {
            var parametersDefinitionsModel = documentModel.createParametersDefinitions();
            this.readParametersDefinitions(parameters, parametersDefinitionsModel);
            documentModel.parameters = parametersDefinitionsModel;
        }
        if (this.isDefined(responses)) {
            var responsesDefinitionsModel = documentModel.createResponsesDefinitions();
            this.readResponsesDefinitions(responses, responsesDefinitionsModel);
            documentModel.responses = responsesDefinitionsModel;
        }
        if (this.isDefined(securityDefinitions)) {
            var securityDefinitionsModel = documentModel.createSecurityDefinitions();
            this.readSecurityDefinitions(securityDefinitions, securityDefinitionsModel);
            documentModel.securityDefinitions = securityDefinitionsModel;
        }
    };
    /**
     * Reads an OAS 2.0 Schema object from the given javascript data.
     * @param schema
     * @param schemaModel
     */
    Oas20JS2ModelReader.prototype.readSchema = function (schema, schemaModel) {
        _super.prototype.readSchema.call(this, schema, schemaModel);
        var discriminator = schema["discriminator"];
        if (this.isDefined(discriminator)) {
            schemaModel.discriminator = discriminator;
        }
    };
    /**
     * Reads an OAS 2.0 Security Definitions object from the given javascript data.
     * @param securityDefinitions
     * @param securityDefinitionsModel
     */
    Oas20JS2ModelReader.prototype.readSecurityDefinitions = function (securityDefinitions, securityDefinitionsModel) {
        for (var name_2 in securityDefinitions) {
            var scheme = securityDefinitions[name_2];
            var schemeModel = securityDefinitionsModel.createSecurityScheme(name_2);
            this.readSecurityScheme(scheme, schemeModel);
            securityDefinitionsModel.addSecurityScheme(name_2, schemeModel);
        }
    };
    /**
     * Reads an OAS 2.0 Security Schema object from the given javascript data.
     * @param scheme
     * @param schemeModel
     */
    Oas20JS2ModelReader.prototype.readSecurityScheme = function (scheme, schemeModel) {
        _super.prototype.readSecurityScheme.call(this, scheme, schemeModel);
        var flow = scheme["flow"];
        var authorizationUrl = scheme["authorizationUrl"];
        var tokenUrl = scheme["tokenUrl"];
        var scopes = scheme["scopes"];
        if (this.isDefined(flow)) {
            schemeModel.flow = flow;
        }
        if (this.isDefined(authorizationUrl)) {
            schemeModel.authorizationUrl = authorizationUrl;
        }
        if (this.isDefined(tokenUrl)) {
            schemeModel.tokenUrl = tokenUrl;
        }
        if (this.isDefined(scopes)) {
            var scopesModel = schemeModel.createScopes();
            this.readScopes(scopes, scopesModel);
            schemeModel.scopes = scopesModel;
        }
    };
    /**
     * Reads an OAS 2.0 Scopes object from the given javascript data.
     * @param scopes
     * @param scopesModel
     */
    Oas20JS2ModelReader.prototype.readScopes = function (scopes, scopesModel) {
        for (var scope in scopes) {
            if (scope.indexOf("x-") === 0) {
                continue;
            }
            var description = scopes[scope];
            scopesModel.addScope(scope, description);
        }
        this.readExtensions(scopes, scopesModel);
    };
    /**
     * Reads an OAS 2.0 Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    Oas20JS2ModelReader.prototype.readOperation = function (operation, operationModel) {
        _super.prototype.readOperation.call(this, operation, operationModel);
        var consumes = operation["consumes"];
        var produces = operation["produces"];
        var schemes = operation["schemes"];
        if (this.isDefined(consumes)) {
            operationModel.consumes = consumes;
        }
        if (this.isDefined(produces)) {
            operationModel.produces = produces;
        }
        if (this.isDefined(schemes)) {
            operationModel.schemes = schemes;
        }
    };
    /**
     * Reads an OAS 2.0 Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    Oas20JS2ModelReader.prototype.readParameter = function (parameter, paramModel) {
        var $ref = parameter["$ref"];
        if (this.isDefined($ref)) {
            paramModel.$ref = $ref;
        }
        this.readParameterBase(parameter, paramModel);
    };
    /**
     * Reads an OAS 2.0 Parameter Definition from the given JS data.
     * @param parameterDef
     * @param paramDefModel
     */
    Oas20JS2ModelReader.prototype.readParameterDefinition = function (parameterDef, paramDefModel) {
        this.readParameterBase(parameterDef, paramDefModel);
    };
    /**
     * Reads an OAS 2.0 Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    Oas20JS2ModelReader.prototype.readParameterBase = function (parameter, paramModel) {
        this.readItems(parameter, paramModel);
        var name = parameter["name"];
        var in_ = parameter["in"];
        var description = parameter["description"];
        var required = parameter["required"];
        var schema = parameter["schema"];
        var allowEmptyValue = parameter["allowEmptyValue"];
        if (this.isDefined(name)) {
            paramModel.name = name;
        }
        if (this.isDefined(in_)) {
            paramModel.in = in_;
        }
        if (this.isDefined(description)) {
            paramModel.description = description;
        }
        if (this.isDefined(required)) {
            paramModel.required = required;
        }
        if (this.isDefined(schema)) {
            var schemaModel = paramModel.createSchema();
            this.readSchema(schema, schemaModel);
            paramModel.schema = schemaModel;
        }
        if (this.isDefined(allowEmptyValue)) {
            paramModel.allowEmptyValue = allowEmptyValue;
        }
        this.readExtensions(parameter, paramModel);
    };
    /**
     * Reads an OAS 2.0 Items object from the given JS data.
     * @param items
     * @param itemsModel
     */
    Oas20JS2ModelReader.prototype.readItems = function (items, itemsModel) {
        var type = items["type"];
        var format = items["format"];
        var itemsChild = items["items"];
        var collectionFormat = items["collectionFormat"];
        var default_ = items["default"];
        var maximum = items["maximum"];
        var exclusiveMaximum = items["exclusiveMaximum"];
        var minimum = items["minimum"];
        var exclusiveMinimum = items["exclusiveMinimum"];
        var maxLength = items["maxLength"]; // Require: integer
        var minLength = items["minLength"]; // Require: integer
        var pattern = items["pattern"];
        var maxItems = items["maxItems"]; // Require: integer
        var minItems = items["minItems"]; // Require: integer
        var uniqueItems = items["uniqueItems"];
        var enum_ = items["enum"];
        var multipleOf = items["multipleOf"];
        if (this.isDefined(type)) {
            itemsModel.type = type;
        }
        if (this.isDefined(format)) {
            itemsModel.format = format;
        }
        if (this.isDefined(itemsChild)) {
            var itemsChildModel = itemsModel.createItems();
            this.readItems(itemsChild, itemsChildModel);
            itemsModel.items = itemsChildModel;
        }
        if (this.isDefined(collectionFormat)) {
            itemsModel.collectionFormat = collectionFormat;
        }
        if (this.isDefined(default_)) {
            itemsModel.default = default_;
        }
        if (this.isDefined(maximum)) {
            itemsModel.maximum = maximum;
        }
        if (this.isDefined(exclusiveMaximum)) {
            itemsModel.exclusiveMaximum = exclusiveMaximum;
        }
        if (this.isDefined(minimum)) {
            itemsModel.minimum = minimum;
        }
        if (this.isDefined(exclusiveMinimum)) {
            itemsModel.exclusiveMinimum = exclusiveMinimum;
        }
        if (this.isDefined(maxLength)) {
            itemsModel.maxLength = maxLength;
        }
        if (this.isDefined(minLength)) {
            itemsModel.minLength = minLength;
        }
        if (this.isDefined(pattern)) {
            itemsModel.pattern = pattern;
        }
        if (this.isDefined(maxItems)) {
            itemsModel.maxItems = maxItems;
        }
        if (this.isDefined(minItems)) {
            itemsModel.minItems = minItems;
        }
        if (this.isDefined(uniqueItems)) {
            itemsModel.uniqueItems = uniqueItems;
        }
        if (this.isDefined(enum_)) {
            itemsModel.enum = enum_;
        }
        if (this.isDefined(multipleOf)) {
            itemsModel.multipleOf = multipleOf;
        }
        this.readExtensions(items, itemsModel);
    };
    /**
     * Reads an OAS 2.0 Response object from the given JS data.
     * @param response
     * @param responseModel
     */
    Oas20JS2ModelReader.prototype.readResponse = function (response, responseModel) {
        var $ref = response["$ref"];
        if (this.isDefined($ref)) {
            responseModel.$ref = $ref;
        }
        this.readResponseBase(response, responseModel);
    };
    /**
     * Reads an OAS 2.0 Response Definition object from the given JS data.
     * @param response
     * @param responseDefModel
     */
    Oas20JS2ModelReader.prototype.readResponseDefinition = function (response, responseDefModel) {
        this.readResponseBase(response, responseDefModel);
    };
    /**
     * Reads an OAS 2.0 Response object from the given JS data.
     * @param response
     * @param responseModel
     */
    Oas20JS2ModelReader.prototype.readResponseBase = function (response, responseModel) {
        var description = response["description"];
        var schema = response["schema"];
        var headers = response["headers"];
        var examples = response["examples"];
        if (this.isDefined(description)) {
            responseModel.description = description;
        }
        if (this.isDefined(schema)) {
            var schemaModel = responseModel.createSchema();
            this.readSchema(schema, schemaModel);
            responseModel.schema = schemaModel;
        }
        if (this.isDefined(headers)) {
            var headersModel = responseModel.createHeaders();
            this.readHeaders(headers, headersModel);
            responseModel.headers = headersModel;
        }
        if (this.isDefined(examples)) {
            var exampleModel = responseModel.createExample();
            this.readExample(examples, exampleModel);
            responseModel.examples = exampleModel;
        }
        this.readExtensions(response, responseModel);
    };
    /**
     * Reads an OAS 2.0 Example object from the given JS data.
     * @param examples
     * @param exampleModel
     */
    Oas20JS2ModelReader.prototype.readExample = function (examples, exampleModel) {
        for (var contentType in examples) {
            var example = examples[contentType];
            exampleModel.addExample(contentType, example);
        }
    };
    /**
     * Reads an OAS Headers object from the given JS data.
     * @param headers
     * @param headersModel
     */
    Oas20JS2ModelReader.prototype.readHeaders = function (headers, headersModel) {
        for (var headerName in headers) {
            var header = headers[headerName];
            var headerModel = headersModel.createHeader(headerName);
            this.readHeader(header, headerModel);
            headersModel.addHeader(headerName, headerModel);
        }
    };
    /**
     * Reads an OAS 2.0 Header object from the given JS data.
     * @param header
     * @param headerModel
     */
    Oas20JS2ModelReader.prototype.readHeader = function (header, headerModel) {
        var description = header["description"];
        if (this.isDefined(description)) {
            headerModel.description = description;
        }
        this.readItems(header, headerModel);
    };
    /**
     * Reads an OAS 2.0 Definitions object from the given JS data.
     * @param definitions
     * @param definitionsModel
     */
    Oas20JS2ModelReader.prototype.readDefinitions = function (definitions, definitionsModel) {
        for (var definitionName in definitions) {
            var definition = definitions[definitionName];
            var definitionSchemaModel = definitionsModel.createSchemaDefinition(definitionName);
            this.readSchema(definition, definitionSchemaModel);
            definitionsModel.addDefinition(definitionName, definitionSchemaModel);
        }
    };
    /**
     * Reads an OAS 2.0 Parameters Definitions object from the given JS data.
     * @param parameters
     * @param parametersDefinitionsModel
     */
    Oas20JS2ModelReader.prototype.readParametersDefinitions = function (parameters, parametersDefinitionsModel) {
        for (var parameterName in parameters) {
            var parameter = parameters[parameterName];
            var parameterDefModel = parametersDefinitionsModel.createParameter(parameterName);
            this.readParameterDefinition(parameter, parameterDefModel);
            parametersDefinitionsModel.addParameter(parameterName, parameterDefModel);
        }
    };
    /**
     * Reads an OAS 2.0 Responses Definitions object from the given JS data.
     * @param responses
     * @param responsesDefinitionsModel
     */
    Oas20JS2ModelReader.prototype.readResponsesDefinitions = function (responses, responsesDefinitionsModel) {
        for (var responseName in responses) {
            var response = responses[responseName];
            var responseModel = responsesDefinitionsModel.createResponse(responseName);
            this.readResponseBase(response, responseModel);
            responsesDefinitionsModel.addResponse(responseName, responseModel);
        }
    };
    return Oas20JS2ModelReader;
}(OasJS2ModelReader));
/**
 * A visitor used to invoke the appropriate readXYZ() method on the Oas20JS2ModelReader
 * class.  This is useful when reading a partial (non root) model from a JS object.  The
 * caller still needs to first construct the appropriate model prior to reading into it.
 */
var Oas20JS2ModelReaderVisitor = (function () {
    /**
     * Constructor.
     * @param reader
     * @param jsData
     */
    function Oas20JS2ModelReaderVisitor(reader, jsData) {
        this.reader = reader;
        this.jsData = jsData;
    }
    Oas20JS2ModelReaderVisitor.prototype.visitDocument = function (node) {
        // Not supported - call the reader directly if you want to read a full document.
    };
    Oas20JS2ModelReaderVisitor.prototype.visitInfo = function (node) {
        this.reader.readInfo(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitContact = function (node) {
        this.reader.readContact(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitLicense = function (node) {
        this.reader.readLicense(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitPaths = function (node) {
        this.reader.readPaths(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitPathItem = function (node) {
        this.reader.readPathItem(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitOperation = function (node) {
        this.reader.readOperation(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitParameter = function (node) {
        this.reader.readParameter(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitParameterDefinition = function (node) {
        this.reader.readParameterDefinition(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitExternalDocumentation = function (node) {
        this.reader.readExternalDocumentation(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitSecurityRequirement = function (node) {
        this.reader.readSecurityRequirement(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitResponses = function (node) {
        this.reader.readResponses(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitResponse = function (node) {
        this.reader.readResponse(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitResponseDefinition = function (node) {
        this.reader.readResponseDefinition(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitHeaders = function (node) {
        this.reader.readHeaders(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitHeader = function (node) {
        this.reader.readHeader(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitExample = function (node) {
        this.reader.readExample(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitItems = function (node) {
        this.reader.readItems(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitTag = function (node) {
        this.reader.readTag(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitSecurityDefinitions = function (node) {
        this.reader.readSecurityDefinitions(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitSecurityScheme = function (node) {
        this.reader.readSecurityScheme(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitScopes = function (node) {
        this.reader.readScopes(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitXML = function (node) {
        this.reader.readXML(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitSchemaDefinition = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitPropertySchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitAllOfSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitItemsSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitDefinitions = function (node) {
        this.reader.readDefinitions(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitParametersDefinitions = function (node) {
        this.reader.readParametersDefinitions(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitResponsesDefinitions = function (node) {
        this.reader.readResponsesDefinitions(this.jsData, node);
    };
    Oas20JS2ModelReaderVisitor.prototype.visitExtension = function (node) {
        // Not supported:  cannot read a single extension
    };
    return Oas20JS2ModelReaderVisitor;
}());
/**
 * A visitor used to invoke the appropriate readXYZ() method on the Oas20JS2ModelReader
 * class.  This is useful when reading a partial (non root) model from a JS object.  The
 * caller still needs to first construct the appropriate model prior to reading into it.
 */
var Oas30JS2ModelReaderVisitor = (function () {
    /**
     * Constructor.
     * @param reader
     * @param jsData
     */
    function Oas30JS2ModelReaderVisitor(reader, jsData) {
        this.reader = reader;
        this.jsData = jsData;
    }
    Oas30JS2ModelReaderVisitor.prototype.visitDocument = function (node) {
        // Not supported - call the reader directly if you want to read a full document.
    };
    Oas30JS2ModelReaderVisitor.prototype.visitInfo = function (node) {
        this.reader.readInfo(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitContact = function (node) {
        this.reader.readContact(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitLicense = function (node) {
        this.reader.readLicense(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitPaths = function (node) {
        this.reader.readPaths(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitPathItem = function (node) {
        this.reader.readPathItem(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitOperation = function (node) {
        this.reader.readOperation(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitParameter = function (node) {
        this.reader.readParameter(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitParameterDefinition = function (node) {
        this.reader.readParameterBase(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitResponses = function (node) {
        this.reader.readResponses(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitResponse = function (node) {
        this.reader.readResponse(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitMediaType = function (node) {
        this.reader.readMediaType(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitEncoding = function (node) {
        this.reader.readEncoding(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitExample = function (node) {
        this.reader.readExample(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitLink = function (node) {
        this.reader.readLink(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitLinkParameterExpression = function (node) {
        // Nothing to read - the expression is simple and not extensible
    };
    Oas30JS2ModelReaderVisitor.prototype.visitLinkRequestBodyExpression = function (node) {
        // Nothing to read - the expression is simple and not extensible
    };
    Oas30JS2ModelReaderVisitor.prototype.visitLinkServer = function (node) {
        this.reader.readServer(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitResponseDefinition = function (node) {
        this.reader.readResponseBase(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitDiscriminator = function (node) {
        this.reader.readDiscriminator(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitXML = function (node) {
        this.reader.readXML(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitHeader = function (node) {
        this.reader.readHeader(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitRequestBody = function (node) {
        this.reader.readRequestBody(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitCallback = function (node) {
        this.reader.readCallback(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitCallbackPathItem = function (node) {
        this.reader.readPathItem(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitServer = function (node) {
        this.reader.readServer(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitServerVariable = function (node) {
        this.reader.readServerVariable(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitSecurityRequirement = function (node) {
        this.reader.readSecurityRequirement(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitTag = function (node) {
        this.reader.readTag(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitExternalDocumentation = function (node) {
        this.reader.readExternalDocumentation(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitAllOfSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitAnyOfSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitOneOfSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitNotSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitPropertySchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitItemsSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitComponents = function (node) {
        this.reader.readComponents(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitSchemaDefinition = function (node) {
        this.reader.readSchema(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitExampleDefinition = function (node) {
        this.reader.readExample(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitRequestBodyDefinition = function (node) {
        this.reader.readRequestBody(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitHeaderDefinition = function (node) {
        this.reader.readHeader(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitOAuthFlows = function (node) {
        this.reader.readOAuthFlows(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitImplicitOAuthFlow = function (node) {
        this.reader.readOAuthFlow(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitPasswordOAuthFlow = function (node) {
        this.reader.readOAuthFlow(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitClientCredentialsOAuthFlow = function (node) {
        this.reader.readOAuthFlow(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        this.reader.readOAuthFlow(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitSecurityScheme = function (node) {
        this.reader.readSecurityScheme(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitLinkDefinition = function (node) {
        this.reader.readLink(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitCallbackDefinition = function (node) {
        this.reader.readCallback(this.jsData, node);
    };
    Oas30JS2ModelReaderVisitor.prototype.visitExtension = function (node) {
        // Not supported:  cannot read a single extension
    };
    return Oas30JS2ModelReaderVisitor;
}());
/**
 * This class reads a javascript object and turns it into a OAS 3.0 model.  It is obviously
 * assumed that the javascript data actually does represent an OAS 3.0 document.
 */
var Oas30JS2ModelReader = (function (_super) {
    __extends$75(Oas30JS2ModelReader, _super);
    function Oas30JS2ModelReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reads the given javascript data and returns an OAS 3.0 document.  Throws an error if
     * the root 'openapi' property is not found or if its value is not "3.0.x".
     * @param jsData
     */
    Oas30JS2ModelReader.prototype.read = function (jsData) {
        var docModel = new Oas30Document();
        this.readDocument(jsData, docModel);
        return docModel;
    };
    /**
     * Reads an OAS 3.0 Document object from the given JS data.
     * @param document
     * @param documentModel
     */
    Oas30JS2ModelReader.prototype.readDocument = function (document, documentModel) {
        var _this = this;
        var openapi = document["openapi"];
        if (openapi.indexOf("3.") != 0) {
            throw Error("Unsupported specification version: " + openapi);
        }
        _super.prototype.readDocument.call(this, document, documentModel);
        var servers = document["servers"];
        var components = document["components"];
        documentModel.openapi = openapi;
        if (Array.isArray(servers)) {
            documentModel.servers = [];
            servers.forEach(function (server) {
                var serverModel = documentModel.createServer();
                _this.readServer(server, serverModel);
                documentModel.servers.push(serverModel);
            });
        }
        if (this.isDefined(components)) {
            var componentsModel = documentModel.createComponents();
            this.readComponents(components, componentsModel);
            documentModel.components = componentsModel;
        }
    };
    /**
     * Reads an OAS 3.0 Components object from the given JS data.
     * @param components
     * @param componentsModel
     */
    Oas30JS2ModelReader.prototype.readComponents = function (components, componentsModel) {
        var schemas = components["schemas"];
        var responses = components["responses"];
        var parameters = components["parameters"];
        var examples = components["examples"];
        var requestBodies = components["requestBodies"];
        var headers = components["headers"];
        var securitySchemes = components["securitySchemes"];
        var links = components["links"];
        var callbacks = components["callbacks"];
        if (this.isDefined(schemas)) {
            for (var name_3 in schemas) {
                var schema = schemas[name_3];
                var schemaModel = componentsModel.createSchemaDefinition(name_3);
                this.readSchema(schema, schemaModel);
                componentsModel.addSchemaDefinition(name_3, schemaModel);
            }
        }
        if (this.isDefined(responses)) {
            for (var name_4 in responses) {
                var response = responses[name_4];
                var responseModel = componentsModel.createResponseDefinition(name_4);
                this.readResponseBase(response, responseModel);
                componentsModel.addResponseDefinition(name_4, responseModel);
            }
        }
        if (this.isDefined(parameters)) {
            for (var name_5 in parameters) {
                var parameter = parameters[name_5];
                var parameterModel = componentsModel.createParameterDefinition(name_5);
                this.readParameterBase(parameter, parameterModel);
                componentsModel.addParameterDefinition(name_5, parameterModel);
            }
        }
        if (this.isDefined(examples)) {
            for (var name_6 in examples) {
                var example = examples[name_6];
                var exampleModel = componentsModel.createExampleDefinition(name_6);
                this.readExample(example, exampleModel);
                componentsModel.addExampleDefinition(name_6, exampleModel);
            }
        }
        if (this.isDefined(requestBodies)) {
            for (var name_7 in requestBodies) {
                var requestBody = requestBodies[name_7];
                var requestBodyModel = componentsModel.createRequestBodyDefinition(name_7);
                this.readRequestBody(requestBody, requestBodyModel);
                componentsModel.addRequestBodyDefinition(name_7, requestBodyModel);
            }
        }
        if (this.isDefined(headers)) {
            for (var name_8 in headers) {
                var header = headers[name_8];
                var headerModel = componentsModel.createHeaderDefinition(name_8);
                this.readHeader(header, headerModel);
                componentsModel.addHeaderDefinition(name_8, headerModel);
            }
        }
        if (this.isDefined(securitySchemes)) {
            for (var name_9 in securitySchemes) {
                var securityScheme = securitySchemes[name_9];
                var securitySchemeModel = componentsModel.createSecurityScheme(name_9);
                this.readSecurityScheme(securityScheme, securitySchemeModel);
                componentsModel.addSecurityScheme(name_9, securitySchemeModel);
            }
        }
        if (this.isDefined(links)) {
            for (var name_10 in links) {
                var link = links[name_10];
                var linkModel = componentsModel.createLinkDefinition(name_10);
                this.readLink(link, linkModel);
                componentsModel.addLinkDefinition(name_10, linkModel);
            }
        }
        if (this.isDefined(callbacks)) {
            for (var name_11 in callbacks) {
                var callback = callbacks[name_11];
                var callbackModel = componentsModel.createCallbackDefinition(name_11);
                this.readCallback(callback, callbackModel);
                componentsModel.addCallbackDefinition(name_11, callbackModel);
            }
        }
        this.readExtensions(components, componentsModel);
    };
    /**
     * Reads an OAS 3.0 Security Scheme object from the given JS data.
     * @param securityScheme
     * @param securitySchemeModel
     */
    Oas30JS2ModelReader.prototype.readSecurityScheme = function (securityScheme, securitySchemeModel) {
        _super.prototype.readSecurityScheme.call(this, securityScheme, securitySchemeModel);
        var $ref = securityScheme["$ref"];
        var scheme = securityScheme["scheme"];
        var bearerFormat = securityScheme["bearerFormat"];
        var flows = securityScheme["flows"];
        var openIdConnectUrl = securityScheme["openIdConnectUrl"];
        if (this.isDefined($ref)) {
            securitySchemeModel.$ref = $ref;
        }
        if (this.isDefined(scheme)) {
            securitySchemeModel.scheme = scheme;
        }
        if (this.isDefined(bearerFormat)) {
            securitySchemeModel.bearerFormat = bearerFormat;
        }
        if (this.isDefined(flows)) {
            var flowsModel = securitySchemeModel.createOAuthFlows();
            this.readOAuthFlows(flows, flowsModel);
            securitySchemeModel.flows = flowsModel;
        }
        if (this.isDefined(openIdConnectUrl)) {
            securitySchemeModel.openIdConnectUrl = openIdConnectUrl;
        }
        this.readExtensions(securityScheme, securitySchemeModel);
    };
    /**
     * Reads an OAS 3.0 OAuth Flows object from the given JS data.
     * @param flows
     * @param flowsModel
     */
    Oas30JS2ModelReader.prototype.readOAuthFlows = function (flows, flowsModel) {
        var implicit = flows["implicit"];
        var password = flows["password"];
        var clientCredentials = flows["clientCredentials"];
        var authorizationCode = flows["authorizationCode"];
        if (this.isDefined(implicit)) {
            var flowModel = flowsModel.createImplicitOAuthFlow();
            this.readOAuthFlow(implicit, flowModel);
            flowsModel.implicit = flowModel;
        }
        if (this.isDefined(password)) {
            var flowModel = flowsModel.createPasswordOAuthFlow();
            this.readOAuthFlow(password, flowModel);
            flowsModel.password = flowModel;
        }
        if (this.isDefined(clientCredentials)) {
            var flowModel = flowsModel.createClientCredentialsOAuthFlow();
            this.readOAuthFlow(clientCredentials, flowModel);
            flowsModel.clientCredentials = flowModel;
        }
        if (this.isDefined(authorizationCode)) {
            var flowModel = flowsModel.createAuthorizationCodeOAuthFlow();
            this.readOAuthFlow(authorizationCode, flowModel);
            flowsModel.authorizationCode = flowModel;
        }
        this.readExtensions(flows, flowsModel);
    };
    /**
     * Reads an OAS 3.0 OAuth Flow object from the given JS data.
     * @param flow
     * @param flowModel
     */
    Oas30JS2ModelReader.prototype.readOAuthFlow = function (flow, flowModel) {
        var authorizationUrl = flow["authorizationUrl"];
        var tokenUrl = flow["tokenUrl"];
        var refreshUrl = flow["refreshUrl"];
        var scopes = flow["scopes"];
        if (this.isDefined(authorizationUrl)) {
            flowModel.authorizationUrl = authorizationUrl;
        }
        if (this.isDefined(tokenUrl)) {
            flowModel.tokenUrl = tokenUrl;
        }
        if (this.isDefined(refreshUrl)) {
            flowModel.refreshUrl = refreshUrl;
        }
        if (this.isDefined(scopes)) {
            for (var name_12 in scopes) {
                var scopeDescription = scopes[name_12];
                flowModel.addScope(name_12, scopeDescription);
            }
        }
        this.readExtensions(flow, flowModel);
    };
    /**
     * Reads an OAS 3.0 PathItem object from the given JS data.
     * @param pathItem
     * @param pathItemModel
     */
    Oas30JS2ModelReader.prototype.readPathItem = function (pathItem, pathItemModel) {
        _super.prototype.readPathItem.call(this, pathItem, pathItemModel);
        var summary = pathItem["summary"];
        var description = pathItem["description"];
        var trace = pathItem["trace"];
        var servers = pathItem["servers"];
        if (this.isDefined(summary)) {
            pathItemModel.summary = summary;
        }
        if (this.isDefined(description)) {
            pathItemModel.description = description;
        }
        if (this.isDefined(trace)) {
            var opModel = pathItemModel.createOperation("trace");
            this.readOperation(trace, opModel);
            pathItemModel.trace = opModel;
        }
        if (Array.isArray(servers)) {
            pathItemModel.servers = [];
            for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
                var server = servers_1[_i];
                var serverModel = pathItemModel.createServer();
                this.readServer(server, serverModel);
                pathItemModel.servers.push(serverModel);
            }
        }
    };
    /**
     * Reads an OAS 3.0 Header object from the given js data.
     * @param header
     * @param headerModel
     */
    Oas30JS2ModelReader.prototype.readHeader = function (header, headerModel) {
        var $ref = header["$ref"];
        var description = header["description"];
        var required = header["required"];
        var schema = header["schema"];
        var allowEmptyValue = header["allowEmptyValue"];
        var deprecated = header["deprecated"];
        var style = header["style"];
        var explode = header["explode"];
        var allowReserved = header["allowReserved"];
        var example = header["example"];
        var examples = header["examples"];
        var content = header["content"];
        if (this.isDefined($ref)) {
            headerModel.$ref = $ref;
        }
        if (this.isDefined(description)) {
            headerModel.description = description;
        }
        if (this.isDefined(required)) {
            headerModel.required = required;
        }
        if (this.isDefined(schema)) {
            var schemaModel = headerModel.createSchema();
            this.readSchema(schema, schemaModel);
            headerModel.schema = schemaModel;
        }
        if (this.isDefined(allowEmptyValue)) {
            headerModel.allowEmptyValue = allowEmptyValue;
        }
        if (this.isDefined(deprecated)) {
            headerModel.deprecated = deprecated;
        }
        if (this.isDefined(style)) {
            headerModel.style = style;
        }
        if (this.isDefined(explode)) {
            headerModel.explode = explode;
        }
        if (this.isDefined(allowReserved)) {
            headerModel.allowReserved = allowReserved;
        }
        if (this.isDefined(example)) {
            headerModel.example = example;
        }
        if (this.isDefined(examples)) {
            for (var exampleName in examples) {
                var exx = examples[exampleName];
                var exampleModel = headerModel.createExample(exampleName);
                this.readExample(exx, exampleModel);
                headerModel.addExample(exampleModel);
            }
        }
        if (this.isDefined(content)) {
            for (var name_13 in content) {
                var mediaType = content[name_13];
                var mediaTypeModel = headerModel.createMediaType(name_13);
                this.readMediaType(mediaType, mediaTypeModel);
                headerModel.addMediaType(name_13, mediaTypeModel);
            }
        }
        this.readExtensions(header, headerModel);
    };
    /**
     * Reads an OAS 3.0 Parameter object from the given JS data.
     * @param parameter
     * @param paramModel
     */
    Oas30JS2ModelReader.prototype.readParameterBase = function (parameter, paramModel) {
        var $ref = parameter["$ref"];
        var name = parameter["name"];
        var in_ = parameter["in"];
        var description = parameter["description"];
        var required = parameter["required"];
        var schema = parameter["schema"];
        var allowEmptyValue = parameter["allowEmptyValue"];
        var deprecated = parameter["deprecated"];
        var style = parameter["style"];
        var explode = parameter["explode"];
        var allowReserved = parameter["allowReserved"];
        var example = parameter["example"];
        var examples = parameter["examples"];
        var content = parameter["content"];
        if (this.isDefined($ref)) {
            paramModel.$ref = $ref;
        }
        if (this.isDefined(name)) {
            paramModel.name = name;
        }
        if (this.isDefined(in_)) {
            paramModel.in = in_;
        }
        if (this.isDefined(description)) {
            paramModel.description = description;
        }
        if (this.isDefined(required)) {
            paramModel.required = required;
        }
        if (this.isDefined(schema)) {
            var schemaModel = paramModel.createSchema();
            this.readSchema(schema, schemaModel);
            paramModel.schema = schemaModel;
        }
        if (this.isDefined(allowEmptyValue)) {
            paramModel.allowEmptyValue = allowEmptyValue;
        }
        if (this.isDefined(deprecated)) {
            paramModel.deprecated = deprecated;
        }
        if (this.isDefined(style)) {
            paramModel.style = style;
        }
        if (this.isDefined(explode)) {
            paramModel.explode = explode;
        }
        if (this.isDefined(allowReserved)) {
            paramModel.allowReserved = allowReserved;
        }
        if (this.isDefined(example)) {
            paramModel.example = example;
        }
        if (this.isDefined(examples)) {
            for (var exampleName in examples) {
                var exx = examples[exampleName];
                var exampleModel = paramModel.createExample(exampleName);
                this.readExample(exx, exampleModel);
                paramModel.addExample(exampleModel);
            }
        }
        if (this.isDefined(content)) {
            for (var name_14 in content) {
                var mediaType = content[name_14];
                var mediaTypeModel = paramModel.createMediaType(name_14);
                this.readMediaType(mediaType, mediaTypeModel);
                paramModel.addMediaType(name_14, mediaTypeModel);
            }
        }
        this.readExtensions(parameter, paramModel);
    };
    /**
     * Reads an OAS 3.0 Parameter object from the given js data.
     * @param parameter
     * @param paramModel
     */
    Oas30JS2ModelReader.prototype.readParameter = function (parameter, paramModel) {
        var $ref = parameter["$ref"];
        if (this.isDefined($ref)) {
            paramModel.$ref = $ref;
        }
        this.readParameterBase(parameter, paramModel);
    };
    /**
     * Reads an OAS 3.0 Operation object from the given JS data.
     * @param operation
     * @param operationModel
     */
    Oas30JS2ModelReader.prototype.readOperation = function (operation, operationModel) {
        var _this = this;
        _super.prototype.readOperation.call(this, operation, operationModel);
        var requestBody = operation["requestBody"];
        var callbacks = operation["callbacks"];
        var servers = operation["servers"];
        if (this.isDefined(requestBody)) {
            var requestBodyModel = operationModel.createRequestBody();
            this.readRequestBody(requestBody, requestBodyModel);
            operationModel.requestBody = requestBodyModel;
        }
        if (this.isDefined(callbacks)) {
            for (var name_15 in callbacks) {
                var callback = callbacks[name_15];
                var callbackModel = operationModel.createCallback(name_15);
                this.readCallback(callback, callbackModel);
                operationModel.addCallback(name_15, callbackModel);
            }
        }
        if (Array.isArray(servers)) {
            operationModel.servers = [];
            servers.forEach(function (server) {
                var serverModel = operationModel.createServer();
                _this.readServer(server, serverModel);
                operationModel.servers.push(serverModel);
            });
        }
    };
    /**
     * Reads an OAS 3.0 Callback object from the given JS data.
     * @param callback
     * @param callbackModel
     */
    Oas30JS2ModelReader.prototype.readCallback = function (callback, callbackModel) {
        for (var name_16 in callback) {
            if (name_16 === "$ref") {
                callbackModel.$ref = callback[name_16];
                continue;
            }
            var pathItem = callback[name_16];
            var pathItemModel = callbackModel.createPathItem(name_16);
            this.readPathItem(pathItem, pathItemModel);
            callbackModel.addPathItem(name_16, pathItemModel);
        }
        this.readExtensions(callback, callbackModel);
    };
    /**
     * Reads an OAS 3.0 Request Body object from the given JS data.
     * @param requestBody
     * @param requestBodyModel
     */
    Oas30JS2ModelReader.prototype.readRequestBody = function (requestBody, requestBodyModel) {
        var $ref = requestBody["$ref"];
        var description = requestBody["description"];
        var content = requestBody["content"];
        var required = requestBody["required"];
        if (this.isDefined($ref)) {
            requestBodyModel.$ref = $ref;
        }
        if (this.isDefined(description)) {
            requestBodyModel.description = description;
        }
        if (this.isDefined(content)) {
            for (var name_17 in content) {
                var mediaType = content[name_17];
                var mediaTypeModel = requestBodyModel.createMediaType(name_17);
                this.readMediaType(mediaType, mediaTypeModel);
                requestBodyModel.addMediaType(name_17, mediaTypeModel);
            }
        }
        if (this.isDefined(required)) {
            requestBodyModel.required = required;
        }
        this.readExtensions(requestBody, requestBodyModel);
    };
    /**
     * Reads an OAS 3.0 Media Type from the given js data.
     * @param mediaType
     * @param mediaTypeModel
     */
    Oas30JS2ModelReader.prototype.readMediaType = function (mediaType, mediaTypeModel) {
        var schema = mediaType["schema"];
        var example = mediaType["example"];
        var examples = mediaType["examples"];
        var encodings = mediaType["encoding"];
        if (this.isDefined(schema)) {
            var schemaModel = mediaTypeModel.createSchema();
            this.readSchema(schema, schemaModel);
            mediaTypeModel.schema = schemaModel;
        }
        if (this.isDefined(example)) {
            mediaTypeModel.example = example;
        }
        if (this.isDefined(examples)) {
            for (var exampleName in examples) {
                var exx = examples[exampleName];
                var exampleModel = mediaTypeModel.createExample(exampleName);
                this.readExample(exx, exampleModel);
                mediaTypeModel.addExample(exampleModel);
            }
        }
        if (this.isDefined(encodings)) {
            for (var name_18 in encodings) {
                var encoding = encodings[name_18];
                var encodingModel = mediaTypeModel.createEncoding(name_18);
                this.readEncoding(encoding, encodingModel);
                mediaTypeModel.addEncoding(name_18, encodingModel);
            }
        }
        this.readExtensions(mediaType, mediaTypeModel);
    };
    /**
     * Reads an OAS 3.0 Example from the given js data.
     * @param example
     * @param exampleModel
     */
    Oas30JS2ModelReader.prototype.readExample = function (example, exampleModel) {
        var $ref = example["$ref"];
        var summary = example["summary"];
        var description = example["description"];
        var value = example["value"];
        var externalValue = example["externalValue"];
        if (this.isDefined($ref)) {
            exampleModel.$ref = $ref;
        }
        if (this.isDefined(summary)) {
            exampleModel.summary = summary;
        }
        if (this.isDefined(description)) {
            exampleModel.description = description;
        }
        if (this.isDefined(value)) {
            exampleModel.value = value;
        }
        if (this.isDefined(externalValue)) {
            exampleModel.externalValue = externalValue;
        }
        this.readExtensions(example, exampleModel);
    };
    /**
     * Reads an OAS 3.0 Encoding from the given js data.
     * @param encodingProperty
     * @param encodingModel
     */
    Oas30JS2ModelReader.prototype.readEncoding = function (encodingProperty, encodingModel) {
        var contentType = encodingProperty["contentType"];
        var headers = encodingProperty["headers"];
        var style = encodingProperty["style"];
        var explode = encodingProperty["explode"];
        var allowReserved = encodingProperty["allowReserved"];
        if (this.isDefined(contentType)) {
            encodingModel.contentType = contentType;
        }
        if (this.isDefined(headers)) {
            for (var name_19 in headers) {
                var header = headers[name_19];
                var headerModel = encodingModel.createHeader(name_19);
                this.readHeader(header, headerModel);
                encodingModel.addHeader(name_19, headerModel);
            }
        }
        if (this.isDefined(style)) {
            encodingModel.style = style;
        }
        if (this.isDefined(explode)) {
            encodingModel.explode = explode;
        }
        if (this.isDefined(allowReserved)) {
            encodingModel.allowReserved = allowReserved;
        }
        this.readExtensions(encodingProperty, encodingModel);
    };
    /**
     * Reads an OAS 3.0 Response object from the given js data.
     * @param response
     * @param responseModel
     */
    Oas30JS2ModelReader.prototype.readResponse = function (response, responseModel) {
        this.readResponseBase(response, responseModel);
    };
    /**
     * Reads an OAS 3.0 Response object from the given JS data.
     * @param response
     * @param responseModel
     */
    Oas30JS2ModelReader.prototype.readResponseBase = function (response, responseModel) {
        var $ref = response["$ref"];
        var description = response["description"];
        var headers = response["headers"];
        var content = response["content"];
        var links = response["links"];
        if (this.isDefined($ref)) {
            responseModel.$ref = $ref;
        }
        if (this.isDefined(description)) {
            responseModel.description = description;
        }
        if (this.isDefined(headers)) {
            for (var name_20 in headers) {
                var header = headers[name_20];
                var headerModel = responseModel.createHeader(name_20);
                this.readHeader(header, headerModel);
                responseModel.addHeader(name_20, headerModel);
            }
        }
        if (this.isDefined(content)) {
            for (var name_21 in content) {
                var mediaType = content[name_21];
                var mediaTypeModel = responseModel.createMediaType(name_21);
                this.readMediaType(mediaType, mediaTypeModel);
                responseModel.addMediaType(name_21, mediaTypeModel);
            }
        }
        if (this.isDefined(links)) {
            for (var name_22 in links) {
                var link = links[name_22];
                var linkModel = responseModel.createLink(name_22);
                this.readLink(link, linkModel);
                responseModel.addLink(name_22, linkModel);
            }
        }
        this.readExtensions(response, responseModel);
    };
    /**
     * Reads an OAS 3.0 Link object from the given js data.
     * @param link
     * @param linkModel
     */
    Oas30JS2ModelReader.prototype.readLink = function (link, linkModel) {
        var $ref = link["$ref"];
        var operationRef = link["operationRef"];
        var operationId = link["operationId"];
        var parameters = link["parameters"];
        var requestBody = link["requestBody"];
        var description = link["description"];
        var server = link["server"];
        if (this.isDefined($ref)) {
            linkModel.$ref = $ref;
        }
        if (this.isDefined(operationRef)) {
            linkModel.operationRef = operationRef;
        }
        if (this.isDefined(operationId)) {
            linkModel.operationId = operationId;
        }
        if (this.isDefined(parameters)) {
            for (var name_23 in parameters) {
                var expression = parameters[name_23];
                linkModel.addLinkParameter(name_23, expression);
            }
        }
        if (this.isDefined(requestBody)) {
            var linkRequestBodyExpressionModel = linkModel.createLinkRequestBodyExpression(requestBody);
            linkModel.requestBody = linkRequestBodyExpressionModel;
        }
        if (this.isDefined(description)) {
            linkModel.description = description;
        }
        if (this.isDefined(server)) {
            var serverModel = linkModel.createServer();
            this.readServer(server, serverModel);
            linkModel.server = serverModel;
        }
        this.readExtensions(link, linkModel);
    };
    /**
     * Reads an OAS 3.0 Schema object from the given js data.
     * @param schema
     * @param schemaModel
     */
    Oas30JS2ModelReader.prototype.readSchema = function (schema, schemaModel) {
        _super.prototype.readSchema.call(this, schema, schemaModel);
        var oneOf = schema["oneOf"];
        var anyOf = schema["anyOf"];
        var not = schema["not"];
        var discriminator = schema["discriminator"];
        var nullable = schema["nullable"];
        var writeOnly = schema["writeOnly"];
        var deprecated = schema["deprecated"];
        if (this.isDefined(discriminator)) {
            var discriminatorModel = schemaModel.createDiscriminator();
            this.readDiscriminator(discriminator, discriminatorModel);
            schemaModel.discriminator = discriminatorModel;
        }
        if (this.isDefined(oneOf)) {
            var schemaModels = [];
            for (var _i = 0, oneOf_1 = oneOf; _i < oneOf_1.length; _i++) {
                var oneOfSchema = oneOf_1[_i];
                var oneOfSchemaModel = schemaModel.createOneOfSchema();
                this.readSchema(oneOfSchema, oneOfSchemaModel);
                schemaModels.push(oneOfSchemaModel);
            }
            schemaModel.oneOf = schemaModels;
        }
        if (this.isDefined(anyOf)) {
            var schemaModels = [];
            for (var _a = 0, anyOf_1 = anyOf; _a < anyOf_1.length; _a++) {
                var anyOfSchema = anyOf_1[_a];
                var anyOfSchemaModel = schemaModel.createAnyOfSchema();
                this.readSchema(anyOfSchema, anyOfSchemaModel);
                schemaModels.push(anyOfSchemaModel);
            }
            schemaModel.anyOf = schemaModels;
        }
        if (this.isDefined(not)) {
            var notSchema = schemaModel.createNotSchema();
            this.readSchema(not, notSchema);
            schemaModel.not = notSchema;
        }
        if (this.isDefined(nullable)) {
            schemaModel.nullable = nullable;
        }
        if (this.isDefined(writeOnly)) {
            schemaModel.writeOnly = writeOnly;
        }
        if (this.isDefined(deprecated)) {
            schemaModel.deprecated = deprecated;
        }
    };
    /**
     * Reads a OAS 3.0 Server object from the given javascript data.
     * @param server
     * @param serverModel
     */
    Oas30JS2ModelReader.prototype.readServer = function (server, serverModel) {
        var url = server["url"];
        var description = server["description"];
        var variables = server["variables"];
        if (this.isDefined(url)) {
            serverModel.url = url;
        }
        if (this.isDefined(description)) {
            serverModel.description = description;
        }
        if (this.isDefined(variables)) {
            for (var name_24 in variables) {
                var serverVariable = variables[name_24];
                var serverVariableModel = serverModel.createServerVariable(name_24);
                this.readServerVariable(serverVariable, serverVariableModel);
                serverModel.addServerVariable(name_24, serverVariableModel);
            }
        }
        this.readExtensions(server, serverModel);
    };
    /**
     * Reads an OAS 3.0 Server Variable object from the given JS data.
     * @param serverVariable
     * @param serverVariableModel
     */
    Oas30JS2ModelReader.prototype.readServerVariable = function (serverVariable, serverVariableModel) {
        var _enum = serverVariable["enum"];
        var _default = serverVariable["default"];
        var description = serverVariable["description"];
        if (Array.isArray(_enum)) {
            serverVariableModel.enum = _enum;
        }
        if (this.isDefined(_default)) {
            serverVariableModel.default = _default;
        }
        if (this.isDefined(description)) {
            serverVariableModel.description = description;
        }
        this.readExtensions(serverVariable, serverVariableModel);
    };
    /**
     * Reads an OAS 3.0 Discriminator object from the given JS data.
     * @param discriminator
     * @param discriminatorModel
     */
    Oas30JS2ModelReader.prototype.readDiscriminator = function (discriminator, discriminatorModel) {
        var propertyName = discriminator["propertyName"];
        var mapping = discriminator["mapping"];
        if (this.isDefined(propertyName)) {
            discriminatorModel.propertyName = propertyName;
        }
        if (this.isDefined(mapping)) {
            discriminatorModel.mapping = mapping;
        }
        this.readExtensions(discriminator, discriminatorModel);
    };
    return Oas30JS2ModelReader;
}(OasJS2ModelReader));

/**
 * @license
 * Copyright 2017 Red Hat
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
/**
 * The main factory for creating new OAS Documents.  This can be used to create a new, empty
 * document.  It can also be used to parse
 */
var OasDocumentFactory = (function () {
    function OasDocumentFactory() {
    }
    /**
     * Creates a new, empty instance of an OAS document.
     * @param oasVersion
     * @return {OasDocument}
     */
    OasDocumentFactory.prototype.createEmpty = function (oasVersion) {
        if (oasVersion === "2.0") {
            return new Oas20Document();
        }
        if (oasVersion.indexOf("3.") === 0) {
            return new Oas30Document();
        }
        throw new Error("Unsupported OAS version: " + oasVersion);
    };
    /**
     * Reads the given object and creates a valid OAS document model.
     * @param oasObject
     * @return {Oas20Document}
     */
    OasDocumentFactory.prototype.createFromObject = function (oasObject) {
        if (oasObject.swagger && oasObject.swagger === "2.0") {
            var reader = new Oas20JS2ModelReader();
            return reader.read(oasObject);
        }
        else if (oasObject.openapi && oasObject.openapi.indexOf("3.") === 0) {
            var reader = new Oas30JS2ModelReader();
            return reader.read(oasObject);
        }
        else {
            var ver = oasObject.swagger;
            if (!ver) {
                ver = oasObject.openapi;
            }
            throw new Error("Unsupported OAS version: " + ver);
        }
    };
    /**
     * Parses the given OAS definition source, parses it into an appropriate data model, and
     * returns it.  The factory will figure out what version of the data model to create based
     * on the content of the source.
     *
     * @param oasDefinitionSource
     * @return {null}
     */
    OasDocumentFactory.prototype.createFromJson = function (oasDefinition) {
        var jsObj = JSON.parse(oasDefinition);
        return this.createFromObject(jsObj);
    };
    return OasDocumentFactory;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$76 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Visitor used to convert from a Model into a JavaScript object.
 */
var OasModelToJSVisitor = (function () {
    /**
     * Constructor.
     */
    function OasModelToJSVisitor() {
        this.reset();
    }
    /**
     * Resets the visitor for a new run.
     */
    OasModelToJSVisitor.prototype.reset = function () {
        this._result = null;
        this._modelIdToJS = {};
    };
    /**
     * Returns the result that was built up during the visit of the model.
     * @return {any}
     */
    OasModelToJSVisitor.prototype.getResult = function () {
        return this.removeNullProperties(this._result);
    };
    /**
     * Removes any property with a null value from the js object.  This is done recursively.
     * @param object
     */
    OasModelToJSVisitor.prototype.removeNullProperties = function (object) {
        if (object instanceof Array) {
            for (var _i = 0, _a = object; _i < _a.length; _i++) {
                var item = _a[_i];
                this.removeNullProperties(item);
            }
        }
        else if (object instanceof Object) {
            for (var key in object) {
                if (object[key] == null) {
                    delete object[key];
                }
                else {
                    this.removeNullProperties(object[key]);
                }
            }
        }
        return object;
    };
    /**
     * Indexes the javascript object by the ModelId of the model it was created from.  This allows
     * quick lookup (mapping) from the model to the JS object.
     * @param node
     * @param jsObject
     */
    OasModelToJSVisitor.prototype.updateIndex = function (node, jsObject) {
        this._modelIdToJS[node.modelId()] = jsObject;
        // Note: the first JS object created by the visitor is the result (we always traverse top-down).
        if (this._result == null) {
            this._result = jsObject;
        }
    };
    /**
     * Lookup a JS object from the ID of the model it came from.
     * @param modelId
     * @return {any}
     */
    OasModelToJSVisitor.prototype.lookup = function (modelId) {
        var rval = this._modelIdToJS[modelId];
        // If not found, return a throwaway object (this would happen when doing a partial
        // read of a subsection of a OAS document).
        if (!this.isDefined(rval)) {
            return {};
        }
        return rval;
    };
    /**
     * Lookup a JS object using the model ID of the node's parent.
     * @param node
     * @return {any}
     */
    OasModelToJSVisitor.prototype.lookupParentJS = function (node) {
        return this.lookup(node.parent().modelId());
    };
    /**
     * Returns true if the given thing is defined.
     * @param thing
     * @return {boolean}
     */
    OasModelToJSVisitor.prototype.isDefined = function (thing) {
        if (thing === undefined || thing === null) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Merges multiple objects into a single object.  This is done by iterating through
     * all properties of all objects and assigning them as properties of a new object.  The
     * result is a new object with all the properties of all objects passed to the method.
     * @param objects
     */
    OasModelToJSVisitor.prototype.merge = function () {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        var rval = new Object();
        for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
            var object = objects_1[_a];
            for (var key in object) {
                var val = object[key];
                rval[key] = val;
            }
        }
        return rval;
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitInfo = function (node) {
        var parentJS = this.lookupParentJS(node);
        var info = {
            title: node.title,
            description: node.description,
            termsOfService: node.termsOfService,
            contact: null,
            license: null,
            version: node.version
        };
        parentJS.info = info;
        this.updateIndex(node, info);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitContact = function (node) {
        var parentJS = this.lookupParentJS(node);
        var contact = {
            name: node.name,
            url: node.url,
            email: node.email
        };
        parentJS.contact = contact;
        this.updateIndex(node, contact);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitLicense = function (node) {
        var parentJS = this.lookupParentJS(node);
        var license = {
            name: node.name,
            url: node.url,
        };
        parentJS.license = license;
        this.updateIndex(node, license);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitPaths = function (node) {
        var paths = {};
        var parentJS = this.lookupParentJS(node);
        parentJS.paths = paths;
        this.updateIndex(node, paths);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitResponses = function (node) {
        var parentJS = this.lookupParentJS(node);
        var responses = {
            default: null
        };
        parentJS.responses = responses;
        this.updateIndex(node, responses);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitXML = function (node) {
        var parent = this.lookupParentJS(node);
        var xml = {
            name: node.name,
            namespace: node.namespace,
            prefix: node.prefix,
            attribute: node.attribute,
            wrapped: node.wrapped
        };
        parent.xml = xml;
        this.updateIndex(node, xml);
    };
    /**
 * Visits a node.
 * @param node
 */
    OasModelToJSVisitor.prototype.visitSecurityRequirement = function (node) {
        var parentJS = this.lookupParentJS(node);
        var securityRequirements = parentJS["security"];
        if (!this.isDefined(securityRequirements)) {
            securityRequirements = [];
            parentJS.security = securityRequirements;
        }
        var securityReq = {};
        for (var _i = 0, _a = node.securityRequirementNames(); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            securityReq[name_1] = node.scopes(name_1);
        }
        securityRequirements.push(securityReq);
        this.updateIndex(node, securityReq);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitTag = function (node) {
        var parentJS = this.lookupParentJS(node);
        if (!this.isDefined(parentJS.tags)) {
            parentJS.tags = [];
        }
        var tag = {
            name: node.name,
            description: node.description,
            externalDocs: null
        };
        parentJS.tags.push(tag);
        this.updateIndex(node, tag);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitExternalDocumentation = function (node) {
        var parentJS = this.lookupParentJS(node);
        parentJS.externalDocs = {
            description: node.description,
            url: node.url
        };
        this.updateIndex(node, parentJS.externalDocs);
    };
    /**
     * Visits a node.
     * @param node
     */
    OasModelToJSVisitor.prototype.visitExtension = function (node) {
        var jsObject = this.lookupParentJS(node);
        jsObject[node.name] = node.value;
    };
    return OasModelToJSVisitor;
}());
/**
 * Visitor used to convert from a Model into a JavaScript object that conforms
 * to the OAS 2.0 specification.  The resulting JS object can be stringified and
 * should be a valid OAS 2.0 document.
 */
var Oas20ModelToJSVisitor = (function (_super) {
    __extends$76(Oas20ModelToJSVisitor, _super);
    /**
     * Constructor.
     */
    function Oas20ModelToJSVisitor() {
        return _super.call(this) || this;
    }
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitDocument = function (node) {
        var root = {
            swagger: node.swagger,
            info: null,
            host: node.host,
            basePath: node.basePath,
            schemes: node.schemes,
            consumes: node.consumes,
            produces: node.produces,
            paths: null,
            definitions: null,
            parameters: null,
            responses: null,
            securityDefinitions: null,
            security: null,
            tags: null,
            externalDocs: null
        };
        this.updateIndex(node, root);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitPathItem = function (node) {
        var parentJS = this.lookupParentJS(node);
        var pathItem = {
            $ref: node.$ref,
            get: null,
            put: null,
            post: null,
            delete: null,
            options: null,
            head: null,
            patch: null,
            parameters: null
        };
        parentJS[node.path()] = pathItem;
        this.updateIndex(node, pathItem);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitOperation = function (node) {
        var parentJS = this.lookupParentJS(node);
        var operation = {
            tags: node.tags,
            summary: node.summary,
            description: node.description,
            externalDocs: null,
            operationId: node.operationId,
            consumes: node.consumes,
            produces: node.produces,
            parameters: null,
            responses: null,
            schemes: node.schemes,
            deprecated: node.deprecated,
            security: null
        };
        parentJS[node.method()] = operation;
        this.updateIndex(node, operation);
    };
    /**
     * Creates a JS object for a Parameter base object.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.createParameterObject = function (node) {
        var items = this.createItemsObject(node);
        var parameter = {
            name: node.name,
            in: node.in,
            description: node.description,
            required: node.required,
            schema: null,
            allowEmptyValue: node.allowEmptyValue
        };
        parameter = this.merge(parameter, items);
        return parameter;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitParameter = function (node) {
        var parentJS = this.lookupParentJS(node);
        if (parentJS.parameters == null) {
            parentJS.parameters = [];
        }
        var parameter = this.createParameterObject(node);
        var paramRef = {
            $ref: node.$ref
        };
        parameter = this.merge(paramRef, parameter);
        parentJS.parameters.push(parameter);
        this.updateIndex(node, parameter);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitParameterDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var parameter = this.createParameterObject(node);
        parentJS[node.parameterName()] = parameter;
        this.updateIndex(node, parameter);
    };
    /**
     * Creates a JS object for a response base instance.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.createResponseObject = function (node) {
        return {
            description: node.description,
            schema: null,
            headers: null,
            examples: null
        };
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitHeaders = function (node) {
        if (node.headerNames().length > 0) {
            var parentJS = this.lookupParentJS(node);
            var headers = {};
            parentJS.headers = headers;
            this.updateIndex(node, headers);
        }
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitResponse = function (node) {
        var parentJS = this.lookupParentJS(node);
        var response = this.createResponseObject(node);
        var responseRef = {
            $ref: node.$ref
        };
        response = this.merge(responseRef, response);
        if (node.statusCode() === null || node.statusCode() === "default") {
            parentJS.default = response;
        }
        else {
            parentJS[node.statusCode()] = response;
        }
        this.updateIndex(node, response);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitResponseDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var response = this.createResponseObject(node);
        parentJS[node.name()] = response;
        this.updateIndex(node, response);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        parentJS.schema = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitPropertySchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.properties)) {
            parentJS.properties = {};
        }
        parentJS.properties[node.propertyName()] = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitSchemaDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        parentJS[node.definitionName()] = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        parentJS.additionalProperties = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitAllOfSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.allOf)) {
            parentJS.allOf = [];
        }
        parentJS.allOf.push(schema);
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitItemsSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.items)) {
            parentJS.items = schema;
        }
        else if (Array.isArray(parentJS.items)) {
            parentJS.items.push(schema);
        }
        else {
            parentJS.items = [
                parentJS.items, schema
            ];
        }
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitHeader = function (node) {
        var parentJS = this.lookupParentJS(node);
        var headerOnly = {
            description: node.description
        };
        var items = this.createItemsObject(node);
        var header = this.merge(headerOnly, items);
        parentJS[node.headerName()] = header;
        this.updateIndex(node, header);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitExample = function (node) {
        var parentJS = this.lookupParentJS(node);
        var examples = {};
        for (var _i = 0, _a = node.exampleContentTypes(); _i < _a.length; _i++) {
            var ct = _a[_i];
            var example = node.example(ct);
            examples[ct] = example;
        }
        parentJS.examples = examples;
        this.updateIndex(node, examples);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitItems = function (node) {
        var parentJS = this.lookupParentJS(node);
        var items = this.createItemsObject(node);
        parentJS.items = items;
        this.updateIndex(node, items);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitSecurityDefinitions = function (node) {
        var parent = this.lookupParentJS(node);
        var secDefs = {};
        for (var name_2 in node.securitySchemeNames()) {
            secDefs[name_2] = null;
        }
        parent.securityDefinitions = secDefs;
        this.updateIndex(node, secDefs);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitSecurityScheme = function (node) {
        var parent = this.lookupParentJS(node);
        var scheme = {
            type: node.type,
            description: node.description,
            name: node.name,
            in: node.in,
            flow: node.flow,
            authorizationUrl: node.authorizationUrl,
            tokenUrl: node.tokenUrl,
            scopes: null
        };
        parent[node.schemeName()] = scheme;
        this.updateIndex(node, scheme);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitScopes = function (node) {
        var parent = this.lookupParentJS(node);
        var scopes = {};
        for (var _i = 0, _a = node.scopes(); _i < _a.length; _i++) {
            var scope = _a[_i];
            var desc = node.getScopeDescription(scope);
            scopes[scope] = desc;
        }
        parent.scopes = scopes;
        this.updateIndex(node, scopes);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitDefinitions = function (node) {
        var defNames = node.definitionNames();
        if (defNames && defNames.length > 0) {
            var parent_1 = this.lookupParentJS(node);
            var definitions = {};
            parent_1.definitions = definitions;
            this.updateIndex(node, definitions);
        }
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitParametersDefinitions = function (node) {
        var paramNames = node.parameterNames();
        if (paramNames && paramNames.length > 0) {
            var parent_2 = this.lookupParentJS(node);
            var parameters = {};
            parent_2.parameters = parameters;
            this.updateIndex(node, parameters);
        }
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.visitResponsesDefinitions = function (node) {
        var responseNames = node.responseNames();
        if (responseNames && responseNames.length > 0) {
            var parent_3 = this.lookupParentJS(node);
            var responses = {};
            parent_3.responses = responses;
            this.updateIndex(node, responses);
        }
    };
    /**
     * Creates an OAS 2.0 Items javascript object.
     * @param node
     */
    Oas20ModelToJSVisitor.prototype.createItemsObject = function (node) {
        return {
            type: node.type,
            format: node.format,
            items: null,
            collectionFormat: node.collectionFormat,
            default: node.default,
            maximum: node.maximum,
            exclusiveMaximum: node.exclusiveMaximum,
            minimum: node.minimum,
            exclusiveMinimum: node.exclusiveMinimum,
            maxLength: node.maxLength,
            minLength: node.minLength,
            pattern: node.pattern,
            maxItems: node.maxItems,
            minItems: node.minItems,
            uniqueItems: node.uniqueItems,
            enum: node.enum,
            multipleOf: node.multipleOf
        };
    };
    /**
     * Shared method used to create a schema JS object.
     * @param node
     * @return {any}
     */
    Oas20ModelToJSVisitor.prototype.createSchemaObject = function (node) {
        var schema = {
            $ref: node.$ref,
            format: node.format,
            title: node.title,
            description: node.description,
            default: node.default,
            multipleOf: node.multipleOf,
            maximum: node.maximum,
            exclusiveMaximum: node.exclusiveMaximum,
            minimum: node.minimum,
            exclusiveMinimum: node.exclusiveMinimum,
            maxLength: node.maxLength,
            minLength: node.minLength,
            pattern: node.pattern,
            maxItems: node.maxItems,
            minItems: node.minItems,
            uniqueItems: node.uniqueItems,
            maxProperties: node.maxProperties,
            minProperties: node.minProperties,
            required: node.required,
            enum: node.enum,
            type: node.type,
            items: null,
            allOf: null,
            properties: null,
            additionalProperties: null,
            discriminator: node.discriminator,
            readOnly: node.readOnly,
            xml: null,
            externalDocs: null,
            example: node.example
        };
        if (typeof node.additionalProperties === "boolean") {
            schema.additionalProperties = node.additionalProperties;
        }
        return schema;
    };
    return Oas20ModelToJSVisitor;
}(OasModelToJSVisitor));
/**
 * Visitor used to convert from a Model into a JavaScript object that conforms
 * to the OAS 3.0 specification.  The resulting JS object can be stringified and
 * should be a valid OAS 3.0 document.
 */
var Oas30ModelToJSVisitor = (function (_super) {
    __extends$76(Oas30ModelToJSVisitor, _super);
    function Oas30ModelToJSVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitDocument = function (node) {
        var root = {
            openapi: node.openapi,
            info: null,
            servers: null,
            paths: null,
            components: null,
            security: null,
            tags: null,
            externalDocs: null
        };
        this.updateIndex(node, root);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitPathItem = function (node) {
        var parentJS = this.lookupParentJS(node);
        var pathItem = {
            $ref: node.$ref,
            summary: node.summary,
            description: node.description,
            get: null,
            put: null,
            post: null,
            delete: null,
            options: null,
            head: null,
            patch: null,
            trace: null,
            servers: null,
            parameters: null
        };
        parentJS[node.path()] = pathItem;
        this.updateIndex(node, pathItem);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitOperation = function (node) {
        var parentJS = this.lookupParentJS(node);
        var operation = {
            tags: node.tags,
            summary: node.summary,
            description: node.description,
            externalDocs: null,
            operationId: node.operationId,
            parameters: null,
            requestBody: null,
            responses: null,
            callbacks: null,
            deprecated: node.deprecated,
            security: null,
            servers: null
        };
        parentJS[node.method()] = operation;
        this.updateIndex(node, operation);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitHeader = function (node) {
        var parentJS = this.lookupParentJS(node);
        var header = this.createHeaderObject(node);
        if (!this.isDefined(parentJS["headers"])) {
            parentJS["headers"] = {};
        }
        parentJS["headers"][node.headerName()] = header;
        this.updateIndex(node, header);
    };
    /**
     * Creates a header object.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.createHeaderObject = function (node) {
        var header = {
            $ref: node.$ref,
            description: node.description,
            required: node.required,
            deprecated: node.deprecated,
            allowEmptyValue: node.allowEmptyValue,
            style: node.style,
            explode: node.explode,
            allowReserved: node.allowReserved,
            schema: null,
            example: node.example,
            examples: null,
            content: null
        };
        return header;
    };
    /**
     * Creates a JS object for a Parameter base object.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.createParameterObject = function (node) {
        var parameter = {
            $ref: node.$ref,
            name: node.name,
            in: node.in,
            description: node.description,
            required: node.required,
            deprecated: node.deprecated,
            allowEmptyValue: node.allowEmptyValue,
            style: node.style,
            explode: node.explode,
            allowReserved: node.allowReserved,
            schema: null,
            example: node.example,
            examples: null,
            content: null
        };
        return parameter;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitParameter = function (node) {
        var parentJS = this.lookupParentJS(node);
        if (parentJS.parameters == null) {
            parentJS.parameters = [];
        }
        var parameter = this.createParameterObject(node);
        parentJS.parameters.push(parameter);
        this.updateIndex(node, parameter);
    };
    /**
     * Creates a JS object for a response base instance.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.createResponseObject = function (node) {
        return {
            $ref: node.$ref,
            description: node.description,
            headers: null,
            content: null,
            links: null
        };
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitResponse = function (node) {
        var parentJS = this.lookupParentJS(node);
        var response = this.createResponseObject(node);
        if (node.statusCode() === null || node.statusCode() === "default") {
            parentJS.default = response;
        }
        else {
            parentJS[node.statusCode()] = response;
        }
        this.updateIndex(node, response);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitLink = function (node) {
        var parentJS = this.lookupParentJS(node);
        var link = this.createLinkObject(node);
        if (!this.isDefined(parentJS["links"])) {
            parentJS["links"] = {};
        }
        parentJS["links"][node.name()] = link;
        this.updateIndex(node, link);
    };
    /**
     * Creates a link object.
     * @param node
     * @return {any}
     */
    Oas30ModelToJSVisitor.prototype.createLinkObject = function (node) {
        var link = {
            $ref: node.$ref,
            operationRef: node.operationRef,
            operationId: node.operationId,
            parameters: null,
            requestBody: null,
            description: node.description,
            server: null
        };
        return link;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitLinkServer = function (node) {
        var parentJS = this.lookupParentJS(node);
        var server = {
            url: node.url,
            description: node.description,
            variables: null
        };
        parentJS.server = server;
        this.updateIndex(node, server);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitLinkParameterExpression = function (node) {
        var parentJS = this.lookupParentJS(node);
        var expression = node.value();
        if (!this.isDefined(parentJS["parameters"])) {
            parentJS["parameters"] = {};
        }
        parentJS["parameters"][node.name()] = expression;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitLinkRequestBodyExpression = function (node) {
        var parentJS = this.lookupParentJS(node);
        var expression = node.value();
        parentJS.requestBody = expression;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        parentJS.schema = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitDiscriminator = function (node) {
        var parentJS = this.lookupParentJS(node);
        var discriminator = {
            propertyName: node.propertyName,
            mapping: node.mapping
        };
        parentJS.discriminator = discriminator;
        this.updateIndex(node, discriminator);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitPropertySchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.properties)) {
            parentJS.properties = {};
        }
        parentJS.properties[node.propertyName()] = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        parentJS.additionalProperties = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitAllOfSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.allOf)) {
            parentJS.allOf = [];
        }
        parentJS.allOf.push(schema);
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitAnyOfSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.anyOf)) {
            parentJS.anyOf = [];
        }
        parentJS.anyOf.push(schema);
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitOneOfSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.oneOf)) {
            parentJS.oneOf = [];
        }
        parentJS.oneOf.push(schema);
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitNotSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        parentJS.not = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitItemsSchema = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS.items)) {
            parentJS.items = schema;
        }
        else if (Array.isArray(parentJS.items)) {
            parentJS.items.push(schema);
        }
        else {
            parentJS.items = [
                parentJS.items, schema
            ];
        }
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitRequestBody = function (node) {
        var parentJS = this.lookupParentJS(node);
        var requestBody = this.createRequestBodyObject(node);
        parentJS.requestBody = requestBody;
        this.updateIndex(node, requestBody);
    };
    /**
     * Creates a request body object.
     * @param node
     * @return {any}
     */
    Oas30ModelToJSVisitor.prototype.createRequestBodyObject = function (node) {
        var requestBody = {
            $ref: node.$ref,
            description: node.description,
            content: null,
            required: node.required
        };
        return requestBody;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitMediaType = function (node) {
        var parentJS = this.lookupParentJS(node);
        var mediaType = {
            schema: null,
            example: node.example,
            examples: null,
            encoding: null
        };
        if (!this.isDefined(parentJS["content"])) {
            parentJS["content"] = {};
        }
        parentJS["content"][node.name()] = mediaType;
        this.updateIndex(node, mediaType);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitEncoding = function (node) {
        var parentJS = this.lookupParentJS(node);
        var encoding = {
            contentType: node.contentType,
            headers: null,
            style: node.style,
            explode: node.explode,
            allowReserved: node.allowReserved
        };
        if (!this.isDefined(parentJS["encoding"])) {
            parentJS["encoding"] = {};
        }
        parentJS["encoding"][node.name()] = encoding;
        this.updateIndex(node, encoding);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitExample = function (node) {
        var parentJS = this.lookupParentJS(node);
        var example = this.createExampleObject(node);
        if (!parentJS.examples) {
            parentJS.examples = {};
        }
        parentJS.examples[node.name()] = example;
        this.updateIndex(node, example);
    };
    /**
     * Creates an example.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.createExampleObject = function (node) {
        var example = {
            $ref: node.$ref,
            summary: node.summary,
            description: node.description,
            value: node.value,
            externalValue: node.externalValue
        };
        return example;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitCallback = function (node) {
        var callback = {};
        var parentJS = this.lookupParentJS(node);
        if (this.isDefined(node.$ref)) {
            callback.$ref = node.$ref;
        }
        if (!this.isDefined(parentJS["callbacks"])) {
            parentJS["callbacks"] = {};
        }
        parentJS["callbacks"][node.name()] = callback;
        this.updateIndex(node, callback);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitCallbackPathItem = function (node) {
        this.visitPathItem(node);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitComponents = function (node) {
        var components = {};
        var parentJS = this.lookupParentJS(node);
        parentJS.components = components;
        this.updateIndex(node, components);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitSchemaDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var schema = this.createSchemaObject(node);
        if (!this.isDefined(parentJS["schemas"])) {
            parentJS["schemas"] = {};
        }
        parentJS["schemas"][node.name()] = schema;
        this.updateIndex(node, schema);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitResponseDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var response = this.createResponseObject(node);
        if (!this.isDefined(parentJS["responses"])) {
            parentJS["responses"] = {};
        }
        parentJS["responses"][node.name()] = response;
        this.updateIndex(node, response);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitParameterDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var parameter = this.createParameterObject(node);
        if (!this.isDefined(parentJS["parameters"])) {
            parentJS["parameters"] = {};
        }
        parentJS["parameters"][node.parameterName()] = parameter;
        this.updateIndex(node, parameter);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitExampleDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var example = this.createExampleObject(node);
        if (!this.isDefined(parentJS["examples"])) {
            parentJS["examples"] = {};
        }
        parentJS["examples"][node.name()] = example;
        this.updateIndex(node, example);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitRequestBodyDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var requestBody = this.createRequestBodyObject(node);
        if (!this.isDefined(parentJS["requestBodies"])) {
            parentJS["requestBodies"] = {};
        }
        parentJS["requestBodies"][node.name()] = requestBody;
        this.updateIndex(node, requestBody);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitHeaderDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var header = this.createHeaderObject(node);
        if (!this.isDefined(parentJS["headers"])) {
            parentJS["headers"] = {};
        }
        parentJS["headers"][node.name()] = header;
        this.updateIndex(node, header);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitOAuthFlows = function (node) {
        var parentJS = this.lookupParentJS(node);
        var oauthFlows = {
            implicit: null,
            password: null,
            clientCredentials: null,
            authorizationCode: null
        };
        parentJS.flows = oauthFlows;
        this.updateIndex(node, oauthFlows);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitImplicitOAuthFlow = function (node) {
        var parentJS = this.lookupParentJS(node);
        var flow = this.createOAuthFlowObject(node);
        parentJS.implicit = flow;
        this.updateIndex(node, flow);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitPasswordOAuthFlow = function (node) {
        var parentJS = this.lookupParentJS(node);
        var flow = this.createOAuthFlowObject(node);
        parentJS.password = flow;
        this.updateIndex(node, flow);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitClientCredentialsOAuthFlow = function (node) {
        var parentJS = this.lookupParentJS(node);
        var flow = this.createOAuthFlowObject(node);
        parentJS.clientCredentials = flow;
        this.updateIndex(node, flow);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        var parentJS = this.lookupParentJS(node);
        var flow = this.createOAuthFlowObject(node);
        parentJS.authorizationCode = flow;
        this.updateIndex(node, flow);
    };
    /**
     * Creates an OAuth Flow js object.
     * @param node
     * @return {any}
     */
    Oas30ModelToJSVisitor.prototype.createOAuthFlowObject = function (node) {
        var flow = {
            authorizationUrl: node.authorizationUrl,
            tokenUrl: node.tokenUrl,
            refreshUrl: node.refreshUrl,
            scopes: node.scopes
        };
        return flow;
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitSecurityScheme = function (node) {
        var parentJS = this.lookupParentJS(node);
        var securityScheme = {
            $ref: node.$ref,
            type: node.type,
            description: node.description,
            name: node.name,
            in: node.in,
            scheme: node.scheme,
            bearerFormat: node.bearerFormat,
            flows: null,
            openIdConnectUrl: node.openIdConnectUrl
        };
        if (!this.isDefined(parentJS["securitySchemes"])) {
            parentJS["securitySchemes"] = {};
        }
        parentJS["securitySchemes"][node.schemeName()] = securityScheme;
        this.updateIndex(node, securityScheme);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitLinkDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var link = this.createLinkObject(node);
        if (!this.isDefined(parentJS["links"])) {
            parentJS["links"] = {};
        }
        parentJS["links"][node.name()] = link;
        this.updateIndex(node, link);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitCallbackDefinition = function (node) {
        var parentJS = this.lookupParentJS(node);
        var callback = {};
        if (this.isDefined(node.$ref)) {
            callback.$ref = node.$ref;
        }
        if (!this.isDefined(parentJS["callbacks"])) {
            parentJS["callbacks"] = {};
        }
        parentJS["callbacks"][node.name()] = callback;
        this.updateIndex(node, callback);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitServer = function (node) {
        var parentJS = this.lookupParentJS(node);
        if (!this.isDefined(parentJS.servers)) {
            parentJS.servers = [];
        }
        var server = {
            url: node.url,
            description: node.description,
            variables: null
        };
        parentJS.servers.push(server);
        this.updateIndex(node, server);
    };
    /**
     * Visits a node.
     * @param node
     */
    Oas30ModelToJSVisitor.prototype.visitServerVariable = function (node) {
        var parentJS = this.lookupParentJS(node);
        var serverVariable = {
            enum: node.enum,
            default: node.default,
            description: node.description
        };
        if (!this.isDefined(parentJS["variables"])) {
            parentJS["variables"] = {};
        }
        parentJS["variables"][node.name()] = serverVariable;
        this.updateIndex(node, serverVariable);
    };
    /**
     * Shared method used to create a schema JS object.
     * @param node
     * @return {any}
     */
    Oas30ModelToJSVisitor.prototype.createSchemaObject = function (node) {
        var schema = {
            $ref: node.$ref,
            format: node.format,
            title: node.title,
            description: node.description,
            default: node.default,
            multipleOf: node.multipleOf,
            maximum: node.maximum,
            exclusiveMaximum: node.exclusiveMaximum,
            minimum: node.minimum,
            exclusiveMinimum: node.exclusiveMinimum,
            maxLength: node.maxLength,
            minLength: node.minLength,
            pattern: node.pattern,
            maxItems: node.maxItems,
            minItems: node.minItems,
            uniqueItems: node.uniqueItems,
            maxProperties: node.maxProperties,
            minProperties: node.minProperties,
            required: node.required,
            enum: node.enum,
            type: node.type,
            items: null,
            allOf: null,
            oneOf: null,
            anyOf: null,
            not: null,
            properties: null,
            additionalProperties: null,
            nullable: node.nullable,
            discriminator: null,
            readOnly: node.readOnly,
            writeOnly: node.writeOnly,
            xml: null,
            externalDocs: null,
            example: node.example,
            deprecated: node.deprecated
        };
        if (typeof node.additionalProperties === "boolean") {
            schema.additionalProperties = node.additionalProperties;
        }
        return schema;
    };
    return Oas30ModelToJSVisitor;
}(OasModelToJSVisitor));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$77 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Used to traverse an OAS tree and call an included visitor for each node.
 */
var OasTraverser = (function () {
    /**
     * Constructor.
     * @param visitor
     */
    function OasTraverser(visitor) {
        this.visitor = visitor;
    }
    /**
     * Called to traverse an OAS 2.0 tree starting at the given node and traversing
     * down until this node and all child nodes have been visited.
     * @param node
     */
    OasTraverser.prototype.traverse = function (node) {
        node.accept(this);
    };
    /**
     * Traverse into the given node, unless it's null.
     * @param node
     */
    OasTraverser.prototype.traverseIfNotNull = function (node) {
        if (node) {
            node.accept(this);
        }
    };
    /**
     * Traverse the items of the given array.
     * @param items
     */
    OasTraverser.prototype.traverseArray = function (items) {
        if (Array.isArray(items)) {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                this.traverseIfNotNull(item);
            }
        }
    };
    /**
     * Traverse the children of an indexed node.
     * @param indexedNode
     */
    OasTraverser.prototype.traverseIndexedNode = function (indexedNode) {
        var itemNames = indexedNode.getItemNames();
        if (itemNames && itemNames.length > 0) {
            for (var _i = 0, itemNames_1 = itemNames; _i < itemNames_1.length; _i++) {
                var itemName = itemNames_1[_i];
                var item = indexedNode.getItem(itemName);
                this.traverseIfNotNull(item);
            }
        }
    };
    /**
     * Traverse the extension nodes, if any are found.
     * @param node
     */
    OasTraverser.prototype.traverseExtensions = function (node) {
        this.traverseArray(node.extensions());
    };
    /**
     * Visit the info object.
     * @param node
     */
    OasTraverser.prototype.visitInfo = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.contact);
        this.traverseIfNotNull(node.license);
        this.traverseExtensions(node);
    };
    /**
     * Visit the contact object.
     * @param node
     */
    OasTraverser.prototype.visitContact = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    /**
     * Visit the license object.
     * @param node
     */
    OasTraverser.prototype.visitLicense = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    /**
     * Visit the paths.
     * @param node
     */
    OasTraverser.prototype.visitPaths = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
        this.traverseExtensions(node);
    };
    /**
 * Visit the responses.
 * @param node
 */
    OasTraverser.prototype.visitResponses = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
        this.traverseIfNotNull(node.default);
        this.traverseExtensions(node);
    };
    /**
     * Visit the scopes.
     * @param node
     */
    OasTraverser.prototype.visitXML = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    /**
     * Visit the security requirement.
     * @param node
     */
    OasTraverser.prototype.visitSecurityRequirement = function (node) {
        node.accept(this.visitor);
    };
    /**
     * Visit the tag.
     * @param node
     */
    OasTraverser.prototype.visitTag = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    };
    /**
     * Visit the external doc.
     * @param node
     */
    OasTraverser.prototype.visitExternalDocumentation = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    /**
     * Visit the extension.
     * @param node
     */
    OasTraverser.prototype.visitExtension = function (node) {
        node.accept(this.visitor);
    };
    return OasTraverser;
}());
/**
 * Used to traverse an OAS 2.0 tree and call an included visitor for each node.
 */
var Oas20Traverser = (function (_super) {
    __extends$77(Oas20Traverser, _super);
    /**
     * Constructor.
     * @param visitor
     */
    function Oas20Traverser(visitor) {
        return _super.call(this, visitor) || this;
    }
    /**
     * Visit the document.
     * @param node
     */
    Oas20Traverser.prototype.visitDocument = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.info);
        this.traverseIfNotNull(node.paths);
        this.traverseIfNotNull(node.definitions);
        this.traverseIfNotNull(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseIfNotNull(node.securityDefinitions);
        this.traverseArray(node.security);
        this.traverseArray(node.tags);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    };
    /**
     * Visit the path item.
     * @param node
     */
    Oas20Traverser.prototype.visitPathItem = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.get);
        this.traverseIfNotNull(node.put);
        this.traverseIfNotNull(node.post);
        this.traverseIfNotNull(node.delete);
        this.traverseIfNotNull(node.options);
        this.traverseIfNotNull(node.head);
        this.traverseIfNotNull(node.patch);
        this.traverseArray(node.parameters);
        this.traverseExtensions(node);
    };
    /**
     * Visit the operation.
     * @param node
     */
    Oas20Traverser.prototype.visitOperation = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseArray(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseArray(node.security);
        this.traverseExtensions(node);
    };
    /**
     * Visit a parameter.
     * @param node
     */
    Oas20Traverser.prototype.visitParameterBase = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    };
    /**
     * Visit the parameter.
     * @param node
     */
    Oas20Traverser.prototype.visitParameter = function (node) {
        this.visitParameterBase(node);
    };
    /**
     * Visit the parameter definition.
     * @param node
     */
    Oas20Traverser.prototype.visitParameterDefinition = function (node) {
        this.visitParameterBase(node);
    };
    Oas20Traverser.prototype.visitResponseBase = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseIfNotNull(node.headers);
        this.traverseIfNotNull(node.examples);
        this.traverseExtensions(node);
    };
    /**
     * Visit the response.
     * @param node
     */
    Oas20Traverser.prototype.visitResponse = function (node) {
        this.visitResponseBase(node);
    };
    /**
     * Visit the headers.
     * @param node
     */
    Oas20Traverser.prototype.visitHeaders = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    };
    /**
     * Visit the response definition.
     * @param node
     */
    Oas20Traverser.prototype.visitResponseDefinition = function (node) {
        this.visitResponseBase(node);
    };
    /**
     * Visit the schema.
     * @param node
     */
    Oas20Traverser.prototype.visitSchema = function (node) {
        node.accept(this.visitor);
        if (node.items !== null && Array.isArray(node.items)) {
            this.traverseArray(node.items);
        }
        else {
            this.traverseIfNotNull(node.items);
        }
        this.traverseArray(node.allOf);
        var propNames = node.propertyNames();
        if (propNames && propNames.length > 0) {
            for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
                var propName = propNames_1[_i];
                var prop = node.property(propName);
                this.traverseIfNotNull(prop);
            }
        }
        if (typeof node.additionalProperties !== "boolean") {
            this.traverseIfNotNull(node.additionalProperties);
        }
        this.traverseIfNotNull(node.xml);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    };
    /**
     * Visit the schema.
     * @param node
     */
    Oas20Traverser.prototype.visitPropertySchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the schema.
     * @param node
     */
    Oas20Traverser.prototype.visitSchemaDefinition = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the schema.
     * @param node
     */
    Oas20Traverser.prototype.visitAdditionalPropertiesSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the schema.
     * @param node
     */
    Oas20Traverser.prototype.visitAllOfSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the schema.
     * @param node
     */
    Oas20Traverser.prototype.visitItemsSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the header.
     * @param node
     */
    Oas20Traverser.prototype.visitHeader = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    };
    /**
     * Visit the example.
     * @param node
     */
    Oas20Traverser.prototype.visitExample = function (node) {
        node.accept(this.visitor);
    };
    /**
     * Visit the items.
     * @param node
     */
    Oas20Traverser.prototype.visitItems = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.items);
        this.traverseExtensions(node);
    };
    /**
     * Visit the security definitions.
     * @param node
     */
    Oas20Traverser.prototype.visitSecurityDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    };
    /**
     * Visit the security scheme.
     * @param node
     */
    Oas20Traverser.prototype.visitSecurityScheme = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.scopes);
        this.traverseExtensions(node);
    };
    /**
     * Visit the scopes.
     * @param node
     */
    Oas20Traverser.prototype.visitScopes = function (node) {
        node.accept(this.visitor);
    };
    /**
     * Visit the definitions.
     * @param node
     */
    Oas20Traverser.prototype.visitDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    };
    /**
     * Visit the definitions.
     * @param node
     */
    Oas20Traverser.prototype.visitParametersDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    };
    /**
     * Visit the responses.
     * @param node
     */
    Oas20Traverser.prototype.visitResponsesDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
    };
    return Oas20Traverser;
}(OasTraverser));
/**
 * Used to traverse an OAS 3.0 tree and call an included visitor for each node.
 */
var Oas30Traverser = (function (_super) {
    __extends$77(Oas30Traverser, _super);
    /**
     * Constructor.
     * @param visitor
     */
    function Oas30Traverser(visitor) {
        return _super.call(this, visitor) || this;
    }
    /**
     * Visit the document.
     * @param node
     */
    Oas30Traverser.prototype.visitDocument = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.info);
        this.traverseArray(node.servers);
        this.traverseIfNotNull(node.paths);
        this.traverseIfNotNull(node.components);
        this.traverseArray(node.security);
        this.traverseArray(node.tags);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitPathItem = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.get);
        this.traverseIfNotNull(node.put);
        this.traverseIfNotNull(node.post);
        this.traverseIfNotNull(node.delete);
        this.traverseIfNotNull(node.options);
        this.traverseIfNotNull(node.head);
        this.traverseIfNotNull(node.patch);
        this.traverseIfNotNull(node.trace);
        this.traverseArray(node.parameters);
        this.traverseArray(node.servers);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitOperation = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseArray(node.parameters);
        this.traverseIfNotNull(node.responses);
        this.traverseIfNotNull(node.requestBody);
        this.traverseArray(node.getCallbacks());
        this.traverseArray(node.security);
        this.traverseArray(node.servers);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitHeader = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseArray(node.getExamples());
        this.traverseArray(node.getMediaTypes());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitSchema = function (node) {
        node.accept(this.visitor);
        if (Array.isArray(node.items)) {
            this.traverseArray(node.items);
        }
        else {
            this.traverseIfNotNull(node.items);
        }
        this.traverseArray(node.allOf);
        var propNames = node.propertyNames();
        if (propNames && propNames.length > 0) {
            for (var _i = 0, propNames_2 = propNames; _i < propNames_2.length; _i++) {
                var propName = propNames_2[_i];
                var prop = node.property(propName);
                this.traverseIfNotNull(prop);
            }
        }
        if (typeof node.additionalProperties !== "boolean") {
            this.traverseIfNotNull(node.additionalProperties);
        }
        this.traverseArray(node.oneOf);
        this.traverseArray(node.anyOf);
        this.traverseIfNotNull(node.not);
        this.traverseIfNotNull(node.discriminator);
        this.traverseIfNotNull(node.xml);
        this.traverseIfNotNull(node.externalDocs);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitDiscriminator = function (node) {
        node.accept(this.visitor);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitParameter = function (node) {
        this.visitParameterBase(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitParameterDefinition = function (node) {
        this.visitParameterBase(node);
    };
    /**
     * Visit a parameter.
     * @param node
     */
    Oas30Traverser.prototype.visitParameterBase = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseArray(node.getExamples());
        this.traverseArray(node.getMediaTypes());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitResponse = function (node) {
        this.visitResponseBase(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitResponseDefinition = function (node) {
        this.visitResponseBase(node);
    };
    /**
     * Visit a response.
     * @param node
     */
    Oas30Traverser.prototype.visitResponseBase = function (node) {
        node.accept(this.visitor);
        this.traverseArray(node.getMediaTypes());
        this.traverseArray(node.getLinks());
        this.traverseArray(node.getHeaders());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitLink = function (node) {
        node.accept(this.visitor);
        this.traverseArray(node.getLinkParameterExpressions());
        this.traverseIfNotNull(node.requestBody);
        this.traverseIfNotNull(node.server);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitLinkParameterExpression = function (node) {
        node.accept(this.visitor);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitLinkRequestBodyExpression = function (node) {
        node.accept(this.visitor);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitLinkServer = function (node) {
        this.visitServer(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitRequestBody = function (node) {
        node.accept(this.visitor);
        this.traverseArray(node.getMediaTypes());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitMediaType = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.schema);
        this.traverseArray(node.getExamples());
        this.traverseArray(node.getEncodings());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitEncoding = function (node) {
        node.accept(this.visitor);
        this.traverseArray(node.getHeaders());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitExample = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitCallback = function (node) {
        node.accept(this.visitor);
        this.traverseIndexedNode(node);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitCallbackPathItem = function (node) {
        this.visitPathItem(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitAllOfSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitAnyOfSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitOneOfSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitNotSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitPropertySchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitItemsSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitAdditionalPropertiesSchema = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitComponents = function (node) {
        node.accept(this.visitor);
        this.traverseArray(node.getSchemaDefinitions());
        this.traverseArray(node.getResponseDefinitions());
        this.traverseArray(node.getParameterDefinitions());
        this.traverseArray(node.getExampleDefinitions());
        this.traverseArray(node.getRequestBodyDefinitions());
        this.traverseArray(node.getHeaderDefinitions());
        this.traverseArray(node.getSecuritySchemes());
        this.traverseArray(node.getLinkDefinitions());
        this.traverseArray(node.getCallbackDefinitions());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitExampleDefinition = function (node) {
        this.visitExample(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitRequestBodyDefinition = function (node) {
        this.visitRequestBody(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitHeaderDefinition = function (node) {
        this.visitHeader(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitSecurityScheme = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.flows);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitOAuthFlows = function (node) {
        node.accept(this.visitor);
        this.traverseIfNotNull(node.implicit);
        this.traverseIfNotNull(node.password);
        this.traverseIfNotNull(node.clientCredentials);
        this.traverseIfNotNull(node.authorizationCode);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitImplicitOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitPasswordOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitClientCredentialsOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitOAuthFlow = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitLinkDefinition = function (node) {
        this.visitLink(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitCallbackDefinition = function (node) {
        this.visitCallback(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitSchemaDefinition = function (node) {
        this.visitSchema(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitServer = function (node) {
        node.accept(this.visitor);
        this.traverseArray(node.getServerVariables());
        this.traverseExtensions(node);
    };
    /**
     * Visit the node.
     * @param node
     */
    Oas30Traverser.prototype.visitServerVariable = function (node) {
        node.accept(this.visitor);
        this.traverseExtensions(node);
    };
    return Oas30Traverser;
}(OasTraverser));
/**
 * Used to traverse up an OAS tree and call an included visitor for each node.
 */
var OasReverseTraverser = (function () {
    /**
     * Constructor.
     * @param visitor
     */
    function OasReverseTraverser(visitor) {
        this.visitor = visitor;
    }
    /**
     * Traverse the given node.
     * @param node
     */
    OasReverseTraverser.prototype.traverse = function (node) {
        node.accept(this);
    };
    OasReverseTraverser.prototype.visitDocument = function (node) {
        node.accept(this.visitor);
    };
    OasReverseTraverser.prototype.visitInfo = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitContact = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitLicense = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitPaths = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitPathItem = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitOperation = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitResponses = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitHeader = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitXML = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitSecurityScheme = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitSecurityRequirement = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitTag = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitExternalDocumentation = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    OasReverseTraverser.prototype.visitExtension = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    return OasReverseTraverser;
}());
/**
 * Used to traverse up an OAS 2.0 tree and call an included visitor for each node.
 */
var Oas20ReverseTraverser = (function (_super) {
    __extends$77(Oas20ReverseTraverser, _super);
    /**
     * Constructor.
     * @param visitor
     */
    function Oas20ReverseTraverser(visitor) {
        return _super.call(this, visitor) || this;
    }
    Oas20ReverseTraverser.prototype.visitParameter = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitParameterDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitResponse = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitHeaders = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitResponseDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitExample = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitItems = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitSecurityDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitScopes = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitSchemaDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitPropertySchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitAdditionalPropertiesSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitAllOfSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitItemsSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitParametersDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas20ReverseTraverser.prototype.visitResponsesDefinitions = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    return Oas20ReverseTraverser;
}(OasReverseTraverser));
/**
 * Used to traverse up an OAS 3.0 tree and call an included visitor for each node.
 */
var Oas30ReverseTraverser = (function (_super) {
    __extends$77(Oas30ReverseTraverser, _super);
    /**
     * Constructor.
     * @param visitor
     */
    function Oas30ReverseTraverser(visitor) {
        return _super.call(this, visitor) || this;
    }
    Oas30ReverseTraverser.prototype.visitParameter = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitParameterDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitResponse = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitLink = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitLinkParameterExpression = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitLinkRequestBodyExpression = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitLinkServer = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitResponseDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitRequestBody = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitMediaType = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitEncoding = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitExample = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitCallback = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitCallbackPathItem = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitAllOfSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitAnyOfSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitOneOfSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitNotSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitPropertySchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitItemsSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitAdditionalPropertiesSchema = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitDiscriminator = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitComponents = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitExampleDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitRequestBodyDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitHeaderDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitOAuthFlows = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitImplicitOAuthFlow = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitPasswordOAuthFlow = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitClientCredentialsOAuthFlow = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitLinkDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitCallbackDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitSchemaDefinition = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitServer = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    Oas30ReverseTraverser.prototype.visitServerVariable = function (node) {
        node.accept(this.visitor);
        this.traverse(node.parent());
    };
    return Oas30ReverseTraverser;
}(OasReverseTraverser));

/**
 * @license
 * Copyright 2017 Red Hat
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

(function (OasTraverserDirection) {
    OasTraverserDirection[OasTraverserDirection["up"] = 0] = "up";
    OasTraverserDirection[OasTraverserDirection["down"] = 1] = "down";
})(exports.OasTraverserDirection || (exports.OasTraverserDirection = {}));
/**
 * Some static convenience methods for visiting an OAS node/tree.
 */
var OasVisitorUtil = (function () {
    function OasVisitorUtil() {
    }
    /**
     * Convenience method for visiting a single node.
     * @param node
     * @param visitor
     */
    OasVisitorUtil.visitNode = function (node, visitor) {
        node.accept(visitor);
    };
    /**
     * Convenience method for visiting an OAS tree.  This will traverse and visit
     * all nodes starting with the given one and traversing down.
     * @param node the node to traverse and visit
     * @param visitor the visitor to call for each node visited
     */
    OasVisitorUtil.visitTree = function (node, visitor, direction) {
        if (direction === void 0) { direction = exports.OasTraverserDirection.down; }
        if (node.ownerDocument().is2xDocument()) {
            var traverser = void 0;
            if (direction === exports.OasTraverserDirection.up) {
                traverser = new Oas20ReverseTraverser(visitor);
            }
            else {
                traverser = new Oas20Traverser(visitor);
            }
            traverser.traverse(node);
        }
        else if (node.ownerDocument().is3xDocument()) {
            var traverser = void 0;
            if (direction === exports.OasTraverserDirection.up) {
                traverser = new Oas30ReverseTraverser(visitor);
            }
            else {
                traverser = new Oas30Traverser(visitor);
            }
            traverser.traverse(node);
        }
        else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    };
    return OasVisitorUtil;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$79 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Base class for node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
var OasNodeVisitorAdapter = (function () {
    function OasNodeVisitorAdapter() {
    }
    OasNodeVisitorAdapter.prototype.visitDocument = function (node) { };
    OasNodeVisitorAdapter.prototype.visitInfo = function (node) { };
    OasNodeVisitorAdapter.prototype.visitContact = function (node) { };
    OasNodeVisitorAdapter.prototype.visitLicense = function (node) { };
    OasNodeVisitorAdapter.prototype.visitPaths = function (node) { };
    OasNodeVisitorAdapter.prototype.visitPathItem = function (node) { };
    OasNodeVisitorAdapter.prototype.visitResponses = function (node) { };
    OasNodeVisitorAdapter.prototype.visitSchema = function (node) { };
    OasNodeVisitorAdapter.prototype.visitHeader = function (node) { };
    OasNodeVisitorAdapter.prototype.visitOperation = function (node) { };
    OasNodeVisitorAdapter.prototype.visitXML = function (node) { };
    OasNodeVisitorAdapter.prototype.visitSecurityScheme = function (node) { };
    OasNodeVisitorAdapter.prototype.visitSecurityRequirement = function (node) { };
    OasNodeVisitorAdapter.prototype.visitTag = function (node) { };
    OasNodeVisitorAdapter.prototype.visitExternalDocumentation = function (node) { };
    OasNodeVisitorAdapter.prototype.visitExtension = function (node) { };
    return OasNodeVisitorAdapter;
}());
/**
 * Base class for OAS 2.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
var Oas20NodeVisitorAdapter = (function (_super) {
    __extends$79(Oas20NodeVisitorAdapter, _super);
    function Oas20NodeVisitorAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas20NodeVisitorAdapter.prototype.visitParameter = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitParameterDefinition = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitResponse = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitHeaders = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitResponseDefinition = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitExample = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitItems = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitSecurityDefinitions = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitSecurityScheme = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitScopes = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitPropertySchema = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitAdditionalPropertiesSchema = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitItemsSchema = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitAllOfSchema = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitSchemaDefinition = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitDefinitions = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitParametersDefinitions = function (node) { };
    Oas20NodeVisitorAdapter.prototype.visitResponsesDefinitions = function (node) { };
    return Oas20NodeVisitorAdapter;
}(OasNodeVisitorAdapter));
/**
 * Base class for OAS 3.0 node visitors that are only interested in a subset of the node types
 * that might be visited.  Extending this class means that subclasses can only override
 * the subset of methods desired.
 */
var Oas30NodeVisitorAdapter = (function (_super) {
    __extends$79(Oas30NodeVisitorAdapter, _super);
    function Oas30NodeVisitorAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas30NodeVisitorAdapter.prototype.visitParameter = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitParameterDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitResponse = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitLink = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitLinkParameterExpression = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitLinkRequestBodyExpression = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitLinkServer = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitResponseDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitRequestBody = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitMediaType = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitExample = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitEncoding = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitCallback = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitCallbackPathItem = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitAllOfSchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitAnyOfSchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitOneOfSchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitNotSchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitPropertySchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitItemsSchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitAdditionalPropertiesSchema = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitComponents = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitExampleDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitRequestBodyDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitHeaderDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitOAuthFlows = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitImplicitOAuthFlow = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitPasswordOAuthFlow = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitClientCredentialsOAuthFlow = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitAuthorizationCodeOAuthFlow = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitLinkDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitCallbackDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitSchemaDefinition = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitServer = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitServerVariable = function (node) { };
    Oas30NodeVisitorAdapter.prototype.visitDiscriminator = function (node) { };
    return Oas30NodeVisitorAdapter;
}(OasNodeVisitorAdapter));
/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
var OasCompositeVisitor = (function () {
    /**
     * Constructor.
     * @param visitors
     */
    function OasCompositeVisitor(visitors) {
        this._visitors = visitors;
    }
    /**
     * Adds a single visitor to the list.
     * @param visitor
     */
    OasCompositeVisitor.prototype.addVisitor = function (visitor) {
        this._visitors.push(visitor);
    };
    /**
     * Adds multiple visitors to the list.
     * @param visitors
     */
    OasCompositeVisitor.prototype.addVisitors = function (visitors) {
        for (var _i = 0, visitors_1 = visitors; _i < visitors_1.length; _i++) {
            var visitor = visitors_1[_i];
            this._visitors.push(visitor);
        }
    };
    /**
     * Called to accept all of the visitors contained by this composite.  This basically
     * iterates through all the visitors and calls node.accept(visitor) on each.
     * @param node
     * @private
     */
    OasCompositeVisitor.prototype._acceptAll = function (node) {
        this._visitors.every(function (visitor) {
            node.accept(visitor);
            return true;
        });
    };
    OasCompositeVisitor.prototype.visitDocument = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitInfo = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitContact = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitLicense = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitPaths = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitPathItem = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitOperation = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitResponses = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitSchema = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitHeader = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitXML = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitSecurityScheme = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitSecurityRequirement = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitTag = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitExternalDocumentation = function (node) { this._acceptAll(node); };
    OasCompositeVisitor.prototype.visitExtension = function (node) { this._acceptAll(node); };
    return OasCompositeVisitor;
}());
/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
var Oas20CompositeVisitor = (function (_super) {
    __extends$79(Oas20CompositeVisitor, _super);
    /**
     * Constructor.
     * @param visitors
     */
    function Oas20CompositeVisitor() {
        var visitors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            visitors[_i] = arguments[_i];
        }
        return _super.call(this, visitors) || this;
    }
    Oas20CompositeVisitor.prototype.visitParameter = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitParameterDefinition = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitResponse = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitHeaders = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitResponseDefinition = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitExample = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitItems = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitSecurityDefinitions = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitSecurityScheme = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitScopes = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitSchemaDefinition = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitPropertySchema = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitAdditionalPropertiesSchema = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitAllOfSchema = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitItemsSchema = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitDefinitions = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitParametersDefinitions = function (node) { this._acceptAll(node); };
    Oas20CompositeVisitor.prototype.visitResponsesDefinitions = function (node) { this._acceptAll(node); };
    return Oas20CompositeVisitor;
}(OasCompositeVisitor));
/**
 * A composite visitor - this class makes it easy to apply multiple visitors to
 * a node at the same time.  It's basically just an array of visitors.
 */
var Oas30CompositeVisitor = (function (_super) {
    __extends$79(Oas30CompositeVisitor, _super);
    /**
     * Constructor.
     * @param visitors
     */
    function Oas30CompositeVisitor() {
        var visitors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            visitors[_i] = arguments[_i];
        }
        return _super.call(this, visitors) || this;
    }
    Oas30CompositeVisitor.prototype.visitParameter = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitParameterDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitResponse = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitLink = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitLinkParameterExpression = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitLinkRequestBodyExpression = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitLinkServer = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitResponseDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitRequestBody = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitCallback = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitCallbackPathItem = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitMediaType = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitExample = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitEncoding = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitAllOfSchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitAnyOfSchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitOneOfSchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitNotSchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitPropertySchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitItemsSchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitAdditionalPropertiesSchema = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitDiscriminator = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitComponents = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitExampleDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitRequestBodyDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitHeaderDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitOAuthFlows = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitImplicitOAuthFlow = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitPasswordOAuthFlow = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitClientCredentialsOAuthFlow = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitAuthorizationCodeOAuthFlow = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitLinkDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitCallbackDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitSchemaDefinition = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitServer = function (node) { this._acceptAll(node); };
    Oas30CompositeVisitor.prototype.visitServerVariable = function (node) { this._acceptAll(node); };
    return Oas30CompositeVisitor;
}(OasCompositeVisitor));
var OasCombinedVisitorAdapter = (function () {
    function OasCombinedVisitorAdapter() {
    }
    OasCombinedVisitorAdapter.prototype.visitDocument = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitInfo = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitContact = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitLicense = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitPaths = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitPathItem = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitOperation = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitParameter = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitParameterDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitExternalDocumentation = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitSecurityRequirement = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitResponses = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitResponse = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitResponseDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitHeaders = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitHeader = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitExample = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitItems = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitTag = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitSecurityDefinitions = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitSecurityScheme = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitScopes = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitXML = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitSchemaDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitPropertySchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitAdditionalPropertiesSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitAllOfSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitItemsSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitDefinitions = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitParametersDefinitions = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitResponsesDefinitions = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitExtension = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitMediaType = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitEncoding = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitLink = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitLinkParameterExpression = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitLinkRequestBodyExpression = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitLinkServer = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitRequestBody = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitCallback = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitCallbackPathItem = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitServer = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitServerVariable = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitAnyOfSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitOneOfSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitNotSchema = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitComponents = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitExampleDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitRequestBodyDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitHeaderDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitOAuthFlows = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitImplicitOAuthFlow = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitPasswordOAuthFlow = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitClientCredentialsOAuthFlow = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitAuthorizationCodeOAuthFlow = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitLinkDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitCallbackDefinition = function (node) { };
    OasCombinedVisitorAdapter.prototype.visitDiscriminator = function (node) { };
    return OasCombinedVisitorAdapter;
}());
/**
 * Base class for visitors that simply want to get called for *every* node
 * in the model.
 */
var OasAllNodeVisitor = (function (_super) {
    __extends$79(OasAllNodeVisitor, _super);
    function OasAllNodeVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OasAllNodeVisitor.prototype.visitDocument = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitInfo = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitContact = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitLicense = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitPaths = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitPathItem = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitOperation = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitParameter = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitParameterDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitExternalDocumentation = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitSecurityRequirement = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitResponses = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitResponse = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitResponseDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitHeaders = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitHeader = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitExample = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitItems = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitTag = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitSecurityDefinitions = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitSecurityScheme = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitScopes = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitXML = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitSchemaDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitPropertySchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitAdditionalPropertiesSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitAllOfSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitItemsSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitDefinitions = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitParametersDefinitions = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitResponsesDefinitions = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitExtension = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitMediaType = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitEncoding = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitLink = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitLinkParameterExpression = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitLinkRequestBodyExpression = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitLinkServer = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitRequestBody = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitCallback = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitCallbackPathItem = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitServer = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitServerVariable = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitAnyOfSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitOneOfSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitNotSchema = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitComponents = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitExampleDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitRequestBodyDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitHeaderDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitOAuthFlows = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitImplicitOAuthFlow = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitPasswordOAuthFlow = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitClientCredentialsOAuthFlow = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitAuthorizationCodeOAuthFlow = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitLinkDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitCallbackDefinition = function (node) { this.doVisitNode(node); };
    OasAllNodeVisitor.prototype.visitDiscriminator = function (node) { this.doVisitNode(node); };
    return OasAllNodeVisitor;
}(OasCombinedVisitorAdapter));

/**
 * @license
 * Copyright 2017 Red Hat
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
/**
 * Represents a single validation error.
 */
var OasValidationError = (function () {
    function OasValidationError(errorCode, nodePath, message) {
        this._attributes = new OasValidationErrorAttributes();
        this.errorCode = errorCode;
        this.nodePath = nodePath;
        this.message = message;
    }
    /**
     * Gets or sets a problem attribute.  When setting the attribute, the previous value
     * will be returned. Otherwise the current value is returned.
     * @param name
     * @param value
     * @return {any}
     */
    OasValidationError.prototype.attribute = function (name, value) {
        if (value === undefined) {
            return this._attributes[name];
        }
        else {
            var pvalue = this._attributes[name];
            this._attributes[name] = value;
            return pvalue;
        }
    };
    return OasValidationError;
}());
var OasValidationErrorAttributes = (function () {
    function OasValidationErrorAttributes() {
    }
    return OasValidationErrorAttributes;
}());
/**
 * Base class for all validation rules.
 */
var OasValidationRuleUtil = (function () {
    function OasValidationRuleUtil() {
    }
    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isDefined = function (propertyValue) {
        if (propertyValue === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * Check if the property value exists (is not undefined and is not null).
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.hasValue = function (propertyValue) {
        if (propertyValue === undefined) {
            return false;
        }
        if (propertyValue === null) {
            return false;
        }
        return true;
    };
    /**
     * Returns true only if the given value is a valid URL.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidUrl = function (propertyValue) {
        var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        var url = new RegExp(urlRegex, 'i');
        return propertyValue.length < 2083 && url.test(propertyValue);
    };
    /**
     * Returns true only if the given value is a valid URL template.
     * @param {string} propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidUrlTemplate = function (propertyValue) {
        // TODO is there a regular expression we can use to validate a URL template??
        return true;
    };
    /**
     * Returns true only if the given value is valid GFM style markup.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidGFM = function (propertyValue) {
        // TODO implement a regexp to test for a valid Github Flavored Markdown string
        return true;
    };
    /**
     * Returns true only if the given value is valid CommonMark style markup.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidCommonMark = function (propertyValue) {
        // TODO implement a regexp to test for a valid CommonMark string
        return true;
    };
    /**
     * Returns true only if the given value is a valid email address.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidEmailAddress = function (propertyValue) {
        var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email.test(propertyValue);
    };
    /**
     * Returns true only if the given value is a valid mime-type.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidMimeType = function (propertyValue) {
        var mt = /^.*\/.*(;.*)?$/;
        for (var _i = 0, propertyValue_1 = propertyValue; _i < propertyValue_1.length; _i++) {
            var v = propertyValue_1[_i];
            if (!mt.test(v)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Returns true if the given value is an item in the enum list.
     * @param value
     * @param items
     */
    OasValidationRuleUtil.isValidEnumItem = function (value, items) {
        return items.indexOf(value) != -1;
    };
    /**
     * Resolves a reference from a relative position in the data model.
     * @param $ref
     * @param from
     */
    OasValidationRuleUtil.resolveRef = function ($ref, from) {
        var _this = this;
        // TODO implement a proper reference resolver including external file resolution: https://github.com/EricWittmann/oai-ts-core/issues/8
        var split = $ref.split("/");
        var cnode = null;
        split.forEach(function (seg) {
            if (seg === "#") {
                cnode = from.ownerDocument();
            }
            else if (_this.hasValue(cnode)) {
                if (cnode["__instanceof_IOasIndexedNode"]) {
                    cnode = cnode["getItem"](seg);
                }
                else {
                    cnode = cnode[seg];
                }
            }
        });
        return cnode;
    };
    /**
     * Returns true only if the given reference can be resolved relative to the given document.  Examples
     * of $ref values include:
     *
     * #/definitions/ExampleDefinition
     * #/parameters/fooId
     * #/responses/NotFoundResponse
     *
     * @param $ref
     * @param oasDocument
     */
    OasValidationRuleUtil.canResolveRef = function ($ref, from) {
        // Don't try to resolve e.g. external references.
        if ($ref.indexOf('#/') !== 0) {
            return true;
        }
        return this.hasValue(OasValidationRuleUtil.resolveRef($ref, from));
    };
    /**
     * Returns true only if the given value is a valid host.
     * @param propertyValue
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidHost = function (propertyValue) {
        // TODO implement a regexp to test for a valid host plus optional port
        if (propertyValue.indexOf("http:") === 0 || propertyValue.indexOf("https:") === 0) {
            return false;
        }
        return true;
    };
    /**
     * Returns true if the given value is valid according to the schema provided.
     * @param value
     * @param node
     */
    OasValidationRuleUtil.isValidForType = function (value, node) {
        // TODO validate the value against the schema
        return true;
    };
    /**
     * Returns true if the given status code is a valid HTTP response code.
     * @param statusCode
     * @return {boolean}
     */
    OasValidationRuleUtil.isValidHttpCode = function (statusCode) {
        return OasValidationRuleUtil.HTTP_STATUS_CODES.indexOf(statusCode) != -1;
    };
    return OasValidationRuleUtil;
}());
/**
 * List of valid HTTP response status codes from:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
 */
OasValidationRuleUtil.HTTP_STATUS_CODES = [
    "100", "101", "102", "1XX", "10X",
    "200", "201", "202", "203", "204", "205", "206", "207", "208", "226", "2XX", "20X", "21X", "22X",
    "300", "301", "302", "303", "304", "305", "306", "307", "308", "3XX", "30X",
    "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "4XX", "40X", "41X",
    "421", "422", "423", "424", "426", "427", "428", "429", "431", "451", "42X", "43X", "44X", "45X",
    "500", "501", "502", "503", "504", "505", "506", "507", "508", "510", "511", "5XX", "50X", "51X"
];

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$81 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Base class for all 2.0 validation rules.
 */
var Oas20ValidationRule = (function (_super) {
    __extends$81(Oas20ValidationRule, _super);
    function Oas20ValidationRule(reporter) {
        var _this = _super.call(this) || this;
        _this._reporter = reporter;
        return _this;
    }
    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    Oas20ValidationRule.prototype.isDefined = function (propertyValue) {
        return OasValidationRuleUtil.isDefined(propertyValue);
    };
    /**
     * Check if the property value exists (is not undefined and is not null).
     * @param propertyValue
     * @return {boolean}
     */
    Oas20ValidationRule.prototype.hasValue = function (propertyValue) {
        return OasValidationRuleUtil.hasValue(propertyValue);
    };
    /**
     * Called by validation rules to report an error.
     * @param code
     * @param node
     * @param message
     */
    Oas20ValidationRule.prototype.report = function (code, node, message) {
        this._reporter.report(code, node, message);
    };
    return Oas20ValidationRule;
}(Oas20NodeVisitorAdapter));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$80 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the required property validation rule.  Various model properties are either
 * required or conditionally required.  For example, the "swagger" property MUST exist
 * on the root (document) node.  This rule checks for all required and conditionally
 * required properties on all model types.
 */
var Oas20RequiredPropertyValidationRule = (function (_super) {
    __extends$80(Oas20RequiredPropertyValidationRule, _super);
    function Oas20RequiredPropertyValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Called when a required property is missing.
     * @param code
     * @param node
     * @param propertyName
     */
    Oas20RequiredPropertyValidationRule.prototype.requireProperty = function (code, node, propertyName) {
        var propertyValue = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(code, node, "Property \"" + propertyName + "\" is required.");
        }
    };
    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentProperty
     * @param dependentValue
     */
    Oas20RequiredPropertyValidationRule.prototype.requirePropertyWhen = function (code, node, propertyName, dependentProperty, dependentValue) {
        var propertyValue = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(code, node, "Property \"" + propertyName + "\" is required when \"" + dependentProperty + "\" property is '" + dependentValue + "'.");
        }
    };
    Oas20RequiredPropertyValidationRule.prototype.visitDocument = function (node) {
        this.requireProperty("R-001", node, "swagger");
        this.requireProperty("R-002", node, "info");
        this.requireProperty("R-003", node, "paths");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitInfo = function (node) {
        this.requireProperty("INF-001", node, "title");
        this.requireProperty("INF-002", node, "version");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitLicense = function (node) {
        this.requireProperty("LIC-001", node, "name");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitOperation = function (node) {
        this.requireProperty("OP-007", node, "responses");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitExternalDocumentation = function (node) {
        this.requireProperty("ED-001", node, "url");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitParameter = function (node) {
        if (this.hasValue(node.$ref)) {
            return;
        }
        this.requireProperty("PAR-001", node, "name");
        this.requireProperty("PAR-002", node, "in");
        if (node.in === "path" && node.required !== true) {
            this.report("PAR-003", node, "Property \"required\" is required when \"in\" property is 'path' (and value must be 'true').");
        }
        if (node.in === "body") {
            this.requirePropertyWhen("PAR-004", node, "schema", "in", "body");
        }
        if (node.in !== "body" && !this.isDefined(node.type)) {
            this.report("PAR-005", node, "Property \"type\" is required when \"in\" property is NOT 'body'.");
        }
        if (node.in !== "body" && node.type === "array" && !this.isDefined(node.items)) {
            this.report("PAR-006", node, "Property \"items\" is required when \"in\" property is NOT 'body' AND \"type\" property is 'array'.");
        }
    };
    Oas20RequiredPropertyValidationRule.prototype.visitItems = function (node) {
        this.requireProperty("IT-001", node, "type");
        if (node.type === "array") {
            this.requirePropertyWhen("IT-002", node, "items", "type", "array");
        }
    };
    Oas20RequiredPropertyValidationRule.prototype.visitResponse = function (node) {
        if (this.hasValue(node.$ref)) {
            return;
        }
        this.requireProperty("RES-001", node, "description");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitHeader = function (node) {
        this.requireProperty("HEAD-001", node, "type");
        if (node.type === "array") {
            this.requirePropertyWhen("HEAD-001", node, "items", "type", "array");
        }
    };
    Oas20RequiredPropertyValidationRule.prototype.visitTag = function (node) {
        this.requireProperty("TAG-001", node, "name");
    };
    Oas20RequiredPropertyValidationRule.prototype.visitSecurityScheme = function (node) {
        this.requireProperty("SS-001", node, "type");
        if (node.type === "apiKey") {
            this.requirePropertyWhen("SS-002", node, "name", "type", "apiKey");
            this.requirePropertyWhen("SS-003", node, "in", "type", "apiKey");
        }
        if (node.type === "oauth2") {
            this.requirePropertyWhen("SS-004", node, "flow", "type", "oauth2");
            if ((node.flow === "implicit" || node.flow === "accessCode") && !this.isDefined(node.authorizationUrl)) {
                this.report("SS-005", node, "Property \"authorizationUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'implicit|accessCode'.");
            }
            if ((node.flow === "password" || node.flow === "application" || node.flow === "accessCode") && !this.isDefined(node.tokenUrl)) {
                this.report("SS-006", node, "Property \"tokenUrl\" is is required when \"type\" property is 'oauth2' AND \"flow\" property is 'password|application|accessCode'.");
            }
            this.requirePropertyWhen("SS-007", node, "scopes", "type", "oauth2");
        }
    };
    return Oas20RequiredPropertyValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$82 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Base class for Node Path visitors for all versions of OpenAPI.
 */
var OasNodePathVisitor = (function () {
    function OasNodePathVisitor() {
        this._path = new OasNodePath();
    }
    OasNodePathVisitor.prototype.path = function () {
        return this._path;
    };
    OasNodePathVisitor.prototype.visitDocument = function (node) {
        // Nothing to do for the root
    };
    OasNodePathVisitor.prototype.visitInfo = function (node) {
        this._path.prependSegment("info");
    };
    OasNodePathVisitor.prototype.visitContact = function (node) {
        this._path.prependSegment("contact");
    };
    OasNodePathVisitor.prototype.visitLicense = function (node) {
        this._path.prependSegment("license");
    };
    OasNodePathVisitor.prototype.visitPaths = function (node) {
        this._path.prependSegment("paths");
    };
    OasNodePathVisitor.prototype.visitPathItem = function (node) {
        this._path.prependSegment(node.path(), true);
    };
    OasNodePathVisitor.prototype.visitOperation = function (node) {
        this._path.prependSegment(node.method());
    };
    OasNodePathVisitor.prototype.visitExternalDocumentation = function (node) {
        this._path.prependSegment("externalDocs");
    };
    OasNodePathVisitor.prototype.visitSecurityRequirement = function (node) {
        var securityRequirements = node.parent().security;
        var idx = 0;
        for (var _i = 0, securityRequirements_1 = securityRequirements; _i < securityRequirements_1.length; _i++) {
            var securityRequirement = securityRequirements_1[_i];
            if (securityRequirement === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("security");
                break;
            }
            else {
                idx++;
            }
        }
    };
    OasNodePathVisitor.prototype.visitResponses = function (node) {
        this._path.prependSegment("responses");
    };
    OasNodePathVisitor.prototype.visitSchema = function (node) {
        this._path.prependSegment("schema");
    };
    OasNodePathVisitor.prototype.visitHeader = function (node) {
        this._path.prependSegment(node.headerName(), true);
    };
    OasNodePathVisitor.prototype.visitTag = function (node) {
        var tags = node.parent().tags;
        var idx = 0;
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            if (tag === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("tags");
                break;
            }
            else {
                idx++;
            }
        }
    };
    OasNodePathVisitor.prototype.visitSecurityScheme = function (node) {
        this._path.prependSegment(node.schemeName(), true);
    };
    OasNodePathVisitor.prototype.visitXML = function (node) {
        this._path.prependSegment("xml");
    };
    OasNodePathVisitor.prototype.visitExtension = function (node) {
        this._path.prependSegment(node.name);
    };
    return OasNodePathVisitor;
}());
/**
 * A visitor used to create a node path for any given node.  Here are some examples
 * of node paths:
 *
 * - The root document:
 *   /
 *
 * - An 'Info' object
 *   /info
 *
 * - A GET operation from pet-store:
 *   /paths[/pet/findByStatus]/get
 *
 * - External Documentation for a tag:
 *   /tags[2]/externalDocs
 *
 */
var Oas20NodePathVisitor = (function (_super) {
    __extends$82(Oas20NodePathVisitor, _super);
    function Oas20NodePathVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas20NodePathVisitor.prototype.visitDocument = function (node) {
        // Nothing to do for the root
    };
    Oas20NodePathVisitor.prototype.visitParameter = function (node) {
        var params = node.parent().parameters;
        var idx = 0;
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var param = params_1[_i];
            if (param === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("parameters");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas20NodePathVisitor.prototype.visitParameterDefinition = function (node) {
        this._path.prependSegment(node.parameterName(), true);
    };
    Oas20NodePathVisitor.prototype.visitResponseDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
    };
    Oas20NodePathVisitor.prototype.visitExample = function (node) {
        this._path.prependSegment("examples");
    };
    Oas20NodePathVisitor.prototype.visitItems = function (node) {
        this._path.prependSegment("items");
    };
    Oas20NodePathVisitor.prototype.visitSecurityDefinitions = function (node) {
        this._path.prependSegment("securityDefinitions");
    };
    Oas20NodePathVisitor.prototype.visitScopes = function (node) {
        this._path.prependSegment("scopes");
    };
    Oas20NodePathVisitor.prototype.visitSchemaDefinition = function (node) {
        this._path.prependSegment(node.definitionName(), true);
    };
    Oas20NodePathVisitor.prototype.visitPropertySchema = function (node) {
        this._path.prependSegment(node.propertyName(), true);
        this._path.prependSegment("properties");
    };
    Oas20NodePathVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
        this._path.prependSegment("additionalProperties");
    };
    Oas20NodePathVisitor.prototype.visitAllOfSchema = function (node) {
        var schemas = node.parent().allOf;
        var idx = 0;
        for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
            var schema = schemas_1[_i];
            if (schema === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("allOf");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas20NodePathVisitor.prototype.visitItemsSchema = function (node) {
        var schemas = node.parent().items;
        if (Array.isArray(schemas)) {
            var idx = 0;
            for (var _i = 0, schemas_2 = schemas; _i < schemas_2.length; _i++) {
                var schema = schemas_2[_i];
                if (schema === node) {
                    this._path.prependSegment(idx, true);
                    this._path.prependSegment("items");
                    break;
                }
                else {
                    idx++;
                }
            }
        }
        else {
            this._path.prependSegment("items");
        }
    };
    Oas20NodePathVisitor.prototype.visitDefinitions = function (node) {
        this._path.prependSegment("definitions");
    };
    Oas20NodePathVisitor.prototype.visitParametersDefinitions = function (node) {
        this._path.prependSegment("parameters");
    };
    Oas20NodePathVisitor.prototype.visitResponsesDefinitions = function (node) {
        this._path.prependSegment("responses");
    };
    Oas20NodePathVisitor.prototype.visitResponse = function (node) {
        this._path.prependSegment(node.statusCode(), true);
    };
    Oas20NodePathVisitor.prototype.visitHeaders = function (node) {
        this._path.prependSegment("headers");
    };
    return Oas20NodePathVisitor;
}(OasNodePathVisitor));
/**
 * The 3.0 version of a node path visitor (creates a node path from a node).
 */
var Oas30NodePathVisitor = (function (_super) {
    __extends$82(Oas30NodePathVisitor, _super);
    function Oas30NodePathVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas30NodePathVisitor.prototype.visitParameter = function (node) {
        var params = node.parent().parameters;
        var idx = 0;
        for (var _i = 0, params_2 = params; _i < params_2.length; _i++) {
            var param = params_2[_i];
            if (param === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("parameters");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas30NodePathVisitor.prototype.visitParameterDefinition = function (node) {
        this._path.prependSegment(node.parameterName(), true);
        this._path.prependSegment("parameters");
    };
    Oas30NodePathVisitor.prototype.visitResponse = function (node) {
        this._path.prependSegment(node.statusCode(), true);
    };
    Oas30NodePathVisitor.prototype.visitMediaType = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("content");
    };
    Oas30NodePathVisitor.prototype.visitEncoding = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("encoding");
    };
    Oas30NodePathVisitor.prototype.visitExample = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("examples");
    };
    Oas30NodePathVisitor.prototype.visitLink = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("links");
    };
    Oas30NodePathVisitor.prototype.visitLinkParameterExpression = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("parameters");
    };
    Oas30NodePathVisitor.prototype.visitLinkRequestBodyExpression = function (node) {
        this._path.prependSegment("requestBody");
    };
    Oas30NodePathVisitor.prototype.visitLinkServer = function (node) {
        this._path.prependSegment("server");
    };
    Oas30NodePathVisitor.prototype.visitResponseDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("responses");
    };
    Oas30NodePathVisitor.prototype.visitRequestBody = function (node) {
        this._path.prependSegment("requestBody");
    };
    Oas30NodePathVisitor.prototype.visitHeader = function (node) {
        this._path.prependSegment(node.headerName(), true);
        this._path.prependSegment("headers");
    };
    Oas30NodePathVisitor.prototype.visitCallback = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("callbacks");
    };
    Oas30NodePathVisitor.prototype.visitCallbackPathItem = function (node) {
        this._path.prependSegment(node.path(), true);
    };
    Oas30NodePathVisitor.prototype.visitServer = function (node) {
        var servers = node.parent().servers;
        var idx = 0;
        for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
            var server = servers_1[_i];
            if (server === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("servers");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas30NodePathVisitor.prototype.visitServerVariable = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("variables");
    };
    Oas30NodePathVisitor.prototype.visitAllOfSchema = function (node) {
        var schemas = node.parent().allOf;
        var idx = 0;
        for (var _i = 0, schemas_3 = schemas; _i < schemas_3.length; _i++) {
            var schema = schemas_3[_i];
            if (schema === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("allOf");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas30NodePathVisitor.prototype.visitAnyOfSchema = function (node) {
        var schemas = node.parent().anyOf;
        var idx = 0;
        for (var _i = 0, schemas_4 = schemas; _i < schemas_4.length; _i++) {
            var schema = schemas_4[_i];
            if (schema === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("anyOf");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas30NodePathVisitor.prototype.visitOneOfSchema = function (node) {
        var schemas = node.parent().oneOf;
        var idx = 0;
        for (var _i = 0, schemas_5 = schemas; _i < schemas_5.length; _i++) {
            var schema = schemas_5[_i];
            if (schema === node) {
                this._path.prependSegment(idx, true);
                this._path.prependSegment("oneOf");
                break;
            }
            else {
                idx++;
            }
        }
    };
    Oas30NodePathVisitor.prototype.visitNotSchema = function (node) {
        this._path.prependSegment("not");
    };
    Oas30NodePathVisitor.prototype.visitPropertySchema = function (node) {
        this._path.prependSegment(node.propertyName(), true);
        this._path.prependSegment("properties");
    };
    Oas30NodePathVisitor.prototype.visitItemsSchema = function (node) {
        var schemas = node.parent().items;
        if (Array.isArray(schemas)) {
            var idx = 0;
            for (var _i = 0, schemas_6 = schemas; _i < schemas_6.length; _i++) {
                var schema = schemas_6[_i];
                if (schema === node) {
                    this._path.prependSegment(idx, true);
                    this._path.prependSegment("items");
                    break;
                }
                else {
                    idx++;
                }
            }
        }
        else {
            this._path.prependSegment("items");
        }
    };
    Oas30NodePathVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
        this._path.prependSegment("additionalProperties");
    };
    Oas30NodePathVisitor.prototype.visitDiscriminator = function (node) {
        this._path.prependSegment("discriminator");
    };
    Oas30NodePathVisitor.prototype.visitComponents = function (node) {
        this._path.prependSegment("components");
    };
    Oas30NodePathVisitor.prototype.visitSchemaDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("schemas");
    };
    Oas30NodePathVisitor.prototype.visitExampleDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("examples");
    };
    Oas30NodePathVisitor.prototype.visitRequestBodyDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("requestBodies");
    };
    Oas30NodePathVisitor.prototype.visitHeaderDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("headers");
    };
    Oas30NodePathVisitor.prototype.visitOAuthFlows = function (node) {
        this._path.prependSegment("flows");
    };
    Oas30NodePathVisitor.prototype.visitImplicitOAuthFlow = function (node) {
        this._path.prependSegment("implicit");
    };
    Oas30NodePathVisitor.prototype.visitPasswordOAuthFlow = function (node) {
        this._path.prependSegment("password");
    };
    Oas30NodePathVisitor.prototype.visitClientCredentialsOAuthFlow = function (node) {
        this._path.prependSegment("clientCredentials");
    };
    Oas30NodePathVisitor.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        this._path.prependSegment("authorizationCode");
    };
    Oas30NodePathVisitor.prototype.visitLinkDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("links");
    };
    Oas30NodePathVisitor.prototype.visitCallbackDefinition = function (node) {
        this._path.prependSegment(node.name(), true);
        this._path.prependSegment("callbacks");
    };
    Oas30NodePathVisitor.prototype.visitSecurityScheme = function (node) {
        this._path.prependSegment(node.schemeName(), true);
        this._path.prependSegment("securitySchemes");
    };
    return Oas30NodePathVisitor;
}(OasNodePathVisitor));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$83 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Property Format validation rule.  This rule is responsible
 * for reporting whenever the value of a property fails to conform to the required
 * *format* for that property.
 */
var Oas20InvalidPropertyFormatValidationRule = (function (_super) {
    __extends$83(Oas20InvalidPropertyFormatValidationRule, _super);
    function Oas20InvalidPropertyFormatValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas20InvalidPropertyFormatValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        if (!isValid) {
            this.report(code, node, message);
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitDocument = function (node) {
        if (this.hasValue(node.host)) {
            this.reportIfInvalid("R-004", OasValidationRuleUtil.isValidHost(node.host), node, "Invalid format for \"host\" property - only the host name (and optionally port) should be specified.");
        }
        if (this.hasValue(node.basePath)) {
            this.reportIfInvalid("R-005", node.basePath.indexOf("/") === 0, node, "The \"basePath\" property must start with a '/' character.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitInfo = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("INF-003", OasValidationRuleUtil.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitContact = function (node) {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("CTC-001", OasValidationRuleUtil.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
        if (this.hasValue(node.email)) {
            this.reportIfInvalid("CTC-002", OasValidationRuleUtil.isValidEmailAddress(node.email), node, "The \"email\" property must be a valid email address.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitLicense = function (node) {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("LIC-002", OasValidationRuleUtil.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitOperation = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("OP-002", OasValidationRuleUtil.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid("OP-005", OasValidationRuleUtil.isValidMimeType(node.consumes), node, "The \"consumes\" property value must be a valid mime type.");
        }
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid("OP-006", OasValidationRuleUtil.isValidMimeType(node.produces), node, "The \"produces\" property value must be a valid mime type.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitExternalDocumentation = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("ED-002", OasValidationRuleUtil.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("ED-003", OasValidationRuleUtil.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitParameter = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("PAR-010", OasValidationRuleUtil.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitItems = function (node) {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid("IT-007", OasValidationRuleUtil.isValidForType(node.default, node), node, "The \"default\" property must conform to the \"type\" of the items.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitHeader = function (node) {
        if (this.hasValue(node.default)) {
            this.reportIfInvalid("HEAD-005", OasValidationRuleUtil.isValidForType(node.default, node), node, "The \"default\" property must conform to the \"type\" of the items.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitTag = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("TAG-002", OasValidationRuleUtil.isValidGFM(node.description), node, "The \"description\" property must be valid GFM syntax (or plain text).");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitSecurityScheme = function (node) {
        if (this.hasValue(node.authorizationUrl)) {
            this.reportIfInvalid("SS-011", OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "The \"authorizationUrl\" property must be a valid URL.");
        }
        if (this.hasValue(node.tokenUrl)) {
            this.reportIfInvalid("SS-012", OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "The \"tokenUrl\" property must be a valid URL.");
        }
    };
    Oas20InvalidPropertyFormatValidationRule.prototype.visitXML = function (node) {
        if (this.hasValue(node.namespace)) {
            this.reportIfInvalid("XML-001", OasValidationRuleUtil.isValidUrl(node.namespace), node, "The \"namespace\" property must be a valid URL.");
        }
    };
    return Oas20InvalidPropertyFormatValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$84 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Property Name validation rule.  This rule is responsible
 * for reporting whenever the **name** of a property fails to conform to the required
 * format defined by the specification.
 */
var Oas20InvalidPropertyNameValidationRule = (function (_super) {
    __extends$84(Oas20InvalidPropertyNameValidationRule, _super);
    function Oas20InvalidPropertyNameValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas20InvalidPropertyNameValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        if (!isValid) {
            this.report(code, node, message);
        }
    };
    /**
     * Returns true if the definition name is valid.
     * @param name
     * @return {boolean}
     */
    Oas20InvalidPropertyNameValidationRule.prototype.isValidDefinitionName = function (name) {
        // TODO implement some reasonable rules for this
        return name.indexOf("/") == -1;
    };
    /**
     * Returns true if the scope name is valid.
     * @param scope
     */
    Oas20InvalidPropertyNameValidationRule.prototype.isValidScopeName = function (scope) {
        // TODO implement some reasonable rules for this
        return true;
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitPathItem = function (node) {
        this.reportIfInvalid("PATH-005", node.path().indexOf("/") === 0, node, "The path must start with a '/' character.");
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitResponse = function (node) {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid("RES-003", OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node, "Response status code is not a valid HTTP response status code: " + node.statusCode());
        }
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitExample = function (node) {
        var _this = this;
        var produces = (node.ownerDocument()).produces;
        var operation = (node.parent().parent().parent());
        if (this.hasValue(operation.produces)) {
            produces = operation.produces;
        }
        if (!this.hasValue(produces)) {
            produces = [];
        }
        var ctypes = node.exampleContentTypes();
        ctypes.forEach(function (ct) {
            _this.reportIfInvalid("EX-001", produces.indexOf(ct) != -1, node, "Example for type '" + ct + "' does not match any of the \"produces\" mime-types expected by the operation.");
        });
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitSchemaDefinition = function (node) {
        this.reportIfInvalid("SDEF-001", this.isValidDefinitionName(node.definitionName()), node, "Definition name does not conform to requirements (invalid format).");
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitParameterDefinition = function (node) {
        this.reportIfInvalid("PDEF-001", this.isValidDefinitionName(node.parameterName()), node, "Definition name does not conform to requirements (invalid format).");
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitResponseDefinition = function (node) {
        this.reportIfInvalid("RDEF-001", this.isValidDefinitionName(node.name()), node, "Definition name does not conform to requirements (invalid format).");
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitScopes = function (node) {
        var _this = this;
        node.scopes().forEach(function (scope) {
            _this.reportIfInvalid("SCPS-001", _this.isValidScopeName(scope), node, "Invalid scope name: " + scope);
        });
    };
    Oas20InvalidPropertyNameValidationRule.prototype.visitSecurityScheme = function (node) {
        this.reportIfInvalid("SS-013", this.isValidDefinitionName(node.schemeName()), node, "Security scheme definition name does not conform to requirements (invalid format).");
    };
    return Oas20InvalidPropertyNameValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$85 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Property Value validation rule.  This rule is responsible
 * for reporting whenever the **value** of a property fails to conform to requirements
 * outlined by the specification.  This is typically things like enums, where the
 * *format* of the value is fine (e.g. correct data-type) but the valid is somehow
 * invalid.
 */
var Oas20InvalidPropertyValueValidationRule = (function (_super) {
    __extends$85(Oas20InvalidPropertyValueValidationRule, _super);
    function Oas20InvalidPropertyValueValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas20InvalidPropertyValueValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        if (!isValid) {
            this.report(code, node, message);
        }
    };
    /**
     * Returns true if the given value is a valid operationId.
     * @param id
     */
    Oas20InvalidPropertyValueValidationRule.prototype.isValidOperationId = function (id) {
        // TODO implement a regex for this? should be something like camelCase
        return true;
    };
    /**
     * Parses the given path template for segments.  For example, a path template might be
     *
     * /foo/{fooId}/resources/{resourceId}
     *
     * In this case, this method will return [ "fooId", "resourceId" ]
     *
     * @param pathTemplate
     * @return {Array}
     */
    Oas20InvalidPropertyValueValidationRule.prototype.parsePathTemplate = function (pathTemplate) {
        var segments = [];
        var split = pathTemplate.split('/');
        split.forEach(function (seg) {
            if (seg.indexOf('{') === 0) {
                var segment = seg.substring(1, seg.lastIndexOf('}')).trim();
                segments.push(segment);
            }
        });
        return segments;
    };
    /**
     * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
     * the type being defined is an 'array' type.
     * @param xml
     * @return {boolean}
     */
    Oas20InvalidPropertyValueValidationRule.prototype.isWrappedOK = function (xml) {
        var schema = xml.parent();
        return schema.type === "array";
    };
    /**
     * Returns true if the given required scopes are all actually defined by the security definition.
     * @param requiredScopes
     * @param definedScopes
     */
    Oas20InvalidPropertyValueValidationRule.prototype.isValidScopes = function (requiredScopes, definedScopes) {
        var rval = true;
        var dscopes = definedScopes.scopes();
        requiredScopes.forEach(function (requiredScope) {
            if (dscopes.indexOf(requiredScope) === -1) {
                rval = false;
            }
        });
        return rval;
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitDocument = function (node) {
        var _this = this;
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach(function (scheme) {
                _this.reportIfInvalid("R-006", OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "Invalid property value.  Each \"schemes\" property value must be one of: http, https, ws, wss (Invalid value found: '" + scheme + "')");
            });
        }
        if (this.hasValue(node.consumes)) {
            this.reportIfInvalid("R-007", OasValidationRuleUtil.isValidMimeType(node.consumes), node, "Invalid property value.  The \"consumes\" property value must be a valid mime-type.");
        }
        if (this.hasValue(node.produces)) {
            this.reportIfInvalid("R-008", OasValidationRuleUtil.isValidMimeType(node.produces), node, "Invalid property value.  The \"produces\" property value must be a valid mime-type.");
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitOperation = function (node) {
        var _this = this;
        if (this.hasValue(node.summary)) {
            this.reportIfInvalid("OP-001", node.summary.length < 120, node, "The \"summary\" property value should be less than 120 characters long.");
        }
        if (this.hasValue(node.operationId)) {
            this.reportIfInvalid("OP-004", this.isValidOperationId(node.operationId), node, "The \"operationId\" property value is invalid - it should be simple *camelCase* format.");
        }
        if (this.hasValue(node.schemes)) {
            node.schemes.forEach(function (scheme) {
                _this.reportIfInvalid("OP-010", OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "Invalid property value.  Each \"schemes\" property value must be one of: http, https, ws, wss (Invalid value found: '" + scheme + "')");
            });
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitParameter = function (node) {
        // Note: parent may be an operation *or* a path-item.
        if (node.in === "path") {
            var pathItem = void 0;
            if (node.parent()["_path"]) {
                pathItem = (node.parent());
            }
            else {
                pathItem = (node.parent().parent());
            }
            var path = pathItem.path();
            var pathVars = this.parsePathTemplate(path);
            this.reportIfInvalid("PAR-007", OasValidationRuleUtil.isValidEnumItem(node.name, pathVars), node, "The \"name\" property value for a 'path' style parameter must match one of the items in the path template.  Invalid path property name found: " + node.name);
        }
        if (node.in === "formData") {
            var consumes = (node.ownerDocument()).consumes;
            if (!node.parent()["_path"]) {
                var operation = (node.parent());
                if (this.hasValue(operation.consumes)) {
                    consumes = operation.consumes;
                }
            }
            if (!this.hasValue(consumes)) {
                consumes = [];
            }
            var valid = consumes.indexOf("application/x-www-form-urlencoded") >= 0 || consumes.indexOf("multipart/form-data") >= 0;
            this.reportIfInvalid("PAR-008", valid, node, "A parameter located in \"formData\" may only be used when the operation @consumes 'application/x-www-form-urlencoded' or 'multipart/form-data' data.");
        }
        if (this.hasValue(node.in)) {
            this.reportIfInvalid("PAR-009", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "path", "formData", "body"]), node, "Invalid property value.  The \"in\" property value must be one of: query, header, path, formData, body (Found value: '" + node.in + "')");
        }
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("PAR-011", OasValidationRuleUtil.isValidEnumItem(node.type, ["string", "number", "integer", "boolean", "array", "file"]), node, "Invalid property value.  The \"type\" property value must be one of: string, number, integer, boolean, array, file (Found value: '" + node.type + "')");
        }
        if (this.hasValue(node.format)) {
            this.reportIfInvalid("PAR-012", OasValidationRuleUtil.isValidEnumItem(node.format, ["int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password"]), node, "Invalid property value.  The \"format\" property value must be one of: int32, int64, float, double, byte, binary, date, date-time, password (Found value: '" + node.format + "')");
        }
        if (this.hasValue(node.allowEmptyValue)) {
            this.reportIfInvalid("PAR-013", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "formData"]), node, "The \"allowEmptyValue\" property is only allowed for 'query' or 'formData' parameters.");
        }
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("PAR-014", node.type === "array", node, "The \"collectionFormat\" property is only allowed for 'array' type parameters.");
        }
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("PAR-015", OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, ["csv", "ssv", "tsv", "pipes", "multi"]), node, "Invalid property value.  The \"collectionFormat\" property value must be one of: csv, ssv, tsv, pipes, multi (Found value: '" + node.collectionFormat + "')");
        }
        if (node.collectionFormat === "multi") {
            this.reportIfInvalid("PAR-016", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "formData"]), node, "Invalid property value.  The \"collectionFormat\" property value can only be 'multi' for 'query' or 'formData' parameters.");
        }
        if (this.hasValue(node.default)) {
            this.reportIfInvalid("PAR-017", node.required === undefined || node.required === null || node.required === false, node, "Invalid property value.  The \"default\" property is not valid when the parameter is required.");
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitItems = function (node) {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("IT-003", OasValidationRuleUtil.isValidEnumItem(node.type, ["string", "number", "integer", "boolean", "array"]), node, "Invalid property value.  The \"type\" property value must be one of: string, number, integer, boolean, array (Found value: '" + node.type + "')");
        }
        if (this.hasValue(node.format)) {
            this.reportIfInvalid("IT-004", OasValidationRuleUtil.isValidEnumItem(node.format, ["int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password"]), node, "Invalid property value.  The \"format\" property value must be one of: int32, int64, float, double, byte, binary, date, date-time, password (Found value: '" + node.format + "')");
        }
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("IT-005", OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, ["csv", "ssv", "tsv", "pipes"]), node, "Invalid property value.  The \"collectionFormat\" property value must be one of: csv, ssv, tsv, pipes (Found value: '" + node.collectionFormat + "')");
        }
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("IT-006", node.type === "array", node, "The \"collectionFormat\" property is only allowed for 'array' type parameters.");
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitHeader = function (node) {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("HEAD-003", OasValidationRuleUtil.isValidEnumItem(node.type, ["string", "number", "integer", "boolean", "array"]), node, "Invalid property value.  The \"type\" property value must be one of: string, number, integer, boolean, array (Found value: '" + node.type + "')");
        }
        if (this.hasValue(node.format)) {
            this.reportIfInvalid("HEAD-004", OasValidationRuleUtil.isValidEnumItem(node.format, ["int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password"]), node, "Invalid property value.  The \"format\" property value must be one of: int32, int64, float, double, byte, binary, date, date-time, password (Found value: '" + node.format + "')");
        }
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("HEAD-006", node.type === "array", node, "The \"collectionFormat\" property is only allowed for 'array' type headers.");
        }
        if (this.hasValue(node.collectionFormat)) {
            this.reportIfInvalid("HEAD-007", OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, ["csv", "ssv", "tsv", "pipes"]), node, "Invalid property value.  The \"collectionFormat\" property value must be one of: csv, ssv, tsv, pipes (Found value: '" + node.collectionFormat + "')");
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitXML = function (node) {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid("XML-002", this.isWrappedOK(node), node, "The \"wrapped\" property is only valid for 'array' types.");
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitSecurityScheme = function (node) {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("SS-008", OasValidationRuleUtil.isValidEnumItem(node.type, ["apiKey", "basic", "oauth2"]), node, "Invalid property value.  The \"type\" property value must be one of: basic, apiKey, oauth2 (Found value: '" + node.type + "')");
        }
        if (this.hasValue(node.in)) {
            this.reportIfInvalid("SS-009", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header"]), node, "Invalid property value.  The \"in\" property value must be one of: query, header (Found value: '" + node.in + "')");
        }
        if (this.hasValue(node.flow)) {
            this.reportIfInvalid("SS-010", OasValidationRuleUtil.isValidEnumItem(node.flow, ["implicit", "password", "application", "accessCode"]), node, "Invalid property value.  The \"flow\" property value must be one of: implicit, password, application, accessCode (Found value: '" + node.flow + "')");
        }
    };
    Oas20InvalidPropertyValueValidationRule.prototype.visitSecurityRequirement = function (node) {
        var _this = this;
        var snames = node.securityRequirementNames();
        snames.forEach(function (sname) {
            var sdefs = node.ownerDocument().securityDefinitions;
            if (_this.hasValue(sdefs)) {
                var scheme = node.ownerDocument().securityDefinitions.securityScheme(sname);
                if (_this.hasValue(scheme)) {
                    if (scheme.type !== "oauth2") {
                        var scopes = node.scopes(sname);
                        _this.reportIfInvalid("SREQ-002", _this.hasValue(scopes) && scopes.length === 0, node, "Security Requirement '" + sname + "' field value must be an empty array because the referenced Security Definition \"type\" is not 'oauth2'.");
                    }
                    else {
                        var definedScopes = scheme.scopes;
                        var requiredScopes = node.scopes(sname);
                        _this.reportIfInvalid("SREQ-003", _this.isValidScopes(requiredScopes, definedScopes), node, "Security Requirement '" + sname + "' field value must be an array of scopes from the possible scopes defined by the referenced Security Definition.");
                    }
                }
            }
        });
    };
    return Oas20InvalidPropertyValueValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$86 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Uniqueness validation rule.  This rule is responsible
 * for reporting whenever properties whose values are required to be unique,
 * fail that test.  Examples are scopes, tags, and operationId.
 */
var Oas20UniquenessValidationRule = (function (_super) {
    __extends$86(Oas20UniquenessValidationRule, _super);
    function Oas20UniquenessValidationRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.indexedOperations = {};
        return _this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas20UniquenessValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        if (!isValid) {
            this.report(code, node, message);
        }
    };
    Oas20UniquenessValidationRule.prototype.visitTag = function (node) {
        var tags = node.ownerDocument().tags;
        var tcount = tags.filter(function (tag) {
            return tag.name === node.name;
        }).length;
        this.reportIfInvalid("TAG-003", tcount === 1, node, "Duplicate tag '" + node.name + "' found (every tag must have a unique name).");
    };
    Oas20UniquenessValidationRule.prototype.visitOperation = function (node) {
        if (this.hasValue(node.operationId)) {
            var dupes = this.indexedOperations[node.operationId];
            if (this.hasValue(dupes)) {
                this.reportIfInvalid("OP-003", dupes.length > 1, dupes[0], "The \"operationId\" property value '" + node.operationId + "' must be unique across ALL operations.");
                this.reportIfInvalid("OP-003", false, node, "The \"operationId\" property value '" + node.operationId + "' must be unique across ALL operations.");
                dupes.push(node);
            }
            else {
                this.indexedOperations[node.operationId] = [node];
            }
        }
    };
    Oas20UniquenessValidationRule.prototype.visitParameter = function (node) {
        var params = node.parent().parameters;
        if (node.in !== "body") {
            this.reportIfInvalid("PAR-019", params.filter(function (param) {
                return param.in === node.in && param.name === node.name;
            }).length === 1, node, "Duplicate '" + node.in + "' parameter named '" + node.name + "' found (parameters must be unique by name and location).");
        }
        if (node.in === "body") {
            this.reportIfInvalid("PAR-020", params.filter(function (param) {
                return param.in === "body";
            }).length === 1, node, "An operation may have at most one \"body\" parameter.");
        }
    };
    return Oas20UniquenessValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$87 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Mutually Exclusive validation rule.  This rule is responsible
 * for reporting whenever properties are used together when that is not allowed.
 * In various places in the specification, some properties are mutually exlusive
 * with each other.
 */
var Oas20MutuallyExclusiveValidationRule = (function (_super) {
    __extends$87(Oas20MutuallyExclusiveValidationRule, _super);
    function Oas20MutuallyExclusiveValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas20MutuallyExclusiveValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        if (!isValid) {
            this.report(code, node, message);
        }
    };
    Oas20MutuallyExclusiveValidationRule.prototype.visitOperation = function (node) {
        if (this.hasValue(node.parameters)) {
            var hasBodyParam_1 = false;
            var hasFormDataParam_1 = false;
            node.parameters.forEach(function (param) {
                if (param.in === "body") {
                    hasBodyParam_1 = true;
                }
                if (param.in === "formData") {
                    hasFormDataParam_1 = true;
                }
            });
            this.reportIfInvalid("PATH-001", !(hasBodyParam_1 && hasFormDataParam_1), node, "An operation may not have both a \"body\" and a \"formData\" parameter.");
        }
    };
    Oas20MutuallyExclusiveValidationRule.prototype.visitPathItem = function (node) {
        if (this.hasValue(node.parameters)) {
            var hasBodyParam_2 = false;
            var hasFormDataParam_2 = false;
            node.parameters.forEach(function (param) {
                if (param.in === "body") {
                    hasBodyParam_2 = true;
                }
                if (param.in === "formData") {
                    hasFormDataParam_2 = true;
                }
            });
            this.reportIfInvalid("PATH-001", !(hasBodyParam_2 && hasFormDataParam_2), node, "An operation may not have both a \"body\" and a \"formData\" parameter.");
        }
    };
    return Oas20MutuallyExclusiveValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$88 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Reference validation rule.  This rule is responsible
 * for reporting whenever a property references another node in the document
 * but that reference is missing or invalid.
 */
var Oas20InvalidReferenceValidationRule = (function (_super) {
    __extends$88(Oas20InvalidReferenceValidationRule, _super);
    function Oas20InvalidReferenceValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas20InvalidReferenceValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        if (!isValid) {
            this.report(code, node, message);
        }
    };
    /**
     * Returns true if the security requirement name is valid.  It does this by looking up a declared
     * security scheme definition in the document.  If no security scheme definition exists with the
     * given name, then it is invalid.
     * @param securityReqName
     * @param doc
     */
    Oas20InvalidReferenceValidationRule.prototype.isValidSecurityRequirementName = function (securityReqName, doc) {
        return this.hasValue(doc.securityDefinitions) && this.isDefined(doc.securityDefinitions.securityScheme(securityReqName));
    };
    Oas20InvalidReferenceValidationRule.prototype.visitParameter = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PAR-018", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property must reference a valid Parameter Definition: " + node.$ref);
        }
    };
    Oas20InvalidReferenceValidationRule.prototype.visitPathItem = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PATH-001", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "Reference to external path is either invalid or not found: " + node.$ref);
        }
    };
    Oas20InvalidReferenceValidationRule.prototype.visitResponse = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RES-002", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property must reference a valid Response Definition: " + node.$ref);
        }
    };
    Oas20InvalidReferenceValidationRule.prototype.visitSchema = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SCH-001", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property must reference a valid Definition: " + node.$ref);
        }
    };
    Oas20InvalidReferenceValidationRule.prototype.visitPropertySchema = function (node) {
        this.visitSchema(node);
    };
    Oas20InvalidReferenceValidationRule.prototype.visitAdditionalPropertiesSchema = function (node) {
        this.visitSchema(node);
    };
    Oas20InvalidReferenceValidationRule.prototype.visitItemsSchema = function (node) {
        this.visitSchema(node);
    };
    Oas20InvalidReferenceValidationRule.prototype.visitAllOfSchema = function (node) {
        this.visitSchema(node);
    };
    Oas20InvalidReferenceValidationRule.prototype.visitSecurityRequirement = function (node) {
        var _this = this;
        node.securityRequirementNames().forEach(function (name) {
            _this.reportIfInvalid("SREQ-001", _this.isValidSecurityRequirementName(name, node.ownerDocument()), node, "Security Requirement name '" + name + "' does not match an item declared in the Security Definitions.");
        });
    };
    return Oas20InvalidReferenceValidationRule;
}(Oas20ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$90 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Base class for all 3.0 validation rules.
 */
var Oas30ValidationRule = (function (_super) {
    __extends$90(Oas30ValidationRule, _super);
    function Oas30ValidationRule(reporter) {
        var _this = _super.call(this) || this;
        _this._reporter = reporter;
        return _this;
    }
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param condition
     * @param node
     * @param message
     */
    Oas30ValidationRule.prototype.reportIf = function (code, condition, node, message) {
        if (condition) {
            this.report(code, node, message);
        }
    };
    /**
     * Reports a validation error if the property is not valid.
     * @param code
     * @param isValid
     * @param node
     * @param message
     */
    Oas30ValidationRule.prototype.reportIfInvalid = function (code, isValid, node, message) {
        this.reportIf(code, !isValid, node, message);
    };
    /**
     * Check if a property was defined.
     * @param propertyValue
     * @return {boolean}
     */
    Oas30ValidationRule.prototype.isDefined = function (propertyValue) {
        return OasValidationRuleUtil.isDefined(propertyValue);
    };
    /**
     * Check if a value is either null or undefined.
     * @param value
     * @return {boolean}
     */
    Oas30ValidationRule.prototype.isNullOrUndefined = function (value) {
        return value === null || value === undefined;
    };
    /**
     * Check if the property value exists (is not undefined and is not null).
     * @param propertyValue
     * @return {boolean}
     */
    Oas30ValidationRule.prototype.hasValue = function (propertyValue) {
        return OasValidationRuleUtil.hasValue(propertyValue);
    };
    /**
     * Called by validation rules to report an error.
     * @param code
     * @param node
     * @param message
     */
    Oas30ValidationRule.prototype.report = function (code, node, message) {
        this._reporter.report(code, node, message);
    };
    return Oas30ValidationRule;
}(Oas30NodeVisitorAdapter));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$89 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Property Format validation rule.  This rule is responsible
 * for reporting whenever the value of a property fails to conform to the required
 * *format* for that property.
 */
var Oas30InvalidPropertyFormatValidationRule = (function (_super) {
    __extends$89(Oas30InvalidPropertyFormatValidationRule, _super);
    function Oas30InvalidPropertyFormatValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas30InvalidPropertyFormatValidationRule.prototype.visitInfo = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("INF-3-003", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
        if (this.hasValue(node.termsOfService)) {
            this.reportIfInvalid("CTC-3-004", OasValidationRuleUtil.isValidUrl(node.termsOfService), node, "The \"termsOfService\" property must be a valid URL.");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitResponseBase = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("RES-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitResponse = function (node) {
        this.visitResponseBase(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitResponseDefinition = function (node) {
        this.visitResponseBase(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitContact = function (node) {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("CTC-3-001", OasValidationRuleUtil.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
        if (this.hasValue(node.email)) {
            this.reportIfInvalid("CTC-3-002", OasValidationRuleUtil.isValidEmailAddress(node.email), node, "The \"email\" property must be a valid email address.");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitExample = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("EX-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitExampleDefinition = function (node) {
        this.visitExample(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitLink = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("LINK-3-004", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitLinkDefinition = function (node) {
        this.visitLink(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitFlow = function (node) {
        if (this.hasValue(node.authorizationUrl)) {
            this.reportIfInvalid("FLOW-3-003", OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "The \"authorizationUrl\" property must be a valid URL.");
        }
        if (this.hasValue(node.tokenUrl)) {
            this.reportIfInvalid("FLOW-3-004", OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "The \"tokenUrl\" property must be a valid URL.");
        }
        if (this.hasValue(node.refreshUrl)) {
            this.reportIfInvalid("FLOW-3-005", OasValidationRuleUtil.isValidUrl(node.refreshUrl), node, "The \"refreshUrl\" property must be a valid URL.");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitImplicitOAuthFlow = function (node) {
        this.visitFlow(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitPasswordOAuthFlow = function (node) {
        this.visitFlow(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
        this.visitFlow(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        this.visitFlow(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitPathItem = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("PATH-3-003", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitRequestBody = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("RB-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitRequestBodyDefinition = function (node) {
        this.visitRequestBody(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitLicense = function (node) {
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("LIC-3-002", OasValidationRuleUtil.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitOperation = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("OP-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitExternalDocumentation = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("ED-3-001", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("ED-3-003", OasValidationRuleUtil.isValidUrl(node.url), node, "The \"url\" property must be a valid URL.");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitParameter = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("PAR-3-005", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitParameterDefinition = function (node) {
        this.visitParameter(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitHeader = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("HEAD-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitHeaderDefinition = function (node) {
        this.visitHeader(node);
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitTag = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("TAG-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitSecurityScheme = function (node) {
        if (this.hasValue(node.openIdConnectUrl)) {
            this.reportIfInvalid("SS-3-007", OasValidationRuleUtil.isValidUrl(node.openIdConnectUrl), node, "The \"openIdConnectUrl\" property must be a valid URL.");
        }
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("SS-3-009", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitServer = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("SRV-3-003", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
        if (this.hasValue(node.url)) {
            this.reportIfInvalid("SRV-3-002", OasValidationRuleUtil.isValidUrlTemplate(node.url), node, "The \"url\" property must be a valid URL.");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitServerVariable = function (node) {
        if (this.hasValue(node.description)) {
            this.reportIfInvalid("SVAR-3-002", OasValidationRuleUtil.isValidCommonMark(node.description), node, "The \"description\" property must be valid CommonMark syntax (or plain text).");
        }
    };
    Oas30InvalidPropertyFormatValidationRule.prototype.visitXML = function (node) {
        if (this.hasValue(node.namespace)) {
            this.reportIfInvalid("XML-3-002", OasValidationRuleUtil.isValidUrl(node.namespace), node, "The \"namespace\" property must be a valid URL.");
        }
    };
    return Oas30InvalidPropertyFormatValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$91 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Ignored Property Name validation rule.  This rule is responsible
 * for reporting whenever a property found in the data model is valid but will
 * be ignored.
 */
var Oas30IgnoredPropertyNameValidationRule = (function (_super) {
    __extends$91(Oas30IgnoredPropertyNameValidationRule, _super);
    function Oas30IgnoredPropertyNameValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas30IgnoredPropertyNameValidationRule.prototype.visitHeader = function (node) {
        if (node.headerName().toLowerCase() === "content-type") {
            this.report("HEAD-3-001", node, "The \"Content-Type\" header will be ignored.");
        }
    };
    Oas30IgnoredPropertyNameValidationRule.prototype.visitHeaderDefinition = function (node) {
        this.visitHeader(node);
    };
    return Oas30IgnoredPropertyNameValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$92 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Property Name validation rule.  This rule is responsible
 * for reporting whenever the **name** of a property fails to conform to the required
 * format defined by the specification.
 */
var Oas30InvalidPropertyNameValidationRule = (function (_super) {
    __extends$92(Oas30InvalidPropertyNameValidationRule, _super);
    function Oas30InvalidPropertyNameValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns true if the definition name is valid.
     * @param name
     * @return {boolean}
     */
    Oas30InvalidPropertyNameValidationRule.isValidDefinitionName = function (name) {
        var definitionNamePattern = /^[a-zA-Z0-9\.\-_]+$/;
        return definitionNamePattern.test(name);
    };
    /**
     * Returns true if the given schema has a property defined with the given name.
     * @param {Oas30Schema} schema
     * @param {string} propertyName
     * @return {boolean}
     */
    Oas30InvalidPropertyNameValidationRule.prototype.isValidSchemaProperty = function (schema, propertyName) {
        if (this.isNullOrUndefined(schema)) {
            return false;
        }
        return !this.isNullOrUndefined(schema.property(propertyName));
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitPathItem = function (node) {
        this.reportIfInvalid("PATH-3-004", node.path().indexOf("/") === 0, node, "The path must start with a '/' character.");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitResponse = function (node) {
        // The "default" response will have a statusCode of "null"
        if (this.hasValue(node.statusCode())) {
            this.reportIfInvalid("RES-3-001", OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node, "Response status code \"" + node.statusCode() + "\" is not a valid HTTP response status code.");
        }
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitSecurityRequirement = function (node) {
        var _this = this;
        var srn = node.securityRequirementNames();
        srn.forEach(function (name) {
            var doc = node.ownerDocument();
            var scheme = doc.components.getSecurityScheme(name);
            _this.reportIfInvalid("SREQ-3-001", !(scheme === undefined || scheme === null), node, "Security Requirement \"" + name + "\" does not correspond to a declared Security Scheme.");
        });
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitSchemaDefinition = function (node) {
        this.reportIfInvalid("COMP-3-001", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Schema Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitParameterDefinition = function (node) {
        this.reportIfInvalid("COMP-3-002", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.parameterName()), node, "The Parameter Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitResponseDefinition = function (node) {
        this.reportIfInvalid("COMP-3-003", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Response Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitSecurityScheme = function (node) {
        this.reportIfInvalid("COMP-3-004", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.schemeName()), node, "The Security Scheme name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitExampleDefinition = function (node) {
        this.reportIfInvalid("COMP-3-005", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Example Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitRequestBodyDefinition = function (node) {
        this.reportIfInvalid("COMP-3-006", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Request Body Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitHeaderDefinition = function (node) {
        this.reportIfInvalid("COMP-3-007", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Header Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitLinkDefinition = function (node) {
        this.reportIfInvalid("COMP-3-008", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Link Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitCallbackDefinition = function (node) {
        this.reportIfInvalid("COMP-3-009", Oas30InvalidPropertyNameValidationRule.isValidDefinitionName(node.name()), node, "The Callback Definition name must match the regular expression: ^[a-zA-Z0-9\\.\\-_]+$");
    };
    Oas30InvalidPropertyNameValidationRule.prototype.visitEncoding = function (node) {
        var name = node.name();
        var schema = node.parent().schema;
        this.reportIfInvalid("ENC-3-006", this.isValidSchemaProperty(schema, name), node, "The encoding property \"" + name + "\" cannot be found in the associated schema.");
    };
    return Oas30InvalidPropertyNameValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$93 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Used to find an operation with a given operation id.
 */
var Oas30OperationFinder = (function (_super) {
    __extends$93(Oas30OperationFinder, _super);
    function Oas30OperationFinder(operationId) {
        var _this = _super.call(this) || this;
        _this.operationId = operationId;
        return _this;
    }
    Oas30OperationFinder.prototype.visitOperation = function (node) {
        if (node.operationId === this.operationId) {
            this.foundOp = node;
        }
    };
    Oas30OperationFinder.prototype.isFound = function () {
        return OasValidationRuleUtil.hasValue(this.foundOp);
    };
    return Oas30OperationFinder;
}(Oas30NodeVisitorAdapter));
/**
 * Implements the Invalid Property Value validation rule.  This rule is responsible
 * for reporting whenever the **value** of a property fails to conform to requirements
 * outlined by the specification.  This is typically things like enums, where the
 * *format* of the value is fine (e.g. correct data-type) but the valid is somehow
 * invalid.
 */
var Oas30InvalidPropertyValueValidationRule = (function (_super) {
    __extends$93(Oas30InvalidPropertyValueValidationRule, _super);
    function Oas30InvalidPropertyValueValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns true if the given value is a valid operationId.
     * @param id
     */
    Oas30InvalidPropertyValueValidationRule.prototype.isValidOperationId = function (id) {
        // TODO implement a regex for this? should be something like camelCase
        return true;
    };
    /**
     * Parses the given path template for segments.  For example, a path template might be
     *
     * /foo/{fooId}/resources/{resourceId}
     *
     * In this case, this method will return [ "fooId", "resourceId" ]
     *
     * @param pathTemplate
     * @return {Array}
     */
    Oas30InvalidPropertyValueValidationRule.prototype.parsePathTemplate = function (pathTemplate) {
        var segments = [];
        var split = pathTemplate.split('/');
        split.forEach(function (seg) {
            if (seg.indexOf('{') === 0) {
                var segment = seg.substring(1, seg.lastIndexOf('}')).trim();
                segments.push(segment);
            }
        });
        return segments;
    };
    /**
     * Parses the given server template for variable names.  For example, a server template might be
     *
     * https://{username}.gigantic-server.com:{port}/{basePath}
     *
     * In this case, this method will return [ "username", "port", "basePath" ]
     *
     * @param serverTemplate
     * @return {Array}
     */
    Oas30InvalidPropertyValueValidationRule.prototype.parseServerTemplate = function (serverTemplate) {
        if (!this.hasValue(serverTemplate)) {
            return [];
        }
        var vars = [];
        var startIdx = serverTemplate.indexOf('{');
        var endIdx = -1;
        while (startIdx != -1) {
            endIdx = serverTemplate.indexOf('}', startIdx);
            if (endIdx != -1) {
                vars.push(serverTemplate.substring(startIdx + 1, endIdx));
                startIdx = serverTemplate.indexOf('{', endIdx);
            }
            else {
                startIdx = -1;
            }
        }
        return vars;
    };
    /**
     * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
     * the type being defined is an 'array' type.
     * @param xml
     * @return {boolean}
     */
    Oas30InvalidPropertyValueValidationRule.prototype.isWrappedOK = function (xml) {
        var schema = xml.parent();
        return schema.type === "array";
    };
    /**
     * Returns true if the given media type name is multipart/* or application/x-www-form-urlencoded
     * @param {string} typeName
     * @return {boolean}
     */
    Oas30InvalidPropertyValueValidationRule.prototype.isValidMultipartType = function (typeName) {
        return typeName === "application/x-www-form-urlencoded" || typeName.indexOf("multipart") == 0;
    };
    /**
     * Returns true if the given operation is one of:  POST, PUT, OPTIONS
     * @param {Oas30Operation} operation
     * @return {boolean}
     */
    Oas30InvalidPropertyValueValidationRule.prototype.isValidRequestBodyOperation = function (operation) {
        var method = operation.method();
        return method === "put" || method === "post" || method === "options";
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitEncoding = function (node) {
        if (node.getHeaders().length > 0) {
            var mediaType = node.parent();
            this.reportIfInvalid("ENC-3-001", mediaType.name().indexOf("multipart") === 0, node, "The \"headers\" property is only allowed for \"multipart\" request body media type encodings.  Found media type \"" + mediaType.name() + "\" instead.");
        }
        if (this.hasValue(node.style)) {
            var mediaType = node.parent();
            this.reportIfInvalid("ENC-3-002", mediaType.name().indexOf("application/x-www-form-urlencoded") === 0, node, "The \"style\" property is only allowed for \"application/x-www-form-urlencoded\" request body media type encodings.  Found media type \"" + mediaType.name() + "\" instead.");
            this.reportIfInvalid("ENC-3-005", OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "The \"style\" property value must be one of: [\"form\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"]  Found value \"" + node.style + "\".");
        }
        if (this.hasValue(node.explode)) {
            var mediaType = node.parent();
            this.reportIf("ENC-3-003", mediaType.name() != "application/x-www-form-urlencoded", node, "The \"explode\" property is only allowed for \"application/x-www-form-urlencoded\" request body media type encodings.");
        }
        if (this.hasValue(node.allowReserved)) {
            var mediaType = node.parent();
            this.reportIf("ENC-3-004", mediaType.name() != "application/x-www-form-urlencoded", node, "The \"allowReserved\" property is only allowed for \"application/x-www-form-urlencoded\" request body media type encodings.");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitHeader = function (node) {
        if (this.hasValue(node.style)) {
            this.reportIfInvalid("HEAD-3-003", OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "The \"style\" property value must be \"simple\".  Found value \"" + node.style + "\".");
        }
        this.reportIfInvalid("HEAD-3-004", node.getMediaTypes().length < 2, node, "The \"content\" property must contain at most one entry.");
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitHeaderDefinition = function (node) {
        this.visitHeader(node);
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitLink = function (node) {
        if (this.hasValue(node.operationId)) {
            var opFinder = new Oas30OperationFinder(node.operationId);
            OasVisitorUtil.visitTree(node.ownerDocument(), opFinder);
            this.reportIfInvalid("LINK-3-002", opFinder.isFound(), node, "The \"operationId\" property must refer to an existing Operation.  Cannot find operation with ID \"" + node.operationId + "\".");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitLinkDefinition = function (node) {
        this.visitLink(node);
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitMediaType = function (node) {
        if (node.getEncodings().length > 0) {
            this.reportIfInvalid("MT-3-003", this.isValidMultipartType(node.name()), node, "The \"encoding\" property is only allowed for \"multipart\" and \"application/x-www-form-urlencoded\" request body media types.  Found \"" + node.name() + "\" instead.");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitOperation = function (node) {
        if (this.hasValue(node.requestBody)) {
            this.reportIfInvalid("OP-3-003", this.isValidRequestBodyOperation(node), node, "The \"requestBody\" property is only supported for POST, PUT, and OPTIONS operations.");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitResponses = function (node) {
        this.reportIfInvalid("OP-3-005", node.responses().length > 0, node.parent(), "There must be at least one Response documented.");
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitParameter = function (node) {
        if (this.hasValue(node.in)) {
            this.reportIfInvalid("PAR-3-002", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "path", "cookie"]), node, "The \"in\" property value must be one of: [\"path\", \"query\", \"header\", \"cookie\"] (Found value: '" + node.in + "')");
        }
        if (this.hasValue(node.allowEmptyValue)) {
            this.reportIfInvalid("PAR-3-007", OasValidationRuleUtil.isValidEnumItem(node.in, ["query"]), node, "The \"allowEmptyValue\" property is only allowed for \"query\" parameters.");
        }
        if (this.hasValue(node.style)) {
            this.reportIfInvalid("PAR-3-009", OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "The \"style\" property value must be one of: [\"matrix\", \"label\", \"form\", \"simple\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"] (Found value \"" + node.style + "\").");
            if (node.in === "query") {
                this.reportIfInvalid("PAR-3-011", OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "For \"query\" parameters, the \"style\" property value must be one of: [\"form\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"] (Found value \"" + node.style + "\").");
            }
            if (node.in === "cookie") {
                this.reportIfInvalid("PAR-3-012", OasValidationRuleUtil.isValidEnumItem(node.style, ["form"]), node, "For \"cookie\" parameters, the \"style\" property value must be \"form\". (Found value \"" + node.style + "\")");
            }
            if (node.in === "header") {
                this.reportIfInvalid("PAR-3-013", OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "For \"header\" parameters, the \"style\" property value must be \"simple\". (Found value \"" + node.style + "\").");
            }
        }
        if (node.in === "path") {
            var pathItem = void 0;
            if (node.parent()["_path"]) {
                pathItem = (node.parent());
            }
            else {
                pathItem = (node.parent().parent());
            }
            var path = pathItem.path();
            var pathVars = this.parsePathTemplate(path);
            this.reportIfInvalid("PAR-3-018", OasValidationRuleUtil.isValidEnumItem(node.name, pathVars), node, "The \"name\" property value for a 'path' style parameter must match one of the items in the path template.  Invalid path property name found: \"" + node.name + "\"");
            this.reportIfInvalid("PAR-3-006", node.required === true, node, "The \"required\" property is required for \"path\" parameters, and must have a value of \"true\".");
            if (this.hasValue(node.style)) {
                this.reportIfInvalid("PAR-3-010", OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "simple"]), node, "For \"path\" parameters, the \"style\" property value must be one of: [\"matrix\", \"label\", \"simple\"]  (Found value \"" + node.style + "\").");
            }
        }
        if (node.in === "header" && this.hasValue(node.name)) {
            var hname = node.name.toLowerCase();
            this.reportIf("PAR-3-019", hname === "accept" || hname === "content-type" || hname === "authorization", node, "Header parameters \"Accept\", \"Content-Type\", and \"Authorization\" are ignored.");
        }
        if (this.hasValue(node.allowReserved)) {
            this.reportIfInvalid("PAR-3-014", node.in === "query", node, "The \"allowReserved\" property is only allowed for \"query\" parameters.");
        }
        if (this.hasValue(node.content)) {
            this.reportIfInvalid("PAR-3-016", node.getMediaTypes().length < 2, node, "The \"content\" property must contain at most one entry.");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitParameterDefinition = function (node) {
        this.visitParameter(node);
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitXML = function (node) {
        if (this.hasValue(node.wrapped)) {
            this.reportIfInvalid("XML-3-002", this.isWrappedOK(node), node, "The \"wrapped\" property is only valid for 'array' types.");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitDiscriminator = function (node) {
        var schema = node.parent();
        this.reportIfInvalid("SCH-3-001", this.hasValue(schema.oneOf) || this.hasValue(schema.anyOf) || this.hasValue(schema.allOf), node, "The \"discriminator\" property is only valid when using one of: [\"oneOf\", \"anyOf\", \"allOf\"]");
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitSecurityScheme = function (node) {
        if (this.hasValue(node.type)) {
            this.reportIfInvalid("SS-3-008", OasValidationRuleUtil.isValidEnumItem(node.type, ["apiKey", "http", "oauth2", "openIdConnect"]), node, "The \"type\" property value must be one of: [\"apiKey\", \"http\", \"oauth2\", \"openIdConnect\"] (Found value: '" + node.type + "')");
        }
        if (this.hasValue(node.in)) {
            this.reportIfInvalid("SS-3-010", OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "cookie"]), node, "The \"in\" property value must be one of: [\"query\", \"header\", \"cookie\"] (Found value: '" + node.in + "')");
        }
        if (this.hasValue(node.scheme)) {
            this.reportIfInvalid("SS-3-013", OasValidationRuleUtil.isValidEnumItem(node.scheme, ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"]), node, "The \"scheme\" property value must be one of: [\"basic\", \"bearer\", \"digest\", \"hoba\", \"mutual\", \"negotiate\", \"oauth\", \"vapid\", \"scram-sha-1\", \"scram-sha-256\"] (Found value: '" + node.scheme + "')");
        }
        if (this.hasValue(node.bearerFormat)) {
            this.reportIfInvalid("SS-3-011", node.type === "http" && node.scheme === "bearer", node, "The \"bearerFormat\" property is only valid for \"http\" security schemes of type \"bearer\".");
        }
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitSecurityRequirement = function (node) {
        var _this = this;
        var snames = node.securityRequirementNames();
        snames.forEach(function (sname) {
            var scopes = node.scopes(sname);
            _this.reportIfInvalid("SREQ-3-003", _this.hasValue(scopes) && Array.isArray(scopes), node, "The value for security requirement \"" + sname + "\" must be an array.");
            // If the security requirement contains some scopes, then it must be pointing to an oauth2 or openIdConnect security scheme!
            if (_this.hasValue(scopes) && scopes.length > 0) {
                var scheme = node.ownerDocument().components.getSecurityScheme(sname);
                if (_this.hasValue(scheme)) {
                    _this.reportIfInvalid("SREQ-3-002", _this.hasValue(scheme) && (scheme.type === "oauth2" || scheme.type === "openIdConnect"), node, "The value for security requirement \"" + sname + "\" must be an empty array (required for Security Schemes of type other than \"oauth2\" and \"openIdConnect\").");
                }
            }
        });
    };
    Oas30InvalidPropertyValueValidationRule.prototype.visitServerVariable = function (node) {
        var varName = node.name();
        var server = node.parent();
        var vars = this.parseServerTemplate(server.url);
        this.reportIfInvalid("SVAR-3-003", OasValidationRuleUtil.isValidEnumItem(varName, vars), node, "The server variable \"" + varName + "\" is not found in the server url template.");
    };
    return Oas30InvalidPropertyValueValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$94 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Invalid Reference validation rule.  This rule is responsible
 * for reporting whenever a property references another node in the document
 * but that reference is missing or invalid.
 */
var Oas30InvalidReferenceValidationRule = (function (_super) {
    __extends$94(Oas30InvalidReferenceValidationRule, _super);
    function Oas30InvalidReferenceValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns true if the security requirement name is valid.  It does this by looking up a declared
     * security scheme definition in the document.  If no security scheme definition exists with the
     * given name, then it is invalid.
     * @param securityReqName
     * @param doc
     */
    // private isValidSecurityRequirementName(securityReqName: string, doc: Oas30Document): boolean {
    //     return this.hasValue(doc.components) && this.hasValue(doc.components.getSecurityScheme(securityReqName));
    // }
    Oas30InvalidReferenceValidationRule.prototype.visitCallback = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("CALL-3-001", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Callback.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitCallbackDefinition = function (node) { this.visitCallback(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitExample = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("EX-3-003", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Example.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitExampleDefinition = function (node) { this.visitExample(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitHeader = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("HEAD-3-005", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Header.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitHeaderDefinition = function (node) { this.visitHeader(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitLink = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("LINK-3-005", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Link.");
        }
        if (this.hasValue(node.operationRef)) {
            this.reportIfInvalid("LINK-3-003", OasValidationRuleUtil.canResolveRef(node.operationRef, node), node, "The \"operationRef\" property value \"" + node.$ref + "\" must reference a valid Link.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitLinkDefinition = function (node) { this.visitLink(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitParameter = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("PAR-3-017", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Parameter.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitParameterDefinition = function (node) { this.visitParameter(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitRequestBody = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RB-3-003", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Request Body.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitRequestBodyDefinition = function (node) { this.visitRequestBody(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitResponseBase = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("RES-3-004", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Response.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitResponse = function (node) { this.visitResponseBase(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitResponseDefinition = function (node) { this.visitResponseBase(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitSecurityScheme = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SS-3-012", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Security Scheme.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitSchema = function (node) {
        if (this.hasValue(node.$ref)) {
            this.reportIfInvalid("SCH-3-002", OasValidationRuleUtil.canResolveRef(node.$ref, node), node, "The \"$ref\" property value \"" + node.$ref + "\" must reference a valid Schema.");
        }
    };
    Oas30InvalidReferenceValidationRule.prototype.visitAllOfSchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitAnyOfSchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitOneOfSchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitNotSchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitPropertySchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitItemsSchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitAdditionalPropertiesSchema = function (node) { this.visitSchema(node); };
    Oas30InvalidReferenceValidationRule.prototype.visitSchemaDefinition = function (node) { this.visitSchema(node); };
    return Oas30InvalidReferenceValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$95 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Mutually Exclusive validation rule.  This rule is responsible
 * for reporting whenever properties are used together when that is not allowed.
 * In various places in the specification, some properties are mutually exclusive
 * with each other.
 */
var Oas30MutuallyExclusiveValidationRule = (function (_super) {
    __extends$95(Oas30MutuallyExclusiveValidationRule, _super);
    function Oas30MutuallyExclusiveValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Oas30MutuallyExclusiveValidationRule.prototype.hasContent = function (contentParent) {
        return contentParent.getMediaTypes().length > 0;
    };
    Oas30MutuallyExclusiveValidationRule.prototype.visitExample = function (node) {
        this.reportIf("EX-3-002", this.hasValue(node.value) && this.hasValue(node.externalValue), node, "The \"value\" and \"externalValue\" properties are mutually exclusive.");
    };
    Oas30MutuallyExclusiveValidationRule.prototype.visitExampleDefinition = function (node) { this.visitExample(node); };
    Oas30MutuallyExclusiveValidationRule.prototype.visitHeader = function (node) {
        // TODO implement this rule once 'content' is added to header
        // this.reportIf("HEAD-3-006", this.hasValue(node.schema) && this.hasContent(node), node,
        //     `The "schema" and "content" properties are mutually exclusive.`);
        this.reportIf("HEAD-3-007", this.hasValue(node.example) && this.hasValue(node.examples), node, "The \"example\" and \"examples\" properties are mutually exclusive.");
    };
    Oas30MutuallyExclusiveValidationRule.prototype.visitHeaderDefinition = function (node) { this.visitHeader(node); };
    Oas30MutuallyExclusiveValidationRule.prototype.visitLink = function (node) {
        this.reportIf("LINK-3-001", this.hasValue(node.operationRef) && this.hasValue(node.operationId), node, "The \"operationRef\" and \"operationId\" properties are mutually exclusive.");
    };
    Oas30MutuallyExclusiveValidationRule.prototype.visitLinkDefinition = function (node) { this.visitLink(node); };
    Oas30MutuallyExclusiveValidationRule.prototype.visitMediaType = function (node) {
        this.reportIf("MT-3-001", this.hasValue(node.example) && this.hasValue(node.examples), node, "The \"example\" and \"examples\" properties are mutually exclusive.");
    };
    Oas30MutuallyExclusiveValidationRule.prototype.visitParameterBase = function (node) {
        this.reportIf("PAR-3-008", this.hasValue(node.schema) && this.hasContent(node), node, "The \"schema\" and \"content\" properties are mutually exclusive.");
        this.reportIf("PAR-3-015", this.hasValue(node.example) && this.hasValue(node.examples), node, "The \"example\" and \"examples\" properties are mutually exclusive.");
    };
    Oas30MutuallyExclusiveValidationRule.prototype.visitParameter = function (node) { this.visitParameterBase(node); };
    Oas30MutuallyExclusiveValidationRule.prototype.visitParameterDefinition = function (node) { this.visitParameterBase(node); };
    return Oas30MutuallyExclusiveValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$96 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the required property validation rule.  Various model properties are either
 * required or conditionally required.  For example, the "swagger" property MUST exist
 * on the root (document) node.  This rule checks for all required and conditionally
 * required properties on all model types.
 */
var Oas30RequiredPropertyValidationRule = (function (_super) {
    __extends$96(Oas30RequiredPropertyValidationRule, _super);
    function Oas30RequiredPropertyValidationRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Called when a required property is missing.
     * @param code
     * @param node
     * @param propertyName
     */
    Oas30RequiredPropertyValidationRule.prototype.requireProperty = function (code, node, propertyName) {
        // No properties are required if we're dealing with a $ref
        if (this.hasValue(node["$ref"])) {
            return;
        }
        var propertyValue = node[propertyName];
        if (!this.isDefined(propertyValue)) {
            this.report(code, node, "Property \"" + propertyName + "\" is required.");
        }
    };
    /**
     * Called when a conditionally required property is missing.
     * @param node
     * @param propertyName
     * @param dependentProperty
     * @param dependentValue
     */
    Oas30RequiredPropertyValidationRule.prototype.requirePropertyWhen = function (code, node, propertyName, dependentProperty, dependentValue) {
        var actualDependentValue = node[dependentProperty];
        var dependentValueMatches = actualDependentValue == dependentValue;
        if (dependentValueMatches) {
            var propertyValue = node[propertyName];
            if (!this.hasValue(propertyValue)) {
                this.report(code, node, "Property \"" + propertyName + "\" is required when \"" + dependentProperty + "\" property is \"" + dependentValue + "\".");
            }
        }
    };
    Oas30RequiredPropertyValidationRule.prototype.visitDiscriminator = function (node) {
        this.requireProperty("DISC-3-001", node, "propertyName");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitExternalDocumentation = function (node) {
        this.requireProperty("ED-3-002", node, "url");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitOAuthFlow = function (node) {
        this.requireProperty("FLOW-3-006", node, "scopes");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitImplicitOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-001", node, "authorizationUrl");
        this.requireProperty("FLOW-3-002", node, "tokenUrl");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitPasswordOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
    };
    Oas30RequiredPropertyValidationRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-002", node, "tokenUrl");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
        this.visitOAuthFlow(node);
        this.requireProperty("FLOW-3-001", node, "authorizationUrl");
        this.requireProperty("FLOW-3-002", node, "tokenUrl");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitInfo = function (node) {
        this.requireProperty("INF-3-001", node, "title");
        this.requireProperty("INF-3-002", node, "version");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitLicense = function (node) {
        this.requireProperty("LIC-3-001", node, "name");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitOperation = function (node) {
        this.requireProperty("OP-3-004", node, "responses");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitParameter = function (node) {
        this.requireProperty("PAR-3-003", node, "name");
        this.requireProperty("PAR-3-004", node, "in");
        // TODO the 'required' property is required for 'path' params
    };
    Oas30RequiredPropertyValidationRule.prototype.visitParameterDefinition = function (node) {
        this.visitParameter(node);
    };
    Oas30RequiredPropertyValidationRule.prototype.visitDocument = function (node) {
        this.requireProperty("R-3-001", node, "openapi");
        this.requireProperty("R-3-002", node, "info");
        this.requireProperty("R-3-003", node, "paths");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitRequestBody = function (node) {
        this.requireProperty("RB-3-002", node, "content");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitRequestBodyDefinition = function (node) {
        this.visitRequestBody(node);
    };
    Oas30RequiredPropertyValidationRule.prototype.visitServer = function (node) {
        this.requireProperty("SRV-3-001", node, "url");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitSecurityScheme = function (node) {
        this.requireProperty("SS-3-001", node, "type");
        this.requirePropertyWhen("SS-3-002", node, "name", "type", "apiKey");
        this.requirePropertyWhen("SS-3-003", node, "in", "type", "apiKey");
        this.requirePropertyWhen("SS-3-004", node, "scheme", "type", "http");
        this.requirePropertyWhen("SS-3-005", node, "flows", "type", "oauth2");
        this.requirePropertyWhen("SS-3-006", node, "openIdConnectUrl", "type", "openIdConnect");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitServerVariable = function (node) {
        this.requireProperty("SVAR-3-001", node, "default");
    };
    Oas30RequiredPropertyValidationRule.prototype.visitTag = function (node) {
        this.requireProperty("TAG-3-001", node, "name");
    };
    return Oas30RequiredPropertyValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$97 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Implements the Uniqueness validation rule.  This rule is responsible
 * for reporting whenever properties whose values are required to be unique,
 * fail that test.  Examples are scopes, tags, and operationId.
 */
var Oas30UniquenessValidationRule = (function (_super) {
    __extends$97(Oas30UniquenessValidationRule, _super);
    function Oas30UniquenessValidationRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.indexedOperations = {};
        return _this;
    }
    Oas30UniquenessValidationRule.prototype.visitTag = function (node) {
        var tags = node.ownerDocument().tags;
        var tcount = tags.filter(function (tag) {
            return tag.name === node.name;
        }).length;
        this.reportIfInvalid("TAG-3-003", tcount === 1, node, "Duplicate tag \"" + node.name + "\" found (every tag must have a unique name).");
    };
    Oas30UniquenessValidationRule.prototype.visitOperation = function (node) {
        if (this.hasValue(node.operationId)) {
            var dupes = this.indexedOperations[node.operationId];
            if (this.hasValue(dupes)) {
                this.reportIfInvalid("OP-3-002", dupes.length > 1, dupes[0], "The \"operationId\" property value '" + node.operationId + "' must be unique across ALL operations.");
                this.report("OP-3-002", node, "The \"operationId\" property value '" + node.operationId + "' must be unique across ALL operations.");
                dupes.push(node);
            }
            else {
                this.indexedOperations[node.operationId] = [node];
            }
        }
    };
    Oas30UniquenessValidationRule.prototype.visitParameter = function (node) {
        var params = node.parent().parameters;
        this.reportIfInvalid("PAR-3-001", params.filter(function (param) {
            return param.in === node.in && param.name === node.name;
        }).length === 1, node, "Duplicate '" + node.in + "' parameter named '" + node.name + "' found (parameters must be unique by name and location).");
    };
    return Oas30UniquenessValidationRule;
}(Oas30ValidationRule));

/**
 * @license
 * Copyright 2017 Red Hat
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
var __extends$78 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Visitor used to validate a OpenAPI document (or a subsection of the document).  The result
 * of the validation will be a list of validation errors.  In addition, the validator will
 * add the validation errors directly to the offending model nodes as attributes.
 */
var Oas20ValidationVisitor = (function (_super) {
    __extends$78(Oas20ValidationVisitor, _super);
    function Oas20ValidationVisitor() {
        var _this = _super.call(this) || this;
        _this.errors = [];
        // Add a bunch of validation rules to the array of visitors.
        _this.addVisitors([
            new Oas20RequiredPropertyValidationRule(_this),
            new Oas20InvalidPropertyFormatValidationRule(_this),
            new Oas20InvalidPropertyNameValidationRule(_this),
            new Oas20InvalidPropertyValueValidationRule(_this),
            new Oas20UniquenessValidationRule(_this),
            new Oas20MutuallyExclusiveValidationRule(_this),
            new Oas20InvalidReferenceValidationRule(_this)
        ]);
        return _this;
    }
    /**
     * Returns the array of validation errors found by the visitor.
     * @return {OasValidationError[]}
     */
    Oas20ValidationVisitor.prototype.getValidationErrors = function () {
        return this.errors;
    };
    /**
     * Called by validation rules when an error is detected.
     * @param code
     * @param node
     * @param message
     */
    Oas20ValidationVisitor.prototype.report = function (code, node, message) {
        var viz = new Oas20NodePathVisitor();
        OasVisitorUtil.visitTree(node, viz, exports.OasTraverserDirection.up);
        var path = viz.path();
        var error = new OasValidationError(code, path, message);
        // Include the error in the list of errors found by this visitor.
        this.errors.push(error);
        // Also make sure to add the error to the list of validation errors on the node model itself.
        var errors = node.n_attribute("validation-errors");
        if (errors === undefined || errors === null) {
            errors = [];
            node.n_attribute("validation-errors", errors);
        }
        errors.push(error);
    };
    /**
     * Clears any previous validation errors from the node and re-validates.
     * @param node
     */
    Oas20ValidationVisitor.prototype._acceptAll = function (node) {
        node.n_attribute("validation-errors", null);
        _super.prototype._acceptAll.call(this, node);
    };
    return Oas20ValidationVisitor;
}(Oas20CompositeVisitor));
/**
 * Visitor used to validate a OpenAPI document (or a subsection of the document).  The result
 * of the validation will be a list of validation errors.  In addition, the validator will
 * add the validation errors directly to the offending model nodes as attributes.
 */
var Oas30ValidationVisitor = (function (_super) {
    __extends$78(Oas30ValidationVisitor, _super);
    function Oas30ValidationVisitor() {
        var _this = _super.call(this) || this;
        _this.errors = [];
        // Add a bunch of validation rules to the array of visitors.
        _this.addVisitors([
            new Oas30InvalidPropertyFormatValidationRule(_this),
            new Oas30IgnoredPropertyNameValidationRule(_this),
            new Oas30InvalidPropertyNameValidationRule(_this),
            new Oas30InvalidPropertyValueValidationRule(_this),
            new Oas30InvalidReferenceValidationRule(_this),
            new Oas30MutuallyExclusiveValidationRule(_this),
            new Oas30RequiredPropertyValidationRule(_this),
            new Oas30UniquenessValidationRule(_this)
        ]);
        return _this;
    }
    /**
     * Returns the array of validation errors found by the visitor.
     * @return {OasValidationError[]}
     */
    Oas30ValidationVisitor.prototype.getValidationErrors = function () {
        return this.errors;
    };
    /**
     * Called by validation rules when an error is detected.
     * @param code
     * @param node
     * @param message
     */
    Oas30ValidationVisitor.prototype.report = function (code, node, message) {
        var viz = new Oas30NodePathVisitor();
        OasVisitorUtil.visitTree(node, viz, exports.OasTraverserDirection.up);
        var path = viz.path();
        var error = new OasValidationError(code, path, message);
        // Include the error in the list of errors found by this visitor.
        this.errors.push(error);
        // Also make sure to add the error to the list of validation errors on the node model itself.
        var errors = node.n_attribute("validation-errors");
        if (errors === undefined || errors === null) {
            errors = [];
            node.n_attribute("validation-errors", errors);
        }
        errors.push(error);
    };
    /**
     * Clears any previous validation errors from the node and re-validates.
     * @param node
     */
    Oas30ValidationVisitor.prototype._acceptAll = function (node) {
        node.n_attribute("validation-errors", null);
        _super.prototype._acceptAll.call(this, node);
    };
    return Oas30ValidationVisitor;
}(Oas30CompositeVisitor));

/**
 * @license
 * Copyright 2017 Red Hat
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
/**
 * Represents the global OAS library entry point.  This is used, for example, when
 * using the library in a simple browser environment.  This object exposes the functions
 * and classes
 */
var OasLibraryUtils = (function () {
    function OasLibraryUtils() {
    }
    /**
     * Creates a document from a source.  The source parameter can be any of the following:
     *
     * -- string: if the string starts with a { then the source is assumed to be a properly
     *            formatted OpenAPI document as a JSON string
     * -- string: if the string is a valid OpenAPI version number (e.g. "2.0") then a new
     *            empty document instance will be returned (of the appropriate version)
     * -- object: an already-parsed OpenAPI document as a javascript object
     *
     * @param source
     */
    OasLibraryUtils.prototype.createDocument = function (source) {
        var factory = new OasDocumentFactory();
        if (typeof source === "object") {
            return factory.createFromObject(source);
        }
        if (typeof source === "string") {
            if (source.indexOf("{") === 0) {
                return factory.createFromJson(source);
            }
            else {
                return factory.createEmpty(source);
            }
        }
        throw new Error("Invalid input (must be either a string or object).");
    };
    /**
     * Reads a partial model from the given source.  The caller must specify what type of
     * node is represented by the source (it is impossible to determine that automatically).
     * The source may either be a JSON string or an object.
     * @param source
     * @param node
     */
    OasLibraryUtils.prototype.readNode = function (source, node) {
        if (node === null || typeof node === "undefined") {
            throw new Error("A valid OAS node must be provided.");
        }
        if (typeof source === "string") {
            source = JSON.parse(source);
        }
        if (node.ownerDocument().is2xDocument()) {
            var reader = new Oas20JS2ModelReader();
            var dispatcher = new Oas20JS2ModelReaderVisitor(reader, source);
            node.accept(dispatcher);
            return node;
        }
        else if (node.ownerDocument().is3xDocument()) {
            var reader = new Oas30JS2ModelReader();
            var dispatcher = new Oas30JS2ModelReaderVisitor(reader, source);
            node.accept(dispatcher);
            return node;
        }
        else {
            throw new Error("Unsupported OAS version: " + node.ownerDocument().getSpecVersion());
        }
    };
    /**
     * Converts the given OAS model into a standard JS object.  Any OAS node can be
     * passed here.
     * @param node
     */
    OasLibraryUtils.prototype.writeNode = function (node) {
        if (node.ownerDocument().is2xDocument()) {
            var visitor = new Oas20ModelToJSVisitor();
            OasVisitorUtil.visitTree(node, visitor);
            return visitor.getResult();
        }
        else if (node.ownerDocument().is3xDocument()) {
            var visitor = new Oas30ModelToJSVisitor();
            OasVisitorUtil.visitTree(node, visitor);
            return visitor.getResult();
        }
        else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    };
    /**
     * Validates the given OAS model.
     * @param node
     * @param recursive
     * @return {any}
     */
    OasLibraryUtils.prototype.validate = function (node, recursive) {
        if (recursive === void 0) { recursive = true; }
        if (node.ownerDocument().is2xDocument()) {
            var visitor = new Oas20ValidationVisitor();
            if (recursive) {
                OasVisitorUtil.visitTree(node, visitor);
            }
            else {
                node.accept(visitor);
            }
            return visitor.getValidationErrors();
        }
        else if (node.ownerDocument().is3xDocument()) {
            var visitor = new Oas30ValidationVisitor();
            if (recursive) {
                OasVisitorUtil.visitTree(node, visitor);
            }
            else {
                node.accept(visitor);
            }
            return visitor.getValidationErrors();
        }
        else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    };
    /**
     * Creates a node path for a given data model node.
     * @param node
     * @return {OasNodePath}
     */
    OasLibraryUtils.prototype.createNodePath = function (node) {
        if (node.ownerDocument().is2xDocument()) {
            var viz = new Oas20NodePathVisitor();
            OasVisitorUtil.visitTree(node, viz, exports.OasTraverserDirection.up);
            return viz.path();
        }
        else if (node.ownerDocument().is3xDocument()) {
            var viz = new Oas30NodePathVisitor();
            OasVisitorUtil.visitTree(node, viz, exports.OasTraverserDirection.up);
            return viz.path();
        }
        else {
            throw new Error("OAS version " + node.ownerDocument().getSpecVersion() + " not supported.");
        }
    };
    return OasLibraryUtils;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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
var OasSchemaFactory = (function () {
    function OasSchemaFactory() {
    }
    /**
     * Creates a new definition schema from a given example.  This method will analyze the example
     * object and create a new schema object that represents the example.  Note that this method
     * does not support arbitrarily complicated examples, and should be used as a starting point
     * for a schema, not a canonical one.
     * @param document
     * @param name
     * @param example
     * @return {Oas20SchemaDefinition}
     */
    OasSchemaFactory.prototype.createSchemaDefinitionFromExample = function (document, name, example) {
        var resolveType = function (thing, schema) {
            if (typeof thing === "number") {
                if (Math.round(thing) === thing) {
                    schema.type = "integer";
                    if (thing >= -2147483647 && thing <= 2147483647) {
                        schema.format = "int32";
                    }
                    else if (thing >= -9223372036854775807 && thing <= 9223372036854775807) {
                        schema.format = "int64";
                    }
                }
                else {
                    schema.type = "number";
                    schema.format = "double";
                }
            }
            else if (typeof thing === "boolean") {
                schema.type = "boolean";
            }
            else if (Array.isArray(thing)) {
                schema.type = "array";
            }
            else if (typeof thing === "object") {
                schema.type = "object";
            }
            else {
                schema.type = "string";
                if (thing.match(/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/)) {
                    schema.format = "date";
                }
                else if (thing.match(/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])(\D?([01]\d|2[0-3])\D?([0-5]\d)\D?([0-5]\d)?\D?(\d{3})?([zZ]|([\+-])([01]\d|2[0-3])\D?([0-5]\d)?)?)?$/)) {
                    schema.format = "date-time";
                }
            }
        };
        var resolveAll = function (object, schema) {
            resolveType(object, schema);
            if (schema.type === "array") {
                schema.items = schema.createItemsSchema();
                if (example.length > 0) {
                    resolveAll(example[0], schema.items);
                }
            }
            else if (schema.type === "object") {
                schema.type = "object";
                for (var propName in object) {
                    var pschema = schema.createPropertySchema(propName);
                    schema.addProperty(propName, pschema);
                    var propValue = object[propName];
                    resolveAll(propValue, pschema);
                }
            }
        };
        if (document.is2xDocument()) {
            var doc = document;
            var definitions = doc.definitions;
            if (!definitions) {
                definitions = doc.createDefinitions();
            }
            // Parse to object if it's not already an object.
            if (typeof example === "string") {
                example = JSON.parse(example);
            }
            var schema = definitions.createSchemaDefinition(name);
            schema.title = "Root Type for " + name;
            schema.description = "The root of the " + name + " type's schema.";
            resolveAll(example, schema);
            return schema;
        }
        else if (document.is3xDocument()) {
            var doc = document;
            var components = doc.components;
            if (!components) {
                components = doc.createComponents();
            }
            // Parse to object if it's not already an object.
            if (typeof example === "string") {
                example = JSON.parse(example);
            }
            var schema = components.createSchemaDefinition(name);
            schema.title = "Root Type for " + name;
            schema.description = "The root of the " + name + " type's schema.";
            resolveAll(example, schema);
            return schema;
        }
    };
    return OasSchemaFactory;
}());

/**
 * @license
 * Copyright 2017 Red Hat
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

/**
 * @license
 * Copyright 2016 JBoss Inc
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
/**
 * @module
 */

exports.OasDocument = OasDocument;
exports.OasExtensibleNode = OasExtensibleNode;
exports.OasExtension = OasExtension;
exports.OasNode = OasNode;
exports.OasNodeAttributes = OasNodeAttributes;
exports.OasNodePath = OasNodePath;
exports.OasNodePathSegment = OasNodePathSegment;
exports.OasContact = OasContact;
exports.OasExternalDocumentation = OasExternalDocumentation;
exports.OasHeader = OasHeader;
exports.OasInfo = OasInfo;
exports.OasLicense = OasLicense;
exports.OasOperation = OasOperation;
exports.OasParameterBase = OasParameterBase;
exports.OasPathItem = OasPathItem;
exports.OasPaths = OasPaths;
exports.OasPathItems = OasPathItems;
exports.OasResponse = OasResponse;
exports.OasResponses = OasResponses;
exports.OasResponseItems = OasResponseItems;
exports.OasSchema = OasSchema;
exports.OasSchemaProperties = OasSchemaProperties;
exports.OasSecurityRequirement = OasSecurityRequirement;
exports.OasSecurityRequirementItems = OasSecurityRequirementItems;
exports.OasSecurityScheme = OasSecurityScheme;
exports.OasTag = OasTag;
exports.OasXML = OasXML;
exports.Oas20Contact = Oas20Contact;
exports.Oas20Definitions = Oas20Definitions;
exports.Oas20DefinitionItems = Oas20DefinitionItems;
exports.Oas20Document = Oas20Document;
exports.Oas20Example = Oas20Example;
exports.Oas20ExampleItems = Oas20ExampleItems;
exports.Oas20ExternalDocumentation = Oas20ExternalDocumentation;
exports.Oas20Header = Oas20Header;
exports.Oas20Headers = Oas20Headers;
exports.OasHeaderItems = OasHeaderItems;
exports.Oas20Info = Oas20Info;
exports.Oas20Items = Oas20Items;
exports.Oas20License = Oas20License;
exports.Oas20Operation = Oas20Operation;
exports.Oas20ParameterBase = Oas20ParameterBase;
exports.Oas20ParameterDefinition = Oas20ParameterDefinition;
exports.Oas20Parameter = Oas20Parameter;
exports.Oas20ParametersDefinitions = Oas20ParametersDefinitions;
exports.Oas20ParametersDefinitionsItems = Oas20ParametersDefinitionsItems;
exports.Oas20PathItem = Oas20PathItem;
exports.Oas20Paths = Oas20Paths;
exports.Oas20ResponseBase = Oas20ResponseBase;
exports.Oas20Response = Oas20Response;
exports.Oas20ResponseDefinition = Oas20ResponseDefinition;
exports.Oas20Responses = Oas20Responses;
exports.Oas20ResponsesDefinitions = Oas20ResponsesDefinitions;
exports.Oas20ResponsesDefinitionsItems = Oas20ResponsesDefinitionsItems;
exports.Oas20Schema = Oas20Schema;
exports.Oas20PropertySchema = Oas20PropertySchema;
exports.Oas20AllOfSchema = Oas20AllOfSchema;
exports.Oas20ItemsSchema = Oas20ItemsSchema;
exports.Oas20AdditionalPropertiesSchema = Oas20AdditionalPropertiesSchema;
exports.Oas20SchemaDefinition = Oas20SchemaDefinition;
exports.Oas20Scopes = Oas20Scopes;
exports.Oas20ScopeItems = Oas20ScopeItems;
exports.Oas20SecurityDefinitions = Oas20SecurityDefinitions;
exports.Oas20SecuritySchemeItems = Oas20SecuritySchemeItems;
exports.Oas20SecurityRequirement = Oas20SecurityRequirement;
exports.Oas20SecurityScheme = Oas20SecurityScheme;
exports.Oas20Tag = Oas20Tag;
exports.Oas20XML = Oas20XML;
exports.Oas30Callback = Oas30Callback;
exports.Oas30CallbackDefinition = Oas30CallbackDefinition;
exports.Oas30Components = Oas30Components;
exports.Oas30SchemaComponents = Oas30SchemaComponents;
exports.Oas30ResponseComponents = Oas30ResponseComponents;
exports.Oas30ParameterComponents = Oas30ParameterComponents;
exports.Oas30ExampleComponents = Oas30ExampleComponents;
exports.Oas30RequestBodyComponents = Oas30RequestBodyComponents;
exports.Oas30HeaderComponents = Oas30HeaderComponents;
exports.Oas30SecuritySchemeComponents = Oas30SecuritySchemeComponents;
exports.Oas30LinkComponents = Oas30LinkComponents;
exports.Oas30CallbackComponents = Oas30CallbackComponents;
exports.Oas30Contact = Oas30Contact;
exports.Oas30Discriminator = Oas30Discriminator;
exports.Oas30Document = Oas30Document;
exports.Oas30Encoding = Oas30Encoding;
exports.Oas30EncodingHeaders = Oas30EncodingHeaders;
exports.Oas30ExampleItems = Oas30ExampleItems;
exports.Oas30Example = Oas30Example;
exports.Oas30ExampleDefinition = Oas30ExampleDefinition;
exports.Oas30ExternalDocumentation = Oas30ExternalDocumentation;
exports.Oas30Header = Oas30Header;
exports.Oas30HeaderDefinition = Oas30HeaderDefinition;
exports.Oas30Info = Oas30Info;
exports.Oas30License = Oas30License;
exports.Oas30Link = Oas30Link;
exports.Oas30LinkDefinition = Oas30LinkDefinition;
exports.Oas30LinkParameters = Oas30LinkParameters;
exports.Oas30LinkParameterExpression = Oas30LinkParameterExpression;
exports.Oas30LinkRequestBodyExpression = Oas30LinkRequestBodyExpression;
exports.Oas30MediaType = Oas30MediaType;
exports.Oas30EncodingItems = Oas30EncodingItems;
exports.Oas30OAuthFlow = Oas30OAuthFlow;
exports.Oas30ImplicitOAuthFlow = Oas30ImplicitOAuthFlow;
exports.Oas30PasswordOAuthFlow = Oas30PasswordOAuthFlow;
exports.Oas30ClientCredentialsOAuthFlow = Oas30ClientCredentialsOAuthFlow;
exports.Oas30AuthorizationCodeOAuthFlow = Oas30AuthorizationCodeOAuthFlow;
exports.Oas30OAuthFlows = Oas30OAuthFlows;
exports.Oas30Operation = Oas30Operation;
exports.Oas30Callbacks = Oas30Callbacks;
exports.Oas30ParameterBase = Oas30ParameterBase;
exports.Oas30ParameterDefinition = Oas30ParameterDefinition;
exports.Oas30Parameter = Oas30Parameter;
exports.Oas30ParameterContent = Oas30ParameterContent;
exports.Oas30PathItem = Oas30PathItem;
exports.Oas30CallbackPathItem = Oas30CallbackPathItem;
exports.Oas30Paths = Oas30Paths;
exports.Oas30RequestBody = Oas30RequestBody;
exports.Oas30RequestBodyDefinition = Oas30RequestBodyDefinition;
exports.Oas30RequestBodyContent = Oas30RequestBodyContent;
exports.Oas30ResponseBase = Oas30ResponseBase;
exports.Oas30Response = Oas30Response;
exports.Oas30ResponseDefinition = Oas30ResponseDefinition;
exports.Oas30ResponseHeaders = Oas30ResponseHeaders;
exports.Oas30ResponseContent = Oas30ResponseContent;
exports.Oas30Links = Oas30Links;
exports.Oas30Responses = Oas30Responses;
exports.Oas30Schema = Oas30Schema;
exports.Oas30PropertySchema = Oas30PropertySchema;
exports.Oas30AllOfSchema = Oas30AllOfSchema;
exports.Oas30AnyOfSchema = Oas30AnyOfSchema;
exports.Oas30OneOfSchema = Oas30OneOfSchema;
exports.Oas30NotSchema = Oas30NotSchema;
exports.Oas30ItemsSchema = Oas30ItemsSchema;
exports.Oas30AdditionalPropertiesSchema = Oas30AdditionalPropertiesSchema;
exports.Oas30SchemaDefinition = Oas30SchemaDefinition;
exports.Oas30SecurityRequirement = Oas30SecurityRequirement;
exports.Oas30SecurityScheme = Oas30SecurityScheme;
exports.Oas30Server = Oas30Server;
exports.Oas30LinkServer = Oas30LinkServer;
exports.Oas30ServerVariables = Oas30ServerVariables;
exports.Oas30ServerVariable = Oas30ServerVariable;
exports.Oas30Tag = Oas30Tag;
exports.Oas30XML = Oas30XML;
exports.OasLibraryUtils = OasLibraryUtils;
exports.OasNodeVisitorAdapter = OasNodeVisitorAdapter;
exports.Oas20NodeVisitorAdapter = Oas20NodeVisitorAdapter;
exports.Oas30NodeVisitorAdapter = Oas30NodeVisitorAdapter;
exports.OasCompositeVisitor = OasCompositeVisitor;
exports.Oas20CompositeVisitor = Oas20CompositeVisitor;
exports.Oas30CompositeVisitor = Oas30CompositeVisitor;
exports.OasCombinedVisitorAdapter = OasCombinedVisitorAdapter;
exports.OasAllNodeVisitor = OasAllNodeVisitor;
exports.OasVisitorUtil = OasVisitorUtil;
exports.OasTraverser = OasTraverser;
exports.Oas20Traverser = Oas20Traverser;
exports.Oas30Traverser = Oas30Traverser;
exports.OasReverseTraverser = OasReverseTraverser;
exports.Oas20ReverseTraverser = Oas20ReverseTraverser;
exports.Oas30ReverseTraverser = Oas30ReverseTraverser;
exports.OasValidationError = OasValidationError;
exports.OasValidationErrorAttributes = OasValidationErrorAttributes;
exports.OasValidationRuleUtil = OasValidationRuleUtil;
exports.Oas20ValidationVisitor = Oas20ValidationVisitor;
exports.Oas30ValidationVisitor = Oas30ValidationVisitor;
exports.OasSchemaFactory = OasSchemaFactory;

Object.defineProperty(exports, '__esModule', { value: true });

})));
