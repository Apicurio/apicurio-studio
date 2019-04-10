(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.OAI = {}));
}(this, function (exports) { 'use strict';

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
    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __modelIdCounter = 0;
    /**
     * Base class for all OAS nodes.  Contains common fields and methods across all
     * nodes of all versions of the OpenAPI Specification.
     */
    var OasNode = /** @class */ (function () {
        function OasNode() {
            this._modelId = __modelIdCounter++;
            this._attributes = new OasNodeAttributes();
            this._extraProperties = {};
            this._validationProblems = {}; // Really a map of string(errorCode)->OasValidationProblem
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
        OasNode.prototype.validationProblems = function () {
            var problems = [];
            for (var code in this._validationProblems) {
                problems.push(this._validationProblems[code]);
            }
            return problems;
        };
        OasNode.prototype.validationProblemsFor = function (propertyName) {
            var problems = [];
            for (var code in this._validationProblems) {
                var problem = this._validationProblems[code];
                if (propertyName === problem.property) {
                    problems.push(problem);
                }
            }
            return problems;
        };
        OasNode.prototype.validationProblemCodes = function () {
            var codes = [];
            for (var code in this._validationProblems) {
                codes.push(code);
            }
            return codes;
        };
        OasNode.prototype.validationProblem = function (code) {
            return this._validationProblems[code];
        };
        OasNode.prototype.addValidationProblem = function (errorCode, nodePath, property, message, severity) {
            var problem = new OasValidationProblem(errorCode, nodePath, property, message, severity);
            problem._ownerDocument = this._ownerDocument;
            problem._parent = this;
            this._validationProblems[errorCode] = problem;
            return problem;
        };
        OasNode.prototype.clearValidationProblems = function () {
            this._validationProblems = {};
        };
        OasNode.prototype.addExtraProperty = function (name, value) {
            this._extraProperties[name] = value;
        };
        OasNode.prototype.removeExtraProperty = function (name) {
            if (this._extraProperties.hasOwnProperty(name)) {
                var rval = this._extraProperties[name];
                delete this._extraProperties[name];
                return rval;
            }
            return undefined;
        };
        OasNode.prototype.hasExtraProperties = function () {
            return Object.keys(this._extraProperties).length > 0;
        };
        OasNode.prototype.getExtraPropertyNames = function () {
            return Object.keys(this._extraProperties);
        };
        OasNode.prototype.getExtraProperty = function (name) {
            return this._extraProperties[name];
        };
        return OasNode;
    }());
    /**
     * Represents a single validation ERROR.
     */
    var OasValidationProblem = /** @class */ (function (_super) {
        __extends(OasValidationProblem, _super);
        /**
         * Constructor.
         * @param errorCode
         * @param nodePath
         * @param property
         * @param message
         * @param severity
         */
        function OasValidationProblem(errorCode, nodePath, property, message, severity) {
            var _this = _super.call(this) || this;
            _this.errorCode = errorCode;
            _this.nodePath = nodePath;
            _this.property = property;
            _this.message = message;
            _this.severity = severity;
            return _this;
        }
        OasValidationProblem.prototype.accept = function (visitor) {
            visitor.visitValidationProblem(this);
        };
        return OasValidationProblem;
    }(OasNode));
    var OasNodeAttributes = /** @class */ (function () {
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
    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an extension node in an OAS document.  For example, in OAS version 2, any
     * property that begins with "x-" is a valid extension node (vendor extension).
     */
    var OasExtension = /** @class */ (function (_super) {
        __extends$1(OasExtension, _super);
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
    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Base class for all extensible OAS nodes.  Most nodes allow extension properties that
     * being with x-* (OAS 2.0).
     */
    var OasExtensibleNode = /** @class */ (function (_super) {
        __extends$2(OasExtensibleNode, _super);
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
         * Gets a single extension by name or null if not found.
         * @param name
         */
        OasExtensibleNode.prototype.extension = function (name) {
            var rval = null;
            if (this._extensions) {
                this._extensions.forEach(function (extension) {
                    if (extension.name === name) {
                        rval = extension;
                    }
                });
            }
            return rval;
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
        /**
         * Removes an extension by name.
         * @param name
         */
        OasExtensibleNode.prototype.removeExtension = function (name) {
            var rval = null;
            if (this._extensions) {
                var idx_1 = -1;
                this._extensions.forEach(function (extension, index) {
                    if (extension.name === name) {
                        rval = extension;
                        idx_1 = index;
                    }
                });
                if (idx_1 !== -1) {
                    this._extensions.splice(idx_1, 1);
                }
            }
            return rval;
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
    var __extends$3 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Base class for all OAS documents.  A version-specific implementation of this class
     * is expected for each version of the specification supported by the library.
     */
    var OasDocument = /** @class */ (function (_super) {
        __extends$3(OasDocument, _super);
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
         * Adds a security requirement child.
         * @param securityRequirement
         */
        OasDocument.prototype.addSecurityRequirement = function (securityRequirement) {
            if (this.security == null) {
                this.security = [];
            }
            this.security.push(securityRequirement);
            return securityRequirement;
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
    var OasNodePath = /** @class */ (function () {
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
         * @param document the document to resolve the path relative to
         * @param visitor an optional visitor to invoke for each node in the path
         * @return {OasNode}
         */
        OasNodePath.prototype.resolve = function (document, visitor) {
            var node = document;
            if (visitor) {
                node.accept(visitor);
            }
            for (var _i = 0, _a = this._segments; _i < _a.length; _i++) {
                var segment = _a[_i];
                node = segment.resolve(node);
                if (visitor && node && node["accept"]) {
                    node.accept(visitor);
                }
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
    var OasNodePathSegment = /** @class */ (function () {
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
            if (node === null || node === undefined) {
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
    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Contact object.
     */
    var OasContact = /** @class */ (function (_super) {
        __extends$4(OasContact, _super);
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
    var __extends$5 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS External Documentation object.
     */
    var OasExternalDocumentation = /** @class */ (function (_super) {
        __extends$5(OasExternalDocumentation, _super);
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
    var __extends$6 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Header object.  Example:
     */
    var OasHeader = /** @class */ (function (_super) {
        __extends$6(OasHeader, _super);
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
    var __extends$7 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Info object.
     */
    var OasInfo = /** @class */ (function (_super) {
        __extends$7(OasInfo, _super);
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
    var __extends$8 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS License object.
     */
    var OasLicense = /** @class */ (function (_super) {
        __extends$8(OasLicense, _super);
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
    var __extends$9 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Operation object.
     */
    var OasOperation = /** @class */ (function (_super) {
        __extends$9(OasOperation, _super);
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
    var __extends$a = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Parameter object.
     */
    var OasParameterBase = /** @class */ (function (_super) {
        __extends$a(OasParameterBase, _super);
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
    var __extends$b = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Path Item object.
     */
    var OasPathItem = /** @class */ (function (_super) {
        __extends$b(OasPathItem, _super);
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
    var __extends$c = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Paths object.  The Paths object can have any number of child
     * paths, where the field name begins with '/'.
     */
    var OasPaths = /** @class */ (function (_super) {
        __extends$c(OasPaths, _super);
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
    var OasPathItems = /** @class */ (function () {
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
    var __extends$d = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Response object.  Example:
     */
    var OasResponse = /** @class */ (function (_super) {
        __extends$d(OasResponse, _super);
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
    var __extends$e = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Responses object.  The Responses object can have any number of child
     * responses, where the field names are either 'default' or an HTTP status code.
     */
    var OasResponses = /** @class */ (function (_super) {
        __extends$e(OasResponses, _super);
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
            if (statusCode === "default") {
                return this.default;
            }
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
            if (statusCode === null || statusCode === "default") {
                this.default = response;
                return response;
            }
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
            if (statusCode === null || statusCode === "default") {
                this.default = null;
                return;
            }
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
    var OasResponseItems = /** @class */ (function () {
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
    var __extends$f = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Schema object.
     */
    var OasSchema = /** @class */ (function (_super) {
        __extends$f(OasSchema, _super);
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
            if (!this.properties) {
                return [];
            }
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
    var OasSchemaProperties = /** @class */ (function () {
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
    var __extends$g = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Security Requirement object.
     */
    var OasSecurityRequirement = /** @class */ (function (_super) {
        __extends$g(OasSecurityRequirement, _super);
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
         * Removes a single security requirement item (reference to an existing security scheme)
         * by scheme name and returns the array of scopes previously mapped to the scheme name.
         * @param name
         */
        OasSecurityRequirement.prototype.removeSecurityRequirementItem = function (name) {
            var scopes = this._items[name];
            this._items[name] = undefined;
            delete this._items[name];
            return scopes;
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
    var OasSecurityRequirementItems = /** @class */ (function () {
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
    var __extends$h = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Security Scheme object.
     */
    var OasSecurityScheme = /** @class */ (function (_super) {
        __extends$h(OasSecurityScheme, _super);
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
    var __extends$i = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS Tag object.
     */
    var OasTag = /** @class */ (function (_super) {
        __extends$i(OasTag, _super);
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
    var __extends$j = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS XML object.
     */
    var OasXML = /** @class */ (function (_super) {
        __extends$j(OasXML, _super);
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
    var __extends$k = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 Contact object.  Example:
     *
     * {
     *   "name": "API Support",
     *   "url": "http://www.swagger.io/support",
     *   "email": "support@swagger.io"
     * }
     */
    var Oas20Contact = /** @class */ (function (_super) {
        __extends$k(Oas20Contact, _super);
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
    var __extends$l = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 External Documentation object.  Example:
     *
     * {
     *   "description": "Find more info here",
     *   "url": "https://swagger.io"
     * }
     */
    var Oas20ExternalDocumentation = /** @class */ (function (_super) {
        __extends$l(Oas20ExternalDocumentation, _super);
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
    var __extends$m = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20XML = /** @class */ (function (_super) {
        __extends$m(Oas20XML, _super);
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
    var __extends$n = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Schema = /** @class */ (function (_super) {
        __extends$n(Oas20Schema, _super);
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
    var Oas20PropertySchema = /** @class */ (function (_super) {
        __extends$n(Oas20PropertySchema, _super);
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
    var Oas20AllOfSchema = /** @class */ (function (_super) {
        __extends$n(Oas20AllOfSchema, _super);
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
    var Oas20ItemsSchema = /** @class */ (function (_super) {
        __extends$n(Oas20ItemsSchema, _super);
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
    var Oas20AdditionalPropertiesSchema = /** @class */ (function (_super) {
        __extends$n(Oas20AdditionalPropertiesSchema, _super);
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
    var Oas20SchemaDefinition = /** @class */ (function (_super) {
        __extends$n(Oas20SchemaDefinition, _super);
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
    var __extends$o = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Definitions = /** @class */ (function (_super) {
        __extends$o(Oas20Definitions, _super);
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
    var Oas20DefinitionItems = /** @class */ (function () {
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
    var __extends$p = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 License object.  Example:
     *
     * {
     *   "name": "Apache 2.0",
     *   "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
     * }
     */
    var Oas20License = /** @class */ (function (_super) {
        __extends$p(Oas20License, _super);
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
    var __extends$q = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Info = /** @class */ (function (_super) {
        __extends$q(Oas20Info, _super);
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
    var __extends$r = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 Tag object.  Example:
     *
     * {
     *     "name": "pet",
     *     "description": "Pets operations"
     * }
     */
    var Oas20Tag = /** @class */ (function (_super) {
        __extends$r(Oas20Tag, _super);
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
    var __extends$s = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20SecurityRequirement = /** @class */ (function (_super) {
        __extends$s(Oas20SecurityRequirement, _super);
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
    var __extends$t = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 OAuth Scopes object.  Example:
     *
     * {
     *   "write:pets": "modify pets in your account",
     *   "read:pets": "read your pets"
     * }
     */
    var Oas20Scopes = /** @class */ (function (_super) {
        __extends$t(Oas20Scopes, _super);
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
    var Oas20ScopeItems = /** @class */ (function () {
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
    var __extends$u = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20SecurityScheme = /** @class */ (function (_super) {
        __extends$u(Oas20SecurityScheme, _super);
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
    var __extends$v = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20SecurityDefinitions = /** @class */ (function (_super) {
        __extends$v(Oas20SecurityDefinitions, _super);
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
    var Oas20SecuritySchemeItems = /** @class */ (function () {
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
    var __extends$w = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 Items object.  Example:
     */
    var Oas20Items = /** @class */ (function (_super) {
        __extends$w(Oas20Items, _super);
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
    var __extends$x = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20ParameterBase = /** @class */ (function (_super) {
        __extends$x(Oas20ParameterBase, _super);
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
    var Oas20ParameterDefinition = /** @class */ (function (_super) {
        __extends$x(Oas20ParameterDefinition, _super);
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
    var Oas20Parameter = /** @class */ (function (_super) {
        __extends$x(Oas20Parameter, _super);
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
    var __extends$y = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 Header object.  Example:
     *
     * {
     *   "description": "The number of allowed requests in the current period",
     *   "type": "integer"
     * }
     */
    var Oas20Header = /** @class */ (function (_super) {
        __extends$y(Oas20Header, _super);
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
    var __extends$z = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Headers = /** @class */ (function (_super) {
        __extends$z(Oas20Headers, _super);
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
    var OasHeaderItems = /** @class */ (function () {
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
    var __extends$A = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Example = /** @class */ (function (_super) {
        __extends$A(Oas20Example, _super);
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
    var Oas20ExampleItems = /** @class */ (function () {
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
    var __extends$B = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20ResponseBase = /** @class */ (function (_super) {
        __extends$B(Oas20ResponseBase, _super);
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
    var Oas20Response = /** @class */ (function (_super) {
        __extends$B(Oas20Response, _super);
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
    var Oas20ResponseDefinition = /** @class */ (function (_super) {
        __extends$B(Oas20ResponseDefinition, _super);
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
    var __extends$C = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Responses = /** @class */ (function (_super) {
        __extends$C(Oas20Responses, _super);
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
    var __extends$D = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Operation = /** @class */ (function (_super) {
        __extends$D(Oas20Operation, _super);
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
    var __extends$E = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20PathItem = /** @class */ (function (_super) {
        __extends$E(Oas20PathItem, _super);
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
    var __extends$F = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20Paths = /** @class */ (function (_super) {
        __extends$F(Oas20Paths, _super);
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
    var __extends$G = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20ParametersDefinitions = /** @class */ (function (_super) {
        __extends$G(Oas20ParametersDefinitions, _super);
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
    var Oas20ParametersDefinitionsItems = /** @class */ (function () {
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
    var __extends$H = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas20ResponsesDefinitions = /** @class */ (function (_super) {
        __extends$H(Oas20ResponsesDefinitions, _super);
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
    var Oas20ResponsesDefinitionsItems = /** @class */ (function () {
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
    var __extends$I = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 2.0 document.
     */
    var Oas20Document = /** @class */ (function (_super) {
        __extends$I(Oas20Document, _super);
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
    var __extends$J = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Server Variable object.
     */
    var Oas30ServerVariable = /** @class */ (function (_super) {
        __extends$J(Oas30ServerVariable, _super);
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
    var __extends$K = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Server = /** @class */ (function (_super) {
        __extends$K(Oas30Server, _super);
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
    var Oas30LinkServer = /** @class */ (function (_super) {
        __extends$K(Oas30LinkServer, _super);
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
    var Oas30ServerVariables = /** @class */ (function () {
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
    var __extends$L = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30XML = /** @class */ (function (_super) {
        __extends$L(Oas30XML, _super);
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
    var __extends$M = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 External Documentation object.  Example:
     *
     * {
     *   "description": "Find more info here",
     *   "url": "https://example.com"
     * }
     */
    var Oas30ExternalDocumentation = /** @class */ (function (_super) {
        __extends$M(Oas30ExternalDocumentation, _super);
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
    var __extends$N = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Discriminator = /** @class */ (function (_super) {
        __extends$N(Oas30Discriminator, _super);
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
    var __extends$O = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Schema = /** @class */ (function (_super) {
        __extends$O(Oas30Schema, _super);
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
    var Oas30PropertySchema = /** @class */ (function (_super) {
        __extends$O(Oas30PropertySchema, _super);
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
    var Oas30AllOfSchema = /** @class */ (function (_super) {
        __extends$O(Oas30AllOfSchema, _super);
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
    var Oas30AnyOfSchema = /** @class */ (function (_super) {
        __extends$O(Oas30AnyOfSchema, _super);
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
    var Oas30OneOfSchema = /** @class */ (function (_super) {
        __extends$O(Oas30OneOfSchema, _super);
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
    var Oas30NotSchema = /** @class */ (function (_super) {
        __extends$O(Oas30NotSchema, _super);
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
    var Oas30ItemsSchema = /** @class */ (function (_super) {
        __extends$O(Oas30ItemsSchema, _super);
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
    var Oas30AdditionalPropertiesSchema = /** @class */ (function (_super) {
        __extends$O(Oas30AdditionalPropertiesSchema, _super);
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
    var Oas30SchemaDefinition = /** @class */ (function (_super) {
        __extends$O(Oas30SchemaDefinition, _super);
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
    var __extends$P = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Oas30ExampleItems = /** @class */ (function () {
        function Oas30ExampleItems() {
        }
        return Oas30ExampleItems;
    }());
    /**
     * Models an OAS 3.0 Example object.  Example:
     */
    var Oas30Example = /** @class */ (function (_super) {
        __extends$P(Oas30Example, _super);
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
    var Oas30ExampleDefinition = /** @class */ (function (_super) {
        __extends$P(Oas30ExampleDefinition, _super);
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
    var __extends$Q = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Header = /** @class */ (function (_super) {
        __extends$Q(Oas30Header, _super);
        /**
         * Constructor.
         * @param headerName
         */
        function Oas30Header(headerName) {
            var _this = _super.call(this, headerName) || this;
            _this.content = new Oas30HeaderContent();
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
    var Oas30HeaderDefinition = /** @class */ (function (_super) {
        __extends$Q(Oas30HeaderDefinition, _super);
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
    var Oas30HeaderContent = /** @class */ (function () {
        function Oas30HeaderContent() {
        }
        return Oas30HeaderContent;
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
    var __extends$R = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Encoding object.
     */
    var Oas30Encoding = /** @class */ (function (_super) {
        __extends$R(Oas30Encoding, _super);
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
    var Oas30EncodingHeaders = /** @class */ (function () {
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
    var __extends$S = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30MediaType = /** @class */ (function (_super) {
        __extends$S(Oas30MediaType, _super);
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
    var Oas30EncodingItems = /** @class */ (function () {
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
    var __extends$T = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30RequestBody = /** @class */ (function (_super) {
        __extends$T(Oas30RequestBody, _super);
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
    var Oas30RequestBodyDefinition = /** @class */ (function (_super) {
        __extends$T(Oas30RequestBodyDefinition, _super);
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
    var Oas30RequestBodyContent = /** @class */ (function () {
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
    var __extends$U = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Link Parameter Expression object.
     */
    var Oas30LinkParameterExpression = /** @class */ (function (_super) {
        __extends$U(Oas30LinkParameterExpression, _super);
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
    var __extends$V = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Link Request Body Expression object.
     */
    var Oas30LinkRequestBodyExpression = /** @class */ (function (_super) {
        __extends$V(Oas30LinkRequestBodyExpression, _super);
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
    var __extends$W = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Link object.
     */
    var Oas30Link = /** @class */ (function (_super) {
        __extends$W(Oas30Link, _super);
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
    var Oas30LinkDefinition = /** @class */ (function (_super) {
        __extends$W(Oas30LinkDefinition, _super);
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
    var Oas30LinkParameters = /** @class */ (function () {
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
    var __extends$X = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30ResponseBase = /** @class */ (function (_super) {
        __extends$X(Oas30ResponseBase, _super);
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
    var Oas30Response = /** @class */ (function (_super) {
        __extends$X(Oas30Response, _super);
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
    var Oas30ResponseDefinition = /** @class */ (function (_super) {
        __extends$X(Oas30ResponseDefinition, _super);
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
    var Oas30ResponseHeaders = /** @class */ (function () {
        function Oas30ResponseHeaders() {
        }
        return Oas30ResponseHeaders;
    }());
    var Oas30ResponseContent = /** @class */ (function () {
        function Oas30ResponseContent() {
        }
        return Oas30ResponseContent;
    }());
    var Oas30Links = /** @class */ (function () {
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
    var __extends$Y = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Responses = /** @class */ (function (_super) {
        __extends$Y(Oas30Responses, _super);
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
    var __extends$Z = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30SecurityRequirement = /** @class */ (function (_super) {
        __extends$Z(Oas30SecurityRequirement, _super);
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
    var __extends$_ = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30ParameterBase = /** @class */ (function (_super) {
        __extends$_(Oas30ParameterBase, _super);
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
    var Oas30ParameterDefinition = /** @class */ (function (_super) {
        __extends$_(Oas30ParameterDefinition, _super);
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
    var Oas30Parameter = /** @class */ (function (_super) {
        __extends$_(Oas30Parameter, _super);
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
    var Oas30ParameterContent = /** @class */ (function () {
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
    var __extends$10 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Operation = /** @class */ (function (_super) {
        __extends$10(Oas30Operation, _super);
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
    var Oas30Callbacks = /** @class */ (function () {
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
    var __extends$11 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30PathItem = /** @class */ (function (_super) {
        __extends$11(Oas30PathItem, _super);
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
    var Oas30CallbackPathItem = /** @class */ (function (_super) {
        __extends$11(Oas30CallbackPathItem, _super);
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
    var __extends$12 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Callback object.
     */
    var Oas30Callback = /** @class */ (function (_super) {
        __extends$12(Oas30Callback, _super);
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
    var Oas30CallbackDefinition = /** @class */ (function (_super) {
        __extends$12(Oas30CallbackDefinition, _super);
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
    var __extends$13 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 OAuth Flow object.
     */
    var Oas30OAuthFlow = /** @class */ (function (_super) {
        __extends$13(Oas30OAuthFlow, _super);
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
    var Oas30ImplicitOAuthFlow = /** @class */ (function (_super) {
        __extends$13(Oas30ImplicitOAuthFlow, _super);
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
    var Oas30PasswordOAuthFlow = /** @class */ (function (_super) {
        __extends$13(Oas30PasswordOAuthFlow, _super);
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
    var Oas30ClientCredentialsOAuthFlow = /** @class */ (function (_super) {
        __extends$13(Oas30ClientCredentialsOAuthFlow, _super);
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
    var Oas30AuthorizationCodeOAuthFlow = /** @class */ (function (_super) {
        __extends$13(Oas30AuthorizationCodeOAuthFlow, _super);
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
    var __extends$14 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 OAuth Flows object.
     */
    var Oas30OAuthFlows = /** @class */ (function (_super) {
        __extends$14(Oas30OAuthFlows, _super);
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
    var __extends$15 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30SecurityScheme = /** @class */ (function (_super) {
        __extends$15(Oas30SecurityScheme, _super);
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
    var __extends$16 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Components = /** @class */ (function (_super) {
        __extends$16(Oas30Components, _super);
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
    var Oas30SchemaComponents = /** @class */ (function () {
        function Oas30SchemaComponents() {
        }
        return Oas30SchemaComponents;
    }());
    var Oas30ResponseComponents = /** @class */ (function () {
        function Oas30ResponseComponents() {
        }
        return Oas30ResponseComponents;
    }());
    var Oas30ParameterComponents = /** @class */ (function () {
        function Oas30ParameterComponents() {
        }
        return Oas30ParameterComponents;
    }());
    var Oas30ExampleComponents = /** @class */ (function () {
        function Oas30ExampleComponents() {
        }
        return Oas30ExampleComponents;
    }());
    var Oas30RequestBodyComponents = /** @class */ (function () {
        function Oas30RequestBodyComponents() {
        }
        return Oas30RequestBodyComponents;
    }());
    var Oas30HeaderComponents = /** @class */ (function () {
        function Oas30HeaderComponents() {
        }
        return Oas30HeaderComponents;
    }());
    var Oas30SecuritySchemeComponents = /** @class */ (function () {
        function Oas30SecuritySchemeComponents() {
        }
        return Oas30SecuritySchemeComponents;
    }());
    var Oas30LinkComponents = /** @class */ (function () {
        function Oas30LinkComponents() {
        }
        return Oas30LinkComponents;
    }());
    var Oas30CallbackComponents = /** @class */ (function () {
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
    var __extends$17 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Contact object.  Example:
     *
     * {
     *   "name": "API Support",
     *   "url": "http://www.example.com/support",
     *   "email": "support@example.com"
     * }
     */
    var Oas30Contact = /** @class */ (function (_super) {
        __extends$17(Oas30Contact, _super);
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
    var __extends$18 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 License object.  Example:
     *
     * {
     *   "name": "Apache 2.0",
     *   "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
     * }
     */
    var Oas30License = /** @class */ (function (_super) {
        __extends$18(Oas30License, _super);
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
    var __extends$19 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Info = /** @class */ (function (_super) {
        __extends$19(Oas30Info, _super);
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
    var __extends$1a = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0 Tag object.  Example:
     *
     * {
     *     "name": "pet",
     *     "description": "Pets operations"
     * }
     */
    var Oas30Tag = /** @class */ (function (_super) {
        __extends$1a(Oas30Tag, _super);
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
    var __extends$1b = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
    var Oas30Paths = /** @class */ (function (_super) {
        __extends$1b(Oas30Paths, _super);
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
    var __extends$1c = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Models an OAS 3.0.x document.
     */
    var Oas30Document = /** @class */ (function (_super) {
        __extends$1c(Oas30Document, _super);
        function Oas30Document() {
            var _this = _super.call(this) || this;
            _this.openapi = "3.0.2";
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
     * Copyright 2018 Red Hat
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
     * A class to help with resolving references.  Handles recursion with loop detection.
     */
    var ReferenceResolver = /** @class */ (function () {
        function ReferenceResolver() {
            this.visitedNodes = [];
        }
        /**
         * Resolves a reference from a relative position in the data model.  Returns null if the
         * $ref is null or cannot be resolved.
         * @param $ref
         * @param from
         */
        ReferenceResolver.prototype.resolveRef = function ($ref, from) {
            this.visitedNodes = [];
            return this.resolveRefInternal($ref, from);
        };
        ReferenceResolver.prototype.resolveRefInternal = function ($ref, from) {
            if (!$ref) {
                return null;
            }
            // TODO implement a proper reference resolver including external file resolution: https://github.com/EricWittmann/oai-ts-core/issues/8
            var split = $ref.split("/");
            var cnode = null;
            split.forEach(function (seg) {
                if (seg === "#") {
                    cnode = from.ownerDocument();
                }
                else if (ReferenceUtil.hasValue(cnode)) {
                    if (cnode["__instanceof_IOasIndexedNode"]) {
                        cnode = cnode["getItem"](seg);
                    }
                    else {
                        cnode = cnode[seg];
                    }
                }
            });
            // Not found?  Return null.
            if (!cnode) {
                return null;
            }
            // If we've already seen cnode, then we're in a loop!
            if (this.visitedNodes.indexOf(cnode) !== -1) {
                return null;
            }
            // Otherwise, add it to the nodes we've seen.
            this.visitedNodes.push(cnode);
            // If cnode itself has a $ref, then keep looking!
            if (cnode["$ref"]) {
                return this.resolveRefInternal(cnode["$ref"], cnode);
            }
            else {
                return cnode;
            }
        };
        return ReferenceResolver;
    }());
    var ReferenceUtil = /** @class */ (function () {
        function ReferenceUtil() {
        }
        /**
         * Resolves a node reference.  If there is no "$ref" property on the node, then the node itself is
         * returned.  If there is a "$ref" property, then it is resolved (if possible) to another node.
         */
        ReferenceUtil.resolveNodeRef = function (node) {
            if (node["$ref"]) {
                return ReferenceUtil.resolveRef((node["$ref"]), node);
            }
            return node;
        };
        /**
         * Resolves a reference from a relative position in the data model.  Returns null if the
         * $ref is null or cannot be resolved.
         * @param $ref
         * @param from
         */
        ReferenceUtil.resolveRef = function ($ref, from) {
            if (!$ref) {
                return null;
            }
            var resolver = new ReferenceResolver();
            return resolver.resolveRef($ref, from);
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
        ReferenceUtil.canResolveRef = function ($ref, from) {
            // Don't try to resolve e.g. external references.
            if ($ref.indexOf('#/') !== 0) {
                return true;
            }
            return ReferenceUtil.hasValue(ReferenceUtil.resolveRef($ref, from));
        };
        /**
         * Check if the property value exists (is not undefined and is not null).
         * @param propertyValue
         * @return {boolean}
         */
        ReferenceUtil.hasValue = function (value) {
            if (value === undefined) {
                return false;
            }
            if (value === null) {
                return false;
            }
            return true;
        };
        return ReferenceUtil;
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
    var __extends$1d = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * This class reads a javascript object and turns it into a OAS model.
     */
    var OasJS2ModelReader = /** @class */ (function () {
        function OasJS2ModelReader() {
        }
        /**
         * Consumes and returns a property found in an entity js object.  The property is read and
         * then deleted.
         * @param entity
         * @param property
         */
        OasJS2ModelReader.prototype.consume = function (entity, property) {
            var rval = entity[property];
            delete entity[property];
            return rval;
        };
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
         * @param readExtras
         */
        OasJS2ModelReader.prototype.readDocument = function (document, documentModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var info = this.consume(document, "info");
            var paths = this.consume(document, "paths");
            var security = this.consume(document, "security");
            var tags = this.consume(document, "tags");
            var externalDocs = this.consume(document, "externalDocs");
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
            if (readExtras) {
                this.readExtraProperties(document, documentModel);
            }
        };
        /**
         * Reads a OAS Info object from the given javascript data.
         * @param info
         * @param infoModel
         */
        OasJS2ModelReader.prototype.readInfo = function (info, infoModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var title = this.consume(info, "title");
            var description = this.consume(info, "description");
            var termsOfService = this.consume(info, "termsOfService");
            var contact = this.consume(info, "contact");
            var license = this.consume(info, "license");
            var version = this.consume(info, "version");
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
            if (readExtras) {
                this.readExtraProperties(info, infoModel);
            }
        };
        /**
         * Reads a OAS Contact object from the given javascript data.
         * @param contact
         * @param contactModel
         */
        OasJS2ModelReader.prototype.readContact = function (contact, contactModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var name = this.consume(contact, "name");
            var url = this.consume(contact, "url");
            var email = this.consume(contact, "email");
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
            if (readExtras) {
                this.readExtraProperties(contact, contactModel);
            }
        };
        /**
         * Reads a OAS License object from the given javascript data.
         * @param license
         * @param licenseModel
         */
        OasJS2ModelReader.prototype.readLicense = function (license, licenseModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var name = this.consume(license, "name");
            var url = this.consume(license, "url");
            if (this.isDefined(name)) {
                licenseModel.name = name;
            }
            if (this.isDefined(url)) {
                licenseModel.url = url;
            }
            this.readExtensions(license, licenseModel);
            if (readExtras) {
                this.readExtraProperties(license, licenseModel);
            }
        };
        /**
         * Reads an OAS Paths object from the given JS data.
         * @param paths
         * @param pathsModel
         */
        OasJS2ModelReader.prototype.readPaths = function (paths, pathsModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            for (var path in paths) {
                if (path.indexOf("x-") === 0) {
                    continue;
                }
                var pathItem = this.consume(paths, path);
                var pathItemModel = pathsModel.createPathItem(path);
                this.readPathItem(pathItem, pathItemModel);
                pathsModel.addPathItem(path, pathItemModel);
            }
            this.readExtensions(paths, pathsModel);
            if (readExtras) {
                this.readExtraProperties(paths, pathsModel);
            }
        };
        /**
         * Reads an OAS PathItem object from the given JS data.
         * @param pathItem
         * @param pathItemModel
         */
        OasJS2ModelReader.prototype.readPathItem = function (pathItem, pathItemModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var $ref = this.consume(pathItem, "$ref");
            var get = this.consume(pathItem, "get");
            var put = this.consume(pathItem, "put");
            var post = this.consume(pathItem, "post");
            var delete_ = this.consume(pathItem, "delete");
            var options = this.consume(pathItem, "options");
            var head = this.consume(pathItem, "head");
            var patch = this.consume(pathItem, "patch");
            var parameters = this.consume(pathItem, "parameters");
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
            if (readExtras) {
                this.readExtraProperties(pathItem, pathItemModel);
            }
        };
        /**
         * Reads an OAS Operation object from the given JS data.
         * @param operation
         * @param operationModel
         */
        OasJS2ModelReader.prototype.readOperation = function (operation, operationModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var tags = this.consume(operation, "tags");
            var summary = this.consume(operation, "summary");
            var description = this.consume(operation, "description");
            var externalDocs = this.consume(operation, "externalDocs");
            var operationId = this.consume(operation, "operationId");
            var parameters = this.consume(operation, "parameters");
            var responses = this.consume(operation, "responses");
            var deprecated = this.consume(operation, "deprecated");
            var security = this.consume(operation, "security");
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
            if (readExtras) {
                this.readExtraProperties(operation, operationModel);
            }
        };
        /**
         * Reads an OAS Responses object from the given JS data.
         * @param responses
         * @param responsesModel
         */
        OasJS2ModelReader.prototype.readResponses = function (responses, responsesModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
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
            if (readExtras) {
                this.readExtensions(responses, responsesModel);
            }
        };
        /**
         * Reads an OAS Schema object from the given JS data.
         * @param schema
         * @param schemaModel
         */
        OasJS2ModelReader.prototype.readSchema = function (schema, schemaModel, readExtras) {
            var _this = this;
            if (readExtras === void 0) { readExtras = true; }
            var $ref = this.consume(schema, "$ref");
            var format = this.consume(schema, "format");
            var title = this.consume(schema, "title");
            var description = this.consume(schema, "description");
            var default_ = this.consume(schema, "default");
            var multipleOf = this.consume(schema, "multipleOf");
            var maximum = this.consume(schema, "maximum");
            var exclusiveMaximum = this.consume(schema, "exclusiveMaximum");
            var minimum = this.consume(schema, "minimum");
            var exclusiveMinimum = this.consume(schema, "exclusiveMinimum");
            var maxLength = this.consume(schema, "maxLength"); // Require: integer
            var minLength = this.consume(schema, "minLength"); // Require: integer
            var pattern = this.consume(schema, "pattern");
            var maxItems = this.consume(schema, "maxItems"); // Require: integer
            var minItems = this.consume(schema, "minItems"); // Require: integer
            var uniqueItems = this.consume(schema, "uniqueItems");
            var maxProperties = this.consume(schema, "maxProperties");
            var minProperties = this.consume(schema, "minProperties");
            var required = this.consume(schema, "required");
            var enum_ = this.consume(schema, "enum");
            var type = this.consume(schema, "type");
            var items = this.consume(schema, "items");
            var allOf = this.consume(schema, "allOf");
            var properties = this.consume(schema, "properties");
            var additionalProperties = this.consume(schema, "additionalProperties");
            var readOnly = this.consume(schema, "readOnly");
            var xml = this.consume(schema, "xml");
            var externalDocs = this.consume(schema, "externalDocs");
            var example = this.consume(schema, "example");
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
            this.readExtensions(schema, schemaModel);
            if (readExtras) {
                this.readExtraProperties(schema, schemaModel);
            }
        };
        /**
         * Reads an OAS XML object from the given JS data.
         * @param xml
         * @param xmlModel
         */
        OasJS2ModelReader.prototype.readXML = function (xml, xmlModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var name = this.consume(xml, "name");
            var namespace = this.consume(xml, "namespace");
            var prefix = this.consume(xml, "prefix");
            var attribute = this.consume(xml, "attribute");
            var wrapped = this.consume(xml, "wrapped");
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
            if (readExtras) {
                this.readExtraProperties(xml, xmlModel);
            }
        };
        /**
         * Reads an OAS 2.0 Security Schema object from the given javascript data.
         * @param scheme
         * @param schemeModel
         */
        OasJS2ModelReader.prototype.readSecurityScheme = function (scheme, schemeModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var type = this.consume(scheme, "type");
            var description = this.consume(scheme, "description");
            var name = this.consume(scheme, "name");
            var in_ = this.consume(scheme, "in");
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
            if (readExtras) {
                this.readExtraProperties(scheme, schemeModel);
            }
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
        OasJS2ModelReader.prototype.readTag = function (tag, tagModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var name = this.consume(tag, "name");
            var description = this.consume(tag, "description");
            var externalDocs = this.consume(tag, "externalDocs");
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
            if (readExtras) {
                this.readExtraProperties(tag, tagModel);
            }
        };
        /**
         * Reads an OAS External Documentation object from the given javascript data.
         * @param externalDocs
         * @param externalDocsModel
         */
        OasJS2ModelReader.prototype.readExternalDocumentation = function (externalDocs, externalDocsModel, readExtras) {
            if (readExtras === void 0) { readExtras = true; }
            var description = this.consume(externalDocs, "description");
            var url = this.consume(externalDocs, "url");
            if (this.isDefined(description)) {
                externalDocsModel.description = description;
            }
            if (this.isDefined(url)) {
                externalDocsModel.url = url;
            }
            this.readExtensions(externalDocs, externalDocsModel);
            if (readExtras) {
                this.readExtraProperties(externalDocs, externalDocsModel);
            }
        };
        /**
         * Reads all of the extension nodes.  An extension node is characterized by a property
         * that begins with "x-".
         * @param jsData
         * @param model
         */
        OasJS2ModelReader.prototype.readExtensions = function (jsData, model) {
            var _this = this;
            var keys = Object.keys(jsData);
            keys.forEach(function (key) {
                if (key.indexOf("x-") === 0) {
                    var val = _this.consume(jsData, key);
                    model.addExtension(key, val);
                }
            });
        };
        /**
         * Reads all remaining properties.  Anything left is an "extra" (or unexpected) property.
         * @param jsData
         * @param model
         */
        OasJS2ModelReader.prototype.readExtraProperties = function (jsData, model) {
            for (var key in jsData) {
                var val = jsData[key];
                console.info("WARN: found unexpected property \"" + key + "\".");
                model.addExtraProperty(key, val);
            }
        };
        return OasJS2ModelReader;
    }());
    /**
     * This class reads a javascript object and turns it into a OAS 2.0 model.  It is obviously
     * assumed that the javascript data actually does represent an OAS 2.0 document.
     */
    var Oas20JS2ModelReader = /** @class */ (function (_super) {
        __extends$1d(Oas20JS2ModelReader, _super);
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
            var swagger = this.consume(document, "swagger");
            if (swagger != "2.0") {
                throw Error("Unsupported specification version: " + swagger);
            }
            _super.prototype.readDocument.call(this, document, documentModel, false);
            var host = this.consume(document, "host");
            var basePath = this.consume(document, "basePath");
            var schemes = this.consume(document, "schemes");
            var consumes = this.consume(document, "consumes");
            var produces = this.consume(document, "produces");
            var definitions = this.consume(document, "definitions");
            var parameters = this.consume(document, "parameters");
            var responses = this.consume(document, "responses");
            var securityDefinitions = this.consume(document, "securityDefinitions");
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
            this.readExtraProperties(document, documentModel);
        };
        /**
         * Reads an OAS 2.0 Schema object from the given javascript data.
         * @param schema
         * @param schemaModel
         */
        Oas20JS2ModelReader.prototype.readSchema = function (schema, schemaModel) {
            _super.prototype.readSchema.call(this, schema, schemaModel, false);
            var discriminator = this.consume(schema, "discriminator");
            if (this.isDefined(discriminator)) {
                schemaModel.discriminator = discriminator;
            }
            this.readExtraProperties(schema, schemaModel);
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
            _super.prototype.readSecurityScheme.call(this, scheme, schemeModel, false);
            var flow = this.consume(scheme, "flow");
            var authorizationUrl = this.consume(scheme, "authorizationUrl");
            var tokenUrl = this.consume(scheme, "tokenUrl");
            var scopes = this.consume(scheme, "scopes");
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
            this.readExtraProperties(scheme, schemeModel);
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
                var description = this.consume(scopes, scope);
                scopesModel.addScope(scope, description);
            }
            this.readExtensions(scopes, scopesModel);
            this.readExtraProperties(scopes, scopesModel);
        };
        /**
         * Reads an OAS 2.0 Operation object from the given JS data.
         * @param operation
         * @param operationModel
         */
        Oas20JS2ModelReader.prototype.readOperation = function (operation, operationModel) {
            _super.prototype.readOperation.call(this, operation, operationModel, false);
            var consumes = this.consume(operation, "consumes");
            var produces = this.consume(operation, "produces");
            var schemes = this.consume(operation, "schemes");
            if (this.isDefined(consumes)) {
                operationModel.consumes = consumes;
            }
            if (this.isDefined(produces)) {
                operationModel.produces = produces;
            }
            if (this.isDefined(schemes)) {
                operationModel.schemes = schemes;
            }
            this.readExtraProperties(operation, operationModel);
        };
        /**
         * Reads an OAS 2.0 Parameter object from the given JS data.
         * @param parameter
         * @param paramModel
         */
        Oas20JS2ModelReader.prototype.readParameter = function (parameter, paramModel) {
            var $ref = this.consume(parameter, "$ref");
            if (this.isDefined($ref)) {
                paramModel.$ref = $ref;
            }
            this.readParameterBase(parameter, paramModel);
            this.readExtraProperties(parameter, paramModel);
        };
        /**
         * Reads an OAS 2.0 Parameter Definition from the given JS data.
         * @param parameterDef
         * @param paramDefModel
         */
        Oas20JS2ModelReader.prototype.readParameterDefinition = function (parameterDef, paramDefModel) {
            this.readParameterBase(parameterDef, paramDefModel);
            this.readExtraProperties(parameterDef, paramDefModel);
        };
        /**
         * Reads an OAS 2.0 Parameter object from the given JS data.
         * @param parameter
         * @param paramModel
         */
        Oas20JS2ModelReader.prototype.readParameterBase = function (parameter, paramModel) {
            this.readItems(parameter, paramModel, false);
            var name = this.consume(parameter, "name");
            var in_ = this.consume(parameter, "in");
            var description = this.consume(parameter, "description");
            var required = this.consume(parameter, "required");
            var schema = this.consume(parameter, "schema");
            var allowEmptyValue = this.consume(parameter, "allowEmptyValue");
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
        Oas20JS2ModelReader.prototype.readItems = function (items, itemsModel, readExtra) {
            if (readExtra === void 0) { readExtra = true; }
            var type = this.consume(items, "type");
            var format = this.consume(items, "format");
            var itemsChild = this.consume(items, "items");
            var collectionFormat = this.consume(items, "collectionFormat");
            var default_ = this.consume(items, "default");
            var maximum = this.consume(items, "maximum");
            var exclusiveMaximum = this.consume(items, "exclusiveMaximum");
            var minimum = this.consume(items, "minimum");
            var exclusiveMinimum = this.consume(items, "exclusiveMinimum");
            var maxLength = this.consume(items, "maxLength"); // Require: integer
            var minLength = this.consume(items, "minLength"); // Require: integer
            var pattern = this.consume(items, "pattern");
            var maxItems = this.consume(items, "maxItems"); // Require: integer
            var minItems = this.consume(items, "minItems"); // Require: integer
            var uniqueItems = this.consume(items, "uniqueItems");
            var enum_ = this.consume(items, "enum");
            var multipleOf = this.consume(items, "multipleOf");
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
            if (readExtra) {
                this.readExtraProperties(items, itemsModel);
            }
        };
        /**
         * Reads an OAS 2.0 Response object from the given JS data.
         * @param response
         * @param responseModel
         */
        Oas20JS2ModelReader.prototype.readResponse = function (response, responseModel) {
            var $ref = this.consume(response, "$ref");
            if (this.isDefined($ref)) {
                responseModel.$ref = $ref;
            }
            this.readResponseBase(response, responseModel);
            this.readExtraProperties(response, responseModel);
        };
        /**
         * Reads an OAS 2.0 Response Definition object from the given JS data.
         * @param response
         * @param responseDefModel
         */
        Oas20JS2ModelReader.prototype.readResponseDefinition = function (response, responseDefModel) {
            this.readResponseBase(response, responseDefModel);
            this.readExtraProperties(response, responseDefModel);
        };
        /**
         * Reads an OAS 2.0 Response object from the given JS data.
         * @param response
         * @param responseModel
         */
        Oas20JS2ModelReader.prototype.readResponseBase = function (response, responseModel) {
            var description = this.consume(response, "description");
            var schema = this.consume(response, "schema");
            var headers = this.consume(response, "headers");
            var examples = this.consume(response, "examples");
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
            var description = this.consume(header, "description");
            if (this.isDefined(description)) {
                headerModel.description = description;
            }
            // Note: readItems() will finalize the input, so we can't read anything after this
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
    var Oas20JS2ModelReaderVisitor = /** @class */ (function () {
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
            this.reader.readDocument(this.jsData, node);
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
        Oas20JS2ModelReaderVisitor.prototype.visitValidationProblem = function (node) {
            // Not supported:  validation problems are transient
        };
        return Oas20JS2ModelReaderVisitor;
    }());
    /**
     * A visitor used to invoke the appropriate readXYZ() method on the Oas20JS2ModelReader
     * class.  This is useful when reading a partial (non root) model from a JS object.  The
     * caller still needs to first construct the appropriate model prior to reading into it.
     */
    var Oas30JS2ModelReaderVisitor = /** @class */ (function () {
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
            this.reader.readDocument(this.jsData, node);
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
        Oas30JS2ModelReaderVisitor.prototype.visitValidationProblem = function (node) {
            // Not supported:  validation problems are transient
        };
        return Oas30JS2ModelReaderVisitor;
    }());
    /**
     * This class reads a javascript object and turns it into a OAS 3.0 model.  It is obviously
     * assumed that the javascript data actually does represent an OAS 3.0 document.
     */
    var Oas30JS2ModelReader = /** @class */ (function (_super) {
        __extends$1d(Oas30JS2ModelReader, _super);
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
            var openapi = this.consume(document, "openapi");
            if (openapi.indexOf("3.") != 0) {
                throw Error("Unsupported specification version: " + openapi);
            }
            _super.prototype.readDocument.call(this, document, documentModel, false);
            var servers = this.consume(document, "servers");
            var components = this.consume(document, "components");
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
            this.readExtraProperties(document, documentModel);
        };
        /**
         * Reads an OAS 3.0 Components object from the given JS data.
         * @param components
         * @param componentsModel
         */
        Oas30JS2ModelReader.prototype.readComponents = function (components, componentsModel) {
            var schemas = this.consume(components, "schemas");
            var responses = this.consume(components, "responses");
            var parameters = this.consume(components, "parameters");
            var examples = this.consume(components, "examples");
            var requestBodies = this.consume(components, "requestBodies");
            var headers = this.consume(components, "headers");
            var securitySchemes = this.consume(components, "securitySchemes");
            var links = this.consume(components, "links");
            var callbacks = this.consume(components, "callbacks");
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
            this.readExtraProperties(components, componentsModel);
        };
        /**
         * Reads an OAS 3.0 Security Scheme object from the given JS data.
         * @param securityScheme
         * @param securitySchemeModel
         */
        Oas30JS2ModelReader.prototype.readSecurityScheme = function (securityScheme, securitySchemeModel) {
            _super.prototype.readSecurityScheme.call(this, securityScheme, securitySchemeModel, false);
            var $ref = this.consume(securityScheme, "$ref");
            var scheme = this.consume(securityScheme, "scheme");
            var bearerFormat = this.consume(securityScheme, "bearerFormat");
            var flows = this.consume(securityScheme, "flows");
            var openIdConnectUrl = this.consume(securityScheme, "openIdConnectUrl");
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
            this.readExtraProperties(securityScheme, securitySchemeModel);
        };
        /**
         * Reads an OAS 3.0 OAuth Flows object from the given JS data.
         * @param flows
         * @param flowsModel
         */
        Oas30JS2ModelReader.prototype.readOAuthFlows = function (flows, flowsModel) {
            var implicit = this.consume(flows, "implicit");
            var password = this.consume(flows, "password");
            var clientCredentials = this.consume(flows, "clientCredentials");
            var authorizationCode = this.consume(flows, "authorizationCode");
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
            this.readExtraProperties(flows, flowsModel);
        };
        /**
         * Reads an OAS 3.0 OAuth Flow object from the given JS data.
         * @param flow
         * @param flowModel
         */
        Oas30JS2ModelReader.prototype.readOAuthFlow = function (flow, flowModel) {
            var authorizationUrl = this.consume(flow, "authorizationUrl");
            var tokenUrl = this.consume(flow, "tokenUrl");
            var refreshUrl = this.consume(flow, "refreshUrl");
            var scopes = this.consume(flow, "scopes");
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
            this.readExtraProperties(flow, flowModel);
        };
        /**
         * Reads an OAS 3.0 PathItem object from the given JS data.
         * @param pathItem
         * @param pathItemModel
         */
        Oas30JS2ModelReader.prototype.readPathItem = function (pathItem, pathItemModel) {
            _super.prototype.readPathItem.call(this, pathItem, pathItemModel, false);
            var summary = this.consume(pathItem, "summary");
            var description = this.consume(pathItem, "description");
            var trace = this.consume(pathItem, "trace");
            var servers = this.consume(pathItem, "servers");
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
            this.readExtraProperties(pathItem, pathItemModel);
        };
        /**
         * Reads an OAS 3.0 Header object from the given js data.
         * @param header
         * @param headerModel
         */
        Oas30JS2ModelReader.prototype.readHeader = function (header, headerModel) {
            var $ref = this.consume(header, "$ref");
            var description = this.consume(header, "description");
            var required = this.consume(header, "required");
            var schema = this.consume(header, "schema");
            var allowEmptyValue = this.consume(header, "allowEmptyValue");
            var deprecated = this.consume(header, "deprecated");
            var style = this.consume(header, "style");
            var explode = this.consume(header, "explode");
            var allowReserved = this.consume(header, "allowReserved");
            var example = this.consume(header, "example");
            var examples = this.consume(header, "examples");
            var content = this.consume(header, "content");
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
            this.readExtraProperties(header, headerModel);
        };
        /**
         * Reads an OAS 3.0 Parameter object from the given JS data.
         * @param parameter
         * @param paramModel
         */
        Oas30JS2ModelReader.prototype.readParameterBase = function (parameter, paramModel) {
            var $ref = this.consume(parameter, "$ref");
            var name = this.consume(parameter, "name");
            var in_ = this.consume(parameter, "in");
            var description = this.consume(parameter, "description");
            var required = this.consume(parameter, "required");
            var schema = this.consume(parameter, "schema");
            var allowEmptyValue = this.consume(parameter, "allowEmptyValue");
            var deprecated = this.consume(parameter, "deprecated");
            var style = this.consume(parameter, "style");
            var explode = this.consume(parameter, "explode");
            var allowReserved = this.consume(parameter, "allowReserved");
            var example = this.consume(parameter, "example");
            var examples = this.consume(parameter, "examples");
            var content = this.consume(parameter, "content");
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
            var $ref = this.consume(parameter, "$ref");
            if (this.isDefined($ref)) {
                paramModel.$ref = $ref;
            }
            this.readParameterBase(parameter, paramModel);
            this.readExtraProperties(parameter, paramModel);
        };
        /**
         * Reads an OAS 3.0 Operation object from the given JS data.
         * @param operation
         * @param operationModel
         */
        Oas30JS2ModelReader.prototype.readOperation = function (operation, operationModel) {
            var _this = this;
            _super.prototype.readOperation.call(this, operation, operationModel, false);
            var requestBody = this.consume(operation, "requestBody");
            var callbacks = this.consume(operation, "callbacks");
            var servers = this.consume(operation, "servers");
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
            this.readExtraProperties(operation, operationModel);
        };
        /**
         * Reads an OAS 3.0 Callback object from the given JS data.
         * @param callback
         * @param callbackModel
         */
        Oas30JS2ModelReader.prototype.readCallback = function (callback, callbackModel) {
            for (var name_16 in callback) {
                if (name_16 === "$ref") {
                    callbackModel.$ref = this.consume(callback, name_16);
                }
                else {
                    var pathItem = this.consume(callback, name_16);
                    var pathItemModel = callbackModel.createPathItem(name_16);
                    this.readPathItem(pathItem, pathItemModel);
                    callbackModel.addPathItem(name_16, pathItemModel);
                }
            }
            this.readExtensions(callback, callbackModel);
            this.readExtraProperties(callback, callbackModel);
        };
        /**
         * Reads an OAS 3.0 Request Body object from the given JS data.
         * @param requestBody
         * @param requestBodyModel
         */
        Oas30JS2ModelReader.prototype.readRequestBody = function (requestBody, requestBodyModel) {
            var $ref = this.consume(requestBody, "$ref");
            var description = this.consume(requestBody, "description");
            var content = this.consume(requestBody, "content");
            var required = this.consume(requestBody, "required");
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
            this.readExtraProperties(requestBody, requestBodyModel);
        };
        /**
         * Reads an OAS 3.0 Media Type from the given js data.
         * @param mediaType
         * @param mediaTypeModel
         */
        Oas30JS2ModelReader.prototype.readMediaType = function (mediaType, mediaTypeModel) {
            var schema = this.consume(mediaType, "schema");
            var example = this.consume(mediaType, "example");
            var examples = this.consume(mediaType, "examples");
            var encodings = this.consume(mediaType, "encoding");
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
            this.readExtraProperties(mediaType, mediaTypeModel);
        };
        /**
         * Reads an OAS 3.0 Example from the given js data.
         * @param example
         * @param exampleModel
         */
        Oas30JS2ModelReader.prototype.readExample = function (example, exampleModel) {
            var $ref = this.consume(example, "$ref");
            var summary = this.consume(example, "summary");
            var description = this.consume(example, "description");
            var value = this.consume(example, "value");
            var externalValue = this.consume(example, "externalValue");
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
            this.readExtraProperties(example, exampleModel);
        };
        /**
         * Reads an OAS 3.0 Encoding from the given js data.
         * @param encodingProperty
         * @param encodingModel
         */
        Oas30JS2ModelReader.prototype.readEncoding = function (encodingProperty, encodingModel) {
            var contentType = this.consume(encodingProperty, "contentType");
            var headers = this.consume(encodingProperty, "headers");
            var style = this.consume(encodingProperty, "style");
            var explode = this.consume(encodingProperty, "explode");
            var allowReserved = this.consume(encodingProperty, "allowReserved");
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
            this.readExtraProperties(encodingProperty, encodingModel);
        };
        /**
         * Reads an OAS 3.0 Response object from the given js data.
         * @param response
         * @param responseModel
         */
        Oas30JS2ModelReader.prototype.readResponse = function (response, responseModel) {
            this.readResponseBase(response, responseModel);
            this.readExtraProperties(response, responseModel);
        };
        /**
         * Reads an OAS 3.0 Response object from the given JS data.
         * @param response
         * @param responseModel
         */
        Oas30JS2ModelReader.prototype.readResponseBase = function (response, responseModel) {
            var $ref = this.consume(response, "$ref");
            var description = this.consume(response, "description");
            var headers = this.consume(response, "headers");
            var content = this.consume(response, "content");
            var links = this.consume(response, "links");
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
            var $ref = this.consume(link, "$ref");
            var operationRef = this.consume(link, "operationRef");
            var operationId = this.consume(link, "operationId");
            var parameters = this.consume(link, "parameters");
            var requestBody = this.consume(link, "requestBody");
            var description = this.consume(link, "description");
            var server = this.consume(link, "server");
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
            this.readExtraProperties(link, linkModel);
        };
        /**
         * Reads an OAS 3.0 Schema object from the given js data.
         * @param schema
         * @param schemaModel
         */
        Oas30JS2ModelReader.prototype.readSchema = function (schema, schemaModel) {
            _super.prototype.readSchema.call(this, schema, schemaModel, false);
            var oneOf = this.consume(schema, "oneOf");
            var anyOf = this.consume(schema, "anyOf");
            var not = this.consume(schema, "not");
            var discriminator = this.consume(schema, "discriminator");
            var nullable = this.consume(schema, "nullable");
            var writeOnly = this.consume(schema, "writeOnly");
            var deprecated = this.consume(schema, "deprecated");
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
            this.readExtraProperties(schema, schemaModel);
        };
        /**
         * Reads a OAS 3.0 Server object from the given javascript data.
         * @param server
         * @param serverModel
         */
        Oas30JS2ModelReader.prototype.readServer = function (server, serverModel) {
            var url = this.consume(server, "url");
            var description = this.consume(server, "description");
            var variables = this.consume(server, "variables");
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
            this.readExtraProperties(server, serverModel);
        };
        /**
         * Reads an OAS 3.0 Server Variable object from the given JS data.
         * @param serverVariable
         * @param serverVariableModel
         */
        Oas30JS2ModelReader.prototype.readServerVariable = function (serverVariable, serverVariableModel) {
            var _enum = this.consume(serverVariable, "enum");
            var _default = this.consume(serverVariable, "default");
            var description = this.consume(serverVariable, "description");
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
            this.readExtraProperties(serverVariable, serverVariableModel);
        };
        /**
         * Reads an OAS 3.0 Discriminator object from the given JS data.
         * @param discriminator
         * @param discriminatorModel
         */
        Oas30JS2ModelReader.prototype.readDiscriminator = function (discriminator, discriminatorModel) {
            var propertyName = this.consume(discriminator, "propertyName");
            var mapping = this.consume(discriminator, "mapping");
            if (this.isDefined(propertyName)) {
                discriminatorModel.propertyName = propertyName;
            }
            if (this.isDefined(mapping)) {
                discriminatorModel.mapping = mapping;
            }
            this.readExtensions(discriminator, discriminatorModel);
            this.readExtraProperties(discriminator, discriminatorModel);
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
    var OasDocumentFactory = /** @class */ (function () {
        function OasDocumentFactory() {
            this.V2_DEFAULT_MINOR = "0";
            this.V3_DEFAULT_MINOR = "0";
            this.V3_DEFAULT_PATCH = "2";
        }
        /**
         * Creates a new, empty instance of an OAS document.
         * @param oasVersion
         * @return {OasDocument}
         */
        OasDocumentFactory.prototype.createEmpty = function (oasVersion) {
            var ver = oasVersion;
            oasVersion = this.parseVersion(oasVersion);
            if (oasVersion && oasVersion === "2.0") {
                return new Oas20Document();
            }
            if (oasVersion && oasVersion.indexOf("3.0") === 0) {
                var doc = new Oas30Document();
                doc.openapi = oasVersion;
                return doc;
            }
            // Use the original version when reporting error
            throw new Error("Unsupported OAS version: " + ver);
        };
        /**
         * Reads the given object and creates a valid OAS document model.
         * @param oasObject
         * @return {Oas20Document}
         */
        OasDocumentFactory.prototype.createFromObject = function (oasObject) {
            var ver = oasObject.swagger;
            if (oasObject.openapi) {
                ver = oasObject.openapi;
            }
            var oasVersion = this.parseVersion(ver);
            // We side-effect the input object when reading it, so make a deep copy of it first.
            oasObject = JSON.parse(JSON.stringify(oasObject));
            if (oasVersion && oasVersion === "2.0") {
                oasObject.swagger = oasVersion;
                var reader = new Oas20JS2ModelReader();
                return reader.read(oasObject);
            }
            if (oasVersion && oasVersion.indexOf("3.0") === 0) {
                oasObject.openapi = oasVersion;
                var reader = new Oas30JS2ModelReader();
                return reader.read(oasObject);
            }
            // Use the original version as read from the document when reporting error
            throw new Error("Unsupported OAS version: " + ver);
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
        /**
         * @param ver
         * @return {string | undefined}
         */
        OasDocumentFactory.prototype.parseVersion = function (ver) {
            var version;
            if (ver) {
                if (typeof ver !== "string") {
                    ver = "" + ver;
                }
                // The regular expression may need to change if supported minor version for OAS 3 changes from 0 to 1 or later.
                // Lenient regular expression which accepts "lower dotted" number beyond patch e.g. strings like "3.0.0.1.1", as well as revision labels after a dash.
                // While semantic versioning has more strict rules about what follows after dash - this expression does not care.
                var specVersionExp = new RegExp(/^(2|3)(\.(0)(\.(\d))?((\.\d)*))?(-(.+))?$/g);
                // We can use the following expression, if we want to be more strict and do not want to allow anything after patch (still accepts revision after dash).
                // const specVersionExp = new RegExp(/^(2|3)(\.(0)(\.(\d))?)?(-(.+))?$/g);
                var match = void 0;
                var major = void 0;
                var minor = void 0;
                var patch = void 0;
                var revision = void 0; // We don't care about the revision but it is there
                if (match = specVersionExp.exec(ver)) {
                    major = match[1];
                    minor = match[2] !== undefined ? match[3] : (major === "2" ? this.V2_DEFAULT_MINOR : this.V3_DEFAULT_MINOR);
                    patch = (match[2] !== undefined && match[4] !== undefined) ? match[5] : (major === "2" ? "" : this.V3_DEFAULT_PATCH);
                    revision = match[6] !== undefined ? match[7] : "";
                    version = major === "2" ? [].concat(major, minor).join(".") : [].concat(major, minor, patch).join(".");
                }
            }
            return version;
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
    var __extends$1e = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Visitor used to convert from a Model into a JavaScript object.
     */
    var OasModelToJSVisitor = /** @class */ (function () {
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
         * Adds any "extra properties" found on the model onto the object.
         * @param object
         * @param model
         */
        OasModelToJSVisitor.prototype.addExtraProperties = function (object, model) {
            model.getExtraPropertyNames().forEach(function (pname) {
                var value = model.getExtraProperty(pname);
                object[pname] = value;
            });
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
            this.addExtraProperties(info, node);
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
            this.addExtraProperties(contact, node);
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
            this.addExtraProperties(license, node);
            parentJS.license = license;
            this.updateIndex(node, license);
        };
        /**
         * Visits a node.
         * @param node
         */
        OasModelToJSVisitor.prototype.visitPaths = function (node) {
            var paths = {};
            this.addExtraProperties(paths, node);
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
            this.addExtraProperties(responses, node);
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
            this.addExtraProperties(xml, node);
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
            this.addExtraProperties(tag, node);
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
            this.addExtraProperties(parentJS.externalDocs, node);
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
        OasModelToJSVisitor.prototype.visitValidationProblem = function (node) {
            // Validation problems are transient - they are not written to the JS.
        };
        return OasModelToJSVisitor;
    }());
    /**
     * Visitor used to convert from a Model into a JavaScript object that conforms
     * to the OAS 2.0 specification.  The resulting JS object can be stringified and
     * should be a valid OAS 2.0 document.
     */
    var Oas20ModelToJSVisitor = /** @class */ (function (_super) {
        __extends$1e(Oas20ModelToJSVisitor, _super);
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
            this.addExtraProperties(root, node);
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
            this.addExtraProperties(pathItem, node);
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
            this.addExtraProperties(operation, node);
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
            this.addExtraProperties(parameter, node);
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
            var response = {
                description: node.description,
                schema: null,
                headers: null,
                examples: null
            };
            this.addExtraProperties(response, node);
            return response;
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
            this.addExtraProperties(scheme, node);
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
            var items = {
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
            this.addExtraProperties(items, node);
            return items;
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
            this.addExtraProperties(schema, node);
            return schema;
        };
        return Oas20ModelToJSVisitor;
    }(OasModelToJSVisitor));
    /**
     * Visitor used to convert from a Model into a JavaScript object that conforms
     * to the OAS 3.0 specification.  The resulting JS object can be stringified and
     * should be a valid OAS 3.0 document.
     */
    var Oas30ModelToJSVisitor = /** @class */ (function (_super) {
        __extends$1e(Oas30ModelToJSVisitor, _super);
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
            this.addExtraProperties(root, node);
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
            this.addExtraProperties(pathItem, node);
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
            this.addExtraProperties(operation, node);
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
            this.addExtraProperties(header, node);
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
            this.addExtraProperties(parameter, node);
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
            var response = {
                $ref: node.$ref,
                description: node.description,
                headers: null,
                content: null,
                links: null
            };
            this.addExtraProperties(response, node);
            return response;
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
            this.addExtraProperties(link, node);
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
            this.addExtraProperties(server, node);
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
            this.addExtraProperties(discriminator, node);
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
            this.addExtraProperties(requestBody, node);
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
            this.addExtraProperties(mediaType, node);
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
            this.addExtraProperties(encoding, node);
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
            this.addExtraProperties(example, node);
            return example;
        };
        /**
         * Visits a node.
         * @param node
         */
        Oas30ModelToJSVisitor.prototype.visitCallback = function (node) {
            var callback = {};
            this.addExtraProperties(callback, node);
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
            this.addExtraProperties(components, node);
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
            this.addExtraProperties(oauthFlows, node);
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
            this.addExtraProperties(flow, node);
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
            this.addExtraProperties(securityScheme, node);
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
            this.addExtraProperties(callback, node);
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
            this.addExtraProperties(server, node);
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
            this.addExtraProperties(serverVariable, node);
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
            this.addExtraProperties(schema, node);
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
    var __extends$1f = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Used to traverse an OAS tree and call an included visitor for each node.
     */
    var OasTraverser = /** @class */ (function () {
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
         * Traverse the validation problems, if any exist.  Validation problems would
         * only exist if validation has been performed on the data model.
         * @param {OasNode} node
         */
        OasTraverser.prototype.traverseValidationProblems = function (node) {
            this.traverseArray(node.validationProblems());
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the contact object.
         * @param node
         */
        OasTraverser.prototype.visitContact = function (node) {
            node.accept(this.visitor);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the license object.
         * @param node
         */
        OasTraverser.prototype.visitLicense = function (node) {
            node.accept(this.visitor);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the paths.
         * @param node
         */
        OasTraverser.prototype.visitPaths = function (node) {
            node.accept(this.visitor);
            this.traverseIndexedNode(node);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the scopes.
         * @param node
         */
        OasTraverser.prototype.visitXML = function (node) {
            node.accept(this.visitor);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the security requirement.
         * @param node
         */
        OasTraverser.prototype.visitSecurityRequirement = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the tag.
         * @param node
         */
        OasTraverser.prototype.visitTag = function (node) {
            node.accept(this.visitor);
            this.traverseIfNotNull(node.externalDocs);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the external doc.
         * @param node
         */
        OasTraverser.prototype.visitExternalDocumentation = function (node) {
            node.accept(this.visitor);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the extension.
         * @param node
         */
        OasTraverser.prototype.visitExtension = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the validation problem.
         * @param {OasValidationProblem} node
         */
        OasTraverser.prototype.visitValidationProblem = function (node) {
            node.accept(this.visitor);
            // Don't traverse the validation problem's validation problems. :)
        };
        return OasTraverser;
    }());
    /**
     * Used to traverse an OAS 2.0 tree and call an included visitor for each node.
     */
    var Oas20Traverser = /** @class */ (function (_super) {
        __extends$1f(Oas20Traverser, _super);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the example.
         * @param node
         */
        Oas20Traverser.prototype.visitExample = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the items.
         * @param node
         */
        Oas20Traverser.prototype.visitItems = function (node) {
            node.accept(this.visitor);
            this.traverseIfNotNull(node.items);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the security definitions.
         * @param node
         */
        Oas20Traverser.prototype.visitSecurityDefinitions = function (node) {
            node.accept(this.visitor);
            this.traverseIndexedNode(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the security scheme.
         * @param node
         */
        Oas20Traverser.prototype.visitSecurityScheme = function (node) {
            node.accept(this.visitor);
            this.traverseIfNotNull(node.scopes);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the scopes.
         * @param node
         */
        Oas20Traverser.prototype.visitScopes = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the definitions.
         * @param node
         */
        Oas20Traverser.prototype.visitDefinitions = function (node) {
            node.accept(this.visitor);
            this.traverseIndexedNode(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the definitions.
         * @param node
         */
        Oas20Traverser.prototype.visitParametersDefinitions = function (node) {
            node.accept(this.visitor);
            this.traverseIndexedNode(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the responses.
         * @param node
         */
        Oas20Traverser.prototype.visitResponsesDefinitions = function (node) {
            node.accept(this.visitor);
            this.traverseIndexedNode(node);
            this.traverseValidationProblems(node);
        };
        return Oas20Traverser;
    }(OasTraverser));
    /**
     * Used to traverse an OAS 3.0 tree and call an included visitor for each node.
     */
    var Oas30Traverser = /** @class */ (function (_super) {
        __extends$1f(Oas30Traverser, _super);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitDiscriminator = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitLinkParameterExpression = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitLinkRequestBodyExpression = function (node) {
            node.accept(this.visitor);
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitEncoding = function (node) {
            node.accept(this.visitor);
            this.traverseArray(node.getHeaders());
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitExample = function (node) {
            node.accept(this.visitor);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitCallback = function (node) {
            node.accept(this.visitor);
            this.traverseIndexedNode(node);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
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
            this.traverseValidationProblems(node);
        };
        /**
         * Visit the node.
         * @param node
         */
        Oas30Traverser.prototype.visitServerVariable = function (node) {
            node.accept(this.visitor);
            this.traverseExtensions(node);
            this.traverseValidationProblems(node);
        };
        return Oas30Traverser;
    }(OasTraverser));
    /**
     * Used to traverse up an OAS tree and call an included visitor for each node.
     */
    var OasReverseTraverser = /** @class */ (function () {
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
        OasReverseTraverser.prototype.visitValidationProblem = function (node) {
            node.accept(this.visitor);
            this.traverse(node.parent());
        };
        return OasReverseTraverser;
    }());
    /**
     * Used to traverse up an OAS 2.0 tree and call an included visitor for each node.
     */
    var Oas20ReverseTraverser = /** @class */ (function (_super) {
        __extends$1f(Oas20ReverseTraverser, _super);
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
    var Oas30ReverseTraverser = /** @class */ (function (_super) {
        __extends$1f(Oas30ReverseTraverser, _super);
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
    var OasVisitorUtil = /** @class */ (function () {
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
        /**
         * Convenience method for visiting all Nodes in a node path, relative to a given document.
         * @param {OasNodePath} path
         * @param {IOasNodeVisitor} visitor
         * @param {OasDocument} document
         */
        OasVisitorUtil.visitPath = function (path, visitor, document) {
            path.resolve(document, visitor);
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
    var __extends$1g = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Base class for node visitors that are only interested in a subset of the node types
     * that might be visited.  Extending this class means that subclasses can only override
     * the subset of methods desired.
     */
    var OasNodeVisitorAdapter = /** @class */ (function () {
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
        OasNodeVisitorAdapter.prototype.visitValidationProblem = function (node) { };
        return OasNodeVisitorAdapter;
    }());
    /**
     * Base class for OAS 2.0 node visitors that are only interested in a subset of the node types
     * that might be visited.  Extending this class means that subclasses can only override
     * the subset of methods desired.
     */
    var Oas20NodeVisitorAdapter = /** @class */ (function (_super) {
        __extends$1g(Oas20NodeVisitorAdapter, _super);
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
    var Oas30NodeVisitorAdapter = /** @class */ (function (_super) {
        __extends$1g(Oas30NodeVisitorAdapter, _super);
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
    var OasCompositeVisitor = /** @class */ (function () {
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
        OasCompositeVisitor.prototype.visitValidationProblem = function (node) { this._acceptAll(node); };
        return OasCompositeVisitor;
    }());
    /**
     * A composite visitor - this class makes it easy to apply multiple visitors to
     * a node at the same time.  It's basically just an array of visitors.
     */
    var Oas20CompositeVisitor = /** @class */ (function (_super) {
        __extends$1g(Oas20CompositeVisitor, _super);
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
    var Oas30CompositeVisitor = /** @class */ (function (_super) {
        __extends$1g(Oas30CompositeVisitor, _super);
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
    /**
     * Composite visitor class that works with all versions (both OAS 2.0 and 3.x).  This class makes it easy
     * to apply multiple visitors concurrently.
     */
    var OasCombinedCompositeVisitor = /** @class */ (function (_super) {
        __extends$1g(OasCombinedCompositeVisitor, _super);
        /**
         * Constructor.
         * @param visitors
         */
        function OasCombinedCompositeVisitor() {
            var visitors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                visitors[_i] = arguments[_i];
            }
            return _super.call(this, visitors) || this;
        }
        OasCombinedCompositeVisitor.prototype.visitAdditionalPropertiesSchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitAllOfSchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitAnyOfSchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitAuthorizationCodeOAuthFlow = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitCallback = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitCallbackDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitCallbackPathItem = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitClientCredentialsOAuthFlow = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitComponents = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitDefinitions = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitDiscriminator = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitEncoding = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitExample = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitExampleDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitHeaderDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitHeaders = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitImplicitOAuthFlow = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitItems = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitItemsSchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitLink = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitLinkDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitLinkParameterExpression = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitLinkRequestBodyExpression = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitLinkServer = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitMediaType = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitNotSchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitOAuthFlows = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitOneOfSchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitParameter = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitParameterDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitParametersDefinitions = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitPasswordOAuthFlow = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitPropertySchema = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitRequestBody = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitRequestBodyDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitResponse = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitResponseDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitResponsesDefinitions = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitSchemaDefinition = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitScopes = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitSecurityDefinitions = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitServer = function (node) { this._acceptAll(node); };
        OasCombinedCompositeVisitor.prototype.visitServerVariable = function (node) { this._acceptAll(node); };
        return OasCombinedCompositeVisitor;
    }(OasCompositeVisitor));
    var OasCombinedVisitorAdapter = /** @class */ (function () {
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
        OasCombinedVisitorAdapter.prototype.visitValidationProblem = function (node) { };
        return OasCombinedVisitorAdapter;
    }());
    /**
     * Base class for visitors that simply want to get called for *every* node
     * in the model.
     */
    var OasAllNodeVisitor = /** @class */ (function (_super) {
        __extends$1g(OasAllNodeVisitor, _super);
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
        OasAllNodeVisitor.prototype.visitValidationProblem = function (node) { this.doVisitNode(node); };
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
    (function (OasValidationProblemSeverity) {
        OasValidationProblemSeverity[OasValidationProblemSeverity["ignore"] = 0] = "ignore";
        OasValidationProblemSeverity[OasValidationProblemSeverity["low"] = 1] = "low";
        OasValidationProblemSeverity[OasValidationProblemSeverity["medium"] = 2] = "medium";
        OasValidationProblemSeverity[OasValidationProblemSeverity["high"] = 3] = "high";
    })(exports.OasValidationProblemSeverity || (exports.OasValidationProblemSeverity = {}));
    /**
     * The default validation severity reqistry simply uses "medium" severity for all spec-mandated
     * validation rules.  Any rules that are not mandated by the OAI spec will be ignored.
     */
    var DefaultValidationSeverityRegistry = /** @class */ (function () {
        function DefaultValidationSeverityRegistry() {
        }
        DefaultValidationSeverityRegistry.prototype.lookupSeverity = function (rule) {
            if (rule.specMandated) {
                return exports.OasValidationProblemSeverity.medium;
            }
            return exports.OasValidationProblemSeverity.ignore;
        };
        return DefaultValidationSeverityRegistry;
    }());
    /**
     * Regular expression to match path - accepts '/', '/1', /abc', '/abc/', /{var}', '/{var}/', '/abc/prefix{var}'
     * Path expressions must not start with numerics.
     */
    var PATH_MATCH_REGEX = /^(\/[^{}\/]*(\{[a-zA-Z_][0-9a-zA-Z_]*\})?)+$/;
    var pathMatchEx = new RegExp(PATH_MATCH_REGEX);
    /**
     * Regular expression to match path segments.
     */
    var SEG_MATCH_REGEX = /\/([^{}\/]*)(\{([a-zA-Z_][0-9a-zA-Z_]*)\})?/g;
    /**
     * Base class for all validation rules.
     */
    var OasValidationRuleUtil = /** @class */ (function () {
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
            return items.indexOf(value) !== -1;
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
            return OasValidationRuleUtil.HTTP_STATUS_CODES.indexOf(statusCode) !== -1;
        };
        /**
         * Checks the path template against the regular expression and returns match result.
         *
         * @param pathTemplate
         * @return {boolean}
         */
        OasValidationRuleUtil.isPathWellFormed = function (pathTemplate) {
            return pathMatchEx.test(pathTemplate);
        };
        /**
         * Finds all occurrences of path segment patterns in a path template.
         *
         * @param pathTemplate
         * @return {PathSegment[]}
         */
        OasValidationRuleUtil.getPathSegments = function (pathTemplate) {
            var pathSegments = [];
            // If path is root '/', simply return empty segments
            if (pathTemplate === "/") {
                return pathSegments;
            }
            var normalizedPath = pathTemplate;
            // Remove the trailing slash if the path ends with slash
            if (pathTemplate.lastIndexOf("/") === pathTemplate.length - 1) {
                normalizedPath = pathTemplate.substring(0, pathTemplate.length - 1);
            }
            // Look for all occurrence of string like {param1}
            var match;
            var segId = 0;
            var segMatchEx = new RegExp(SEG_MATCH_REGEX);
            match = segMatchEx.exec(normalizedPath);
            while (match) {
                var pathSegment = {
                    segId: segId,
                    prefix: match[1],
                };
                // parameter name is inside the curly braces (group 3)
                if (match[3] !== undefined) {
                    pathSegment.formalName = match[3];
                    pathSegment.normalizedName = "__param__" + segId;
                }
                pathSegments.push(pathSegment);
                segId = segId + 1;
                match = segMatchEx.exec(normalizedPath);
            }
            return pathSegments;
        };
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
        return OasValidationRuleUtil;
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
    var __extends$1h = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Util for creating node paths.
     */
    var OasNodePathUtil = /** @class */ (function () {
        function OasNodePathUtil() {
        }
        OasNodePathUtil.createNodePath = function (node) {
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
        return OasNodePathUtil;
    }());
    /**
     * Base class for Node Path visitors for all versions of OpenAPI.
     */
    var OasNodePathVisitor = /** @class */ (function () {
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
        OasNodePathVisitor.prototype.visitValidationProblem = function (node) {
            this._path.prependSegment(node.errorCode, true);
            this._path.prependSegment("_validationProblems");
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
    var Oas20NodePathVisitor = /** @class */ (function (_super) {
        __extends$1h(Oas20NodePathVisitor, _super);
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
            this._path.prependSegment(node.statusCode() == null ? "default" : node.statusCode(), true);
        };
        Oas20NodePathVisitor.prototype.visitHeaders = function (node) {
            this._path.prependSegment("headers");
        };
        return Oas20NodePathVisitor;
    }(OasNodePathVisitor));
    /**
     * The 3.0 version of a node path visitor (creates a node path from a node).
     */
    var Oas30NodePathVisitor = /** @class */ (function (_super) {
        __extends$1h(Oas30NodePathVisitor, _super);
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
    var __extends$1i = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Base class for all validation rules.
     */
    var OasValidationRule = /** @class */ (function (_super) {
        __extends$1i(OasValidationRule, _super);
        /**
         * C'tor.
         * @param ruleInfo
         */
        function OasValidationRule(ruleInfo) {
            var _this = _super.call(this) || this;
            _this.ruleInfo = ruleInfo;
            return _this;
        }
        /**
         * Sets the reporter to use by this rule.
         * @param reporter
         */
        OasValidationRule.prototype.setReporter = function (reporter) {
            this._reporter = reporter;
        };
        /**
         * Called by validation rules to report an error.
         * @param node
         * @param property
         * @param messageParams
         */
        OasValidationRule.prototype.report = function (node, property, messageParams) {
            var message = this.ruleInfo.messageTemplate(messageParams || {});
            this._reporter.report(this.ruleInfo, node, property, message);
        };
        /**
         * Utility function to report path related errors.
         * @param node
         * @param messageParams
         */
        OasValidationRule.prototype.reportPathError = function (node, messageParams) {
            this.report(node, null, messageParams);
        };
        /**
         * Reports a validation error if the property is not valid.
         * @param isValid
         * @param node
         * @param property
         * @param messageParams
         */
        OasValidationRule.prototype.reportIfInvalid = function (isValid, node, property, messageParams) {
            if (!isValid) {
                this.report(node, property, messageParams);
            }
        };
        /**
         * Reports a validation error if the given condition is true.
         * @param condition
         * @param node
         * @param property
         * @param messageParams
         */
        OasValidationRule.prototype.reportIf = function (condition, node, property, messageParams) {
            if (condition) {
                this.report(node, property, messageParams);
            }
        };
        /**
         * Check if a property was defined.
         * @param propertyValue
         * @return {boolean}
         */
        OasValidationRule.prototype.isDefined = function (propertyValue) {
            return OasValidationRuleUtil.isDefined(propertyValue);
        };
        /**
         * Check if the property value exists (is not undefined and is not null).
         * @param propertyValue
         * @return {boolean}
         */
        OasValidationRule.prototype.hasValue = function (propertyValue) {
            return OasValidationRuleUtil.hasValue(propertyValue);
        };
        /**
         * Checks the path template against the regular expression and returns match result.
         *
         * @param pathTemplate
         * @return {boolean}
         */
        OasValidationRule.prototype.isPathWellFormed = function (pathTemplate) {
            return OasValidationRuleUtil.isPathWellFormed(pathTemplate);
        };
        /**
         * Finds all occurences of path segment patterns in a path template.
         *
         * @param pathTemplate
         * @return {PathSegment[]}
         */
        OasValidationRule.prototype.getPathSegments = function (pathTemplate) {
            return OasValidationRuleUtil.getPathSegments(pathTemplate);
        };
        /**
         * Check if a value is either null or undefined.
         * @param value
         * @return {boolean}
         */
        OasValidationRule.prototype.isNullOrUndefined = function (value) {
            return value === null || value === undefined;
        };
        return OasValidationRule;
    }(OasCombinedVisitorAdapter));

    /**
     * @license
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
    var __extends$1j = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Implements the Tag Name Uniqueness validation rule.
     */
    var OasTagUniquenessValidationRule = /** @class */ (function (_super) {
        __extends$1j(OasTagUniquenessValidationRule, _super);
        function OasTagUniquenessValidationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasTagUniquenessValidationRule.prototype.visitTag = function (node) {
            var tags = node.ownerDocument().tags;
            var tcount = tags.filter(function (tag) {
                return tag.name === node.name;
            }).length;
            this.reportIfInvalid(tcount === 1, node, node.name, {
                tagName: node.name
            });
        };
        return OasTagUniquenessValidationRule;
    }(OasValidationRule));
    /**
     * Implements the Operation ID Uniqueness validation rule.
     */
    var OasOperationIdUniquenessValidationRule = /** @class */ (function (_super) {
        __extends$1j(OasOperationIdUniquenessValidationRule, _super);
        function OasOperationIdUniquenessValidationRule() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.indexedOperations = {};
            return _this;
        }
        OasOperationIdUniquenessValidationRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.operationId)) {
                var dupes = this.indexedOperations[node.operationId];
                if (this.hasValue(dupes)) {
                    this.reportIfInvalid(dupes.length > 1, dupes[0], "operationId", {
                        operationId: node.operationId
                    });
                    this.report(node, "operationId", {
                        operationId: node.operationId
                    });
                    dupes.push(node);
                }
                else {
                    this.indexedOperations[node.operationId] = [node];
                }
            }
        };
        return OasOperationIdUniquenessValidationRule;
    }(OasValidationRule));
    /**
     * Implements the Parameter Uniqueness validation rule.
     */
    var OasParameterUniquenessValidationRule = /** @class */ (function (_super) {
        __extends$1j(OasParameterUniquenessValidationRule, _super);
        function OasParameterUniquenessValidationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Given a 'in' and a 'name' for a parameter, return the # of parameters in the list
         * of parameters that match.
         */
        OasParameterUniquenessValidationRule.prototype.getParamCount = function (params, paramName, paramIn) {
            var _this = this;
            return params.filter(function (param) {
                return _this.hasValue(param) && param.name === paramName && param.in === paramIn;
            }).length;
        };
        /**
         * Validates that all parameter name and "in" combinations are unique
         * @param params
         */
        OasParameterUniquenessValidationRule.prototype.ensureUnique = function (params) {
            var _this = this;
            if (!this.hasValue(params)) {
                return;
            }
            // Must validate against resolved params in the case where we're using $ref
            var resolvedParams = params.map(function (param) {
                return ReferenceUtil.resolveNodeRef(param);
            });
            // Loop through the resolved params looking for duplicates.
            resolvedParams.forEach(function (resolvedParam, idx) {
                if (_this.hasValue(resolvedParam) && _this.hasValue(resolvedParam.in) && _this.hasValue(resolvedParam.name) && resolvedParam.in !== "body") {
                    var count = _this.getParamCount(resolvedParams, resolvedParam.name, resolvedParam.in);
                    if (count > 1) {
                        // Report the error on the original param - not the resolved param.
                        var param = params[idx];
                        _this.report(param, "in", {
                            paramIn: resolvedParam.in,
                            paramName: resolvedParam.name
                        });
                    }
                }
            });
        };
        OasParameterUniquenessValidationRule.prototype.visitPathItem = function (node) {
            var pathItemParams = node.parameters;
            this.ensureUnique(pathItemParams);
        };
        OasParameterUniquenessValidationRule.prototype.visitOperation = function (node) {
            var opParams = node.parameters;
            this.ensureUnique(opParams);
        };
        return OasParameterUniquenessValidationRule;
    }(OasValidationRule));
    /**
     * Implements the Body Parameter Uniqueness validation rule (can only have 1 body param).
     */
    var OasBodyParameterUniquenessValidationRule = /** @class */ (function (_super) {
        __extends$1j(OasBodyParameterUniquenessValidationRule, _super);
        function OasBodyParameterUniquenessValidationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasBodyParameterUniquenessValidationRule.prototype.visitParameter = function (node) {
            var params = node.parent().parameters;
            if (node.in === "body") {
                this.reportIfInvalid(params.filter(function (param) {
                    return param.in === "body";
                }).length === 1, node, "in");
            }
        };
        return OasBodyParameterUniquenessValidationRule;
    }(OasValidationRule));

    /**
     * @license
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
    var __extends$1k = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Implements the Invalid API Host Rule.
     */
    var OasInvalidApiHostRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidApiHostRule, _super);
        function OasInvalidApiHostRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidApiHostRule.prototype.visitDocument = function (node) {
            if (this.hasValue(node.host)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidHost(node.host), node, "host");
            }
        };
        return OasInvalidApiHostRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid API Base Path Rule
     */
    var OasInvalidApiBasePathRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidApiBasePathRule, _super);
        function OasInvalidApiBasePathRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidApiBasePathRule.prototype.visitDocument = function (node) {
            if (this.hasValue(node.basePath)) {
                this.reportIfInvalid(node.basePath.indexOf("/") === 0, node, "basePath");
            }
        };
        return OasInvalidApiBasePathRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid API Description Rule
     */
    var OasInvalidApiDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidApiDescriptionRule, _super);
        function OasInvalidApiDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidApiDescriptionRule.prototype.visitInfo = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
            }
        };
        return OasInvalidApiDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Contact URL Rule
     */
    var OasInvalidContactUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidContactUrlRule, _super);
        function OasInvalidContactUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidContactUrlRule.prototype.visitContact = function (node) {
            if (this.hasValue(node.url)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.url), node, "url");
            }
        };
        return OasInvalidContactUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Contact Email Rule
     */
    var OasInvalidContactEmailRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidContactEmailRule, _super);
        function OasInvalidContactEmailRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidContactEmailRule.prototype.visitContact = function (node) {
            if (this.hasValue(node.email)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEmailAddress(node.email), node, "email");
            }
        };
        return OasInvalidContactEmailRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid License URL Rule
     */
    var OasInvalidLicenseUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidLicenseUrlRule, _super);
        function OasInvalidLicenseUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidLicenseUrlRule.prototype.visitLicense = function (node) {
            if (this.hasValue(node.url)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.url), node, "url");
            }
        };
        return OasInvalidLicenseUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Operation Description Rule
     */
    var OasInvalidOperationDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOperationDescriptionRule, _super);
        function OasInvalidOperationDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOperationDescriptionRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
            }
        };
        return OasInvalidOperationDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Operation Consumes Rule
     */
    var OasInvalidOperationConsumesRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOperationConsumesRule, _super);
        function OasInvalidOperationConsumesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOperationConsumesRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.consumes)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.consumes), node, "consumes");
            }
        };
        return OasInvalidOperationConsumesRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Operation Produces Rule
     */
    var OasInvalidOperationProducesRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOperationProducesRule, _super);
        function OasInvalidOperationProducesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOperationProducesRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.produces)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.produces), node, "produces");
            }
        };
        return OasInvalidOperationProducesRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid External Documentation Description Rule
     */
    var OasInvalidExternalDocsDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidExternalDocsDescriptionRule, _super);
        function OasInvalidExternalDocsDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidExternalDocsDescriptionRule.prototype.visitExternalDocumentation = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
            }
        };
        return OasInvalidExternalDocsDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid External Documentation URL Rule
     */
    var OasInvalidExternalDocsUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidExternalDocsUrlRule, _super);
        function OasInvalidExternalDocsUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidExternalDocsUrlRule.prototype.visitExternalDocumentation = function (node) {
            if (this.hasValue(node.url)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.url), node, "url");
            }
        };
        return OasInvalidExternalDocsUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Parameter Description Rule
     */
    var OasInvalidParameterDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidParameterDescriptionRule, _super);
        function OasInvalidParameterDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidParameterDescriptionRule.prototype.validateParameter = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
            }
        };
        OasInvalidParameterDescriptionRule.prototype.visitParameter = function (node) {
            this.validateParameter(node);
        };
        OasInvalidParameterDescriptionRule.prototype.visitParameterDefinition = function (node) {
            this.validateParameter(node);
        };
        return OasInvalidParameterDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Schema Items Default Value Rule
     */
    var OasInvalidSchemaItemsDefaultValueRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidSchemaItemsDefaultValueRule, _super);
        function OasInvalidSchemaItemsDefaultValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSchemaItemsDefaultValueRule.prototype.visitItems = function (node) {
            if (this.hasValue(node.default)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidForType(node.default, node), node, "default");
            }
        };
        return OasInvalidSchemaItemsDefaultValueRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Header Default Value Rule
     */
    var OasInvalidHeaderDefaultValueRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidHeaderDefaultValueRule, _super);
        function OasInvalidHeaderDefaultValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHeaderDefaultValueRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.default)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidForType(node.default, node), node, "default");
            }
        };
        return OasInvalidHeaderDefaultValueRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Tag Description Rule
     */
    var OasInvalidTagDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidTagDescriptionRule, _super);
        function OasInvalidTagDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidTagDescriptionRule.prototype.visitTag = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidGFM(node.description), node, "description");
            }
        };
        return OasInvalidTagDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Security Scheme Auth URL Rule
     */
    var OasInvalidSecuritySchemeAuthUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidSecuritySchemeAuthUrlRule, _super);
        function OasInvalidSecuritySchemeAuthUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSecuritySchemeAuthUrlRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.authorizationUrl)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "authorizationUrl");
            }
        };
        return OasInvalidSecuritySchemeAuthUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Security Scheme Token URL Rule
     */
    var OasInvalidSecuritySchemeTokenUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidSecuritySchemeTokenUrlRule, _super);
        function OasInvalidSecuritySchemeTokenUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSecuritySchemeTokenUrlRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.tokenUrl)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "tokenUrl");
            }
        };
        return OasInvalidSecuritySchemeTokenUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid XML Namespace URL Rule
     */
    var OasInvalidXmlNamespaceUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidXmlNamespaceUrlRule, _super);
        function OasInvalidXmlNamespaceUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidXmlNamespaceUrlRule.prototype.visitXML = function (node) {
            if (this.hasValue(node.namespace)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.namespace), node, "namespace");
            }
        };
        return OasInvalidXmlNamespaceUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Terms of Service URL Rule
     */
    var OasInvalidTermsOfServiceUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidTermsOfServiceUrlRule, _super);
        function OasInvalidTermsOfServiceUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidTermsOfServiceUrlRule.prototype.visitInfo = function (node) {
            if (this.hasValue(node.termsOfService)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.termsOfService), node, "termsOfService");
            }
        };
        return OasInvalidTermsOfServiceUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Response Description Rule
     */
    var OasInvalidResponseDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidResponseDescriptionRule, _super);
        function OasInvalidResponseDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidResponseDescriptionRule.prototype.visitResponseBase = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        OasInvalidResponseDescriptionRule.prototype.visitResponse = function (node) {
            this.visitResponseBase(node);
        };
        OasInvalidResponseDescriptionRule.prototype.visitResponseDefinition = function (node) {
            this.visitResponseBase(node);
        };
        return OasInvalidResponseDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Example Description Rule
     */
    var OasInvalidExampleDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidExampleDescriptionRule, _super);
        function OasInvalidExampleDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidExampleDescriptionRule.prototype.visitExample = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        OasInvalidExampleDescriptionRule.prototype.visitExampleDefinition = function (node) {
            this.visitExample(node);
        };
        return OasInvalidExampleDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Link Description Rule
     */
    var OasInvalidLinkDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidLinkDescriptionRule, _super);
        function OasInvalidLinkDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidLinkDescriptionRule.prototype.visitLink = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        OasInvalidLinkDescriptionRule.prototype.visitLinkDefinition = function (node) {
            this.visitLink(node);
        };
        return OasInvalidLinkDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid OAuth Authorization URL Rule
     */
    var OasInvalidOAuthAuthorizationUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOAuthAuthorizationUrlRule, _super);
        function OasInvalidOAuthAuthorizationUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOAuthAuthorizationUrlRule.prototype.visitFlow = function (node) {
            if (this.hasValue(node.authorizationUrl)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.authorizationUrl), node, "authorizationUrl");
            }
        };
        OasInvalidOAuthAuthorizationUrlRule.prototype.visitImplicitOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthAuthorizationUrlRule.prototype.visitPasswordOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthAuthorizationUrlRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthAuthorizationUrlRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        return OasInvalidOAuthAuthorizationUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid OAuth Token URL Rule
     */
    var OasInvalidOAuthTokenUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOAuthTokenUrlRule, _super);
        function OasInvalidOAuthTokenUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOAuthTokenUrlRule.prototype.visitFlow = function (node) {
            if (this.hasValue(node.tokenUrl)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.tokenUrl), node, "tokenUrl");
            }
        };
        OasInvalidOAuthTokenUrlRule.prototype.visitImplicitOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthTokenUrlRule.prototype.visitPasswordOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthTokenUrlRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthTokenUrlRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        return OasInvalidOAuthTokenUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid OAuth Refresh URL Rule
     */
    var OasInvalidOAuthRefreshUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOAuthRefreshUrlRule, _super);
        function OasInvalidOAuthRefreshUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOAuthRefreshUrlRule.prototype.visitFlow = function (node) {
            if (this.hasValue(node.refreshUrl)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.refreshUrl), node, "refreshUrl");
            }
        };
        OasInvalidOAuthRefreshUrlRule.prototype.visitImplicitOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthRefreshUrlRule.prototype.visitPasswordOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthRefreshUrlRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        OasInvalidOAuthRefreshUrlRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
            this.visitFlow(node);
        };
        return OasInvalidOAuthRefreshUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Path Item Description Rule
     */
    var OasInvalidPathItemDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidPathItemDescriptionRule, _super);
        function OasInvalidPathItemDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidPathItemDescriptionRule.prototype.visitPathItem = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        return OasInvalidPathItemDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Request Body Description Rule
     */
    var OasInvalidRequestBodyDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidRequestBodyDescriptionRule, _super);
        function OasInvalidRequestBodyDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidRequestBodyDescriptionRule.prototype.visitRequestBody = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        OasInvalidRequestBodyDescriptionRule.prototype.visitRequestBodyDefinition = function (node) {
            this.visitRequestBody(node);
        };
        return OasInvalidRequestBodyDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Header Description Rule
     */
    var OasInvalidHeaderDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidHeaderDescriptionRule, _super);
        function OasInvalidHeaderDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHeaderDescriptionRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        OasInvalidHeaderDescriptionRule.prototype.visitHeaderDefinition = function (node) {
            this.visitHeader(node);
        };
        return OasInvalidHeaderDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid OpenId Connect URL Rule
     */
    var OasInvalidOpenIDConnectUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidOpenIDConnectUrlRule, _super);
        function OasInvalidOpenIDConnectUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOpenIDConnectUrlRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.openIdConnectUrl)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrl(node.openIdConnectUrl), node, "openIdConnectUrl");
            }
        };
        return OasInvalidOpenIDConnectUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Security Scheme Description Rule
     */
    var OasInvalidSecuritySchemeDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidSecuritySchemeDescriptionRule, _super);
        function OasInvalidSecuritySchemeDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSecuritySchemeDescriptionRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        return OasInvalidSecuritySchemeDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Server Description Rule
     */
    var OasInvalidServerDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidServerDescriptionRule, _super);
        function OasInvalidServerDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidServerDescriptionRule.prototype.visitServer = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        return OasInvalidServerDescriptionRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Server URL Rule
     */
    var OasInvalidServerUrlRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidServerUrlRule, _super);
        function OasInvalidServerUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidServerUrlRule.prototype.visitServer = function (node) {
            if (this.hasValue(node.url)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidUrlTemplate(node.url), node, "url");
            }
        };
        return OasInvalidServerUrlRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Server Variable Description Rule
     */
    var OasInvalidServerVariableDescriptionRule = /** @class */ (function (_super) {
        __extends$1k(OasInvalidServerVariableDescriptionRule, _super);
        function OasInvalidServerVariableDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidServerVariableDescriptionRule.prototype.visitServerVariable = function (node) {
            if (this.hasValue(node.description)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidCommonMark(node.description), node, "description");
            }
        };
        return OasInvalidServerVariableDescriptionRule;
    }(OasValidationRule));

    /**
     * @license
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
    var __extends$1l = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Base class for all Invalid Property Name rules.
     */
    var OasInvalidPropertyNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidPropertyNameRule, _super);
        function OasInvalidPropertyNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the definition name is valid.
         * @param name
         * @return {boolean}
         */
        OasInvalidPropertyNameRule.prototype.isValidDefinitionName = function (name) {
            // TODO should this be different for OAS 2.0 vs. 3.x??  Only 3.x dictates the format to some extent (I think).
            var definitionNamePattern = /^[a-zA-Z0-9\.\-_]+$/;
            return definitionNamePattern.test(name);
        };
        /**
         * Returns true if the scope name is valid.
         * @param scope
         */
        OasInvalidPropertyNameRule.prototype.isValidScopeName = function (scope) {
            // TODO implement some reasonable rules for this
            return true;
        };
        /**
         * Finds all occurences of path segments that are empty.
         * i.e. they neither have a prefix nor a path variable within curly braces.
         *
         * @param pathSegments
         * @return {PathSegment[]}
         */
        OasInvalidPropertyNameRule.prototype.findEmptySegmentsInPath = function (pathSegments) {
            return pathSegments.filter(function (pathSegment) {
                return pathSegment.prefix === "" && pathSegment.formalName === undefined;
            });
        };
        /**
         * Finds path segments that are duplicates i.e. they have the same formal name used across multiple segments.
         * For example, in a path like /prefix/{var1}/{var1}, var1 is used in multiple segments.
         *
         * @param pathSegments
         * @return {PathSegment[]}
         */
        OasInvalidPropertyNameRule.prototype.findDuplicateParametersInPath = function (pathSegments) {
            var uniq = pathSegments
                .filter(function (pathSegment) {
                return pathSegment.formalName !== undefined;
            })
                .map(function (pathSegment) {
                return { parameter: pathSegment.formalName, count: 1 };
            })
                .reduce(function (parameterCounts, segmentEntry) {
                parameterCounts[segmentEntry.parameter] = (parameterCounts[segmentEntry.parameter] || 0) + segmentEntry.count;
                return parameterCounts;
            }, {});
            return Object.keys(uniq).filter(function (a) { return uniq[a] > 1; });
        };
        return OasInvalidPropertyNameRule;
    }(OasValidationRule));
    /**
     * Implements the Empty Path Segment Rule.
     */
    var OasEmptyPathSegmentRule = /** @class */ (function (_super) {
        __extends$1l(OasEmptyPathSegmentRule, _super);
        function OasEmptyPathSegmentRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasEmptyPathSegmentRule.prototype.visitPathItem = function (node) {
            var pathTemplate = node.path();
            var pathSegments;
            if (this.isPathWellFormed(pathTemplate) === true) {
                pathSegments = this.getPathSegments(pathTemplate);
                var emptySegments = this.findEmptySegmentsInPath(pathSegments);
                if (emptySegments.length > 0) {
                    this.reportPathError(node, {
                        path: node.path()
                    });
                }
            }
        };
        return OasEmptyPathSegmentRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Duplicate Path Segment Rule.
     */
    var OasDuplicatePathSegmentRule = /** @class */ (function (_super) {
        __extends$1l(OasDuplicatePathSegmentRule, _super);
        function OasDuplicatePathSegmentRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasDuplicatePathSegmentRule.prototype.visitPathItem = function (node) {
            var pathTemplate = node.path();
            var pathSegments;
            if (this.isPathWellFormed(pathTemplate) === true) {
                pathSegments = this.getPathSegments(pathTemplate);
                var duplicateParameters = this.findDuplicateParametersInPath(pathSegments);
                if (duplicateParameters.length > 0) {
                    this.reportPathError(node, {
                        path: node.path(),
                        duplicates: duplicateParameters.join(", ")
                    });
                }
            }
        };
        return OasDuplicatePathSegmentRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Path Segment Rule.
     */
    var OasInvalidPathSegmentRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidPathSegmentRule, _super);
        function OasInvalidPathSegmentRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidPathSegmentRule.prototype.visitPathItem = function (node) {
            var pathTemplate = node.path();
            if (!this.isPathWellFormed(pathTemplate) === true) {
                this.reportPathError(node, {
                    path: node.path()
                });
            }
        };
        return OasInvalidPathSegmentRule;
    }(OasInvalidPropertyNameRule));
    var OasIdenticalPathTemplateRule = /** @class */ (function (_super) {
        __extends$1l(OasIdenticalPathTemplateRule, _super);
        function OasIdenticalPathTemplateRule() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.indexedPathTemplates = {};
            return _this;
        }
        /**
         * Utility function to find other paths that are semantically similar to the path that is being checked against.
         * Two paths that differ only in formal parameter name are considered identical.
         * For example, paths /test/{var1} and /test/{var2} are identical.
         * See OAS 3 Specification's Path Templates section for more details.
         *
         * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#path-templating-matching
         *
         * @param pathToCheck
         * @param pathIndex
         */
        OasIdenticalPathTemplateRule.prototype.findIdenticalPaths = function (pathToCheck, pathIndex) {
            var _this = this;
            var identicalPaths = [];
            var pathSegments = pathIndex[pathToCheck].pathSegments;
            Object.keys(pathIndex)
                .filter(function (checkAgainst) { return checkAgainst !== pathToCheck; })
                .forEach(function (checkAgainst) {
                var segmentsIdential = true;
                var pathSegmentsToCheckAgainst = pathIndex[checkAgainst].pathSegments;
                if (pathSegments.length !== pathSegmentsToCheckAgainst.length) {
                    segmentsIdential = false;
                }
                else {
                    pathSegments.forEach(function (pathSegment, index) {
                        segmentsIdential =
                            segmentsIdential && _this.isSegmentIdentical(pathSegment, pathSegmentsToCheckAgainst[index]);
                    });
                }
                if (segmentsIdential === true) {
                    identicalPaths.push(checkAgainst);
                }
            });
            return identicalPaths;
        };
        /**
         * Utility function to test the equality of two path segments.
         * Segments are considered equal if they have same prefixes (if any) and same "normalized name".
         *
         * @param segment1
         * @param segment2
         * @return {boolean}
         */
        OasIdenticalPathTemplateRule.prototype.isSegmentIdentical = function (segment1, segment2) {
            if (segment1.prefix === segment2.prefix) {
                if (segment1.normalizedName === undefined && segment2.normalizedName === undefined) {
                    return true;
                }
                if ((segment1.normalizedName === undefined && segment2.normalizedName !== undefined) ||
                    (segment1.normalizedName !== undefined && segment2.normalizedName === undefined)) {
                    return false;
                }
                return segment1.normalizedName === segment2.normalizedName;
            }
            return false;
        };
        OasIdenticalPathTemplateRule.prototype.visitPathItem = function (node) {
            var _this = this;
            var pathTemplate = node.path();
            if (this.isPathWellFormed(pathTemplate)) {
                var pathSegments = this.getPathSegments(pathTemplate);
                var currentPathRecord = {
                    identicalReported: false,
                    pathSegments: pathSegments,
                    node: node,
                };
                this.indexedPathTemplates[pathTemplate] = currentPathRecord;
                var identicalPaths = this.findIdenticalPaths(pathTemplate, this.indexedPathTemplates);
                if (identicalPaths.length > 0) {
                    this.reportPathError(node, { path: node.path() });
                    currentPathRecord.identicalReported = true;
                    identicalPaths.forEach(function (path) {
                        var identicalPathRecord = _this.indexedPathTemplates[path];
                        if (identicalPathRecord.identicalReported === false) {
                            _this.reportPathError(identicalPathRecord.node, { path: node.path() });
                            identicalPathRecord.identicalReported = true;
                        }
                    });
                }
            }
        };
        return OasIdenticalPathTemplateRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Http Response Code Rule.
     */
    var OasInvalidHttpResponseCodeRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidHttpResponseCodeRule, _super);
        function OasInvalidHttpResponseCodeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHttpResponseCodeRule.prototype.visitResponse = function (node) {
            // The "default" response will have a statusCode of "null"
            if (this.hasValue(node.statusCode())) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidHttpCode(node.statusCode()), node, "statusCode", {
                    statusCode: node.statusCode()
                });
            }
        };
        return OasInvalidHttpResponseCodeRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Unmatched Example Type Rule.
     */
    var OasUnmatchedExampleTypeRule = /** @class */ (function (_super) {
        __extends$1l(OasUnmatchedExampleTypeRule, _super);
        function OasUnmatchedExampleTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnmatchedExampleTypeRule.prototype.visitExample = function (node) {
            var _this = this;
            var produces = node.ownerDocument().produces;
            var operation = node.parent().parent().parent();
            if (this.hasValue(operation.produces)) {
                produces = operation.produces;
            }
            if (!this.hasValue(produces)) {
                produces = [];
            }
            var ctypes = node.exampleContentTypes();
            ctypes.forEach(function (ct) {
                _this.reportIfInvalid(produces.indexOf(ct) !== -1, node, "produces", {
                    contentType: ct
                });
            });
        };
        return OasUnmatchedExampleTypeRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Schema Definition Name Rule.
     */
    var OasInvalidSchemaDefNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidSchemaDefNameRule, _super);
        function OasInvalidSchemaDefNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSchemaDefNameRule.prototype.visitSchemaDefinition = function (node) {
            if (node.ownerDocument().is2xDocument()) {
                this.reportIfInvalid(this.isValidDefinitionName(node.definitionName()), node, "definitionName");
            }
            else {
                this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
            }
        };
        return OasInvalidSchemaDefNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Parameter Definition Name Rule.
     */
    var OasInvalidParameterDefNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidParameterDefNameRule, _super);
        function OasInvalidParameterDefNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidParameterDefNameRule.prototype.visitParameterDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.parameterName()), node, "parameterName");
        };
        return OasInvalidParameterDefNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Response Definition Name Rule.
     */
    var OasInvalidResponseDefNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidResponseDefNameRule, _super);
        function OasInvalidResponseDefNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidResponseDefNameRule.prototype.visitResponseDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
        };
        return OasInvalidResponseDefNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Scope Name Rule.
     */
    var OasInvalidScopeNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidScopeNameRule, _super);
        function OasInvalidScopeNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidScopeNameRule.prototype.visitScopes = function (node) {
            var _this = this;
            node.scopes().forEach(function (scope) {
                _this.reportIfInvalid(_this.isValidScopeName(scope), node, "scopes", {
                    scope: scope
                });
            });
        };
        return OasInvalidScopeNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Security Scheme Name Rule.
     */
    var OasInvalidSecuritySchemeNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidSecuritySchemeNameRule, _super);
        function OasInvalidSecuritySchemeNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSecuritySchemeNameRule.prototype.visitSecurityScheme = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.schemeName()), node, "schemeName");
        };
        return OasInvalidSecuritySchemeNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Example Definition Name Rule.
     */
    var OasInvalidExampleDefinitionNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidExampleDefinitionNameRule, _super);
        function OasInvalidExampleDefinitionNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidExampleDefinitionNameRule.prototype.visitExampleDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
        };
        return OasInvalidExampleDefinitionNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Request Body Definition Name Rule.
     */
    var OasInvalidRequestBodyDefinitionNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidRequestBodyDefinitionNameRule, _super);
        function OasInvalidRequestBodyDefinitionNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidRequestBodyDefinitionNameRule.prototype.visitRequestBodyDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
        };
        return OasInvalidRequestBodyDefinitionNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Header Definition Name Rule.
     */
    var OasInvalidHeaderDefinitionNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidHeaderDefinitionNameRule, _super);
        function OasInvalidHeaderDefinitionNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHeaderDefinitionNameRule.prototype.visitHeaderDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
        };
        return OasInvalidHeaderDefinitionNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Link Definition Name Rule.
     */
    var OasInvalidLinkDefinitionNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidLinkDefinitionNameRule, _super);
        function OasInvalidLinkDefinitionNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidLinkDefinitionNameRule.prototype.visitLinkDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
        };
        return OasInvalidLinkDefinitionNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Invalid Callback Definition Name Rule.
     */
    var OasInvalidCallbackDefinitionNameRule = /** @class */ (function (_super) {
        __extends$1l(OasInvalidCallbackDefinitionNameRule, _super);
        function OasInvalidCallbackDefinitionNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidCallbackDefinitionNameRule.prototype.visitCallbackDefinition = function (node) {
            this.reportIfInvalid(this.isValidDefinitionName(node.name()), node, "name");
        };
        return OasInvalidCallbackDefinitionNameRule;
    }(OasInvalidPropertyNameRule));
    /**
     * Implements the Unmatched Encoding Property Rule.
     */
    var OasUnmatchedEncodingPropertyRule = /** @class */ (function (_super) {
        __extends$1l(OasUnmatchedEncodingPropertyRule, _super);
        function OasUnmatchedEncodingPropertyRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the given schema has a property defined with the given name.
         * @param {Oas30Schema} schema
         * @param {string} propertyName
         * @return {boolean}
         */
        OasUnmatchedEncodingPropertyRule.prototype.isValidSchemaProperty = function (schema, propertyName) {
            if (this.isNullOrUndefined(schema)) {
                return false;
            }
            return !this.isNullOrUndefined(schema.property(propertyName));
        };
        OasUnmatchedEncodingPropertyRule.prototype.visitEncoding = function (node) {
            var name = node.name();
            var schema = node.parent().schema;
            this.reportIfInvalid(this.isValidSchemaProperty(schema, name), node, name, {
                name: name
            });
        };
        return OasUnmatchedEncodingPropertyRule;
    }(OasInvalidPropertyNameRule));

    /**
     * @license
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
    var __extends$1m = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Implements the Unknown Property rule.
     */
    var OasUnknownPropertyRule = /** @class */ (function (_super) {
        __extends$1m(OasUnknownPropertyRule, _super);
        function OasUnknownPropertyRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownPropertyRule.prototype.validateNode = function (node) {
            var _this = this;
            if (node.hasExtraProperties()) {
                node.getExtraPropertyNames().forEach(function (pname) {
                    _this.report(node, pname, {
                        property: pname
                    });
                });
            }
        };
        OasUnknownPropertyRule.prototype.visitDocument = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitInfo = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitContact = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitLicense = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitPaths = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitPathItem = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitOperation = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitParameter = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitParameterDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitExternalDocumentation = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitSecurityRequirement = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitResponses = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitResponse = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitResponseDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitHeaders = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitHeader = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitExample = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitItems = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitTag = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitSecurityDefinitions = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitSecurityScheme = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitScopes = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitXML = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitSchemaDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitPropertySchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitAdditionalPropertiesSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitAllOfSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitItemsSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitDefinitions = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitParametersDefinitions = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitResponsesDefinitions = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitExtension = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitMediaType = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitEncoding = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitLink = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitLinkParameterExpression = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitLinkRequestBodyExpression = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitLinkServer = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitRequestBody = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitCallback = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitCallbackPathItem = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitServer = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitServerVariable = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitAnyOfSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitOneOfSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitNotSchema = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitComponents = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitExampleDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitRequestBodyDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitHeaderDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitOAuthFlows = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitImplicitOAuthFlow = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitPasswordOAuthFlow = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitClientCredentialsOAuthFlow = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitLinkDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitCallbackDefinition = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitDiscriminator = function (node) { this.validateNode(node); };
        OasUnknownPropertyRule.prototype.visitValidationProblem = function (node) { this.validateNode(node); };
        return OasUnknownPropertyRule;
    }(OasValidationRule));

    /**
     * @license
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
    var __extends$1n = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Used to find an operation with a given operation id.
     */
    var Oas30OperationFinder = /** @class */ (function (_super) {
        __extends$1n(Oas30OperationFinder, _super);
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
     * Base class for all Invalid Property Value rules.
     */
    var OasInvalidPropertyValueRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidPropertyValueRule, _super);
        function OasInvalidPropertyValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the given media type name is multipart/* or application/x-www-form-urlencoded
         * @param {string} typeName
         * @return {boolean}
         */
        OasInvalidPropertyValueRule.prototype.isValidMultipartType = function (typeName) {
            return typeName === "application/x-www-form-urlencoded" || typeName.indexOf("multipart") === 0;
        };
        /**
         * Merges all parameters applicable for an operation - those defined within the operation and those defined at the pathItem level.
         * Resolves parameters that are not defined inline but are referenced from the components/parameters section.
         * @param {Oas30Operation} - Operation for which to merge parameters.
         * @return {Oas30Parameter[]} - array of merged paramters.
         */
        OasInvalidPropertyValueRule.prototype.mergeParameters = function (node) {
            var paramsKey = {};
            var parentNode = node.parent();
            // Get the parameters from pathItem
            if (this.hasValue(parentNode.parameters)) {
                parentNode.parameters.forEach(function (param) {
                    var resolutionResult = ReferenceUtil.resolveNodeRef(param);
                    if (resolutionResult) {
                        var key = resolutionResult.in + "-" + resolutionResult.name;
                        paramsKey[key] = resolutionResult;
                    }
                });
            }
            // Overwrite parameters from parent
            if (this.hasValue(node.parameters)) {
                node.parameters.forEach(function (param) {
                    var resolutionResult = ReferenceUtil.resolveNodeRef(param);
                    if (resolutionResult) {
                        var key = resolutionResult.in + "-" + resolutionResult.name;
                        paramsKey[key] = resolutionResult;
                    }
                });
            }
            var mergedParameters = [];
            for (var key in paramsKey) {
                mergedParameters.push(paramsKey[key]);
            }
            return mergedParameters;
        };
        return OasInvalidPropertyValueRule;
    }(OasValidationRule));
    /**
     * Implements the XXX rule.
     */
    var OasInvalidApiSchemeRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidApiSchemeRule, _super);
        function OasInvalidApiSchemeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidApiSchemeRule.prototype.visitDocument = function (node) {
            var _this = this;
            if (this.hasValue(node.schemes)) {
                node.schemes.forEach(function (scheme) {
                    _this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "schemes", {
                        scheme: scheme
                    });
                });
            }
        };
        return OasInvalidApiSchemeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Invalid API 'Consumes' Mime-Type rule.
     */
    var OasInvalidApiConsumesMTRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidApiConsumesMTRule, _super);
        function OasInvalidApiConsumesMTRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidApiConsumesMTRule.prototype.visitDocument = function (node) {
            if (this.hasValue(node.consumes)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.consumes), node, "consumes");
            }
        };
        return OasInvalidApiConsumesMTRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Invalid API 'Produces' Mime-Type rule.
     */
    var OasInvalidApiProducesMTRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidApiProducesMTRule, _super);
        function OasInvalidApiProducesMTRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidApiProducesMTRule.prototype.visitDocument = function (node) {
            if (this.hasValue(node.produces)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidMimeType(node.produces), node, "produces");
            }
        };
        return OasInvalidApiProducesMTRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Operation Summary Too Long rule.
     */
    var OasOperationSummaryTooLongRule = /** @class */ (function (_super) {
        __extends$1n(OasOperationSummaryTooLongRule, _super);
        function OasOperationSummaryTooLongRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasOperationSummaryTooLongRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.summary)) {
                this.reportIfInvalid(node.summary.length < 120, node, "summary");
            }
        };
        return OasOperationSummaryTooLongRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Invalid Operation ID rule.
     */
    var OasInvalidOperationIdRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidOperationIdRule, _super);
        function OasInvalidOperationIdRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the given value is a valid operationId.
         * @param id
         */
        OasInvalidOperationIdRule.prototype.isValidOperationId = function (id) {
            // TODO implement a regex for this? should be something like camelCase
            return true;
        };
        OasInvalidOperationIdRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.operationId)) {
                this.reportIfInvalid(this.isValidOperationId(node.operationId), node, "operationId");
            }
        };
        return OasInvalidOperationIdRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Invalid Operation Scheme rule.
     */
    var OasInvalidOperationSchemeRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidOperationSchemeRule, _super);
        function OasInvalidOperationSchemeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidOperationSchemeRule.prototype.visitOperation = function (node) {
            var _this = this;
            if (this.hasValue(node.schemes)) {
                node.schemes.forEach(function (scheme) {
                    _this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(scheme, ["http", "https", "ws", "wss"]), node, "schemes", {
                        scheme: scheme
                    });
                });
            }
        };
        return OasInvalidOperationSchemeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Path Parameter Not Found rule.
     */
    var OasPathParamNotFoundRule = /** @class */ (function (_super) {
        __extends$1n(OasPathParamNotFoundRule, _super);
        function OasPathParamNotFoundRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasPathParamNotFoundRule.prototype.visitParameter = function (node) {
            var resolvedParam = ReferenceUtil.resolveNodeRef(node);
            if (this.hasValue(resolvedParam) && resolvedParam.in === "path") {
                // Note: parent may be an operation *or* a path-item.
                var pathItem = void 0;
                if (node.parent()["_path"]) {
                    pathItem = node.parent();
                }
                else {
                    pathItem = node.parent().parent();
                }
                var path = pathItem.path();
                var pathSegs = this.getPathSegments(path);
                this.reportIfInvalid(pathSegs.filter(function (pathSeg) { return pathSeg.formalName === resolvedParam.name; }).length > 0, node, "name", {
                    name: resolvedParam.name
                });
            }
        };
        return OasPathParamNotFoundRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Form Data Parameter Not Allowed rule.
     */
    var OasFormDataParamNotAllowedRule = /** @class */ (function (_super) {
        __extends$1n(OasFormDataParamNotAllowedRule, _super);
        function OasFormDataParamNotAllowedRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasFormDataParamNotAllowedRule.prototype.visitParameter = function (node) {
            if (node.in === "formData") {
                var consumes = node.ownerDocument().consumes;
                if (!node.parent()["_path"]) {
                    var operation = node.parent();
                    if (this.hasValue(operation.consumes)) {
                        consumes = operation.consumes;
                    }
                }
                if (!this.hasValue(consumes)) {
                    consumes = [];
                }
                var valid = consumes.indexOf("application/x-www-form-urlencoded") >= 0 || consumes.indexOf("multipart/form-data") >= 0;
                this.reportIfInvalid(valid, node, "consumes");
            }
        };
        return OasFormDataParamNotAllowedRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Parameter Location rule.
     */
    var OasUnknownParamLocationRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownParamLocationRule, _super);
        function OasUnknownParamLocationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownParamLocationRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.in)) {
                if (node.ownerDocument().is2xDocument()) {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "path", "formData", "body"]), node, "in", {
                        options: "query, header, path, formData, body"
                    });
                }
                else {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "path", "cookie"]), node, "in", {
                        options: "query, header, path, cookie"
                    });
                }
            }
        };
        return OasUnknownParamLocationRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Parameter Type rule.
     */
    var OasUnknownParamTypeRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownParamTypeRule, _super);
        function OasUnknownParamTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownParamTypeRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.type)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, ["string", "number", "integer", "boolean", "array", "file"]), node, "type");
            }
        };
        return OasUnknownParamTypeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Parameter Format rule.
     */
    var OasUnknownParamFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownParamFormatRule, _super);
        function OasUnknownParamFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownParamFormatRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.format)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.format, ["int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password"]), node, "format");
            }
        };
        return OasUnknownParamFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Parameter Usage of 'allowEmptyValue' rule.
     */
    var OasUnexpectedParamAllowEmptyValueRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedParamAllowEmptyValueRule, _super);
        function OasUnexpectedParamAllowEmptyValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedParamAllowEmptyValueRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.allowEmptyValue)) {
                if (node.ownerDocument().is2xDocument()) {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "formData"]), node, "allowEmptyValue", {
                        options: "Query and Form Data"
                    });
                }
                else {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query"]), node, "allowEmptyValue", {
                        options: "Query"
                    });
                }
            }
        };
        return OasUnexpectedParamAllowEmptyValueRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Parameter Usage of 'collectionFormat' rule.
     */
    var OasUnexpectedParamCollectionFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedParamCollectionFormatRule, _super);
        function OasUnexpectedParamCollectionFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedParamCollectionFormatRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.collectionFormat)) {
                this.reportIfInvalid(node.type === "array", node, "collectionFormat");
            }
        };
        return OasUnexpectedParamCollectionFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Parameter Collection Format rule.
     */
    var OasUnknownParamCollectionFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownParamCollectionFormatRule, _super);
        function OasUnknownParamCollectionFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownParamCollectionFormatRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.collectionFormat)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, ["csv", "ssv", "tsv", "pipes", "multi"]), node, "collectionFormat");
            }
        };
        return OasUnknownParamCollectionFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Parameter Usage of 'multi' rule.
     */
    var OasUnexpectedParamMultiRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedParamMultiRule, _super);
        function OasUnexpectedParamMultiRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedParamMultiRule.prototype.visitParameter = function (node) {
            if (node.collectionFormat === "multi") {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "formData"]), node, "collectionFormat");
            }
        };
        return OasUnexpectedParamMultiRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Required Parameter With Default Value rule.
     */
    var OasRequiredParamWithDefaultValueRule = /** @class */ (function (_super) {
        __extends$1n(OasRequiredParamWithDefaultValueRule, _super);
        function OasRequiredParamWithDefaultValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasRequiredParamWithDefaultValueRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.default)) {
                this.reportIfInvalid(node.required === undefined || node.required === null || node.required === false, node, "default");
            }
        };
        return OasRequiredParamWithDefaultValueRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Array Type rule.
     */
    var OasUnknownArrayTypeRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownArrayTypeRule, _super);
        function OasUnknownArrayTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownArrayTypeRule.prototype.visitItems = function (node) {
            if (this.hasValue(node.type)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, ["string", "number", "integer", "boolean", "array"]), node, "type");
            }
        };
        return OasUnknownArrayTypeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Array Format rule.
     */
    var OasUnknownArrayFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownArrayFormatRule, _super);
        function OasUnknownArrayFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownArrayFormatRule.prototype.visitItems = function (node) {
            if (this.hasValue(node.format)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.format, ["int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password"]), node, "format");
            }
        };
        return OasUnknownArrayFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Array Collection Format rule.
     */
    var OasUnknownArrayCollectionFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownArrayCollectionFormatRule, _super);
        function OasUnknownArrayCollectionFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownArrayCollectionFormatRule.prototype.visitItems = function (node) {
            if (this.hasValue(node.collectionFormat)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, ["csv", "ssv", "tsv", "pipes"]), node, "collectionFormat");
            }
        };
        return OasUnknownArrayCollectionFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Array Usage of 'collectionFormat' rule.
     */
    var OasUnexpectedArrayCollectionFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedArrayCollectionFormatRule, _super);
        function OasUnexpectedArrayCollectionFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedArrayCollectionFormatRule.prototype.visitItems = function (node) {
            if (this.hasValue(node.collectionFormat)) {
                this.reportIfInvalid(node.type === "array", node, "collectionFormat");
            }
        };
        return OasUnexpectedArrayCollectionFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Header Type rule.
     */
    var OasUnknownHeaderTypeRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownHeaderTypeRule, _super);
        function OasUnknownHeaderTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownHeaderTypeRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.type)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, ["string", "number", "integer", "boolean", "array"]), node, "type");
            }
        };
        return OasUnknownHeaderTypeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Header Format rule.
     */
    var OasUnknownHeaderFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownHeaderFormatRule, _super);
        function OasUnknownHeaderFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownHeaderFormatRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.format)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.format, ["int32", "int64", "float", "double", "byte", "binary", "date", "date-time", "password"]), node, "format");
            }
        };
        return OasUnknownHeaderFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Header Usage of 'collectionFormat' rule.
     */
    var OasUnexpectedHeaderCollectionFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedHeaderCollectionFormatRule, _super);
        function OasUnexpectedHeaderCollectionFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedHeaderCollectionFormatRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.collectionFormat)) {
                this.reportIfInvalid(node.type === "array", node, "collectionFormat");
            }
        };
        return OasUnexpectedHeaderCollectionFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Header Collection Format rule.
     */
    var OasUnknownHeaderCollectionFormatRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownHeaderCollectionFormatRule, _super);
        function OasUnknownHeaderCollectionFormatRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownHeaderCollectionFormatRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.collectionFormat)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.collectionFormat, ["csv", "ssv", "tsv", "pipes"]), node, "collectionFormat");
            }
        };
        return OasUnknownHeaderCollectionFormatRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected XML Wrapping rule.
     */
    var OasUnexpectedXmlWrappingRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedXmlWrappingRule, _super);
        function OasUnexpectedXmlWrappingRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if it's OK to use "wrapped" in the XML node.  It's only OK to do this if
         * the type being defined is an 'array' type.
         * @param xml
         * @return {boolean}
         */
        OasUnexpectedXmlWrappingRule.prototype.isWrappedOK = function (xml) {
            var schema = xml.parent();
            return schema.type === "array";
        };
        OasUnexpectedXmlWrappingRule.prototype.visitXML = function (node) {
            if (this.hasValue(node.wrapped)) {
                this.reportIfInvalid(this.isWrappedOK(node), node, "wrapped");
            }
        };
        return OasUnexpectedXmlWrappingRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Security Scheme Type rule.
     */
    var OasUnknownSecuritySchemeTypeRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownSecuritySchemeTypeRule, _super);
        function OasUnknownSecuritySchemeTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownSecuritySchemeTypeRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.type)) {
                if (node.ownerDocument().is2xDocument()) {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, ["apiKey", "basic", "oauth2"]), node, "type", {
                        options: "basic, apiKey, oauth2"
                    });
                }
                else {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.type, ["apiKey", "http", "oauth2", "openIdConnect"]), node, "type", {
                        options: "http, apiKey, oauth2, openIdConnect"
                    });
                }
            }
        };
        return OasUnknownSecuritySchemeTypeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown API-Key Location rule.
     */
    var OasUnknownApiKeyLocationRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownApiKeyLocationRule, _super);
        function OasUnknownApiKeyLocationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownApiKeyLocationRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.in)) {
                if (node.ownerDocument().is2xDocument()) {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header"]), node, "in", {
                        options: "query, header"
                    });
                }
                else {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.in, ["query", "header", "cookie"]), node, "in", {
                        options: "query, header, cookie"
                    });
                }
            }
        };
        return OasUnknownApiKeyLocationRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown OAuth Flow Type rule.
     */
    var OasUnknownOauthFlowTypeRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownOauthFlowTypeRule, _super);
        function OasUnknownOauthFlowTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownOauthFlowTypeRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.flow)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.flow, ["implicit", "password", "application", "accessCode"]), node, "flow");
            }
        };
        return OasUnknownOauthFlowTypeRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Security Requirement Scopes Must Be Empty rule.
     */
    var OasSecurityRequirementScopesMustBeEmptyRule = /** @class */ (function (_super) {
        __extends$1n(OasSecurityRequirementScopesMustBeEmptyRule, _super);
        function OasSecurityRequirementScopesMustBeEmptyRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasSecurityRequirementScopesMustBeEmptyRule.prototype.findSecurityScheme = function (document, schemeName) {
            if (document.is2xDocument()) {
                var doc20 = document;
                if (this.hasValue(doc20.securityDefinitions)) {
                    return doc20.securityDefinitions.securityScheme(schemeName);
                }
            }
            else {
                var doc30 = document;
                if (this.hasValue(doc30.components)) {
                    return doc30.components.getSecurityScheme(schemeName);
                }
            }
            return null;
        };
        OasSecurityRequirementScopesMustBeEmptyRule.prototype.visitSecurityRequirement = function (node) {
            var _this = this;
            var allowedTypes = ["oauth2"];
            var options = "\"oauth2\"";
            if (node.ownerDocument().is3xDocument()) {
                allowedTypes.push("openIdConnect");
                options = "\"oauth2\" or \"openIdConnect\"";
            }
            var snames = node.securityRequirementNames();
            snames.forEach(function (sname) {
                var scheme = _this.findSecurityScheme(node.ownerDocument(), sname);
                if (_this.hasValue(scheme)) {
                    if (allowedTypes.indexOf(scheme.type) === -1) {
                        var scopes = node.scopes(sname);
                        _this.reportIfInvalid(_this.hasValue(scopes) && scopes.length === 0, node, null, {
                            sname: sname,
                            options: options
                        });
                    }
                }
            });
        };
        return OasSecurityRequirementScopesMustBeEmptyRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Security Requirement Scope(s) rule.
     */
    var OasUnexpectedSecurityRequirementScopesRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedSecurityRequirementScopesRule, _super);
        function OasUnexpectedSecurityRequirementScopesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the given required scopes are all actually defined by the security definition.
         * @param requiredScopes
         * @param definedScopes
         */
        OasUnexpectedSecurityRequirementScopesRule.prototype.isValidScopes = function (requiredScopes, definedScopes) {
            var rval = true;
            var dscopes = [];
            if (definedScopes) {
                dscopes = definedScopes.scopes();
            }
            requiredScopes.forEach(function (requiredScope) {
                if (dscopes.indexOf(requiredScope) === -1) {
                    rval = false;
                }
            });
            return rval;
        };
        OasUnexpectedSecurityRequirementScopesRule.prototype.visitSecurityRequirement = function (node) {
            var _this = this;
            var snames = node.securityRequirementNames();
            snames.forEach(function (sname) {
                var sdefs = node.ownerDocument().securityDefinitions;
                if (_this.hasValue(sdefs)) {
                    var scheme = node.ownerDocument().securityDefinitions.securityScheme(sname);
                    if (_this.hasValue(scheme)) {
                        if (scheme.type === "oauth2") {
                            var definedScopes = scheme.scopes;
                            var requiredScopes = node.scopes(sname);
                            _this.reportIfInvalid(_this.isValidScopes(requiredScopes, definedScopes), node, null, {
                                sname: sname
                            });
                        }
                    }
                }
            });
        };
        return OasUnexpectedSecurityRequirementScopesRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unexpected Header Usage rule.
     */
    var OasUnexpectedHeaderUsageRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedHeaderUsageRule, _super);
        function OasUnexpectedHeaderUsageRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedHeaderUsageRule.prototype.visitEncoding = function (node) {
            if (node.getHeaders().length > 0) {
                var mediaType = node.parent();
                this.reportIfInvalid(mediaType.name().indexOf("multipart") === 0, node, "headers", {
                    name: mediaType.name()
                });
            }
        };
        return OasUnexpectedHeaderUsageRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Encoding Style Not Allowed rule.
     */
    var OasEncodingStyleNotAllowedRule = /** @class */ (function (_super) {
        __extends$1n(OasEncodingStyleNotAllowedRule, _super);
        function OasEncodingStyleNotAllowedRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasEncodingStyleNotAllowedRule.prototype.visitEncoding = function (node) {
            if (this.hasValue(node.style)) {
                var mediaType = node.parent();
                this.reportIfInvalid(mediaType.name().indexOf("application/x-www-form-urlencoded") === 0, node, "style", {
                    name: mediaType.name()
                });
            }
        };
        return OasEncodingStyleNotAllowedRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Explode Not Allowed rule.
     */
    var OasExplodeNotAllowedRule = /** @class */ (function (_super) {
        __extends$1n(OasExplodeNotAllowedRule, _super);
        function OasExplodeNotAllowedRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasExplodeNotAllowedRule.prototype.visitEncoding = function (node) {
            if (this.hasValue(node.explode)) {
                var mediaType = node.parent();
                this.reportIf(mediaType.name() !== "application/x-www-form-urlencoded", node, "explode", {
                    name: mediaType.name()
                });
            }
        };
        return OasExplodeNotAllowedRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Allow Reserved Not Allowed rule.
     */
    var OasAllowReservedNotAllowedRule = /** @class */ (function (_super) {
        __extends$1n(OasAllowReservedNotAllowedRule, _super);
        function OasAllowReservedNotAllowedRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasAllowReservedNotAllowedRule.prototype.visitEncoding = function (node) {
            if (this.hasValue(node.allowReserved)) {
                var mediaType = node.parent();
                this.reportIf(mediaType.name() !== "application/x-www-form-urlencoded", node, "allowReserved", {
                    name: mediaType.name()
                });
            }
        };
        return OasAllowReservedNotAllowedRule;
    }(OasInvalidPropertyValueRule));
    /**
     * Implements the Unknown Encoding Style rule.
     */
    var OasUnknownEncodingStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownEncodingStyleRule, _super);
        function OasUnknownEncodingStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownEncodingStyleRule.prototype.visitEncoding = function (node) {
            if (this.hasValue(node.style)) {
                var valid = OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]);
                this.reportIfInvalid(valid, node, "style");
            }
        };
        return OasUnknownEncodingStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasInvalidHeaderStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidHeaderStyleRule, _super);
        function OasInvalidHeaderStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHeaderStyleRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.style)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "style");
            }
        };
        OasInvalidHeaderStyleRule.prototype.visitHeaderDefinition = function (node) {
            this.visitHeader(node);
        };
        return OasInvalidHeaderStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasUnexpectedNumberOfHeaderMTsRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedNumberOfHeaderMTsRule, _super);
        function OasUnexpectedNumberOfHeaderMTsRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedNumberOfHeaderMTsRule.prototype.visitHeader = function (node) {
            this.reportIfInvalid(node.getMediaTypes().length < 2, node, "content");
        };
        OasUnexpectedNumberOfHeaderMTsRule.prototype.visitHeaderDefinition = function (node) {
            this.visitHeader(node);
        };
        return OasUnexpectedNumberOfHeaderMTsRule;
    }(OasInvalidPropertyValueRule));
    var OasInvalidLinkOperationIdRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidLinkOperationIdRule, _super);
        function OasInvalidLinkOperationIdRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // TODO move this to the invalid reference section
        OasInvalidLinkOperationIdRule.prototype.visitLink = function (node) {
            if (this.hasValue(node.operationId)) {
                var opFinder = new Oas30OperationFinder(node.operationId);
                OasVisitorUtil.visitTree(node.ownerDocument(), opFinder);
                this.reportIfInvalid(opFinder.isFound(), node, "operationId");
            }
        };
        OasInvalidLinkOperationIdRule.prototype.visitLinkDefinition = function (node) {
            this.visitLink(node);
        };
        return OasInvalidLinkOperationIdRule;
    }(OasInvalidPropertyValueRule));
    var OasInvalidEncodingForMPMTRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidEncodingForMPMTRule, _super);
        function OasInvalidEncodingForMPMTRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidEncodingForMPMTRule.prototype.visitMediaType = function (node) {
            if (node.getEncodings().length > 0) {
                this.reportIfInvalid(this.isValidMultipartType(node.name()), node, "encoding", {
                    name: node.name()
                });
            }
        };
        return OasInvalidEncodingForMPMTRule;
    }(OasInvalidPropertyValueRule));
    var OasUnexpectedRequestBodyRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedRequestBodyRule, _super);
        function OasUnexpectedRequestBodyRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the given operation is one of:  POST, PUT, OPTIONS
         * @param {Oas30Operation} operation
         * @return {boolean}
         */
        OasUnexpectedRequestBodyRule.prototype.isValidRequestBodyOperation = function (operation) {
            var method = operation.method();
            return method === "put" || method === "post" || method === "options" || method === "patch";
        };
        OasUnexpectedRequestBodyRule.prototype.visitOperation = function (node) {
            if (this.hasValue(node.requestBody)) {
                this.reportIfInvalid(this.isValidRequestBodyOperation(node), node, "requestBody", {
                    method: node.method().toUpperCase()
                });
            }
        };
        return OasUnexpectedRequestBodyRule;
    }(OasInvalidPropertyValueRule));
    var OasMissingPathParamDefinitionRule = /** @class */ (function (_super) {
        __extends$1n(OasMissingPathParamDefinitionRule, _super);
        function OasMissingPathParamDefinitionRule() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pathItemsWithError = [];
            return _this;
        }
        OasMissingPathParamDefinitionRule.prototype.visitPathItem = function (node) {
            if (!this.isPathWellFormed(node.path())) {
                this.pathItemsWithError.push(node.path());
            }
        };
        OasMissingPathParamDefinitionRule.prototype.visitOperation = function (node) {
            var _this = this;
            // Perform operation level checks only if there are no issues at the pathItem level.
            if (this.pathItemsWithError.indexOf(node.parent().path()) !== -1) {
                return;
            }
            // Check parameters are unique within operation
            var mergedParameters = this.mergeParameters(node);
            var pathItem = node.parent();
            var path = pathItem.path();
            var pathSegs = this.getPathSegments(path);
            // Report all the path segments that don't have an associated parameter definition
            pathSegs.filter(function (pathSeg) {
                return pathSeg.formalName !== undefined;
            }).forEach(function (pathSeg) {
                var valid = mergedParameters.filter(function (param) { return pathSeg.formalName === param.name && param.in === 'path'; }).length > 0;
                _this.reportIfInvalid(valid, node, null, {
                    param: pathSeg.formalName,
                    path: path,
                    method: node.method().toUpperCase()
                });
            });
        };
        return OasMissingPathParamDefinitionRule;
    }(OasInvalidPropertyValueRule));
    var OasMissingResponseForOperationRule = /** @class */ (function (_super) {
        __extends$1n(OasMissingResponseForOperationRule, _super);
        function OasMissingResponseForOperationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingResponseForOperationRule.prototype.visitResponses = function (node) {
            this.reportIfInvalid(node.responses().length > 0, node.parent(), null);
        };
        return OasMissingResponseForOperationRule;
    }(OasInvalidPropertyValueRule));
    var OasUnknownParamStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownParamStyleRule, _super);
        function OasUnknownParamStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownParamStyleRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.style)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "form", "simple", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style", {
                    style: node.style
                });
            }
        };
        OasUnknownParamStyleRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasUnknownParamStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasUnknownQueryParamStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownQueryParamStyleRule, _super);
        function OasUnknownQueryParamStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownQueryParamStyleRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.style)) {
                if (node.in === "query") {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["form", "spaceDelimited", "pipeDelimited", "deepObject"]), node, "style", {
                        style: node.style
                    });
                }
            }
        };
        OasUnknownQueryParamStyleRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasUnknownQueryParamStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasUnknownCookieParamStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownCookieParamStyleRule, _super);
        function OasUnknownCookieParamStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownCookieParamStyleRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.style)) {
                if (node.in === "cookie") {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["form"]), node, "style", {
                        style: node.style
                    });
                }
            }
        };
        OasUnknownCookieParamStyleRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasUnknownCookieParamStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasUnknownHeaderParamStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownHeaderParamStyleRule, _super);
        function OasUnknownHeaderParamStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownHeaderParamStyleRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.style)) {
                if (node.in === "header") {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["simple"]), node, "style", {
                        style: node.style
                    });
                }
            }
        };
        OasUnknownHeaderParamStyleRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasUnknownHeaderParamStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasUnknownPathParamStyleRule = /** @class */ (function (_super) {
        __extends$1n(OasUnknownPathParamStyleRule, _super);
        function OasUnknownPathParamStyleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnknownPathParamStyleRule.prototype.visitParameter = function (node) {
            if (node.in === "path") {
                if (this.hasValue(node.style)) {
                    this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.style, ["matrix", "label", "simple"]), node, "style", {
                        style: node.style
                    });
                }
            }
        };
        OasUnknownPathParamStyleRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasUnknownPathParamStyleRule;
    }(OasInvalidPropertyValueRule));
    var OasAllowReservedNotAllowedForParamRule = /** @class */ (function (_super) {
        __extends$1n(OasAllowReservedNotAllowedForParamRule, _super);
        function OasAllowReservedNotAllowedForParamRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasAllowReservedNotAllowedForParamRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.allowReserved)) {
                this.reportIfInvalid(node.in === "query", node, "allowReserved");
            }
        };
        OasAllowReservedNotAllowedForParamRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasAllowReservedNotAllowedForParamRule;
    }(OasInvalidPropertyValueRule));
    var OasUnexpectedNumOfParamMTsRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedNumOfParamMTsRule, _super);
        function OasUnexpectedNumOfParamMTsRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedNumOfParamMTsRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.content)) {
                this.reportIfInvalid(node.getMediaTypes().length < 2, node, "content");
            }
        };
        OasUnexpectedNumOfParamMTsRule.prototype.visitParameterDefinition = function (node) {
            this.visitParameter(node);
        };
        return OasUnexpectedNumOfParamMTsRule;
    }(OasInvalidPropertyValueRule));
    var OasUnexpectedUsageOfDiscriminatorRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedUsageOfDiscriminatorRule, _super);
        function OasUnexpectedUsageOfDiscriminatorRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedUsageOfDiscriminatorRule.prototype.visitDiscriminator = function (node) {
            var schema = node.parent();
            var valid = this.hasValue(schema.oneOf) || this.hasValue(schema.anyOf) || this.hasValue(schema.allOf);
            this.reportIfInvalid(valid, node, "discriminator");
        };
        return OasUnexpectedUsageOfDiscriminatorRule;
    }(OasInvalidPropertyValueRule));
    var OasInvalidHttpSecuritySchemeTypeRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidHttpSecuritySchemeTypeRule, _super);
        function OasInvalidHttpSecuritySchemeTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHttpSecuritySchemeTypeRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.scheme)) {
                this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(node.scheme, ["basic", "bearer", "digest", "hoba", "mutual", "negotiate", "oauth", "vapid", "scram-sha-1", "scram-sha-256"]), node, "scheme", {
                    scheme: node.scheme
                });
            }
        };
        return OasInvalidHttpSecuritySchemeTypeRule;
    }(OasInvalidPropertyValueRule));
    var OasUnexpectedUsageOfBearerTokenRule = /** @class */ (function (_super) {
        __extends$1n(OasUnexpectedUsageOfBearerTokenRule, _super);
        function OasUnexpectedUsageOfBearerTokenRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasUnexpectedUsageOfBearerTokenRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node.bearerFormat)) {
                this.reportIfInvalid(node.type === "http" && node.scheme === "bearer", node, "bearerFormat");
            }
        };
        return OasUnexpectedUsageOfBearerTokenRule;
    }(OasInvalidPropertyValueRule));
    var OasInvalidSecurityReqScopesRule = /** @class */ (function (_super) {
        __extends$1n(OasInvalidSecurityReqScopesRule, _super);
        function OasInvalidSecurityReqScopesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSecurityReqScopesRule.prototype.visitSecurityRequirement = function (node) {
            var _this = this;
            var snames = node.securityRequirementNames();
            snames.forEach(function (sname) {
                var scopes = node.scopes(sname);
                _this.reportIfInvalid(_this.hasValue(scopes) && Array.isArray(scopes), node, sname, {
                    name: sname
                });
            });
        };
        return OasInvalidSecurityReqScopesRule;
    }(OasInvalidPropertyValueRule));
    var OasServerVarNotFoundInTemplateRule = /** @class */ (function (_super) {
        __extends$1n(OasServerVarNotFoundInTemplateRule, _super);
        function OasServerVarNotFoundInTemplateRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
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
        OasServerVarNotFoundInTemplateRule.prototype.parseServerTemplate = function (serverTemplate) {
            if (!this.hasValue(serverTemplate)) {
                return [];
            }
            var vars = [];
            var startIdx = serverTemplate.indexOf('{');
            var endIdx = -1;
            while (startIdx !== -1) {
                endIdx = serverTemplate.indexOf('}', startIdx);
                if (endIdx !== -1) {
                    vars.push(serverTemplate.substring(startIdx + 1, endIdx));
                    startIdx = serverTemplate.indexOf('{', endIdx);
                }
                else {
                    startIdx = -1;
                }
            }
            return vars;
        };
        OasServerVarNotFoundInTemplateRule.prototype.visitServerVariable = function (node) {
            var varName = node.name();
            var server = node.parent();
            var vars = this.parseServerTemplate(server.url);
            this.reportIfInvalid(OasValidationRuleUtil.isValidEnumItem(varName, vars), node, null, {
                name: varName
            });
        };
        return OasServerVarNotFoundInTemplateRule;
    }(OasInvalidPropertyValueRule));

    /**
     * @license
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
    var __extends$1o = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Implements the Invalid Parameter Reference rule.
     */
    var OasInvalidParameterReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidParameterReferenceRule, _super);
        function OasInvalidParameterReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidParameterReferenceRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidParameterReferenceRule.prototype.visitParameterDefinition = function (node) {
            if (node.ownerDocument().is3xDocument()) {
                this.visitParameter(node);
            }
        };
        return OasInvalidParameterReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Path Item Reference rule.
     */
    var OasInvalidPathItemReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidPathItemReferenceRule, _super);
        function OasInvalidPathItemReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidPathItemReferenceRule.prototype.visitPathItem = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        return OasInvalidPathItemReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Response Reference rule.
     */
    var OasInvalidResponseReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidResponseReferenceRule, _super);
        function OasInvalidResponseReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidResponseReferenceRule.prototype.visitResponseBase = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidResponseReferenceRule.prototype.visitResponse = function (node) { this.visitResponseBase(node); };
        OasInvalidResponseReferenceRule.prototype.visitResponseDefinition = function (node) {
            if (node.ownerDocument().is3xDocument()) {
                this.visitResponseBase(node);
            }
        };
        return OasInvalidResponseReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Schema Reference rule.
     */
    var OasInvalidSchemaReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidSchemaReferenceRule, _super);
        function OasInvalidSchemaReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSchemaReferenceRule.prototype.visitSchema = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidSchemaReferenceRule.prototype.visitPropertySchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitAdditionalPropertiesSchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitItemsSchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitAllOfSchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitAnyOfSchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitOneOfSchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitNotSchema = function (node) { this.visitSchema(node); };
        OasInvalidSchemaReferenceRule.prototype.visitSchemaDefinition = function (node) { this.visitSchema(node); };
        return OasInvalidSchemaReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Security Scheme Reference rule.
     */
    var OasInvalidSecuritySchemeReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidSecuritySchemeReferenceRule, _super);
        function OasInvalidSecuritySchemeReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSecuritySchemeReferenceRule.prototype.visitSecurityScheme = function (node) {
            if (node.ownerDocument().is3xDocument()) {
                var node30 = node;
                if (this.hasValue(node30.$ref)) {
                    this.reportIfInvalid(ReferenceUtil.canResolveRef(node30.$ref, node), node, "$ref");
                }
            }
        };
        return OasInvalidSecuritySchemeReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Security Requirement Name rule.
     */
    var OasInvalidSecurityRequirementNameRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidSecurityRequirementNameRule, _super);
        function OasInvalidSecurityRequirementNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the security requirement name is valid.  It does this by looking up a declared
         * security scheme definition in the document.  If no security scheme definition exists with the
         * given name, then it is invalid.
         * @param securityReqName
         * @param doc
         */
        OasInvalidSecurityRequirementNameRule.prototype.isValidSecurityRequirementName = function (securityReqName, doc) {
            if (doc.is2xDocument()) {
                var doc20 = doc;
                return this.hasValue(doc20.securityDefinitions) && this.isDefined(doc20.securityDefinitions.securityScheme(securityReqName));
            }
            else {
                var doc30 = doc;
                return this.hasValue(doc30.components) && this.isDefined(doc30.components.getSecurityScheme(securityReqName));
            }
        };
        OasInvalidSecurityRequirementNameRule.prototype.visitSecurityRequirement = function (node) {
            var _this = this;
            node.securityRequirementNames().forEach(function (name) {
                _this.reportIfInvalid(_this.isValidSecurityRequirementName(name, node.ownerDocument()), node, null, {
                    name: name
                });
            });
        };
        return OasInvalidSecurityRequirementNameRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Callback Reference rule.
     */
    var OasInvalidCallbackReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidCallbackReferenceRule, _super);
        function OasInvalidCallbackReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidCallbackReferenceRule.prototype.visitCallback = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidCallbackReferenceRule.prototype.visitCallbackDefinition = function (node) { this.visitCallback(node); };
        return OasInvalidCallbackReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Example Reference rule.
     */
    var OasInvalidExampleReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidExampleReferenceRule, _super);
        function OasInvalidExampleReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidExampleReferenceRule.prototype.visitExample = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidExampleReferenceRule.prototype.visitExampleDefinition = function (node) { this.visitExample(node); };
        return OasInvalidExampleReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Header Reference rule.
     */
    var OasInvalidHeaderReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidHeaderReferenceRule, _super);
        function OasInvalidHeaderReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidHeaderReferenceRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidHeaderReferenceRule.prototype.visitHeaderDefinition = function (node) { this.visitHeader(node); };
        return OasInvalidHeaderReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Link Reference rule.
     */
    var OasInvalidLinkReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidLinkReferenceRule, _super);
        function OasInvalidLinkReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidLinkReferenceRule.prototype.visitLink = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidLinkReferenceRule.prototype.visitLinkDefinition = function (node) { this.visitLink(node); };
        return OasInvalidLinkReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Link Operation Reference rule.
     */
    var OasInvalidLinkOperationReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidLinkOperationReferenceRule, _super);
        function OasInvalidLinkOperationReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidLinkOperationReferenceRule.prototype.visitLink = function (node) {
            if (this.hasValue(node.operationRef)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.operationRef, node), node, "operationRef");
            }
        };
        OasInvalidLinkOperationReferenceRule.prototype.visitLinkDefinition = function (node) { this.visitLink(node); };
        return OasInvalidLinkOperationReferenceRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Request Body Reference rule.
     */
    var OasInvalidRequestBodyReferenceRule = /** @class */ (function (_super) {
        __extends$1o(OasInvalidRequestBodyReferenceRule, _super);
        function OasInvalidRequestBodyReferenceRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidRequestBodyReferenceRule.prototype.visitRequestBody = function (node) {
            if (this.hasValue(node.$ref)) {
                this.reportIfInvalid(ReferenceUtil.canResolveRef(node.$ref, node), node, "$ref");
            }
        };
        OasInvalidRequestBodyReferenceRule.prototype.visitRequestBodyDefinition = function (node) { this.visitRequestBody(node); };
        return OasInvalidRequestBodyReferenceRule;
    }(OasValidationRule));

    /**
     * @license
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
    var __extends$1p = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Implements the Body and Form Data Mutual Exclusivity Rule.
     */
    var OasBodyAndFormDataMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasBodyAndFormDataMutualExclusivityRule, _super);
        function OasBodyAndFormDataMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasBodyAndFormDataMutualExclusivityRule.prototype.visitOperation = function (node) {
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
                this.reportIfInvalid(!(hasBodyParam_1 && hasFormDataParam_1), node, "body");
            }
        };
        OasBodyAndFormDataMutualExclusivityRule.prototype.visitPathItem = function (node) {
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
                this.reportIfInvalid(!(hasBodyParam_2 && hasFormDataParam_2), node, "body");
            }
        };
        return OasBodyAndFormDataMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Example Value/External Value Mutual Exclusivity Rule.
     */
    var OasExampleValueMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasExampleValueMutualExclusivityRule, _super);
        function OasExampleValueMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasExampleValueMutualExclusivityRule.prototype.visitExample = function (node) {
            this.reportIf(this.hasValue(node.value) && this.hasValue(node.externalValue), node, "value");
        };
        OasExampleValueMutualExclusivityRule.prototype.visitExampleDefinition = function (node) { this.visitExample(node); };
        return OasExampleValueMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Header Example/Examples Mutual Exclusivity Rule.
     */
    var OasHeaderExamplesMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasHeaderExamplesMutualExclusivityRule, _super);
        function OasHeaderExamplesMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasHeaderExamplesMutualExclusivityRule.prototype.visitHeader = function (node) {
            this.reportIf(this.hasValue(node.example) && this.hasValue(node.examples), node, "example");
        };
        OasHeaderExamplesMutualExclusivityRule.prototype.visitHeaderDefinition = function (node) { this.visitHeader(node); };
        return OasHeaderExamplesMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Link OperationRef/OperationId Mutual Exclusivity Rule.
     */
    var OasLinkOperationRefMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasLinkOperationRefMutualExclusivityRule, _super);
        function OasLinkOperationRefMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasLinkOperationRefMutualExclusivityRule.prototype.visitLink = function (node) {
            this.reportIf(this.hasValue(node.operationRef) && this.hasValue(node.operationId), node, "operationId");
        };
        OasLinkOperationRefMutualExclusivityRule.prototype.visitLinkDefinition = function (node) { this.visitLink(node); };
        return OasLinkOperationRefMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Media Type Example/Examples Mutual Exclusivity Rule.
     */
    var OasMediaTypeExamplesMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasMediaTypeExamplesMutualExclusivityRule, _super);
        function OasMediaTypeExamplesMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMediaTypeExamplesMutualExclusivityRule.prototype.visitMediaType = function (node) {
            this.reportIf(this.hasValue(node.example) && this.hasValue(node.examples), node, "example");
        };
        return OasMediaTypeExamplesMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Parameter Schema/Content Mutual Exclusivity Rule.
     */
    var OasParameterSchemaContentMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasParameterSchemaContentMutualExclusivityRule, _super);
        function OasParameterSchemaContentMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasParameterSchemaContentMutualExclusivityRule.prototype.hasContent = function (contentParent) {
            return contentParent.getMediaTypes().length > 0;
        };
        OasParameterSchemaContentMutualExclusivityRule.prototype.visitParameterBase = function (node) {
            this.reportIf(this.hasValue(node.schema) && this.hasContent(node), node, "schema");
        };
        OasParameterSchemaContentMutualExclusivityRule.prototype.visitParameter = function (node) { this.visitParameterBase(node); };
        OasParameterSchemaContentMutualExclusivityRule.prototype.visitParameterDefinition = function (node) { this.visitParameterBase(node); };
        return OasParameterSchemaContentMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Header Schema/Content Mutual Exclusivity Rule.
     */
    var OasHeaderSchemaContentMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasHeaderSchemaContentMutualExclusivityRule, _super);
        function OasHeaderSchemaContentMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasHeaderSchemaContentMutualExclusivityRule.prototype.hasContent = function (contentParent) {
            return contentParent.getMediaTypes().length > 0;
        };
        OasHeaderSchemaContentMutualExclusivityRule.prototype.visitHeader = function (node) {
            this.reportIf(this.hasValue(node.schema) && this.hasContent(node), node, "schema");
        };
        OasHeaderSchemaContentMutualExclusivityRule.prototype.visitHeaderDefinition = function (node) { this.visitHeader(node); };
        return OasHeaderSchemaContentMutualExclusivityRule;
    }(OasValidationRule));
    /**
     * Implements the Parameter Example/Examples Mutual Exclusivity Rule.
     */
    var OasParameterExamplesMutualExclusivityRule = /** @class */ (function (_super) {
        __extends$1p(OasParameterExamplesMutualExclusivityRule, _super);
        function OasParameterExamplesMutualExclusivityRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasParameterExamplesMutualExclusivityRule.prototype.visitParameterBase = function (node) {
            this.reportIf(this.hasValue(node.example) && this.hasValue(node.examples), node, "example");
        };
        OasParameterExamplesMutualExclusivityRule.prototype.visitParameter = function (node) { this.visitParameterBase(node); };
        OasParameterExamplesMutualExclusivityRule.prototype.visitParameterDefinition = function (node) { this.visitParameterBase(node); };
        return OasParameterExamplesMutualExclusivityRule;
    }(OasValidationRule));

    /**
     * @license
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
    var __extends$1q = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Base class for all Required Property rules.
     */
    var OasRequiredPropertyValidationRule = /** @class */ (function (_super) {
        __extends$1q(OasRequiredPropertyValidationRule, _super);
        function OasRequiredPropertyValidationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Called when a required property is missing.
         * @param node
         * @param propertyName
         * @param messageProperties
         */
        OasRequiredPropertyValidationRule.prototype.requireProperty = function (node, propertyName, messageProperties) {
            var propertyValue = node[propertyName];
            if (!this.isDefined(propertyValue)) {
                this.report(node, propertyName, messageProperties);
            }
        };
        /**
         * Called when a conditionally required property is missing.
         * @param node
         * @param propertyName
         * @param dependentPropertyName
         * @param dependentPropertyExpectedValue
         * @param messageProperties
         */
        OasRequiredPropertyValidationRule.prototype.requirePropertyWhen = function (node, propertyName, dependentPropertyName, dependentPropertyExpectedValue, messageProperties) {
            var dependentPropertyActualValue = node[dependentPropertyName];
            if (dependentPropertyActualValue === dependentPropertyExpectedValue) {
                this.requireProperty(node, propertyName, messageProperties);
            }
        };
        return OasRequiredPropertyValidationRule;
    }(OasValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOpenApiPropertyRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOpenApiPropertyRule, _super);
        function OasMissingOpenApiPropertyRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOpenApiPropertyRule.prototype.visitDocument = function (node) {
            if (node.is2xDocument()) {
                this.requireProperty(node, "swagger");
            }
            else {
                this.requireProperty(node, "openapi");
            }
        };
        return OasMissingOpenApiPropertyRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingApiInformationRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingApiInformationRule, _super);
        function OasMissingApiInformationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingApiInformationRule.prototype.visitDocument = function (node) {
            this.requireProperty(node, "info");
        };
        return OasMissingApiInformationRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingApiPathsRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingApiPathsRule, _super);
        function OasMissingApiPathsRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingApiPathsRule.prototype.visitDocument = function (node) {
            this.requireProperty(node, "paths");
        };
        return OasMissingApiPathsRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingApiTitleRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingApiTitleRule, _super);
        function OasMissingApiTitleRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingApiTitleRule.prototype.visitInfo = function (node) {
            this.requireProperty(node, "title");
        };
        return OasMissingApiTitleRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingApiVersionRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingApiVersionRule, _super);
        function OasMissingApiVersionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingApiVersionRule.prototype.visitInfo = function (node) {
            this.requireProperty(node, "version");
        };
        return OasMissingApiVersionRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingLicenseNameRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingLicenseNameRule, _super);
        function OasMissingLicenseNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingLicenseNameRule.prototype.visitLicense = function (node) {
            this.requireProperty(node, "name");
        };
        return OasMissingLicenseNameRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOperationResponsesRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOperationResponsesRule, _super);
        function OasMissingOperationResponsesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOperationResponsesRule.prototype.visitOperation = function (node) {
            this.requireProperty(node, "responses");
        };
        return OasMissingOperationResponsesRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOperationIdRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOperationIdRule, _super);
        function OasMissingOperationIdRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOperationIdRule.prototype.visitOperation = function (node) {
            this.requireProperty(node, "operationId");
        };
        return OasMissingOperationIdRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingExternalDocumentationUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingExternalDocumentationUrlRule, _super);
        function OasMissingExternalDocumentationUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingExternalDocumentationUrlRule.prototype.visitExternalDocumentation = function (node) {
            this.requireProperty(node, "url");
        };
        return OasMissingExternalDocumentationUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingParameterNameRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingParameterNameRule, _super);
        function OasMissingParameterNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingParameterNameRule.prototype.validateParameter = function (node) {
            if (this.hasValue(node['$ref'])) {
                return;
            }
            this.requireProperty(node, "name");
        };
        OasMissingParameterNameRule.prototype.visitParameter = function (node) {
            this.validateParameter(node);
        };
        OasMissingParameterNameRule.prototype.visitParameterDefinition = function (node) {
            this.validateParameter(node);
        };
        return OasMissingParameterNameRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingParameterLocationRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingParameterLocationRule, _super);
        function OasMissingParameterLocationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingParameterLocationRule.prototype.validateParameter = function (node) {
            if (this.hasValue(node['$ref'])) {
                return;
            }
            this.requireProperty(node, "in");
        };
        OasMissingParameterLocationRule.prototype.visitParameter = function (node) {
            this.validateParameter(node);
        };
        OasMissingParameterLocationRule.prototype.visitParameterDefinition = function (node) {
            this.validateParameter(node);
        };
        return OasMissingParameterLocationRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasPathParamsMustBeRequiredRule = /** @class */ (function (_super) {
        __extends$1q(OasPathParamsMustBeRequiredRule, _super);
        function OasPathParamsMustBeRequiredRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasPathParamsMustBeRequiredRule.prototype.validateParameter = function (node) {
            if (node.in === "path" && node.required !== true) {
                this.report(node, "required", {
                    name: node.name
                });
            }
        };
        OasPathParamsMustBeRequiredRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.$ref)) {
                return;
            }
            this.validateParameter(node);
        };
        OasPathParamsMustBeRequiredRule.prototype.visitParameterDefinition = function (node) {
            this.validateParameter(node);
        };
        return OasPathParamsMustBeRequiredRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingBodyParameterSchemaRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingBodyParameterSchemaRule, _super);
        function OasMissingBodyParameterSchemaRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingBodyParameterSchemaRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.$ref)) {
                return;
            }
            this.requirePropertyWhen(node, "schema", "in", "body");
        };
        return OasMissingBodyParameterSchemaRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingParameterTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingParameterTypeRule, _super);
        function OasMissingParameterTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingParameterTypeRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.$ref)) {
                return;
            }
            if (node.in !== "body") {
                this.requireProperty(node, "type", {
                    name: node.name
                });
            }
        };
        return OasMissingParameterTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingParameterArrayTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingParameterArrayTypeRule, _super);
        function OasMissingParameterArrayTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingParameterArrayTypeRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.$ref)) {
                return;
            }
            if (node.in !== "body" && node.type === "array") {
                this.requirePropertyWhen(node, "items", "type", "array", {
                    name: node.name
                });
            }
        };
        return OasMissingParameterArrayTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingItemsTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingItemsTypeRule, _super);
        function OasMissingItemsTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingItemsTypeRule.prototype.visitItems = function (node) {
            this.requireProperty(node, "type");
        };
        return OasMissingItemsTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingItemsArrayInformationRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingItemsArrayInformationRule, _super);
        function OasMissingItemsArrayInformationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingItemsArrayInformationRule.prototype.visitItems = function (node) {
            this.requirePropertyWhen(node, "items", "type", "array");
        };
        return OasMissingItemsArrayInformationRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingResponseDescriptionRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingResponseDescriptionRule, _super);
        function OasMissingResponseDescriptionRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingResponseDescriptionRule.prototype.visitResponse = function (node) {
            if (this.hasValue(node.$ref)) {
                return;
            }
            this.requireProperty(node, "description", {
                statusCode: node.statusCode()
            });
        };
        return OasMissingResponseDescriptionRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingHeaderTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingHeaderTypeRule, _super);
        function OasMissingHeaderTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingHeaderTypeRule.prototype.visitHeader = function (node) {
            if (this.hasValue(node['$ref'])) {
                return;
            }
            this.requireProperty(node, "type");
        };
        return OasMissingHeaderTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingHeaderArrayInformationRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingHeaderArrayInformationRule, _super);
        function OasMissingHeaderArrayInformationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingHeaderArrayInformationRule.prototype.visitHeader = function (node) {
            this.requirePropertyWhen(node, "items", "type", "array");
        };
        return OasMissingHeaderArrayInformationRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingTagNameRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingTagNameRule, _super);
        function OasMissingTagNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingTagNameRule.prototype.visitTag = function (node) {
            this.requireProperty(node, "name");
        };
        return OasMissingTagNameRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingSecuritySchemeTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingSecuritySchemeTypeRule, _super);
        function OasMissingSecuritySchemeTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingSecuritySchemeTypeRule.prototype.visitSecurityScheme = function (node) {
            if (this.hasValue(node['$ref'])) {
                return;
            }
            this.requireProperty(node, "type");
        };
        return OasMissingSecuritySchemeTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingApiKeySchemeParamNameRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingApiKeySchemeParamNameRule, _super);
        function OasMissingApiKeySchemeParamNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingApiKeySchemeParamNameRule.prototype.visitSecurityScheme = function (node) {
            this.requirePropertyWhen(node, "name", "type", "apiKey");
        };
        return OasMissingApiKeySchemeParamNameRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingApiKeySchemeParamLocationRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingApiKeySchemeParamLocationRule, _super);
        function OasMissingApiKeySchemeParamLocationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingApiKeySchemeParamLocationRule.prototype.visitSecurityScheme = function (node) {
            this.requirePropertyWhen(node, "in", "type", "apiKey");
        };
        return OasMissingApiKeySchemeParamLocationRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthSchemeFlowTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthSchemeFlowTypeRule, _super);
        function OasMissingOAuthSchemeFlowTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthSchemeFlowTypeRule.prototype.visitSecurityScheme = function (node) {
            this.requirePropertyWhen(node, "flow", "type", "oauth2");
        };
        return OasMissingOAuthSchemeFlowTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthSchemeAuthUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthSchemeAuthUrlRule, _super);
        function OasMissingOAuthSchemeAuthUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthSchemeAuthUrlRule.prototype.visitSecurityScheme = function (node) {
            if (node.type === "oauth2") {
                if ((node.flow === "implicit" || node.flow === "accessCode") && !this.isDefined(node.authorizationUrl)) {
                    this.report(node, "authorizationUrl");
                }
            }
        };
        return OasMissingOAuthSchemeAuthUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthSchemeTokenUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthSchemeTokenUrlRule, _super);
        function OasMissingOAuthSchemeTokenUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthSchemeTokenUrlRule.prototype.visitSecurityScheme = function (node) {
            if (node.type === "oauth2") {
                if ((node.flow === "password" || node.flow === "application" || node.flow === "accessCode") && !this.isDefined(node.tokenUrl)) {
                    this.report(node, "tokenUrl");
                }
            }
        };
        return OasMissingOAuthSchemeTokenUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthSchemeScopesRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthSchemeScopesRule, _super);
        function OasMissingOAuthSchemeScopesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthSchemeScopesRule.prototype.visitSecurityScheme = function (node) {
            if (node.type === "oauth2") {
                this.requirePropertyWhen(node, "scopes", "type", "oauth2");
            }
        };
        return OasMissingOAuthSchemeScopesRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingDiscriminatorPropertyNameRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingDiscriminatorPropertyNameRule, _super);
        function OasMissingDiscriminatorPropertyNameRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingDiscriminatorPropertyNameRule.prototype.visitDiscriminator = function (node) {
            this.requireProperty(node, "propertyName");
        };
        return OasMissingDiscriminatorPropertyNameRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthFlowScopesRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthFlowScopesRule, _super);
        function OasMissingOAuthFlowScopesRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthFlowScopesRule.prototype.visitOAuthFlow = function (node) {
            this.requireProperty(node, "scopes");
        };
        OasMissingOAuthFlowScopesRule.prototype.visitImplicitOAuthFlow = function (node) {
            this.visitOAuthFlow(node);
        };
        OasMissingOAuthFlowScopesRule.prototype.visitPasswordOAuthFlow = function (node) {
            this.visitOAuthFlow(node);
        };
        OasMissingOAuthFlowScopesRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
            this.visitOAuthFlow(node);
        };
        OasMissingOAuthFlowScopesRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
            this.visitOAuthFlow(node);
        };
        return OasMissingOAuthFlowScopesRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthFlowAuthUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthFlowAuthUrlRule, _super);
        function OasMissingOAuthFlowAuthUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthFlowAuthUrlRule.prototype.visitImplicitOAuthFlow = function (node) {
            this.requireProperty(node, "authorizationUrl", {
                flowType: "Implicit"
            });
        };
        OasMissingOAuthFlowAuthUrlRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
            this.requireProperty(node, "authorizationUrl", {
                flowType: "Auth Code"
            });
        };
        return OasMissingOAuthFlowAuthUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthFlowRokenUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthFlowRokenUrlRule, _super);
        function OasMissingOAuthFlowRokenUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthFlowRokenUrlRule.prototype.visitPasswordOAuthFlow = function (node) {
            this.requireProperty(node, "tokenUrl", {
                flowType: "Password"
            });
        };
        OasMissingOAuthFlowRokenUrlRule.prototype.visitClientCredentialsOAuthFlow = function (node) {
            this.requireProperty(node, "tokenUrl", {
                flowType: "Client Credentials"
            });
        };
        OasMissingOAuthFlowRokenUrlRule.prototype.visitAuthorizationCodeOAuthFlow = function (node) {
            this.requireProperty(node, "tokenUrl", {
                flowType: "Auth Code"
            });
        };
        return OasMissingOAuthFlowRokenUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingRequestBodyContentRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingRequestBodyContentRule, _super);
        function OasMissingRequestBodyContentRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingRequestBodyContentRule.prototype.visitRequestBody = function (node) {
            this.requireProperty(node, "content");
        };
        OasMissingRequestBodyContentRule.prototype.visitRequestBodyDefinition = function (node) {
            this.visitRequestBody(node);
        };
        return OasMissingRequestBodyContentRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingServerTemplateUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingServerTemplateUrlRule, _super);
        function OasMissingServerTemplateUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingServerTemplateUrlRule.prototype.visitServer = function (node) {
            this.requireProperty(node, "url");
        };
        return OasMissingServerTemplateUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingHttpSecuritySchemeTypeRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingHttpSecuritySchemeTypeRule, _super);
        function OasMissingHttpSecuritySchemeTypeRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingHttpSecuritySchemeTypeRule.prototype.visitSecurityScheme = function (node) {
            this.requirePropertyWhen(node, "scheme", "type", "http");
        };
        return OasMissingHttpSecuritySchemeTypeRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOAuthSecuritySchemeFlowsRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOAuthSecuritySchemeFlowsRule, _super);
        function OasMissingOAuthSecuritySchemeFlowsRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOAuthSecuritySchemeFlowsRule.prototype.visitSecurityScheme = function (node) {
            this.requirePropertyWhen(node, "flows", "type", "oauth2");
        };
        return OasMissingOAuthSecuritySchemeFlowsRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingOpenIdConnectSecuritySchemeConnectUrlRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingOpenIdConnectSecuritySchemeConnectUrlRule, _super);
        function OasMissingOpenIdConnectSecuritySchemeConnectUrlRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingOpenIdConnectSecuritySchemeConnectUrlRule.prototype.visitSecurityScheme = function (node) {
            this.requirePropertyWhen(node, "openIdConnectUrl", "type", "openIdConnect");
        };
        return OasMissingOpenIdConnectSecuritySchemeConnectUrlRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingServerVarDefaultValueRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingServerVarDefaultValueRule, _super);
        function OasMissingServerVarDefaultValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingServerVarDefaultValueRule.prototype.visitServerVariable = function (node) {
            this.requireProperty(node, "default", {
                name: node.name()
            });
        };
        return OasMissingServerVarDefaultValueRule;
    }(OasRequiredPropertyValidationRule));
    /**
     * Implements the Missing Property rule.
     */
    var OasMissingSchemaArrayInformationRule = /** @class */ (function (_super) {
        __extends$1q(OasMissingSchemaArrayInformationRule, _super);
        function OasMissingSchemaArrayInformationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasMissingSchemaArrayInformationRule.prototype.visitSchema = function (node) {
            this.requirePropertyWhen(node, "items", "type", "array");
        };
        OasMissingSchemaArrayInformationRule.prototype.visitAllOfSchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitAnyOfSchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitOneOfSchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitNotSchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitPropertySchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitItemsSchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitAdditionalPropertiesSchema = function (node) { this.visitSchema(node); };
        OasMissingSchemaArrayInformationRule.prototype.visitSchemaDefinition = function (node) { this.visitSchema(node); };
        return OasMissingSchemaArrayInformationRule;
    }(OasRequiredPropertyValidationRule));

    /**
     * @license
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
    var __extends$1r = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Implements the Ignored Content-Type Header validation rule.
     */
    var OasIgnoredContentTypeHeaderRule = /** @class */ (function (_super) {
        __extends$1r(OasIgnoredContentTypeHeaderRule, _super);
        function OasIgnoredContentTypeHeaderRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasIgnoredContentTypeHeaderRule.prototype.visitHeader = function (node) {
            this.reportIf(node.headerName().toLowerCase() === "content-type", node, null);
        };
        OasIgnoredContentTypeHeaderRule.prototype.visitHeaderDefinition = function (node) {
            this.visitHeader(node);
        };
        return OasIgnoredContentTypeHeaderRule;
    }(OasValidationRule));
    /**
     * Implements the Ignored Content-Type/Accept/Authorization Header validation rule.
     */
    var OasIgnoredHeaderParameterRule = /** @class */ (function (_super) {
        __extends$1r(OasIgnoredHeaderParameterRule, _super);
        function OasIgnoredHeaderParameterRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasIgnoredHeaderParameterRule.prototype.visitParameter = function (node) {
            if (this.hasValue(node.name)) {
                var ignored = OasValidationRuleUtil.isValidEnumItem(node.name.toLowerCase(), OasIgnoredHeaderParameterRule.ignoredHeaderNames);
                this.reportIf(ignored, node, "name", { name: node.name });
            }
        };
        OasIgnoredHeaderParameterRule.ignoredHeaderNames = [
            "content-type", "accept", "authorization"
        ];
        return OasIgnoredHeaderParameterRule;
    }(OasValidationRule));

    /**
     * @license
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
    var __extends$1s = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var allowedTypes = ["string", "number", "integer", "boolean", "array", "object"];
    /**
     * Implements the Invalid Property Type validation rule.  This rule is responsible
     * for reporting whenever the **type** and **items** of a property fails to conform to the required
     * format defined by the specification
     */
    var OasInvalidPropertyTypeValidationRule = /** @class */ (function (_super) {
        __extends$1s(OasInvalidPropertyTypeValidationRule, _super);
        function OasInvalidPropertyTypeValidationRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns true if the type node has a valid type.
         * @param type
         * @return {boolean}
         */
        OasInvalidPropertyTypeValidationRule.prototype.isValidType = function (type) {
            if (this.hasValue(type)) {
                return OasValidationRuleUtil.isValidEnumItem(type, allowedTypes);
            }
            return true;
        };
        OasInvalidPropertyTypeValidationRule.prototype.visitAllOfSchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitAnyOfSchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitOneOfSchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitNotSchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitPropertySchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitItemsSchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitAdditionalPropertiesSchema = function (node) { this.visitSchema(node); };
        OasInvalidPropertyTypeValidationRule.prototype.visitSchemaDefinition = function (node) { this.visitSchema(node); };
        return OasInvalidPropertyTypeValidationRule;
    }(OasValidationRule));
    /**
     * Implements the Invalid Schema Type Value rule.
     */
    var OasInvalidSchemaTypeValueRule = /** @class */ (function (_super) {
        __extends$1s(OasInvalidSchemaTypeValueRule, _super);
        function OasInvalidSchemaTypeValueRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSchemaTypeValueRule.prototype.visitSchema = function (node) {
            this.reportIfInvalid(this.isValidType(node.type), node, "type", {
                type: node.type,
                allowedTypes: allowedTypes.join(", ")
            });
        };
        return OasInvalidSchemaTypeValueRule;
    }(OasInvalidPropertyTypeValidationRule));
    /**
     * Implements the Invalid Schema Array Items rule.
     */
    var OasInvalidSchemaArrayItemsRule = /** @class */ (function (_super) {
        __extends$1s(OasInvalidSchemaArrayItemsRule, _super);
        function OasInvalidSchemaArrayItemsRule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasInvalidSchemaArrayItemsRule.prototype.visitSchema = function (node) {
            if (this.isDefined(node.items) && node.type !== "array") {
                this.report(node, "items");
            }
        };
        return OasInvalidSchemaArrayItemsRule;
    }(OasInvalidPropertyTypeValidationRule));

    var __makeTemplateObject = (undefined && undefined.__makeTemplateObject) || function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };
    function template(literals) {
        var placeholders = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            placeholders[_i - 1] = arguments[_i];
        }
        return (function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            var dict = values[values.length - 1] || {};
            var result = [literals[0]];
            placeholders.forEach(function (key, i) {
                var value = dict[key] || key;
                result.push(value, literals[i + 1]);
            });
            return result.join('');
        });
    }
    var OasValidationRuleset = /** @class */ (function () {
        /**
         * C'tor.
         */
        function OasValidationRuleset() {
            this._rules = [
                { code: "UNKNOWN-001", name: "Unknown/Unexpected Property", type: "Unknown Property", entity: "All", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_1 || (templateObject_1 = __makeTemplateObject(["An unexpected property \"", "\" was found.  Extension properties should begin with \"x-\"."], ["An unexpected property \"", "\" was found.  Extension properties should begin with \"x-\"."])), 'property'), class: OasUnknownPropertyRule },
                /** Uniqueness **/
                { code: "TAG-003", name: "Duplicate Tag Definition", type: "Uniqueness", entity: "Tag", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Duplicate tag '", "' found (every tag must have a unique name)."], ["Duplicate tag '", "' found (every tag must have a unique name)."])), 'tagName'), class: OasTagUniquenessValidationRule },
                { code: "OP-003", name: "Duplicate Operation ID", type: "Uniqueness", entity: "Operation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Duplicate operationId '", "' found (operation IDs must be unique across all operations in the API)."], ["Duplicate operationId '", "' found (operation IDs must be unique across all operations in the API)."])), 'operationId'), class: OasOperationIdUniquenessValidationRule },
                { code: "PAR-019", name: "Duplicate Parameter", type: "Uniqueness", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Duplicate ", " parameter named '", "' found (parameters must be unique by name and location)."], ["Duplicate ", " parameter named '", "' found (parameters must be unique by name and location)."])), 'paramIn', 'paramName'), class: OasParameterUniquenessValidationRule },
                { code: "PAR-020", name: "Duplicate Body Parameter", type: "Uniqueness", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Operation has multiple \"body\" parameters."], ["Operation has multiple \"body\" parameters."]))), class: OasBodyParameterUniquenessValidationRule },
                /** Invalid Property Format **/
                { code: "R-004", name: "Invalid API Host", type: "Invalid Property Format", entity: "API", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Host not properly formatted - only the host name (and optionally port) should be specified."], ["Host not properly formatted - only the host name (and optionally port) should be specified."]))), class: OasInvalidApiHostRule },
                { code: "R-005", name: "Invalid API Base Path", type: "Invalid Property Format", entity: "API", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Base Path should being with a '/' character."], ["Base Path should being with a '/' character."]))), class: OasInvalidApiBasePathRule },
                { code: "INF-003", name: "Invalid API Description", type: "Invalid Property Format", entity: "Info", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_8 || (templateObject_8 = __makeTemplateObject(["API description is an incorrect format."], ["API description is an incorrect format."]))), class: OasInvalidApiDescriptionRule },
                { code: "INF-004", name: "Invalid Terms of Service URL", type: "Invalid Property Format", entity: "Info", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Terms of Service URL is an incorrect format."], ["Terms of Service URL is an incorrect format."]))), class: OasInvalidTermsOfServiceUrlRule },
                { code: "CTC-001", name: "Invalid Contact URL", type: "Invalid Property Format", entity: "Contact", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Contact URL is an incorrect format."], ["Contact URL is an incorrect format."]))), class: OasInvalidContactUrlRule },
                { code: "CTC-002", name: "Invalid Contact Email", type: "Invalid Property Format", entity: "Contact", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Contact Email is an incorrect format."], ["Contact Email is an incorrect format."]))), class: OasInvalidContactEmailRule },
                { code: "LIC-002", name: "Invalid License URL", type: "Invalid Property Format", entity: "License", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_12 || (templateObject_12 = __makeTemplateObject(["License URL is an incorrect format."], ["License URL is an incorrect format."]))), class: OasInvalidLicenseUrlRule },
                { code: "OP-002", name: "Invalid Operation Description", type: "Invalid Property Format", entity: "Operation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Operation Description is an incorrect format."], ["Operation Description is an incorrect format."]))), class: OasInvalidOperationDescriptionRule },
                { code: "OP-005", name: "Invalid Operation 'Consumes' Type", type: "Invalid Property Format", entity: "Operation", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Operation \"consumes\" must be a valid mime type."], ["Operation \"consumes\" must be a valid mime type."]))), class: OasInvalidOperationConsumesRule },
                { code: "OP-006", name: "Invalid Operation 'Produces' Type", type: "Invalid Property Format", entity: "Operation", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Operation \"produces\" must be a valid mime type."], ["Operation \"produces\" must be a valid mime type."]))), class: OasInvalidOperationProducesRule },
                { code: "ED-002", name: "Invalid External Documentation Description", type: "Invalid Property Format", entity: "External Documentation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_16 || (templateObject_16 = __makeTemplateObject(["External Docs Description is an incorrect format."], ["External Docs Description is an incorrect format."]))), class: OasInvalidExternalDocsDescriptionRule },
                { code: "ED-003", name: "Invalid External Documentation URL", type: "Invalid Property Format", entity: "External Documentation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_17 || (templateObject_17 = __makeTemplateObject(["External Docs URL is an incorrect format."], ["External Docs URL is an incorrect format."]))), class: OasInvalidExternalDocsUrlRule },
                { code: "PAR-010", name: "Invalid Parameter Description", type: "Invalid Property Format", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Parameter Description is an incorrect format."], ["Parameter Description is an incorrect format."]))), class: OasInvalidParameterDescriptionRule },
                { code: "IT-007", name: "Invalid Schema Items Default Value", type: "Invalid Property Format", entity: "Shema Items", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Schema Items default value does not conform to the correct type."], ["Schema Items default value does not conform to the correct type."]))), class: OasInvalidSchemaItemsDefaultValueRule },
                { code: "HEAD-005", name: "Invalid Header Default Value", type: "Invalid Property Format", entity: "Header Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_20 || (templateObject_20 = __makeTemplateObject(["The \"default\" property must conform to the \"type\" of the items."], ["The \"default\" property must conform to the \"type\" of the items."]))), class: OasInvalidHeaderDefaultValueRule },
                { code: "TAG-002", name: "Invalid Tag Description", type: "Invalid Property Format", entity: "Tag", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Tag Description is an incorrect format."], ["Tag Description is an incorrect format."]))), class: OasInvalidTagDescriptionRule },
                { code: "SS-011", name: "Invalid Security Scheme Auth URL", type: "Invalid Property Format", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Security Scheme Authorization URL is an incorrect format."], ["Security Scheme Authorization URL is an incorrect format."]))), class: OasInvalidSecuritySchemeAuthUrlRule },
                { code: "SS-012", name: "Invalid Security Scheme Token URL", type: "Invalid Property Format", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Security Scheme Token URL is an incorrect format."], ["Security Scheme Token URL is an incorrect format."]))), class: OasInvalidSecuritySchemeTokenUrlRule },
                { code: "XML-001", name: "Invalid XML Namespace URL", type: "Invalid Property Format", entity: "XML", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_24 || (templateObject_24 = __makeTemplateObject(["XML Namespace URL is an incorrect format."], ["XML Namespace URL is an incorrect format."]))), class: OasInvalidXmlNamespaceUrlRule },
                { code: "RES-004", name: "Invalid Response Description", type: "Invalid Property Format", entity: "Response", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Response description is an incorrect format."], ["Response description is an incorrect format."]))), class: OasInvalidResponseDescriptionRule },
                { code: "EX-002", name: "Invalid Example Description", type: "Invalid Property Format", entity: "Example", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Example Description is an incorrect format."], ["Example Description is an incorrect format."]))), class: OasInvalidExampleDescriptionRule },
                { code: "LINK-004", name: "Invalid Link Description", type: "Invalid Property Format", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Link Description is an incorrect format."], ["Link Description is an incorrect format."]))), class: OasInvalidLinkDescriptionRule },
                { code: "FLOW-003", name: "Invalid OAuth Authorization URL", type: "Invalid Property Format", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_28 || (templateObject_28 = __makeTemplateObject(["OAuth Authorization URL is an incorrect format."], ["OAuth Authorization URL is an incorrect format."]))), class: OasInvalidOAuthAuthorizationUrlRule },
                { code: "FLOW-004", name: "Invalid OAuth Token URL", type: "Invalid Property Format", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_29 || (templateObject_29 = __makeTemplateObject(["OAuth Token URL is an incorrect format."], ["OAuth Token URL is an incorrect format."]))), class: OasInvalidOAuthTokenUrlRule },
                { code: "FLOW-005", name: "Invalid OAuth Refresh URL", type: "Invalid Property Format", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_30 || (templateObject_30 = __makeTemplateObject(["OAuth Refresh URL is an incorrect format."], ["OAuth Refresh URL is an incorrect format."]))), class: OasInvalidOAuthRefreshUrlRule },
                { code: "PATH-008", name: "Invalid Path Item Description", type: "Invalid Property Format", entity: "Path Item", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Path Item Description is an incorrect format."], ["Path Item Description is an incorrect format."]))), class: OasInvalidPathItemDescriptionRule },
                { code: "RB-001", name: "Invalid Request Body Description", type: "Invalid Property Format", entity: "Request Body", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Request Body Description is an incorrect format."], ["Request Body Description is an incorrect format."]))), class: OasInvalidRequestBodyDescriptionRule },
                { code: "HEAD-009", name: "Invalid Header Description", type: "Invalid Property Format", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Header Description is an incorrect format."], ["Header Description is an incorrect format."]))), class: OasInvalidHeaderDescriptionRule },
                { code: "SS-014", name: "Invalid OpenID Connect URL", type: "Invalid Property Format", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_34 || (templateObject_34 = __makeTemplateObject(["OpenID Connect URL is an incorrect format."], ["OpenID Connect URL is an incorrect format."]))), class: OasInvalidOpenIDConnectUrlRule },
                { code: "SS-015", name: "Invalid Security Scheme Description", type: "Invalid Property Format", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Security Scheme Description is an incorrect format."], ["Security Scheme Description is an incorrect format."]))), class: OasInvalidSecuritySchemeDescriptionRule },
                { code: "SRV-003", name: "Invalid Server Description", type: "Invalid Property Format", entity: "Server", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Server Description is an incorrect format."], ["Server Description is an incorrect format."]))), class: OasInvalidServerDescriptionRule },
                { code: "SRV-002", name: "Invalid Server URL", type: "Invalid Property Format", entity: "Server", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Server URL is an incorrect format."], ["Server URL is an incorrect format."]))), class: OasInvalidServerUrlRule },
                { code: "SVAR-002", name: "Invalid Server Variable Description", type: "Invalid Property Format", entity: "Server Variable", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Server Variable Description is an incorrect format."], ["Server Variable Description is an incorrect format."]))), class: OasInvalidServerVariableDescriptionRule },
                /** Invalid Property Name **/
                { code: "PATH-006", name: "Empty Path Segment", type: "Invalid Property Name", entity: "Path Item", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_39 || (templateObject_39 = __makeTemplateObject(["Path template \"", "\" contains one or more empty segment."], ["Path template \"", "\" contains one or more empty segment."])), 'path'), class: OasEmptyPathSegmentRule },
                { code: "PATH-007", name: "Duplicate Path Segment", type: "Invalid Property Name", entity: "Path Item", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Path template \"", "\" contains duplicate variable names (", ")."], ["Path template \"", "\" contains duplicate variable names (", ")."])), 'path', 'duplicates'), class: OasDuplicatePathSegmentRule },
                { code: "PATH-005", name: "Invalid Path Segment", type: "Invalid Property Name", entity: "Path Item", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Path template \"", "\" is not valid."], ["Path template \"", "\" is not valid."])), 'path'), class: OasInvalidPathSegmentRule },
                { code: "PATH-009", name: "Identical Path Template", type: "Invalid Property Name", entity: "Path Item", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_42 || (templateObject_42 = __makeTemplateObject(["Path template \"", "\" is semantically identical to at least one other path."], ["Path template \"", "\" is semantically identical to at least one other path."])), 'path'), class: OasIdenticalPathTemplateRule },
                { code: "RES-003", name: "Invalid HTTP Response Code", type: "Invalid Property Name", entity: "Response", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_43 || (templateObject_43 = __makeTemplateObject(["\"", "\" is not a valid HTTP response status code."], ["\"", "\" is not a valid HTTP response status code."])), 'statusCode'), class: OasInvalidHttpResponseCodeRule },
                { code: "EX-001", name: "Unmatched Example Type", type: "Invalid Property Name", entity: "Example", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_44 || (templateObject_44 = __makeTemplateObject(["Example '", "' must match one of the \"produces\" mime-types."], ["Example '", "' must match one of the \"produces\" mime-types."])), 'contentType'), class: OasUnmatchedExampleTypeRule },
                { code: "SDEF-001", name: "Invalid Schema Definition Name", type: "Invalid Property Name", entity: "Schema Definition", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_45 || (templateObject_45 = __makeTemplateObject(["Schema Definition Name is not valid."], ["Schema Definition Name is not valid."]))), class: OasInvalidSchemaDefNameRule },
                { code: "PDEF-001", name: "Invalid Parameter Definition Name", type: "Invalid Property Name", entity: "Parameter Definition", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_46 || (templateObject_46 = __makeTemplateObject(["Parameter Definition Name is not valid."], ["Parameter Definition Name is not valid."]))), class: OasInvalidParameterDefNameRule },
                { code: "RDEF-001", name: "Invalid Response Definition Name", type: "Invalid Property Name", entity: "Response Definition", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_47 || (templateObject_47 = __makeTemplateObject(["Response Definition Name is not valid."], ["Response Definition Name is not valid."]))), class: OasInvalidResponseDefNameRule },
                { code: "SCPS-001", name: "Invalid Scope Name", type: "Invalid Scope Name", entity: "Scopes", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_48 || (templateObject_48 = __makeTemplateObject(["'", "' is not a valid scope name."], ["'", "' is not a valid scope name."])), 'scope'), class: OasInvalidScopeNameRule },
                { code: "SS-013", name: "Invalid Security Scheme Name", type: "Invalid Property Name", entity: "Security Scheme", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_49 || (templateObject_49 = __makeTemplateObject(["Security Scheme Name is not valid."], ["Security Scheme Name is not valid."]))), class: OasInvalidSecuritySchemeNameRule },
                { code: "EDEF-001", name: "Invalid Example Definition Name", type: "Invalid Property Name", entity: "Components", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_50 || (templateObject_50 = __makeTemplateObject(["Example Definition Name is not valid."], ["Example Definition Name is not valid."]))), class: OasInvalidExampleDefinitionNameRule },
                { code: "RBDEF-001", name: "Invalid Request Body Definition Name", type: "Invalid Property Name", entity: "Components", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_51 || (templateObject_51 = __makeTemplateObject(["Request Body Definition Name is not valid."], ["Request Body Definition Name is not valid."]))), class: OasInvalidRequestBodyDefinitionNameRule },
                { code: "HDEF-001", name: "Invalid Header Definition Name", type: "Invalid Property Name", entity: "Components", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_52 || (templateObject_52 = __makeTemplateObject(["Header Definition Name is not valid."], ["Header Definition Name is not valid."]))), class: OasInvalidHeaderDefinitionNameRule },
                { code: "LDEF-001", name: "Invalid Link Definition Name", type: "Invalid Property Name", entity: "Components", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_53 || (templateObject_53 = __makeTemplateObject(["Link Definition Name is not valid."], ["Link Definition Name is not valid."]))), class: OasInvalidLinkDefinitionNameRule },
                { code: "CDEF-001", name: "Invalid Callback Definition Name", type: "Invalid Property Name", entity: "Components", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_54 || (templateObject_54 = __makeTemplateObject(["Callback Definition Name is not valid."], ["Callback Definition Name is not valid."]))), class: OasInvalidCallbackDefinitionNameRule },
                { code: "ENC-006", name: "Unmatched Encoding Property", type: "Invalid Property Name", entity: "Components", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_55 || (templateObject_55 = __makeTemplateObject(["Encoding Property \"", "\" not found in the associated schema."], ["Encoding Property \"", "\" not found in the associated schema."])), 'name'), class: OasUnmatchedEncodingPropertyRule },
                /** Invalid Property Value **/
                { code: "R-006", name: "Invalid API Scheme", type: "Invalid Property Value", entity: "API", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_56 || (templateObject_56 = __makeTemplateObject(["API scheme \"", "\" not allowed.  Must be one of: http, https, ws, wss"], ["API scheme \"", "\" not allowed.  Must be one of: http, https, ws, wss"])), 'scheme'), class: OasInvalidApiSchemeRule },
                { code: "R-007", name: "Invalid 'Consumes' Mime-Type", type: "Invalid Property Value", entity: "API", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_57 || (templateObject_57 = __makeTemplateObject(["API \"consumes\" must be a valid mime-type."], ["API \"consumes\" must be a valid mime-type."]))), class: OasInvalidApiConsumesMTRule },
                { code: "R-008", name: "Invalid 'Produces' Mime-Type", type: "Invalid Property Value", entity: "API", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_58 || (templateObject_58 = __makeTemplateObject(["API \"produces\" must be a valid mime-type."], ["API \"produces\" must be a valid mime-type."]))), class: OasInvalidApiProducesMTRule },
                { code: "OP-001", name: "Operation Summary Too Long", type: "Invalid Property Value", entity: "Operation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_59 || (templateObject_59 = __makeTemplateObject(["Operation Summary should be less than 120 characters."], ["Operation Summary should be less than 120 characters."]))), class: OasOperationSummaryTooLongRule },
                { code: "OP-004", name: "Invalid Operation ID", type: "Invalid Property Value", entity: "Operation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_60 || (templateObject_60 = __makeTemplateObject(["Operation ID is an invalid format."], ["Operation ID is an invalid format."]))), class: OasInvalidOperationIdRule },
                { code: "OP-010", name: "Invalid Operation Scheme", type: "Invalid Property Value", entity: "Operation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_61 || (templateObject_61 = __makeTemplateObject(["Operation scheme \"", "\" not allowed.  Must be one of: http, https, ws, wss"], ["Operation scheme \"", "\" not allowed.  Must be one of: http, https, ws, wss"])), 'scheme'), class: OasInvalidOperationSchemeRule },
                { code: "PAR-007", name: "Path Parameter Not Found", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_62 || (templateObject_62 = __makeTemplateObject(["Path Parameter \"", "\" not found in path template."], ["Path Parameter \"", "\" not found in path template."])), 'name'), class: OasPathParamNotFoundRule },
                { code: "PAR-008", name: "Form Data Parameter Not Allowed", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_63 || (templateObject_63 = __makeTemplateObject(["Form Data Parameters are only used in 'application/x-www-form-urlencoded' or 'multipart/form-data' requests."], ["Form Data Parameters are only used in 'application/x-www-form-urlencoded' or 'multipart/form-data' requests."]))), class: OasFormDataParamNotAllowedRule },
                { code: "PAR-009", name: "Unknown Parameter Location", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_64 || (templateObject_64 = __makeTemplateObject(["Parameters can only be found in one of: ", ""], ["Parameters can only be found in one of: ", ""])), 'options'), class: OasUnknownParamLocationRule },
                { code: "PAR-011", name: "Unknown Parameter Type", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_65 || (templateObject_65 = __makeTemplateObject(["Parameter types are limited to: string, number, integer, boolean, array, file"], ["Parameter types are limited to: string, number, integer, boolean, array, file"]))), class: OasUnknownParamTypeRule },
                { code: "PAR-012", name: "Unknown Parameter Format", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_66 || (templateObject_66 = __makeTemplateObject(["Parameter Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password"], ["Parameter Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password"]))), class: OasUnknownParamFormatRule },
                { code: "PAR-013", name: "Unexpected Usage of Parameter 'allowEmptyValue'", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_67 || (templateObject_67 = __makeTemplateObject(["Allow Empty Value is not allowed (only for ", " params)."], ["Allow Empty Value is not allowed (only for ", " params)."])), 'options'), class: OasUnexpectedParamAllowEmptyValueRule },
                { code: "PAR-014", name: "Unexpected Usage of Parameter 'collectionFormat'", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_68 || (templateObject_68 = __makeTemplateObject(["The \"collectionFormat\" property is only allowed for 'array' type parameters."], ["The \"collectionFormat\" property is only allowed for 'array' type parameters."]))), class: OasUnexpectedParamCollectionFormatRule },
                { code: "PAR-015", name: "Unknown Parameter Collection Format", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_69 || (templateObject_69 = __makeTemplateObject(["Parameter Collection Format must be one of: csv, ssv, tsv, pipes, multi"], ["Parameter Collection Format must be one of: csv, ssv, tsv, pipes, multi"]))), class: OasUnknownParamCollectionFormatRule },
                { code: "PAR-016", name: "Unexpected Parameter Usage of 'multi'", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_70 || (templateObject_70 = __makeTemplateObject(["Parameter Collection Format can only be \"multi\" for Query and Form Data parameters."], ["Parameter Collection Format can only be \"multi\" for Query and Form Data parameters."]))), class: OasUnexpectedParamMultiRule },
                { code: "PAR-017", name: "Required Parameter With Default Value Not Allowed", type: "Invalid Property Value", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_71 || (templateObject_71 = __makeTemplateObject(["Required Parameters can not have a default value."], ["Required Parameters can not have a default value."]))), class: OasRequiredParamWithDefaultValueRule },
                { code: "IT-003", name: "Unknown Array Type", type: "Invalid Property Value", entity: "Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_72 || (templateObject_72 = __makeTemplateObject(["Schema Items Type must be one of: string, number, integer, boolean, array"], ["Schema Items Type must be one of: string, number, integer, boolean, array"]))), class: OasUnknownArrayTypeRule },
                { code: "IT-004", name: "Unknown Array Format", type: "Invalid Property Value", entity: "Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_73 || (templateObject_73 = __makeTemplateObject(["Schema Items Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password"], ["Schema Items Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password"]))), class: OasUnknownArrayFormatRule },
                { code: "IT-005", name: "Unknown Array Collection Format", type: "Invalid Property Value", entity: "Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_74 || (templateObject_74 = __makeTemplateObject(["Schema Items Collection Format must be one of: csv, ssv, tsv, pipes"], ["Schema Items Collection Format must be one of: csv, ssv, tsv, pipes"]))), class: OasUnknownArrayCollectionFormatRule },
                { code: "IT-006", name: "Unexpected Usage of Array 'collectionFormat'", type: "Invalid Property Value", entity: "Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_75 || (templateObject_75 = __makeTemplateObject(["Schema Items Collection Format is only allowed for Array style parameters."], ["Schema Items Collection Format is only allowed for Array style parameters."]))), class: OasUnexpectedArrayCollectionFormatRule },
                { code: "HEAD-003", name: "Unknown Header Type", type: "Invalid Property Value", entity: "Header", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_76 || (templateObject_76 = __makeTemplateObject(["Header Type must be one of: string, number, integer, boolean, array"], ["Header Type must be one of: string, number, integer, boolean, array"]))), class: OasUnknownHeaderTypeRule },
                { code: "HEAD-004", name: "Unknown Header Format", type: "Invalid Property Value", entity: "Header", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_77 || (templateObject_77 = __makeTemplateObject(["Header Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password"], ["Header Format must be one of: int32, int64, float, double, byte, binary, date, date-time, password"]))), class: OasUnknownHeaderFormatRule },
                { code: "HEAD-006", name: "Unexpected Usage of Header 'collectionFormat'", type: "Invalid Property Value", entity: "Header", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_78 || (templateObject_78 = __makeTemplateObject(["Header Collection Format is only allowed for \"array\" type headers."], ["Header Collection Format is only allowed for \"array\" type headers."]))), class: OasUnexpectedHeaderCollectionFormatRule },
                { code: "HEAD-007", name: "Unknown Header Collection Format", type: "Invalid Property Value", entity: "Header", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_79 || (templateObject_79 = __makeTemplateObject(["Header Collection Format must be one of: csv, ssv, tsv, pipes"], ["Header Collection Format must be one of: csv, ssv, tsv, pipes"]))), class: OasUnknownHeaderCollectionFormatRule },
                { code: "XML-002", name: "Unexpected Usage of XML Wrapping", type: "Invalid Property Value", entity: "XML", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_80 || (templateObject_80 = __makeTemplateObject(["XML Wrapped elements can only be used for \"array\" properties."], ["XML Wrapped elements can only be used for \"array\" properties."]))), class: OasUnexpectedXmlWrappingRule },
                { code: "SS-008", name: "Unknown Security Scheme Type", type: "Invalid Property Value", entity: "Security Scheme", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_81 || (templateObject_81 = __makeTemplateObject(["Security Scheme Type must be one of: ", ""], ["Security Scheme Type must be one of: ", ""])), 'options'), class: OasUnknownSecuritySchemeTypeRule },
                { code: "SS-009", name: "Unknown API Key Location", type: "Invalid Property Value", entity: "Security Scheme", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_82 || (templateObject_82 = __makeTemplateObject(["API Key Security Scheme must be located \"in\" one of: ", ""], ["API Key Security Scheme must be located \"in\" one of: ", ""])), 'options'), class: OasUnknownApiKeyLocationRule },
                { code: "SS-010", name: "Unknown OAuth Flow Type", type: "Invalid Property Value", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_83 || (templateObject_83 = __makeTemplateObject(["OAuth Security Scheme \"flow\" must be one of: implicit, password, application, accessCode"], ["OAuth Security Scheme \"flow\" must be one of: implicit, password, application, accessCode"]))), class: OasUnknownOauthFlowTypeRule },
                { code: "SREQ-002", name: "Security Requirement Scopes Must Be Empty", type: "Invalid Property Value", entity: "Security Requirement", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_84 || (templateObject_84 = __makeTemplateObject(["Security Requirement '", "' scopes must be an empty array because the referenced Security Definition not ", "."], ["Security Requirement '", "' scopes must be an empty array because the referenced Security Definition not ", "."])), 'sname', 'options'), class: OasSecurityRequirementScopesMustBeEmptyRule },
                { code: "SREQ-003", name: "Unexpected Security Requirement Scope(s)", type: "Invalid Property Value", entity: "Security Requirement", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_85 || (templateObject_85 = __makeTemplateObject(["Security Requirement '", "' scopes must be an array of values from the possible scopes defined by the referenced Security Definition."], ["Security Requirement '", "' scopes must be an array of values from the possible scopes defined by the referenced Security Definition."])), 'sname'), class: OasUnexpectedSecurityRequirementScopesRule },
                { code: "ENC-001", name: "Unexpected Usage of Headers (Multipart Media Type)", type: "Invalid Property Value", entity: "Encoding", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_86 || (templateObject_86 = __makeTemplateObject(["Headers are not allowed for \"", "\" media types."], ["Headers are not allowed for \"", "\" media types."])), 'name'), class: OasUnexpectedHeaderUsageRule },
                { code: "ENC-002", name: "Encoding Style Not Allowed for Media Type", type: "Invalid Property Value", entity: "Encoding", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_87 || (templateObject_87 = __makeTemplateObject(["Encoding Style is not allowed for \"", "\" media types."], ["Encoding Style is not allowed for \"", "\" media types."])), 'name'), class: OasEncodingStyleNotAllowedRule },
                { code: "ENC-003", name: "'Explode' Not Allowed for Media Type", type: "Invalid Property Value", entity: "Encoding", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_88 || (templateObject_88 = __makeTemplateObject(["\"Explode\" is not allowed for \"", "\" media types."], ["\"Explode\" is not allowed for \"", "\" media types."])), 'name'), class: OasExplodeNotAllowedRule },
                { code: "ENC-004", name: "'Allow Reserved' Not Allowed for Media Type", type: "Invalid Property Value", entity: "Encoding", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_89 || (templateObject_89 = __makeTemplateObject(["\"Allow Reserved\" is not allowed for \"", "\" media types."], ["\"Allow Reserved\" is not allowed for \"", "\" media types."])), 'name'), class: OasAllowReservedNotAllowedRule },
                { code: "ENC-005", name: "Unknown Encoding Style", type: "Invalid Property Value", entity: "Encoding", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_90 || (templateObject_90 = __makeTemplateObject(["Encoding Style is an invalid value."], ["Encoding Style is an invalid value."]))), class: OasUnknownEncodingStyleRule },
                { code: "HEAD-010", name: "InvalidHeaderStyle", type: "Invalid Property Value", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_91 || (templateObject_91 = __makeTemplateObject(["Header Style must be \"simple\"."], ["Header Style must be \"simple\"."]))), class: OasInvalidHeaderStyleRule },
                { code: "HEAD-011", name: "Unexpected Number of Header Media Types", type: "Invalid Property Value", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_92 || (templateObject_92 = __makeTemplateObject(["Header content cannot have multiple media types."], ["Header content cannot have multiple media types."]))), class: OasUnexpectedNumberOfHeaderMTsRule },
                { code: "LINK-002", name: "Invalid Link OperationID Reference", type: "Invalid Reference", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_93 || (templateObject_93 = __makeTemplateObject(["The Operation ID does not refer to an existing Operation."], ["The Operation ID does not refer to an existing Operation."]))), class: OasInvalidLinkOperationIdRule },
                { code: "MT-003", name: "Invalid Encoding For Multi-Part Media Type", type: "Invalid Property Value", entity: "Media Type", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_94 || (templateObject_94 = __makeTemplateObject(["Encoding is not allowed for \"", "\" media types."], ["Encoding is not allowed for \"", "\" media types."])), 'name'), class: OasInvalidEncodingForMPMTRule },
                { code: "OP-009", name: "Unexpected Request Body", type: "Invalid Property Value", entity: "Operation", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_95 || (templateObject_95 = __makeTemplateObject(["Request Body is not supported for ", " operations."], ["Request Body is not supported for ", " operations."])), 'method'), class: OasUnexpectedRequestBodyRule },
                { code: "OP-011", name: "Missing Path Parameter Definition", type: "Invalid Property Value", entity: "Operation", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_96 || (templateObject_96 = __makeTemplateObject(["No definition found for path variable \"", "\" for path '", "' and method '", "'."], ["No definition found for path variable \"", "\" for path '", "' and method '", "'."])), 'param', 'path', 'method'), class: OasMissingPathParamDefinitionRule },
                { code: "OP-013", name: "Missing Response for Operation", type: "Invalid Property Value", entity: "Operation", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_97 || (templateObject_97 = __makeTemplateObject(["Operation must have at least one Response."], ["Operation must have at least one Response."]))), class: OasMissingResponseForOperationRule },
                { code: "PAR-022", name: "Unknown Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_98 || (templateObject_98 = __makeTemplateObject(["Parameter Style must be one of: [\"matrix\", \"label\", \"form\", \"simple\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"] (Found \"", "\")."], ["Parameter Style must be one of: [\"matrix\", \"label\", \"form\", \"simple\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"] (Found \"", "\")."])), 'style'), class: OasUnknownParamStyleRule },
                { code: "PAR-023", name: "Unknown Query Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_99 || (templateObject_99 = __makeTemplateObject(["Query Parameter Style must be one of: [\"form\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"] (Found \"", "\")."], ["Query Parameter Style must be one of: [\"form\", \"spaceDelimited\", \"pipeDelimited\", \"deepObject\"] (Found \"", "\")."])), 'style'), class: OasUnknownQueryParamStyleRule },
                { code: "PAR-024", name: "Unknown Cookie Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_100 || (templateObject_100 = __makeTemplateObject(["Cookie Parameter style must be \"form\". (Found \"", "\")"], ["Cookie Parameter style must be \"form\". (Found \"", "\")"])), 'style'), class: OasUnknownCookieParamStyleRule },
                { code: "PAR-025", name: "Unknown Header Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_101 || (templateObject_101 = __makeTemplateObject(["Header Parameter Style must be \"simple\". (Found \"", "\")."], ["Header Parameter Style must be \"simple\". (Found \"", "\")."])), 'style'), class: OasUnknownHeaderParamStyleRule },
                { code: "PAR-027", name: "Unknown Path Parameter Style", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_102 || (templateObject_102 = __makeTemplateObject(["Path Parameter Style must be one of: [\"matrix\", \"label\", \"simple\"]  (Found \"", "\")."], ["Path Parameter Style must be one of: [\"matrix\", \"label\", \"simple\"]  (Found \"", "\")."])), 'style'), class: OasUnknownPathParamStyleRule },
                { code: "PAR-028", name: "'Allow Reserved' Not Allowed for Param", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_103 || (templateObject_103 = __makeTemplateObject(["Allow Reserved is only allowed for Query Parameters."], ["Allow Reserved is only allowed for Query Parameters."]))), class: OasAllowReservedNotAllowedForParamRule },
                { code: "PAR-029", name: "Unexpected Number of Parameter Media Types", type: "Invalid Property Value", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_104 || (templateObject_104 = __makeTemplateObject(["Parameter content cannot have multiple media types."], ["Parameter content cannot have multiple media types."]))), class: OasUnexpectedNumOfParamMTsRule },
                { code: "SCH-002", name: "Unexpected Usage of Discriminator", type: "Invalid Property Value", entity: "Schema", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_105 || (templateObject_105 = __makeTemplateObject(["Schema Discriminator is only allowed when using one of: [\"oneOf\", \"anyOf\", \"allOf\"]"], ["Schema Discriminator is only allowed when using one of: [\"oneOf\", \"anyOf\", \"allOf\"]"]))), class: OasUnexpectedUsageOfDiscriminatorRule },
                { code: "SS-016", name: "Invalid HTTP Security Scheme Type", type: "Invalid Property Value", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_106 || (templateObject_106 = __makeTemplateObject(["HTTP Security Scheme must be one of: [\"basic\", \"bearer\", \"digest\", \"hoba\", \"mutual\", \"negotiate\", \"oauth\", \"vapid\", \"scram-sha-1\", \"scram-sha-256\"] (Found: '", "')"], ["HTTP Security Scheme must be one of: [\"basic\", \"bearer\", \"digest\", \"hoba\", \"mutual\", \"negotiate\", \"oauth\", \"vapid\", \"scram-sha-1\", \"scram-sha-256\"] (Found: '", "')"])), 'scheme'), class: OasInvalidHttpSecuritySchemeTypeRule },
                { code: "SS-017", name: "Unexpected Usage of 'bearerFormat'", type: "Invalid Property Value", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_107 || (templateObject_107 = __makeTemplateObject(["Security Scheme \"Bearer Format\" only allowed for HTTP Bearer auth scheme."], ["Security Scheme \"Bearer Format\" only allowed for HTTP Bearer auth scheme."]))), class: OasUnexpectedUsageOfBearerTokenRule },
                { code: "SREQ-004", name: "Invalid Security Requirement Scopes", type: "Invalid Property Value", entity: "Security Requirement", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_108 || (templateObject_108 = __makeTemplateObject(["Value (scopes) for Security Requirement \"", "\" must be an array."], ["Value (scopes) for Security Requirement \"", "\" must be an array."])), 'name'), class: OasInvalidSecurityReqScopesRule },
                { code: "SVAR-003", name: "Server Variable Not Found in Template", type: "Invalid Property Value", entity: "XXX", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_109 || (templateObject_109 = __makeTemplateObject(["Server Variable \"", "\" is not found in the server url template."], ["Server Variable \"", "\" is not found in the server url template."])), 'name'), class: OasServerVarNotFoundInTemplateRule },
                /** Invalid Reference **/
                { code: "PAR-018", name: "Invalid Parameter Reference", type: "Invalid Reference", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_110 || (templateObject_110 = __makeTemplateObject(["Parameter Reference must refer to a valid Parameter Definition."], ["Parameter Reference must refer to a valid Parameter Definition."]))), class: OasInvalidParameterReferenceRule },
                { code: "PATH-001", name: "Invalid Path Item Reference", type: "Invalid Reference", entity: "Path Item", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_111 || (templateObject_111 = __makeTemplateObject(["Path Item Reference must refer to a valid Path Item Definition."], ["Path Item Reference must refer to a valid Path Item Definition."]))), class: OasInvalidPathItemReferenceRule },
                { code: "RES-002", name: "Invalid Response Reference", type: "Invalid Reference", entity: "Response", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_112 || (templateObject_112 = __makeTemplateObject(["Response Reference must refer to a valid Response Definition."], ["Response Reference must refer to a valid Response Definition."]))), class: OasInvalidResponseReferenceRule },
                { code: "SCH-001", name: "Invalid Schema Reference", type: "Invalid Reference", entity: "Schema", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_113 || (templateObject_113 = __makeTemplateObject(["Schema Reference must refer to a valid Schema Definition."], ["Schema Reference must refer to a valid Schema Definition."]))), class: OasInvalidSchemaReferenceRule },
                { code: "SREQ-001", name: "Invalid Security Requirement Name", type: "Invalid Reference", entity: "Security Requirement", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_114 || (templateObject_114 = __makeTemplateObject(["Security Requirement '", "' must refer to a valid Security Scheme."], ["Security Requirement '", "' must refer to a valid Security Scheme."])), 'name'), class: OasInvalidSecurityRequirementNameRule },
                { code: "SS-018", name: "Invalid Security Scheme Reference", type: "Invalid Reference", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_115 || (templateObject_115 = __makeTemplateObject(["Security Scheme Reference must refer to a valid Security Scheme Definition."], ["Security Scheme Reference must refer to a valid Security Scheme Definition."]))), class: OasInvalidSecuritySchemeReferenceRule },
                { code: "CALL-001", name: "Invalid Callback Reference", type: "Invalid Reference", entity: "Callback", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_116 || (templateObject_116 = __makeTemplateObject(["Callback Reference must refer to a valid Callback Definition."], ["Callback Reference must refer to a valid Callback Definition."]))), class: OasInvalidCallbackReferenceRule },
                { code: "EX-003", name: "Invalid Example Reference", type: "Invalid Reference", entity: "Example", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_117 || (templateObject_117 = __makeTemplateObject(["Example Reference must refer to a valid Example Definition."], ["Example Reference must refer to a valid Example Definition."]))), class: OasInvalidExampleReferenceRule },
                { code: "HEAD-012", name: "Invalid Head Reference", type: "Invalid Reference", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_118 || (templateObject_118 = __makeTemplateObject(["Header Reference must refer to a valid Header Definition."], ["Header Reference must refer to a valid Header Definition."]))), class: OasInvalidHeaderReferenceRule },
                { code: "LINK-005", name: "Invalid Link Reference", type: "Invalid Reference", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_119 || (templateObject_119 = __makeTemplateObject(["Link Reference must refer to a valid Link Definition."], ["Link Reference must refer to a valid Link Definition."]))), class: OasInvalidLinkReferenceRule },
                { code: "LINK-003", name: "Invalid Link Operation Reference", type: "Invalid Reference", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_120 || (templateObject_120 = __makeTemplateObject(["Link \"Operation Reference\" must refer to a valid Operation Definition."], ["Link \"Operation Reference\" must refer to a valid Operation Definition."]))), class: OasInvalidLinkOperationReferenceRule },
                { code: "RB-003", name: "Invalid Request Body Reference", type: "Invalid Reference", entity: "Request Body", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_121 || (templateObject_121 = __makeTemplateObject(["Request Body Reference must refer to a valid Request Body Definition."], ["Request Body Reference must refer to a valid Request Body Definition."]))), class: OasInvalidRequestBodyReferenceRule },
                /** Mutual Exclusivity **/
                { code: "PATH-002", name: "Body and Form Data Params are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Operation", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_122 || (templateObject_122 = __makeTemplateObject(["Operation may not have both Body and Form Data parameters."], ["Operation may not have both Body and Form Data parameters."]))), class: OasBodyAndFormDataMutualExclusivityRule },
                { code: "EX-004", name: "Example Value and External Value are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Example", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_123 || (templateObject_123 = __makeTemplateObject(["Example \"Value\" and \"External Value\" are mutually exclusive."], ["Example \"Value\" and \"External Value\" are mutually exclusive."]))), class: OasExampleValueMutualExclusivityRule },
                { code: "HEAD-013", name: "Header Example and Examples are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_124 || (templateObject_124 = __makeTemplateObject(["Header \"Example\" and \"Examples\" are mutually exclusive."], ["Header \"Example\" and \"Examples\" are mutually exclusive."]))), class: OasHeaderExamplesMutualExclusivityRule },
                { code: "HEAD-014", name: "Header Schema and Content are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_125 || (templateObject_125 = __makeTemplateObject(["Header cannot have both a Schema and Content."], ["Header cannot have both a Schema and Content."]))), class: OasHeaderSchemaContentMutualExclusivityRule },
                { code: "LINK-001", name: "Link Operation Ref and Operation ID are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Link", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_126 || (templateObject_126 = __makeTemplateObject(["Link Operation Reference and Operation ID cannot both be used."], ["Link Operation Reference and Operation ID cannot both be used."]))), class: OasLinkOperationRefMutualExclusivityRule },
                { code: "MT-001", name: "Media Type Example and Examples are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Media Type", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_127 || (templateObject_127 = __makeTemplateObject(["Media Type \"Example\" and \"Examples\" are mutually exclusive."], ["Media Type \"Example\" and \"Examples\" are mutually exclusive."]))), class: OasMediaTypeExamplesMutualExclusivityRule },
                { code: "PAR-030", name: "Parameter Schema and Content are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_128 || (templateObject_128 = __makeTemplateObject(["Parameter cannot have both a Schema and Content."], ["Parameter cannot have both a Schema and Content."]))), class: OasParameterSchemaContentMutualExclusivityRule },
                { code: "PAR-031", name: "Parameter Example and Examples are Mutually Exclusive", type: "Mutual Exclusivity", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_129 || (templateObject_129 = __makeTemplateObject(["Parameter \"Example\" and \"Examples\" are mutually exclusive."], ["Parameter \"Example\" and \"Examples\" are mutually exclusive."]))), class: OasParameterExamplesMutualExclusivityRule },
                /** Required Property **/
                { code: "R-001", name: "Missing OpenAPI Property", type: "Required Property", entity: "API", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_130 || (templateObject_130 = __makeTemplateObject(["API is missing the 'openapi' property."], ["API is missing the 'openapi' property."]))), class: OasMissingOpenApiPropertyRule },
                { code: "R-002", name: "Missing API Information", type: "Required Property", entity: "API", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_131 || (templateObject_131 = __makeTemplateObject(["API is missing the 'info' property."], ["API is missing the 'info' property."]))), class: OasMissingApiInformationRule },
                { code: "R-003", name: "Missing API Paths", type: "Required Property", entity: "API", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_132 || (templateObject_132 = __makeTemplateObject(["API is missing the 'paths' property."], ["API is missing the 'paths' property."]))), class: OasMissingApiPathsRule },
                { code: "INF-001", name: "Missing API Title", type: "Required Property", entity: "Info", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_133 || (templateObject_133 = __makeTemplateObject(["API is missing a title."], ["API is missing a title."]))), class: OasMissingApiTitleRule },
                { code: "INF-002", name: "Missing API Version", type: "Required Property", entity: "Info", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_134 || (templateObject_134 = __makeTemplateObject(["API is missing a version."], ["API is missing a version."]))), class: OasMissingApiVersionRule },
                { code: "LIC-001", name: "Missing License Name", type: "Required Property", entity: "License", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_135 || (templateObject_135 = __makeTemplateObject(["License is missing a name."], ["License is missing a name."]))), class: OasMissingLicenseNameRule },
                { code: "OP-007", name: "Missing Operation Responses", type: "Required Property", entity: "Operation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_136 || (templateObject_136 = __makeTemplateObject(["Operation must have at least one response."], ["Operation must have at least one response."]))), class: OasMissingOperationResponsesRule },
                { code: "OP-008", name: "Missing Operation ID", type: "Required Property", entity: "Operation", versions: ["2.0", "3.0"], specMandated: false, messageTemplate: template(templateObject_137 || (templateObject_137 = __makeTemplateObject(["Operation is missing a operation id."], ["Operation is missing a operation id."]))), class: OasMissingOperationIdRule },
                { code: "ED-001", name: "Missing External Documentation URL", type: "Required Property", entity: "External Documentation", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_138 || (templateObject_138 = __makeTemplateObject(["External Documentation is missing a URL."], ["External Documentation is missing a URL."]))), class: OasMissingExternalDocumentationUrlRule },
                { code: "PAR-001", name: "Missing Parameter Name", type: "Required Property", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_139 || (templateObject_139 = __makeTemplateObject(["Parameter is missing a name."], ["Parameter is missing a name."]))), class: OasMissingParameterNameRule },
                { code: "PAR-002", name: "Missing Parameter Location", type: "Required Property", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_140 || (templateObject_140 = __makeTemplateObject(["Parameter is missing a location (Query, Header, etc)."], ["Parameter is missing a location (Query, Header, etc)."]))), class: OasMissingParameterLocationRule },
                { code: "PAR-003", name: "Path Parameters Must Be Required", type: "Required Property", entity: "Parameter", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_141 || (templateObject_141 = __makeTemplateObject(["Path Parameter \"", "\" must be marked as required."], ["Path Parameter \"", "\" must be marked as required."])), 'name'), class: OasPathParamsMustBeRequiredRule },
                { code: "PAR-004", name: "Missing Body Parameter Schema", type: "Required Property", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_142 || (templateObject_142 = __makeTemplateObject(["Body Parameters must have a schema defined."], ["Body Parameters must have a schema defined."]))), class: OasMissingBodyParameterSchemaRule },
                { code: "PAR-005", name: "Missing Parameter Type", type: "Required Property", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_143 || (templateObject_143 = __makeTemplateObject(["Parameter '", "' is missing a type."], ["Parameter '", "' is missing a type."])), 'name'), class: OasMissingParameterTypeRule },
                { code: "PAR-006", name: "Missing Parameter Array Type", type: "Required Property", entity: "Parameter", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_144 || (templateObject_144 = __makeTemplateObject(["Parameter '", "' marked as array but no array type provided."], ["Parameter '", "' marked as array but no array type provided."])), 'name'), class: OasMissingParameterArrayTypeRule },
                { code: "IT-001", name: "Missing Items Type", type: "Required Property", entity: "Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_145 || (templateObject_145 = __makeTemplateObject(["Type information is missing for array items."], ["Type information is missing for array items."]))), class: OasMissingItemsTypeRule },
                { code: "IT-002", name: "Missing Items Array Information", type: "Required Property", entity: "Items", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_146 || (templateObject_146 = __makeTemplateObject(["Type information missing for array items."], ["Type information missing for array items."]))), class: OasMissingItemsArrayInformationRule },
                { code: "RES-001", name: "Missing Response Description", type: "Required Property", entity: "Response", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_147 || (templateObject_147 = __makeTemplateObject(["Response (code ", ") is missing a description."], ["Response (code ", ") is missing a description."])), 'statusCode'), class: OasMissingResponseDescriptionRule },
                { code: "HEAD-001", name: "Missing Header Type", type: "Required Property", entity: "Header", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_148 || (templateObject_148 = __makeTemplateObject(["Header is missing type information."], ["Header is missing type information."]))), class: OasMissingHeaderTypeRule },
                { code: "HEAD-002", name: "Missing Header Array Information", type: "Required Property", entity: "Header", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_149 || (templateObject_149 = __makeTemplateObject(["Header is missing array type information."], ["Header is missing array type information."]))), class: OasMissingHeaderArrayInformationRule },
                { code: "SCH-005", name: "Missing Schema Array Information", type: "Required Property", entity: "Schema", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_150 || (templateObject_150 = __makeTemplateObject(["Schema is missing array type information."], ["Schema is missing array type information."]))), class: OasMissingSchemaArrayInformationRule },
                { code: "TAG-001", name: "Missing Tag Name", type: "Required Property", entity: "Tag", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_151 || (templateObject_151 = __makeTemplateObject(["Tag is missing a name."], ["Tag is missing a name."]))), class: OasMissingTagNameRule },
                { code: "SS-001", name: "Missing Security Scheme Type", type: "Required Property", entity: "Security Scheme", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_152 || (templateObject_152 = __makeTemplateObject(["Security Scheme is missing a type."], ["Security Scheme is missing a type."]))), class: OasMissingSecuritySchemeTypeRule },
                { code: "SS-002", name: "Missing API-Key Scheme Parameter Name", type: "Required Property", entity: "Security Scheme", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_153 || (templateObject_153 = __makeTemplateObject(["API Key Security Scheme is missing a parameter name (e.g. name of a header or query param)."], ["API Key Security Scheme is missing a parameter name (e.g. name of a header or query param)."]))), class: OasMissingApiKeySchemeParamNameRule },
                { code: "SS-003", name: "Missing API-Key Scheme Parameter Location", type: "Required Property", entity: "Security Scheme", versions: ["2.0", "3.0"], specMandated: true, messageTemplate: template(templateObject_154 || (templateObject_154 = __makeTemplateObject(["API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc)."], ["API Key Security Scheme must describe where the Key can be found (e.g. header, query param, etc)."]))), class: OasMissingApiKeySchemeParamLocationRule },
                { code: "SS-004", name: "Missing OAuth Scheme Flow Type", type: "Required Property", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_155 || (templateObject_155 = __makeTemplateObject(["OAuth Security Scheme is missing a flow type."], ["OAuth Security Scheme is missing a flow type."]))), class: OasMissingOAuthSchemeFlowTypeRule },
                { code: "SS-005", name: "Missing OAuth Scheme Auth URL", type: "Required Property", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_156 || (templateObject_156 = __makeTemplateObject(["OAuth Security Scheme is missing an Authorization URL."], ["OAuth Security Scheme is missing an Authorization URL."]))), class: OasMissingOAuthSchemeAuthUrlRule },
                { code: "SS-006", name: "Missing OAuth Scheme Token URL", type: "Required Property", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_157 || (templateObject_157 = __makeTemplateObject(["OAuth Security Scheme is missing a Token URL."], ["OAuth Security Scheme is missing a Token URL."]))), class: OasMissingOAuthSchemeTokenUrlRule },
                { code: "SS-007", name: "Missing OAuth Scheme Scopes", type: "Required Property", entity: "Security Scheme", versions: ["2.0"], specMandated: true, messageTemplate: template(templateObject_158 || (templateObject_158 = __makeTemplateObject(["OAuth Security Scheme is missing defined scopes."], ["OAuth Security Scheme is missing defined scopes."]))), class: OasMissingOAuthSchemeScopesRule },
                { code: "DISC-001", name: "Missing a Discriminator Property Name", type: "Required Property", entity: "Discriminator", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_159 || (templateObject_159 = __makeTemplateObject(["Discriminator must indicate a property (by name)."], ["Discriminator must indicate a property (by name)."]))), class: OasMissingDiscriminatorPropertyNameRule },
                { code: "FLOW-006", name: "Missing OAuth Flow Scopes", type: "Required Property", entity: "OAuth Flow", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_160 || (templateObject_160 = __makeTemplateObject(["OAuth Flow is missing defined scopes."], ["OAuth Flow is missing defined scopes."]))), class: OasMissingOAuthFlowScopesRule },
                { code: "FLOW-001", name: "Missing OAuth Flow Authorization URL", type: "Required Property", entity: "OAuth Flow", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_161 || (templateObject_161 = __makeTemplateObject(["", " OAuth Flow is missing an Authorization URL."], ["", " OAuth Flow is missing an Authorization URL."])), 'flowType'), class: OasMissingOAuthFlowAuthUrlRule },
                { code: "FLOW-002", name: "Missing OAuth Flow Token URL", type: "Required Property", entity: "OAuth Flow", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_162 || (templateObject_162 = __makeTemplateObject(["", " OAuth Flow is missing a Token URL."], ["", " OAuth Flow is missing a Token URL."])), 'flowType'), class: OasMissingOAuthFlowRokenUrlRule },
                { code: "RB-002", name: "Missing Request Body Content", type: "Required Property", entity: "Request Body", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_163 || (templateObject_163 = __makeTemplateObject(["Request Body content is missing."], ["Request Body content is missing."]))), class: OasMissingRequestBodyContentRule },
                { code: "SRV-001", name: "Missing Server Template URL", type: "Required Property", entity: "Server", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_164 || (templateObject_164 = __makeTemplateObject(["Server is missing a template URL."], ["Server is missing a template URL."]))), class: OasMissingServerTemplateUrlRule },
                { code: "SS-019", name: "Missing HTTP Security Scheme Style", type: "Required Property", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_165 || (templateObject_165 = __makeTemplateObject(["HTTP Security Scheme is missing a scheme (Basic, Digest, etc)."], ["HTTP Security Scheme is missing a scheme (Basic, Digest, etc)."]))), class: OasMissingHttpSecuritySchemeTypeRule },
                { code: "SS-020", name: "Missing OAuth Security Scheme Flows", type: "Required Property", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_166 || (templateObject_166 = __makeTemplateObject(["OAuth Security Scheme does not define any OAuth flows."], ["OAuth Security Scheme does not define any OAuth flows."]))), class: OasMissingOAuthSecuritySchemeFlowsRule },
                { code: "SS-021", name: "Missing OID Connect Security Scheme Connect URL", type: "Required Property", entity: "Security Scheme", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_167 || (templateObject_167 = __makeTemplateObject(["OpenID Connect Security Scheme is missing a Connect URL."], ["OpenID Connect Security Scheme is missing a Connect URL."]))), class: OasMissingOpenIdConnectSecuritySchemeConnectUrlRule },
                { code: "SVAR-001", name: "Missing Server Variable Default Value", type: "Required Property", entity: "Server Variable", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_168 || (templateObject_168 = __makeTemplateObject(["Server Variable \"", "\" is missing a default value."], ["Server Variable \"", "\" is missing a default value."])), 'name'), class: OasMissingServerVarDefaultValueRule },
                /** Ignored Property **/
                { code: "HEAD-008", name: "Ignored Content-Type Header", type: "Ignored Property", entity: "Header", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_169 || (templateObject_169 = __makeTemplateObject(["The \"Content-Type\" header will be ignored."], ["The \"Content-Type\" header will be ignored."]))), class: OasIgnoredContentTypeHeaderRule },
                { code: "PAR-021", name: "Ignored Header Parameter", type: "Ignored Property", entity: "Parameter", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_170 || (templateObject_170 = __makeTemplateObject(["The \"", "\" header parameter will be ignored."], ["The \"", "\" header parameter will be ignored."])), 'name'), class: OasIgnoredHeaderParameterRule },
                /** Invalid Property Type **/
                { code: "SCH-003", name: "Invalid Schema Type Value", type: "Invalid Property Type", entity: "Schema", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_171 || (templateObject_171 = __makeTemplateObject(["Schema type value of \"", "\" is not allowed.  Must be one of: [", "]"], ["Schema type value of \"", "\" is not allowed.  Must be one of: [", "]"])), 'type', 'allowedTypes'), class: OasInvalidSchemaTypeValueRule },
                { code: "SCH-004", name: "Invalid Schema Array Items", type: "Invalid Property Type", entity: "Schema", versions: ["3.0"], specMandated: true, messageTemplate: template(templateObject_172 || (templateObject_172 = __makeTemplateObject(["Schema items must be present only for schemas of type 'array'."], ["Schema items must be present only for schemas of type 'array'."]))), class: OasInvalidSchemaArrayItemsRule },
            ];
            this.validateRuleData();
        }
        /**
         * Verify that there are no duplicate codes in the set of rules.
         */
        OasValidationRuleset.prototype.validateRuleData = function () {
            var codes = {};
            var names = {};
            this._rules.forEach(function (rule) {
                if (codes[rule.code]) {
                    throw new Error("Duplicate rule code found: " + rule.code);
                }
                else {
                    codes[rule.code] = rule.name;
                }
                if (names[rule.name]) {
                    throw new Error("Duplicate rule name found: " + rule.name);
                }
                else {
                    names[rule.name] = rule.code;
                }
            });
        };
        /**
         * Gets all of the registered rules.
         */
        OasValidationRuleset.prototype.getAllRules = function () {
            return this._rules;
        };
        /**
         * Gets the actual rule instances (visitors) that should be applied to the given document.
         * @param document
         */
        OasValidationRuleset.prototype.getRulesFor = function (document) {
            var version = "2.0";
            if (document.is3xDocument()) {
                version = "3.0";
            }
            return this._rules.filter(function (rule) {
                return rule.versions.indexOf(version) != -1;
            }).map(function (rule) {
                return new rule.class(rule);
            });
        };
        OasValidationRuleset.instance = new OasValidationRuleset();
        return OasValidationRuleset;
    }());
    var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49, templateObject_50, templateObject_51, templateObject_52, templateObject_53, templateObject_54, templateObject_55, templateObject_56, templateObject_57, templateObject_58, templateObject_59, templateObject_60, templateObject_61, templateObject_62, templateObject_63, templateObject_64, templateObject_65, templateObject_66, templateObject_67, templateObject_68, templateObject_69, templateObject_70, templateObject_71, templateObject_72, templateObject_73, templateObject_74, templateObject_75, templateObject_76, templateObject_77, templateObject_78, templateObject_79, templateObject_80, templateObject_81, templateObject_82, templateObject_83, templateObject_84, templateObject_85, templateObject_86, templateObject_87, templateObject_88, templateObject_89, templateObject_90, templateObject_91, templateObject_92, templateObject_93, templateObject_94, templateObject_95, templateObject_96, templateObject_97, templateObject_98, templateObject_99, templateObject_100, templateObject_101, templateObject_102, templateObject_103, templateObject_104, templateObject_105, templateObject_106, templateObject_107, templateObject_108, templateObject_109, templateObject_110, templateObject_111, templateObject_112, templateObject_113, templateObject_114, templateObject_115, templateObject_116, templateObject_117, templateObject_118, templateObject_119, templateObject_120, templateObject_121, templateObject_122, templateObject_123, templateObject_124, templateObject_125, templateObject_126, templateObject_127, templateObject_128, templateObject_129, templateObject_130, templateObject_131, templateObject_132, templateObject_133, templateObject_134, templateObject_135, templateObject_136, templateObject_137, templateObject_138, templateObject_139, templateObject_140, templateObject_141, templateObject_142, templateObject_143, templateObject_144, templateObject_145, templateObject_146, templateObject_147, templateObject_148, templateObject_149, templateObject_150, templateObject_151, templateObject_152, templateObject_153, templateObject_154, templateObject_155, templateObject_156, templateObject_157, templateObject_158, templateObject_159, templateObject_160, templateObject_161, templateObject_162, templateObject_163, templateObject_164, templateObject_165, templateObject_166, templateObject_167, templateObject_168, templateObject_169, templateObject_170, templateObject_171, templateObject_172;

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
    var __extends$1t = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Visitor used to clear validation problems.  This is typically done just before
     * validation is run so that the data model is clean.  Validation would then add new
     * problem nodes to the model.
     */
    var OasResetValidationProblemsVisitor = /** @class */ (function (_super) {
        __extends$1t(OasResetValidationProblemsVisitor, _super);
        function OasResetValidationProblemsVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OasResetValidationProblemsVisitor.prototype.doVisitNode = function (node) {
            node.clearValidationProblems();
        };
        return OasResetValidationProblemsVisitor;
    }(OasAllNodeVisitor));
    /**
     * Visitor used to validate a OpenAPI document (or a subsection of the document).  The result
     * of the validation will be a list of validation errors.  In addition, the validator will
     * add the validation errors directly to the offending model nodes as attributes.
     */
    var OasValidationVisitor = /** @class */ (function (_super) {
        __extends$1t(OasValidationVisitor, _super);
        /**
         * C'tor.
         * @param document
         */
        function OasValidationVisitor(document) {
            var _this = _super.call(this) || this;
            _this.errors = [];
            _this.severityRegistry = new DefaultValidationSeverityRegistry();
            var ruleset = OasValidationRuleset.instance;
            var rulesFor = ruleset.getRulesFor(document);
            rulesFor.forEach(function (rule) { rule.setReporter(_this); });
            _this.addVisitors(rulesFor);
            return _this;
        }
        /**
         * Sets the severity registry.
         * @param {IOasValidationSeverityRegistry} severityRegistry
         */
        OasValidationVisitor.prototype.setSeverityRegistry = function (severityRegistry) {
            this.severityRegistry = severityRegistry;
        };
        /**
         * Returns the array of validation errors found by the visitor.
         * @return {OasValidationProblem[]}
         */
        OasValidationVisitor.prototype.getValidationErrors = function () {
            return this.errors;
        };
        /**
         * Called by validation rules when an error is detected.
         * @param ruleInfo
         * @param node
         * @param property
         * @param message
         */
        OasValidationVisitor.prototype.report = function (ruleInfo, node, property, message) {
            var severity = this.severityRegistry.lookupSeverity(ruleInfo);
            if (severity === exports.OasValidationProblemSeverity.ignore) {
                return;
            }
            var path = OasNodePathUtil.createNodePath(node);
            var error = node.addValidationProblem(ruleInfo.code, path, property, message, severity);
            // Include the error in the list of errors found by this visitor.
            this.errors.push(error);
        };
        return OasValidationVisitor;
    }(OasCombinedCompositeVisitor));

    var __extends$1u = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * A visitor used to transform an OpenAPI 2.0 document into an OpenAPI 3.0.x document.
     */
    var Oas20to30TransformationVisitor = /** @class */ (function () {
        function Oas20to30TransformationVisitor() {
            this._library = new OasLibraryUtils();
            this._nodeMap = {};
            this._postProcessResponses = [];
            this._postProcessingComplete = false;
        }
        Oas20to30TransformationVisitor.prototype.getResult = function () {
            if (!this._postProcessingComplete) {
                this.postProcess();
            }
            return this.doc30;
        };
        Oas20to30TransformationVisitor.prototype.visitDocument = function (node) {
            this.doc30 = this._library.createDocument("3.0.2");
            if (node.host) {
                var basePath = node.basePath;
                if (!basePath) {
                    basePath = "";
                }
                var schemes = node.schemes;
                if (!schemes || schemes.length === 0) {
                    schemes = ["http"];
                }
                var server30 = this.doc30.createServer();
                this.doc30.servers = [server30];
                if (schemes.length === 1) {
                    server30.url = schemes[0] + "://" + node.host + basePath;
                }
                else {
                    server30.url = "{scheme}://" + node.host + basePath;
                    var var30 = server30.createServerVariable("scheme");
                    server30.addServerVariable("scheme", var30);
                    var30.default = schemes[0];
                    var30.enum = schemes.slice(0);
                    var30.description = "The supported protocol schemes.";
                }
            }
            this.mapNode(node, this.doc30);
        };
        Oas20to30TransformationVisitor.prototype.visitInfo = function (node) {
            this.doc30.info = this.doc30.createInfo();
            this.doc30.info.title = node.title;
            this.doc30.info.description = node.description;
            this.doc30.info.termsOfService = node.termsOfService;
            this.doc30.info.version = node.version;
            this.mapNode(node, this.doc30.info);
        };
        Oas20to30TransformationVisitor.prototype.visitContact = function (node) {
            var info30 = this.lookup(node.parent());
            var contact30 = info30.createContact();
            info30.contact = contact30;
            contact30.name = node.name;
            contact30.url = node.url;
            contact30.email = node.email;
            this.mapNode(node, contact30);
        };
        Oas20to30TransformationVisitor.prototype.visitLicense = function (node) {
            var info30 = this.lookup(node.parent());
            var license30 = info30.createLicense();
            info30.license = license30;
            license30.name = node.name;
            license30.url = node.url;
            this.mapNode(node, license30);
        };
        Oas20to30TransformationVisitor.prototype.visitPaths = function (node) {
            this.doc30.paths = this.doc30.createPaths();
            this.mapNode(node, this.doc30.paths);
        };
        Oas20to30TransformationVisitor.prototype.visitPathItem = function (node) {
            var paths30 = this.lookup(node.parent());
            var pathItem30 = paths30.createPathItem(node.path());
            paths30.addPathItem(node.path(), pathItem30);
            pathItem30.$ref = this.updateRef(node.$ref);
            this.mapNode(node, pathItem30);
        };
        Oas20to30TransformationVisitor.prototype.visitOperation = function (node) {
            var pathItem30 = this.lookup(node.parent());
            var operation30 = pathItem30.createOperation(node.method());
            pathItem30[node.method()] = operation30;
            operation30.tags = node.tags;
            operation30.summary = node.summary;
            operation30.description = node.description;
            operation30.operationId = node.operationId;
            operation30.deprecated = node.deprecated;
            if (node.schemes && node.schemes.length > 0 && this.doc30.servers && this.doc30.servers.length > 0) {
                var server30 = operation30.createServer();
                operation30.servers = [server30];
                server30.url = this.doc30.servers[0].url;
                if (node.schemes.length === 1) {
                    server30.url = server30.url.replace("{scheme}", node.schemes[0]);
                    server30.removeServerVariable("scheme");
                }
                else {
                    server30.url = "{scheme}" + server30.url.substring(server30.url.indexOf("://"));
                    var var30 = server30.createServerVariable("scheme");
                    server30.addServerVariable("scheme", var30);
                    var30.description = "The supported protocol schemes.";
                    var30.default = node.schemes[0];
                    var30.enum = node.schemes.slice(0);
                }
            }
            // Note: consumes/produces will be handled elsewhere (when Request Body and Response models are created)
            this.mapNode(node, operation30);
        };
        Oas20to30TransformationVisitor.prototype.visitParameter = function (node) {
            var _this = this;
            if (node.in === "body") {
                var operation30 = this.lookup(this.findParentOperation(node));
                if (operation30) {
                    var body30_1 = operation30.createRequestBody();
                    operation30.requestBody = body30_1;
                    body30_1.description = node.description;
                    body30_1.required = node.required;
                    if (node.schema) {
                        var consumes = this.findConsumes(node);
                        var schema_1 = node.schema;
                        consumes.forEach(function (ct) {
                            var mediaType30 = body30_1.createMediaType(ct);
                            body30_1.addMediaType(ct, mediaType30);
                            var schema30 = mediaType30.createSchema();
                            mediaType30.schema = _this.toSchema(schema_1, schema30, true);
                            _this.mapNode(schema_1, schema30);
                        });
                    }
                }
            }
            else if (node.in === "formData") {
                var operation30_1 = this.lookup(this.findParentOperation(node));
                if (operation30_1) {
                    var consumes = this.findConsumes(node);
                    if (!this.hasFormDataMimeType(consumes)) {
                        consumes = ["application/x-www-form-urlencoded"];
                    }
                    consumes.forEach(function (ct) {
                        if (_this.isFormDataMimeType(ct)) {
                            var body30 = operation30_1.requestBody;
                            if (!body30) {
                                body30 = operation30_1.createRequestBody();
                                operation30_1.requestBody = body30;
                                body30.required = true;
                            }
                            var mediaType30 = body30.getMediaType(ct);
                            if (!mediaType30) {
                                mediaType30 = body30.createMediaType(ct);
                                body30.addMediaType(ct, mediaType30);
                            }
                            var schema30 = mediaType30.schema;
                            if (!schema30) {
                                schema30 = mediaType30.createSchema();
                                mediaType30.schema = schema30;
                                schema30.type = "object";
                            }
                            var property30 = schema30.createPropertySchema(node.name);
                            schema30.addProperty(node.name, property30);
                            property30.description = node.description;
                            _this.toSchema(node, property30, false);
                            _this.mapNode(node, schema30);
                        }
                    });
                }
            }
            else {
                if (this.isRef(node)) {
                    var paramDef = ReferenceUtil.resolveRef(node.$ref, node);
                    // Handle the case where there is a parameter $ref to a "body" param.  All body params become
                    // Request Bodies.  So a reference to a "body" param should become a reference to a request body.
                    if (paramDef && paramDef.in === "body") {
                        var parent30_1 = this.lookup(this.findParentOperation(node));
                        if (parent30_1) {
                            var body30 = parent30_1.createRequestBody();
                            parent30_1.requestBody = body30;
                            body30.$ref = "#/components/requestBodies/" + paramDef.parameterName();
                            this.mapNode(node, body30);
                            return;
                        }
                    }
                    // Handle the case where the parameter is a $ref to a formData param.  In this case we want to
                    // treat the param as though it is inlined (which will result in a requestBody model).
                    if (paramDef && paramDef.in === "formData") {
                        // Inline the parameter definition and then re-visit it.
                        this._library.readNode(this._library.writeNode(paramDef), node);
                        node.$ref = null;
                        this.visitParameter(node);
                        return;
                    }
                }
                // Now we have normal handling of a parameter, examples include path params, query params, header params, etc.
                var parent30 = this.lookup(node.parent());
                var param30 = parent30.createParameter();
                parent30.addParameter(param30);
                this.transformParam(node, param30);
                this.mapNode(node, param30);
            }
        };
        Oas20to30TransformationVisitor.prototype.transformParam = function (node, param30) {
            param30.$ref = this.updateRef(node["$ref"]);
            if (param30.$ref) {
                return param30;
            }
            param30.name = node.name;
            param30.in = node.in;
            param30.description = node.description;
            param30.required = node.required;
            param30.allowEmptyValue = node.allowEmptyValue;
            param30.schema = this.toSchema(node, param30.createSchema(), false);
            this.collectionFormatToStyleAndExplode(node, param30);
            return param30;
        };
        Oas20to30TransformationVisitor.prototype.visitParameterDefinition = function (node) {
            var _this = this;
            if (node.in === "body") {
                var parent30 = this.getOrCreateComponents();
                var bodyDef30_1 = parent30.createRequestBodyDefinition(node.parameterName());
                parent30.addRequestBodyDefinition(node.parameterName(), bodyDef30_1);
                bodyDef30_1.description = node.description;
                bodyDef30_1.required = node.required;
                if (node.schema) {
                    var consumes = this.findConsumes(node);
                    var schema_2 = node.schema;
                    consumes.forEach(function (ct) {
                        var mediaType30 = bodyDef30_1.createMediaType(ct);
                        bodyDef30_1.addMediaType(ct, mediaType30);
                        var schema30 = mediaType30.createSchema();
                        mediaType30.schema = _this.toSchema(schema_2, schema30, true);
                        _this.mapNode(schema_2, schema30);
                    });
                }
            }
            else if (node.in === "formData") ;
            else {
                var components30 = this.getOrCreateComponents();
                var paramDef30 = components30.createParameterDefinition(node.parameterName());
                components30.addParameterDefinition(node.parameterName(), paramDef30);
                this.transformParam(node, paramDef30);
                this.mapNode(node, paramDef30);
            }
        };
        Oas20to30TransformationVisitor.prototype.visitExternalDocumentation = function (node) {
            var parent30 = this.lookup(node.parent());
            var externalDocs30 = parent30.createExternalDocumentation();
            parent30.externalDocs = externalDocs30;
            externalDocs30.description = node.description;
            externalDocs30.url = node.url;
            this.mapNode(node, externalDocs30);
        };
        Oas20to30TransformationVisitor.prototype.visitSecurityRequirement = function (node) {
            var parent30 = this.lookup(node.parent());
            var securityRequirement30 = parent30.createSecurityRequirement();
            if (!parent30.security) {
                parent30.security = [];
            }
            parent30.security.push(securityRequirement30);
            node.securityRequirementNames().forEach(function (name) {
                securityRequirement30.addSecurityRequirementItem(name, node.scopes(name));
            });
            this.mapNode(node, securityRequirement30);
        };
        Oas20to30TransformationVisitor.prototype.visitResponses = function (node) {
            var parent30 = this.lookup(node.parent());
            var responses30 = parent30.createResponses();
            parent30.responses = responses30;
            this.mapNode(node, responses30);
        };
        Oas20to30TransformationVisitor.prototype.visitResponse = function (node) {
            var parent30 = this.lookup(node.parent());
            var response30 = parent30.createResponse(node.statusCode());
            parent30.addResponse(node.statusCode(), response30);
            response30.$ref = this.updateRef(node.$ref);
            this.transformResponse(node, response30);
            this.mapNode(node, response30);
        };
        Oas20to30TransformationVisitor.prototype.visitResponseDefinition = function (node) {
            var parent30 = this.getOrCreateComponents();
            var responseDef30 = parent30.createResponseDefinition(node.name());
            parent30.addResponseDefinition(node.name(), responseDef30);
            this.transformResponse(node, responseDef30);
            this.mapNode(node, responseDef30);
        };
        Oas20to30TransformationVisitor.prototype.transformResponse = function (node, response30) {
            var _this = this;
            response30.description = node.description;
            if (node.schema) {
                var produces = this.findProduces(node);
                var schema_3 = node.schema;
                produces.forEach(function (ct) {
                    var mediaType30 = response30.createMediaType(ct);
                    response30.addMediaType(ct, mediaType30);
                    var schema30 = mediaType30.createSchema();
                    mediaType30.schema = _this.toSchema(schema_3, schema30, true);
                    if (node.examples) {
                        var ctexample = node.examples.example(ct);
                        if (ctexample) {
                            mediaType30.example = ctexample;
                        }
                    }
                    _this.mapNode(schema_3, schema30);
                });
                // TODO update: mark the Response as needing Content post-processing
                if (produces.length > 1) {
                    this._postProcessResponses.push(response30);
                }
            }
        };
        Oas20to30TransformationVisitor.prototype.visitSchema = function (node) {
            // In 2.0, Schemas can only be located on responses and parameters.  In both cases, we
            // handle processing and indexing the schema in their respective visit methods - so we
            // can skip doing that here.
        };
        Oas20to30TransformationVisitor.prototype.visitHeaders = function (node) {
            var parent30 = this.lookup(node.parent());
            // No processing to do here, because 3.0 doesn't have a "headers" node.  So instead
            // we'll map the headers node to the 3.0 response node, because that will be the
            // effective parent for any 3.0 Header nodes.
            this.mapNode(node, parent30);
        };
        Oas20to30TransformationVisitor.prototype.visitHeader = function (node) {
            var parent30 = this.lookup(node.parent());
            var header30 = parent30.createHeader(node.headerName());
            parent30.addHeader(node.headerName(), header30);
            header30.description = node.description;
            header30.schema = this.toSchema(node, header30.createSchema(), false);
            this.mapNode(node, header30);
        };
        Oas20to30TransformationVisitor.prototype.visitExample = function (node) {
            // Examples are processed as part of "transformResponse"
        };
        Oas20to30TransformationVisitor.prototype.visitItems = function (node) {
            var parent30 = this.findItemsParent(node);
            var items30 = parent30.createItemsSchema();
            parent30.items = items30;
            this.toSchema(node, items30, false);
            this.mapNode(node, items30);
        };
        Oas20to30TransformationVisitor.prototype.visitTag = function (node) {
            var parent30 = this.doc30;
            if (!parent30.tags) {
                parent30.tags = [];
            }
            var tag30 = parent30.createTag();
            tag30.name = node.name;
            tag30.description = node.description;
            parent30.tags.push(tag30);
            this.mapNode(node, tag30);
        };
        Oas20to30TransformationVisitor.prototype.visitSecurityDefinitions = function (node) {
            // OpenAPI has no "Security Definitions" wrapper entity.
        };
        Oas20to30TransformationVisitor.prototype.visitSecurityScheme = function (node) {
            var parent30 = this.getOrCreateComponents();
            var scheme30 = parent30.createSecurityScheme(node.schemeName());
            parent30.addSecurityScheme(node.schemeName(), scheme30);
            scheme30.type = node.type;
            scheme30.description = node.description;
            scheme30.name = node.name;
            scheme30.in = node.in;
            if (node.type === "oauth2") {
                if (node.flow === "implicit") {
                    scheme30.flows = scheme30.createOAuthFlows();
                    scheme30.flows.implicit = scheme30.flows.createImplicitOAuthFlow();
                    scheme30.flows.implicit.authorizationUrl = node.authorizationUrl;
                    if (node.scopes) {
                        node.scopes.scopes().forEach(function (scopeName) {
                            scheme30.flows.implicit.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                        });
                    }
                }
                if (node.flow === "accessCode") {
                    scheme30.flows = scheme30.createOAuthFlows();
                    scheme30.flows.authorizationCode = scheme30.flows.createAuthorizationCodeOAuthFlow();
                    scheme30.flows.authorizationCode.authorizationUrl = node.authorizationUrl;
                    scheme30.flows.authorizationCode.tokenUrl = node.tokenUrl;
                    if (node.scopes) {
                        node.scopes.scopes().forEach(function (scopeName) {
                            scheme30.flows.authorizationCode.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                        });
                    }
                }
                if (node.flow === "password") {
                    scheme30.flows = scheme30.createOAuthFlows();
                    scheme30.flows.password = scheme30.flows.createPasswordOAuthFlow();
                    scheme30.flows.password.tokenUrl = node.tokenUrl;
                    if (node.scopes) {
                        node.scopes.scopes().forEach(function (scopeName) {
                            scheme30.flows.password.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                        });
                    }
                }
                if (node.flow === "application") {
                    scheme30.flows = scheme30.createOAuthFlows();
                    scheme30.flows.clientCredentials = scheme30.flows.createClientCredentialsOAuthFlow();
                    scheme30.flows.clientCredentials.tokenUrl = node.tokenUrl;
                    if (node.scopes) {
                        node.scopes.scopes().forEach(function (scopeName) {
                            scheme30.flows.clientCredentials.addScope(scopeName, node.scopes.getScopeDescription(scopeName));
                        });
                    }
                }
            }
            this.mapNode(node, scheme30);
        };
        Oas20to30TransformationVisitor.prototype.visitScopes = function (node) {
            // Note: scopes are handled during the processing of the security scheme.  See `visitSecurityScheme` for details.
        };
        Oas20to30TransformationVisitor.prototype.visitXML = function (node) {
            var parent30 = this.lookup(node.parent());
            var xml30 = parent30.createXML();
            parent30.xml = xml30;
            xml30.name = node.name;
            xml30.namespace = node.namespace;
            xml30.prefix = node.prefix;
            xml30.attribute = node.attribute;
            xml30.wrapped = node.wrapped;
            this.mapNode(node, xml30);
        };
        Oas20to30TransformationVisitor.prototype.visitSchemaDefinition = function (node) {
            var parent30 = this.getOrCreateComponents();
            var schemaDef30 = parent30.createSchemaDefinition(node.definitionName());
            parent30.addSchemaDefinition(node.definitionName(), schemaDef30);
            this.toSchema(node, schemaDef30, true);
            this.mapNode(node, schemaDef30);
        };
        Oas20to30TransformationVisitor.prototype.visitPropertySchema = function (node) {
            var parent30 = this.lookup(node.parent());
            var property30 = parent30.createPropertySchema(node.propertyName());
            parent30.addProperty(node.propertyName(), property30);
            this.toSchema(node, property30, true);
            this.mapNode(node, property30);
        };
        Oas20to30TransformationVisitor.prototype.visitAdditionalPropertiesSchema = function (node) {
            var parent30 = this.lookup(node.parent());
            var additionalProps30 = parent30.createAdditionalPropertiesSchema();
            parent30.additionalProperties = additionalProps30;
            this.toSchema(node, additionalProps30, true);
            this.mapNode(node, additionalProps30);
        };
        Oas20to30TransformationVisitor.prototype.visitAllOfSchema = function (node) {
            var parent30 = this.lookup(node.parent());
            var allOf30 = parent30.createAllOfSchema();
            if (!parent30.allOf) {
                parent30.allOf = [];
            }
            parent30.allOf.push(allOf30);
            this.toSchema(node, allOf30, true);
            this.mapNode(node, allOf30);
        };
        Oas20to30TransformationVisitor.prototype.visitItemsSchema = function (node) {
            var parent30 = this.lookup(node.parent());
            var items30 = parent30.createItemsSchema();
            if (parent30.items && typeof parent30.items === "object") {
                parent30.items = [parent30.items];
                parent30.items.push(items30);
            }
            else {
                parent30.items = items30;
            }
            this.toSchema(node, items30, true);
            this.mapNode(node, items30);
        };
        Oas20to30TransformationVisitor.prototype.visitDefinitions = function (node) {
            // Note: there is no "definitions" entity in 3.0, so nothing to do here.
        };
        Oas20to30TransformationVisitor.prototype.visitParametersDefinitions = function (node) {
            // Note: there is no "parameters definitions" entity in 3.0, so nothing to do here.
        };
        Oas20to30TransformationVisitor.prototype.visitResponsesDefinitions = function (node) {
            // Note: there is no "responses definitions" entity in 3.0, so nothing to do here.
        };
        Oas20to30TransformationVisitor.prototype.visitExtension = function (node) {
            var parent30 = this.lookup(node.parent());
            parent30.addExtension(node.name, node.value);
        };
        Oas20to30TransformationVisitor.prototype.visitValidationProblem = function (node) {
            // Note: nothing to do for a validation problem
        };
        Oas20to30TransformationVisitor.prototype.mapNode = function (from, to) {
            var nodePath = this._library.createNodePath(from);
            var mapIndex = nodePath.toString();
            this._nodeMap[mapIndex] = to;
        };
        Oas20to30TransformationVisitor.prototype.lookup = function (node) {
            var nodePath = this._library.createNodePath(node);
            var mapIndex = nodePath.toString();
            return this._nodeMap[mapIndex];
        };
        Oas20to30TransformationVisitor.prototype.getOrCreateComponents = function () {
            if (!this.doc30.components) {
                this.doc30.components = this.doc30.createComponents();
            }
            return this.doc30.components;
        };
        Oas20to30TransformationVisitor.prototype.toSchema = function (from, schema30, isSchema) {
            schema30.type = from.type;
            schema30.format = from.format;
            if (from.type === "file") {
                schema30.type = "string";
                schema30.format = "binary";
            }
            if (from.items && !Array.isArray(from.items)) {
                // This is done so that we can lookup the appropriate parent for an "Items" object later
                // on in the visit.  This is a special case because we're introducing a new Oas30Schema
                // entity in between e.g. a Response and the ItemsSchema - whereas in 2.0 the ItemsSchema
                // is a direct child of Response and Parameter.  So when visiting a Items, we cannot lookup
                // the new 3.0 Schema using the Items' parent (because the parent maps to something else -
                // the grandparent, in fact).  THIS IS ONLY A PROBLEM FOR "ITEMS" ON PARAM AND RESPONSE.
                from.items.n_attribute("_transformation_items-parent", schema30);
            }
            else if (from.items && Array.isArray(from.items)) ;
            // Note: Not sure what to do with the "collectionFormat" of a schema.  Dropping it for now.
            //schema30.collectionFormat = from.collectionFormat;
            schema30.default = from.default;
            schema30.maximum = from.maximum;
            schema30.exclusiveMaximum = from.exclusiveMaximum;
            schema30.minimum = from.minimum;
            schema30.exclusiveMinimum = from.exclusiveMinimum;
            schema30.maxLength = from.maxLength;
            schema30.minLength = from.minLength;
            schema30.pattern = from.pattern;
            schema30.maxItems = from.maxItems;
            schema30.minItems = from.minItems;
            schema30.uniqueItems = from.uniqueItems;
            schema30.enum = from.enum;
            schema30.multipleOf = from.multipleOf;
            if (isSchema) {
                var schema20 = from;
                schema30.$ref = this.updateRef(schema20.$ref);
                if (typeof schema20.additionalProperties === "boolean") {
                    schema30.additionalProperties = schema20.additionalProperties;
                }
                schema30.readOnly = schema20.readOnly;
                schema30.example = schema20.example;
                schema30.title = schema20.title;
                schema30.description = schema20.description;
                schema30.maxProperties = schema20.maxProperties;
                schema30.minProperties = schema20.minProperties;
                schema30.required = schema20.required;
                if (schema20.discriminator) {
                    schema30.discriminator = schema30.createDiscriminator();
                    schema30.discriminator.propertyName = schema20.discriminator;
                }
            }
            return schema30;
        };
        Oas20to30TransformationVisitor.prototype.findItemsParent = function (node) {
            var itemsParent = node.n_attribute("_transformation_items-parent");
            if (!itemsParent) {
                itemsParent = this.lookup(node.parent());
            }
            return itemsParent;
        };
        Oas20to30TransformationVisitor.prototype.findParentOperation = function (node) {
            var visitor = new ParentOperationFinderVisitor();
            OasVisitorUtil.visitTree(node, visitor, exports.OasTraverserDirection.up);
            return visitor.operation;
        };
        Oas20to30TransformationVisitor.prototype.findProduces = function (node) {
            var visitor = new ProducesFinderVisitor();
            OasVisitorUtil.visitTree(node, visitor, exports.OasTraverserDirection.up);
            return visitor.produces;
        };
        Oas20to30TransformationVisitor.prototype.findConsumes = function (node) {
            var visitor = new ConsumesFinderVisitor();
            OasVisitorUtil.visitTree(node, visitor, exports.OasTraverserDirection.up);
            return visitor.consumes;
        };
        Oas20to30TransformationVisitor.prototype.collectionFormatToStyleAndExplode = function (node, param30) {
            if (node.type === "array" && node.collectionFormat === "multi" && (node.in === "query" || node.in === "cookie")) {
                param30.style = "form";
                param30.explode = true;
                return;
            }
            if (node.type === "array" && node.collectionFormat === "csv" && (node.in === "query" || node.in === "cookie")) {
                param30.style = "form";
                param30.explode = false;
                return;
            }
            if (node.type === "array" && node.collectionFormat === "csv" && (node.in === "path" || node.in === "header")) {
                param30.style = "simple";
                return;
            }
            if (node.type === "array" && node.collectionFormat === "ssv" && node.in === "query") {
                param30.style = "spaceDelimited";
                return;
            }
            if (node.type === "array" && node.collectionFormat === "pipes" && node.in === "query") {
                param30.style = "pipeDelimited";
                return;
            }
        };
        Oas20to30TransformationVisitor.prototype.isFormDataMimeType = function (mimetype) {
            return mimetype && (mimetype === "multipart/form-data" || mimetype === "application/x-www-form-urlencoded");
        };
        Oas20to30TransformationVisitor.prototype.hasFormDataMimeType = function (mimetypes) {
            if (mimetypes) {
                for (var _i = 0, mimetypes_1 = mimetypes; _i < mimetypes_1.length; _i++) {
                    var mt = mimetypes_1[_i];
                    if (this.isFormDataMimeType(mt)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Oas20to30TransformationVisitor.prototype.isRef = function (node) {
            return node.$ref && node.$ref.length > 0;
        };
        Oas20to30TransformationVisitor.prototype.updateRef = function ($ref) {
            if (!$ref || $ref.length === 0) {
                return $ref;
            }
            var split = $ref.split("/");
            if (split[0] === "#") {
                if (split[1] === "definitions") {
                    split.splice(1, 1, "components", "schemas");
                }
                else if (split[1] === "parameters") {
                    split.splice(1, 1, "components", "parameters");
                }
                else if (split[1] === "responses") {
                    split.splice(1, 1, "components", "responses");
                }
            }
            return split.join("/");
        };
        /**
         * Called when visiting is complete.  Any additional processing of the result can
         * be done here.
         */
        Oas20to30TransformationVisitor.prototype.postProcess = function () {
            var _this = this;
            // Post process all of the responses that require it.  Responses may require post-processing
            // when a response has multiple @Produces content types, which results in multiple MimeType
            // entities in the 3.0 Response 'content'.  When this happens, only one of the mime types
            // will contain the visited (and thus transformed) data model.  So we must post-process them
            // to "clone" that info to the other mime types.  Otherwise we'll have a full mime type
            // definition for only ONE of the mime types, and partial definitions for the rest.
            this._postProcessResponses.forEach(function (response) {
                // First, figure out which of the media types is the largest (has the most content)
                var largest = 0;
                var srcMt = null;
                response.getMediaTypes().forEach(function (mt) {
                    var size = JSON.stringify(_this._library.writeNode(mt.schema)).length;
                    if (size > largest) {
                        largest = size;
                        srcMt = mt;
                    }
                });
                // Now clone the contents of the largest media type into all the others.
                response.getMediaTypes().forEach(function (mt) {
                    if (srcMt !== mt) {
                        console.info("Cloning Media Type " + srcMt.name() + " into " + mt.name());
                        var src = _this._library.writeNode(srcMt.schema);
                        _this._library.readNode(src, mt.schema);
                    }
                });
            });
        };
        return Oas20to30TransformationVisitor;
    }());
    var ProducesFinderVisitor = /** @class */ (function (_super) {
        __extends$1u(ProducesFinderVisitor, _super);
        function ProducesFinderVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.produces = ["*/*"];
            return _this;
        }
        ProducesFinderVisitor.prototype.visitDocument = function (node) {
            if (node.produces && node.produces.length > 0) {
                this.produces = node.produces;
            }
        };
        ProducesFinderVisitor.prototype.visitOperation = function (node) {
            if (node.produces && node.produces.length > 0) {
                this.produces = node.produces;
            }
        };
        return ProducesFinderVisitor;
    }(Oas20NodeVisitorAdapter));
    var ConsumesFinderVisitor = /** @class */ (function (_super) {
        __extends$1u(ConsumesFinderVisitor, _super);
        function ConsumesFinderVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.consumes = ["*/*"];
            return _this;
        }
        ConsumesFinderVisitor.prototype.visitDocument = function (node) {
            if (node.consumes && node.consumes.length > 0) {
                this.consumes = node.consumes;
            }
        };
        ConsumesFinderVisitor.prototype.visitOperation = function (node) {
            if (node.consumes && node.consumes.length > 0) {
                this.consumes = node.consumes;
            }
        };
        return ConsumesFinderVisitor;
    }(Oas20NodeVisitorAdapter));
    var ParentOperationFinderVisitor = /** @class */ (function (_super) {
        __extends$1u(ParentOperationFinderVisitor, _super);
        function ParentOperationFinderVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.operation = null;
            return _this;
        }
        ParentOperationFinderVisitor.prototype.visitOperation = function (node) {
            this.operation = node;
        };
        return ParentOperationFinderVisitor;
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
    /**
     * Represents the global OAS library entry point.  This is used, for example, when
     * using the library in a simple browser environment.  This object exposes the functions
     * and classes
     */
    var OasLibraryUtils = /** @class */ (function () {
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
         * Transforms from a 2.0 document into a 3.0 document.
         * @param source
         */
        OasLibraryUtils.prototype.transformDocument = function (source) {
            var clone = this.cloneDocument(source);
            var transformer = new Oas20to30TransformationVisitor();
            OasVisitorUtil.visitTree(clone, transformer);
            return transformer.getResult();
        };
        /**
         * Clones the given document by serializing it to a JS object, and then re-parsing it.
         * @param source
         */
        OasLibraryUtils.prototype.cloneDocument = function (source) {
            return this.createDocument(this.writeNode(source));
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
            else {
                // If the source is an object, clone it (the reader is destructive to the input).
                source = JSON.parse(JSON.stringify(source));
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
         * @param severityRegistry
         * @return {any}
         */
        OasLibraryUtils.prototype.validate = function (node, recursive, severityRegistry) {
            if (recursive === void 0) { recursive = true; }
            // Default the severity registry if one is not provided.
            if (!severityRegistry) {
                severityRegistry = new DefaultValidationSeverityRegistry();
            }
            // Reset all problems first
            var resetter = new OasResetValidationProblemsVisitor();
            OasVisitorUtil.visitTree(node, resetter);
            // Now validate the data model.
            var visitor = new OasValidationVisitor(node.ownerDocument());
            visitor.setSeverityRegistry(severityRegistry);
            if (recursive) {
                OasVisitorUtil.visitTree(node, visitor);
            }
            else {
                OasVisitorUtil.visitNode(node, visitor);
            }
            // Return any validation errors found.
            return visitor.getValidationErrors();
        };
        /**
         * Creates a node path for a given data model node.
         * @param node
         * @return {OasNodePath}
         */
        OasLibraryUtils.prototype.createNodePath = function (node) {
            return OasNodePathUtil.createNodePath(node);
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
    var OasSchemaFactory = /** @class */ (function () {
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

    exports.OasDocument = OasDocument;
    exports.OasExtensibleNode = OasExtensibleNode;
    exports.OasExtension = OasExtension;
    exports.OasNode = OasNode;
    exports.OasValidationProblem = OasValidationProblem;
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
    exports.Oas30HeaderContent = Oas30HeaderContent;
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
    exports.ReferenceUtil = ReferenceUtil;
    exports.OasLibraryUtils = OasLibraryUtils;
    exports.OasNodeVisitorAdapter = OasNodeVisitorAdapter;
    exports.Oas20NodeVisitorAdapter = Oas20NodeVisitorAdapter;
    exports.Oas30NodeVisitorAdapter = Oas30NodeVisitorAdapter;
    exports.OasCompositeVisitor = OasCompositeVisitor;
    exports.Oas20CompositeVisitor = Oas20CompositeVisitor;
    exports.Oas30CompositeVisitor = Oas30CompositeVisitor;
    exports.OasCombinedCompositeVisitor = OasCombinedCompositeVisitor;
    exports.OasCombinedVisitorAdapter = OasCombinedVisitorAdapter;
    exports.OasAllNodeVisitor = OasAllNodeVisitor;
    exports.OasVisitorUtil = OasVisitorUtil;
    exports.OasTraverser = OasTraverser;
    exports.Oas20Traverser = Oas20Traverser;
    exports.Oas30Traverser = Oas30Traverser;
    exports.OasReverseTraverser = OasReverseTraverser;
    exports.Oas20ReverseTraverser = Oas20ReverseTraverser;
    exports.Oas30ReverseTraverser = Oas30ReverseTraverser;
    exports.DefaultValidationSeverityRegistry = DefaultValidationSeverityRegistry;
    exports.PATH_MATCH_REGEX = PATH_MATCH_REGEX;
    exports.pathMatchEx = pathMatchEx;
    exports.SEG_MATCH_REGEX = SEG_MATCH_REGEX;
    exports.OasValidationRuleUtil = OasValidationRuleUtil;
    exports.OasResetValidationProblemsVisitor = OasResetValidationProblemsVisitor;
    exports.OasValidationVisitor = OasValidationVisitor;
    exports.OasValidationRuleset = OasValidationRuleset;
    exports.Oas20to30TransformationVisitor = Oas20to30TransformationVisitor;
    exports.ProducesFinderVisitor = ProducesFinderVisitor;
    exports.ConsumesFinderVisitor = ConsumesFinderVisitor;
    exports.ParentOperationFinderVisitor = ParentOperationFinderVisitor;
    exports.OasSchemaFactory = OasSchemaFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
