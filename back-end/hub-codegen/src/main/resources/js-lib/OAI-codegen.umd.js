(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('oai-ts-core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'oai-ts-core'], factory) :
    (global = global || self, factory(global.OAI_codegen = {}, global.OAI));
}(this, function (exports, oaiTsCore) { 'use strict';

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
    /**
     * Visitor used to organize all of the paths into a set of interface names.
     *
     * TODO once everything is done, find all interfaces with only 1 path and pull them all into Root
     */
    var InterfacesVisitor = /** @class */ (function (_super) {
        __extends(InterfacesVisitor, _super);
        function InterfacesVisitor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.interfaces = {};
            return _this;
        }
        InterfacesVisitor.prototype.getInterfaces = function () {
            var rval = [];
            for (var name_1 in this.interfaces) {
                rval.push(this.interfaces[name_1]);
            }
            return rval;
        };
        /**
         * Visits a Path Item to produce
         * @param {OasPathItem} node
         */
        InterfacesVisitor.prototype.visitPathItem = function (node) {
            var p = node.path();
            var split = p.split("/");
            if (split && split.length > 1) {
                var firstSegment = split[1];
                if (firstSegment && firstSegment !== "" && firstSegment.indexOf("{") === -1) {
                    var iname = this.capitalize(firstSegment) + "Resource";
                    this.addPathTo(p, iname);
                    return;
                }
            }
            // Default.
            this.addPathTo(p, "RootResource");
        };
        /**
         * Adds a path to an interface.  Creates the interface mapping if it doesn't exist yet.
         * @param {string} path
         * @param {string} interfaceName
         */
        InterfacesVisitor.prototype.addPathTo = function (path, interfaceName) {
            var info = this.interfaces[interfaceName];
            if (info === null || info === undefined) {
                info = {
                    name: interfaceName,
                    paths: []
                };
                this.interfaces[interfaceName] = info;
            }
            info.paths.push(path);
        };
        /**
         * Capitalizes a word.
         * @param {string} firstSegment
         * @return {string}
         */
        InterfacesVisitor.prototype.capitalize = function (firstSegment) {
            return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
        };
        return InterfacesVisitor;
    }(oaiTsCore.OasCombinedVisitorAdapter));

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
    var PathItemDetectionVisitor = /** @class */ (function (_super) {
        __extends$1(PathItemDetectionVisitor, _super);
        function PathItemDetectionVisitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PathItemDetectionVisitor.prototype.visitPathItem = function (node) {
            this.isPathItem = true;
        };
        return PathItemDetectionVisitor;
    }(oaiTsCore.OasCombinedVisitorAdapter));
    /**
     * Visitor used to create a Codegen Info object from a OpenAPI document.
     */
    var OpenApi2CodegenVisitor = /** @class */ (function (_super) {
        __extends$1(OpenApi2CodegenVisitor, _super);
        /**
         * C'tor.
         * @param {string} packageName
         * @param {InterfaceInfo[]} interfaces
         */
        function OpenApi2CodegenVisitor(packageName, interfaces) {
            var _this = _super.call(this) || this;
            _this.interfacesIndex = {};
            _this.codegenInfo = {
                name: "Thorntail API",
                version: "1.0.0",
                interfaces: [],
                beans: []
            };
            _this._library = new oaiTsCore.OasLibraryUtils();
            _this._methodCounter = 1;
            _this._processPathItemParams = false;
            _this.packageName = packageName;
            for (var _i = 0, interfaces_1 = interfaces; _i < interfaces_1.length; _i++) {
                var iface = interfaces_1[_i];
                for (var _a = 0, _b = iface.paths; _a < _b.length; _a++) {
                    var path = _b[_a];
                    _this.interfacesIndex[path] = iface.name;
                }
            }
            return _this;
        }
        /**
         * Gets the CodegenInfo object that was created by the visitor.
         * @return {CodegenInfo}
         */
        OpenApi2CodegenVisitor.prototype.getCodegenInfo = function () {
            return this.codegenInfo;
        };
        /**
         * Visits the info model to extract some meta data.
         * @param {OasInfo} node
         */
        OpenApi2CodegenVisitor.prototype.visitInfo = function (node) {
            this.codegenInfo.name = node.title;
            if (node.description) {
                this.codegenInfo.description = node.description;
            }
            this.codegenInfo.version = node.version;
        };
        /**
         * Visits an operation to produce a CodegenJavaInterface.
         * @param {OasPathItem} node
         */
        OpenApi2CodegenVisitor.prototype.visitPathItem = function (node) {
            var p = node.path();
            var cgInterface = this.getOrCreateInterface(p);
            this._currentInterface = cgInterface;
        };
        /**
         * Visits an operation to produce a CodegenJavaMethod.
         * @param {OasOperation} node
         */
        OpenApi2CodegenVisitor.prototype.visitOperation = function (node) {
            var method = {
                name: this.methodName(node),
                path: this.methodPath(node),
                method: node.method(),
                produces: [],
                consumes: [],
                arguments: []
            };
            if (node.description) {
                method.description = node.description;
            }
            // Handle 2.0 "produces"
            if (node.ownerDocument().is2xDocument()) {
                var produces = node.produces;
                if (produces === null || produces === undefined) {
                    produces = node.ownerDocument().produces;
                }
                if (produces) {
                    method.produces = produces;
                }
            }
            // Handle 2.0 "consumes"
            if (node.ownerDocument().is2xDocument()) {
                var consumes = node.consumes;
                if (consumes === null || consumes === undefined) {
                    consumes = node.ownerDocument().consumes;
                }
                if (consumes) {
                    method.consumes = consumes;
                }
            }
            this._currentMethod = method;
            this._currentInterface.methods.push(method);
            // Be sure to process path and query parameters found on the parent!
            this._processPathItemParams = true;
            var parentParams = node.parent().parameters;
            if (parentParams && parentParams.length > 0) {
                for (var _i = 0, parentParams_1 = parentParams; _i < parentParams_1.length; _i++) {
                    var parentParam = parentParams_1[_i];
                    oaiTsCore.OasVisitorUtil.visitNode(parentParam, this);
                }
            }
            this._processPathItemParams = false;
        };
        /**
         * Visits a parameter to produce a CodegenJavaArgument.
         * @param {Oas20Parameter | Oas30Parameter} node
         */
        OpenApi2CodegenVisitor.prototype.visitParameter = function (node) {
            // Skip processing of the parameter if it is defined at the path level.
            if (!this._processPathItemParams && this.isPathItem(node.parent())) {
                return;
            }
            var cgArgument = {
                name: node.name,
                in: node.in,
                required: true
            };
            this._currentMethod.arguments.push(cgArgument);
            this._currentArgument = cgArgument;
            if (node.required !== undefined && node.required !== null) {
                cgArgument.required = node.required;
            }
            if (node.ownerDocument().is2xDocument()) {
                this.visit20Parameter(node);
            }
            if (node.ownerDocument().is3xDocument()) {
                this.visit30Parameter(node);
            }
        };
        OpenApi2CodegenVisitor.prototype.visit20Parameter = function (node) {
            var cgReturn = this.returnFromSchema(node.schema);
            if (cgReturn) {
                if (cgReturn.collection) {
                    this._currentArgument.collection = cgReturn.collection;
                }
                if (cgReturn.type) {
                    this._currentArgument.type = cgReturn.type;
                }
                if (cgReturn.format) {
                    this._currentArgument.format = cgReturn.format;
                }
            }
            else if (node.type) {
                if (node.type) {
                    this._currentArgument.type = node.type;
                }
                if (node.format) {
                    this._currentArgument.format = node.format;
                }
            }
        };
        OpenApi2CodegenVisitor.prototype.visit30Parameter = function (node) {
            if (node.getMediaTypes().length > 0) {
                var mediaTypes = node.getMediaTypes();
                if (mediaTypes && mediaTypes.length > 0) {
                    var mediaType = mediaTypes[0];
                    var cgReturn = this.returnFromSchema(mediaType.schema);
                    if (cgReturn) {
                        if (cgReturn.collection) {
                            this._currentArgument.collection = cgReturn.collection;
                        }
                        if (cgReturn.type) {
                            this._currentArgument.type = cgReturn.type;
                        }
                        if (cgReturn.format) {
                            this._currentArgument.format = cgReturn.format;
                        }
                    }
                }
            }
            else if (node.schema) {
                this.visit20Parameter(node);
            }
        };
        /**
         * Visits a requesty body to produce a CodegenJavaArgument with in === "body".
         * @param {Oas30RequestBody} node
         */
        OpenApi2CodegenVisitor.prototype.visitRequestBody = function (node) {
            var mediaTypes = node.getMediaTypes();
            if (mediaTypes && mediaTypes.length > 0) {
                var mediaType = mediaTypes[0];
                var cgArgument = {
                    name: "data",
                    in: "body",
                    required: true
                };
                var cgReturn = this.returnFromSchema(mediaType.schema);
                if (cgReturn) {
                    if (cgReturn.collection) {
                        cgArgument.collection = cgReturn.collection;
                    }
                    if (cgReturn.type) {
                        cgArgument.type = cgReturn.type;
                    }
                    if (cgReturn.format) {
                        cgArgument.format = cgReturn.format;
                    }
                }
                this._currentArgument = cgArgument;
                this._currentMethod.arguments.push(cgArgument);
            }
            // Push all of the media types onto the "consumes" array for the method.
            for (var _i = 0, mediaTypes_1 = mediaTypes; _i < mediaTypes_1.length; _i++) {
                var mt = mediaTypes_1[_i];
                this._currentMethod.consumes.push(mt.name());
            }
        };
        /**
         * Visits a response to produce a CodegenJavaReturn for a method.
         * @param {OasResponse} node
         */
        OpenApi2CodegenVisitor.prototype.visitResponse = function (node) {
            // Note: if there are multiple 2xx responses, only the first one will
            // become the method return value.
            if (node.statusCode() && node.statusCode().indexOf("2") === 0 && !this._currentMethod.return) {
                if (node.ownerDocument().is2xDocument()) {
                    this.visit20Response(node);
                }
                if (node.ownerDocument().is3xDocument()) {
                    this.visit30Response(node);
                }
            }
        };
        OpenApi2CodegenVisitor.prototype.visit20Response = function (node) {
            if (node.statusCode() && node.statusCode().indexOf("2") === 0) {
                this._currentMethod.return = this.returnFromSchema(node.schema);
            }
        };
        OpenApi2CodegenVisitor.prototype.visit30Response = function (node) {
            var mediaTypes = node.getMediaTypes();
            if (mediaTypes && mediaTypes.length > 0) {
                var mediaType = mediaTypes[0];
                this._currentMethod.return = this.returnFromSchema(mediaType.schema);
            }
            // Push all of the media types onto the "produces" array for the method.
            for (var _i = 0, mediaTypes_2 = mediaTypes; _i < mediaTypes_2.length; _i++) {
                var mt = mediaTypes_2[_i];
                this._currentMethod.produces.push(mt.name());
            }
        };
        /**
         * Visits a schema definition to produce a CodegenJavaBean.
         * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} node
         */
        OpenApi2CodegenVisitor.prototype.visitSchemaDefinition = function (node) {
            var name = null;
            if (node.ownerDocument().is2xDocument()) {
                name = node.definitionName();
            }
            else if (node.ownerDocument().is3xDocument()) {
                name = node.name();
            }
            var bean = {
                name: name,
                package: this.packageName + ".beans",
                $schema: this._library.writeNode(node)
            };
            this.codegenInfo.beans.push(bean);
        };
        OpenApi2CodegenVisitor.prototype.getOrCreateInterface = function (path) {
            var interfaceName = this.interfacesIndex[path];
            for (var _i = 0, _a = this.codegenInfo.interfaces; _i < _a.length; _i++) {
                var cgInterface_1 = _a[_i];
                if (cgInterface_1.name === interfaceName) {
                    return cgInterface_1;
                }
            }
            var ifacePath = "/";
            if (interfaceName !== "Root") {
                ifacePath = "/" + path.split("/")[1];
            }
            var cgInterface = {
                name: interfaceName,
                package: this.packageName,
                path: ifacePath,
                methods: []
            };
            this.codegenInfo.interfaces.push(cgInterface);
            return cgInterface;
        };
        OpenApi2CodegenVisitor.prototype.methodName = function (operation) {
            var _this = this;
            if (operation.operationId !== null && operation.operationId !== undefined && operation.operationId.length > 0) {
                return operation.operationId;
            }
            if (operation.summary !== null && operation.summary !== undefined && operation.summary.length > 0) {
                var nameSegments = operation.summary.split(" ");
                return this.decapitalize(nameSegments.map(function (segment) {
                    return _this.capitalize(segment.replace(/\W/g, ''));
                }).join(''));
            }
            return "generatedMethod" + this._methodCounter++;
        };
        OpenApi2CodegenVisitor.prototype.methodPath = function (operation) {
            var path = operation.parent().path();
            if (path === this._currentInterface.path) {
                return null;
            }
            path = path.substring(this._currentInterface.path.length);
            if (path === "/") {
                return null;
            }
            return path;
        };
        OpenApi2CodegenVisitor.prototype.returnFromSchema = function (schema) {
            if (schema === null || schema === undefined) {
                return null;
            }
            var cgReturn = {
                type: null
            };
            if (schema.$ref) {
                cgReturn.type = this.typeFromSchemaRef(schema.$ref);
            }
            else if (schema.type === "array") {
                cgReturn.collection = "list";
                var items = schema.items;
                var subReturn = this.returnFromSchema(items);
                if (subReturn && subReturn.type) {
                    cgReturn.type = subReturn.type;
                }
                if (subReturn && subReturn.format) {
                    cgReturn.format = subReturn.format;
                }
            }
            else {
                if (schema.type) {
                    cgReturn.type = schema.type;
                }
                if (schema.format) {
                    cgReturn.format = schema.format;
                }
            }
            return cgReturn;
        };
        OpenApi2CodegenVisitor.prototype.typeFromSchemaRef = function (schemaRef) {
            if (schemaRef && schemaRef.indexOf("#/components/schemas/") === 0) {
                return this.packageName + ".beans." + schemaRef.substring(21);
            }
            if (schemaRef && schemaRef.indexOf("#/definitions/") === 0) {
                return this.packageName + ".beans." + schemaRef.substring(14);
            }
            return null;
        };
        OpenApi2CodegenVisitor.prototype.isPathItem = function (node) {
            var viz = new PathItemDetectionVisitor();
            oaiTsCore.OasVisitorUtil.visitNode(node, viz);
            return viz.isPathItem;
        };
        /**
         * Capitalizes a word.
         * @param {string} word
         * @return {string}
         */
        OpenApi2CodegenVisitor.prototype.capitalize = function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        };
        /**
         * De-capitalizes a word.
         * @param {string} word
         * @return {string}
         */
        OpenApi2CodegenVisitor.prototype.decapitalize = function (word) {
            return word.charAt(0).toLowerCase() + word.slice(1);
        };
        return OpenApi2CodegenVisitor;
    }(oaiTsCore.OasCombinedVisitorAdapter));

    /**
     * @license
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
    var CodegenLibrary = /** @class */ (function () {
        function CodegenLibrary() {
        }
        /**
         * Called to generate a CodegenInfo from the given OAI document and Java package name.
         * @param {OasDocument} document
         * @param {string} javaPackage
         * @return {CodegenInfo}
         */
        CodegenLibrary.prototype.generateJaxRsInfo = function (document, javaPackage) {
            // First, figure out the breakdown of the interfaces.
            var visitor = new InterfacesVisitor();
            oaiTsCore.OasVisitorUtil.visitTree(document, visitor);
            // Then generate the CodegenInfo object.
            var cgVisitor = new OpenApi2CodegenVisitor(javaPackage, visitor.getInterfaces());
            oaiTsCore.OasVisitorUtil.visitTree(document, cgVisitor);
            return cgVisitor.getCodegenInfo();
        };
        return CodegenLibrary;
    }());

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
     * @license
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

    exports.CodegenLibrary = CodegenLibrary;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
