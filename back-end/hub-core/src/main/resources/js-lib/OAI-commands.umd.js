(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('oai-ts-core')) :
	typeof define === 'function' && define.amd ? define(['exports', 'oai-ts-core'], factory) :
	(factory((global.OAI_commands = global.OAI_commands || {}),global.OAI));
}(this, (function (exports,oaiTsCore) { 'use strict';

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
var ModelUtils = (function () {
    function ModelUtils() {
    }
    /**
     * Returns true if the given object is null or undefined.
     * @param object
     * @return {boolean}
     */
    ModelUtils.isNullOrUndefined = function (object) {
        return object === undefined || object === null;
    };
    return ModelUtils;
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
 * A base class for all command implementations.
 */
var AbstractCommand = (function () {
    function AbstractCommand() {
    }
    /**
     * Returns true of the argument is either null or undefined.
     * @param object
     */
    AbstractCommand.prototype.isNullOrUndefined = function (object) {
        return ModelUtils.isNullOrUndefined(object);
    };
    /**
     * Gets access to the static OAS library.
     * @return {OasLibraryUtils}
     */
    AbstractCommand.prototype.oasLibrary = function () {
        return AbstractCommand._oasLibrary;
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    AbstractCommand.prototype.marshall = function () {
        var cmdType = this.type();
        var obj = {
            __type: cmdType
        };
        for (var propName in this) {
            obj[propName] = this[propName];
        }
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    AbstractCommand.prototype.unmarshall = function (obj) {
        for (var propName in obj) {
            if (propName !== "__type") {
                this[propName] = obj[propName];
            }
        }
    };
    return AbstractCommand;
}());
AbstractCommand._oasLibrary = new oaiTsCore.OasLibraryUtils();

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
var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createAddPathItemCommand(document, pathItemName, obj) {
    if (document.getSpecVersion() === "2.0") {
        return new AddPathItemCommand_20(pathItemName, obj);
    }
    else {
        return new AddPathItemCommand_30(pathItemName, obj);
    }
}
/**
 * A command used to add a new pathItem in a document.  Source for the new
 * pathItem must be provided.  This source will be converted to an OAS
 * pathItem object and then added to the data model.
 */
var AddPathItemCommand = (function (_super) {
    __extends(AddPathItemCommand, _super);
    /**
     * C'tor.
     * @param {string} pathItemName
     * @param obj
     */
    function AddPathItemCommand(pathItemName, obj) {
        var _this = _super.call(this) || this;
        _this._newPathItemName = pathItemName;
        _this._newPathItemObj = obj;
        return _this;
    }
    /**
     * Adds the new pathItem to the document.
     * @param document
     */
    AddPathItemCommand.prototype.execute = function (document) {
        console.info("[AddPathItemCommand] Executing.");
        if (this.isNullOrUndefined(document.paths)) {
            document.paths = document.createPaths();
            this._nullPathItems = true;
        }
        if (document.paths.pathItem(this._newPathItemName)) {
            console.info("[AddPathItemCommand] PathItem with name %s already exists.", this._newPathItemName);
            this._pathItemExits = true;
        }
        else {
            var pathItem = document.paths.createPathItem(this._newPathItemName);
            pathItem = this.oasLibrary().readNode(this._newPathItemObj, pathItem);
            document.paths.addPathItem(this._newPathItemName, pathItem);
            this._pathItemExits = false;
        }
    };
    /**
     * Removes the pathItem.
     * @param document
     */
    AddPathItemCommand.prototype.undo = function (document) {
        console.info("[AddPathItemCommand] Reverting.");
        if (this._pathItemExits) {
            return;
        }
        if (this._nullPathItems) {
            document.paths = null;
        }
        else {
            document.paths.removePathItem(this._newPathItemName);
        }
    };
    return AddPathItemCommand;
}(AbstractCommand));
/**
 * The OAI 2.0 impl.
 */
var AddPathItemCommand_20 = (function (_super) {
    __extends(AddPathItemCommand_20, _super);
    function AddPathItemCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddPathItemCommand_20.prototype.type = function () {
        return "AddPathItemCommand_20";
    };
    return AddPathItemCommand_20;
}(AddPathItemCommand));
/**
 * The OAI 3.0 impl.
 */
var AddPathItemCommand_30 = (function (_super) {
    __extends(AddPathItemCommand_30, _super);
    function AddPathItemCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddPathItemCommand_30.prototype.type = function () {
        return "AddPathItemCommand_30";
    };
    return AddPathItemCommand_30;
}(AddPathItemCommand));

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
var __extends$1 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createAddSchemaDefinitionCommand(document, definitionName, obj) {
    if (document.getSpecVersion() === "2.0") {
        return new AddSchemaDefinitionCommand_20(definitionName, obj);
    }
    else {
        return new AddSchemaDefinitionCommand_30(definitionName, obj);
    }
}
/**
 * A command used to add a new definition in a document.  Source for the new
 * definition must be provided.  This source will be converted to an OAS
 * definition object and then added to the data model.
 */
var AddSchemaDefinitionCommand = (function (_super) {
    __extends$1(AddSchemaDefinitionCommand, _super);
    /**
     * Constructor.
     * @param {string} definitionName
     * @param obj
     */
    function AddSchemaDefinitionCommand(definitionName, obj) {
        var _this = _super.call(this) || this;
        _this._newDefinitionName = definitionName;
        _this._newDefinitionObj = obj;
        return _this;
    }
    /**
     * Adds the new definition to the document.
     * @param document
     */
    AddSchemaDefinitionCommand.prototype.execute = function (document) {
        console.info("[AddSchemaDefinitionCommand] Executing.");
        // Do nothing if the definition already exists.
        if (this.defExists(document)) {
            console.info("[AddSchemaDefinitionCommand] Definition with name %s already exists.", this._newDefinitionName);
            this._defExisted = true;
            return;
        }
        this.prepareDocumentForDef(document);
        var definition = this.createSchemaDefinition(document);
        this.addDefinition(document, definition);
    };
    /**
     * Removes the definition.
     * @param document
     */
    AddSchemaDefinitionCommand.prototype.undo = function (document) {
        console.info("[AddSchemaDefinitionCommand] Reverting.");
        if (this._defExisted) {
            return;
        }
        this.removeDefinition(document);
    };
    return AddSchemaDefinitionCommand;
}(AbstractCommand));
/**
 * OAI version 2.0 impl.
 */
var AddSchemaDefinitionCommand_20 = (function (_super) {
    __extends$1(AddSchemaDefinitionCommand_20, _super);
    function AddSchemaDefinitionCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddSchemaDefinitionCommand_20.prototype.type = function () {
        return "AddSchemaDefinitionCommand_20";
    };
    AddSchemaDefinitionCommand_20.prototype.defExists = function (document) {
        if (this.isNullOrUndefined(document.definitions)) {
            return false;
        }
        return !this.isNullOrUndefined(document.definitions.definition(this._newDefinitionName));
    };
    AddSchemaDefinitionCommand_20.prototype.prepareDocumentForDef = function (document) {
        if (this.isNullOrUndefined(document.definitions)) {
            document.definitions = document.createDefinitions();
            this._nullDefinitions = true;
        }
    };
    AddSchemaDefinitionCommand_20.prototype.createSchemaDefinition = function (document) {
        var definition = document.definitions.createSchemaDefinition(this._newDefinitionName);
        definition = this.oasLibrary().readNode(this._newDefinitionObj, definition);
        return definition;
    };
    AddSchemaDefinitionCommand_20.prototype.addDefinition = function (document, definition) {
        document.definitions.addDefinition(this._newDefinitionName, definition);
    };
    AddSchemaDefinitionCommand_20.prototype.removeDefinition = function (document) {
        if (this._nullDefinitions) {
            document.definitions = null;
        }
        else {
            document.definitions.removeDefinition(this._newDefinitionName);
        }
    };
    return AddSchemaDefinitionCommand_20;
}(AddSchemaDefinitionCommand));
/**
 * OAI version 3.0.x impl.
 */
var AddSchemaDefinitionCommand_30 = (function (_super) {
    __extends$1(AddSchemaDefinitionCommand_30, _super);
    function AddSchemaDefinitionCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddSchemaDefinitionCommand_30.prototype.type = function () {
        return "AddSchemaDefinitionCommand_30";
    };
    AddSchemaDefinitionCommand_30.prototype.defExists = function (document) {
        if (this.isNullOrUndefined(document.components)) {
            return false;
        }
        return !this.isNullOrUndefined(document.components.getSchemaDefinition(this._newDefinitionName));
    };
    AddSchemaDefinitionCommand_30.prototype.prepareDocumentForDef = function (document) {
        if (this.isNullOrUndefined(document.components)) {
            document.components = document.createComponents();
            this._nullComponents = true;
        }
        else {
            this._nullComponents = false;
        }
    };
    AddSchemaDefinitionCommand_30.prototype.createSchemaDefinition = function (document) {
        var definition = document.components.createSchemaDefinition(this._newDefinitionName);
        definition = this.oasLibrary().readNode(this._newDefinitionObj, definition);
        return definition;
    };
    AddSchemaDefinitionCommand_30.prototype.addDefinition = function (document, definition) {
        document.components.addSchemaDefinition(this._newDefinitionName, definition);
    };
    AddSchemaDefinitionCommand_30.prototype.removeDefinition = function (document) {
        if (this._nullComponents) {
            document.components = null;
        }
        else {
            document.components.removeSchemaDefinition(this._newDefinitionName);
        }
    };
    return AddSchemaDefinitionCommand_30;
}(AddSchemaDefinitionCommand));

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
var __extends$2 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeDescriptionCommand(document, newDescription) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeDescriptionCommand_20(newDescription);
    }
    else {
        return new ChangeDescriptionCommand_30(newDescription);
    }
}
/**
 * A command used to modify the description of a document.
 */
var ChangeDescriptionCommand = (function (_super) {
    __extends$2(ChangeDescriptionCommand, _super);
    /**
     * C'tor.
     * @param {string} newDescription
     */
    function ChangeDescriptionCommand(newDescription) {
        var _this = _super.call(this) || this;
        _this._newDescription = newDescription;
        return _this;
    }
    /**
     * Modifies the description of the document.
     * @param document
     */
    ChangeDescriptionCommand.prototype.execute = function (document) {
        console.info("[ChangeDescriptionCommand] Executing.");
        if (document.info === undefined || document.info === null) {
            document.info = document.createInfo();
            this._nullInfo = true;
            this._oldDescription = null;
        }
        else {
            this._oldDescription = document.info.description;
        }
        document.info.description = this._newDescription;
    };
    /**
     * Resets the description back to a previous version.
     * @param document
     */
    ChangeDescriptionCommand.prototype.undo = function (document) {
        console.info("[ChangeDescriptionCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        }
        else {
            document.info.description = this._oldDescription;
        }
    };
    return ChangeDescriptionCommand;
}(AbstractCommand));
/**
 * The OAI 2.0 impl.
 */
var ChangeDescriptionCommand_20 = (function (_super) {
    __extends$2(ChangeDescriptionCommand_20, _super);
    function ChangeDescriptionCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeDescriptionCommand_20.prototype.type = function () {
        return "ChangeDescriptionCommand_20";
    };
    return ChangeDescriptionCommand_20;
}(ChangeDescriptionCommand));
/**
 * The OAI 3.0 impl.
 */
var ChangeDescriptionCommand_30 = (function (_super) {
    __extends$2(ChangeDescriptionCommand_30, _super);
    function ChangeDescriptionCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeDescriptionCommand_30.prototype.type = function () {
        return "ChangeDescriptionCommand_30";
    };
    return ChangeDescriptionCommand_30;
}(ChangeDescriptionCommand));

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
var __extends$3 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeLicenseCommand(document, name, url) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeLicenseCommand_20(name, url);
    }
    else {
        return new ChangeLicenseCommand_30(name, url);
    }
}
/**
 * A command used to modify the license information of a document.
 */
var ChangeLicenseCommand = (function (_super) {
    __extends$3(ChangeLicenseCommand, _super);
    /**
     * C'tor.
     * @param {string} name
     * @param {string} url
     */
    function ChangeLicenseCommand(name, url) {
        var _this = _super.call(this) || this;
        _this._newLicenseName = name;
        _this._newLicenseUrl = url;
        return _this;
    }
    /**
     * Modifies the license.
     * @param document
     */
    ChangeLicenseCommand.prototype.execute = function (document) {
        console.info("[ChangeLicenseCommand] Executing.");
        this._oldLicense = null;
        this._nullInfo = false;
        if (this.isNullOrUndefined(document.info)) {
            this._nullInfo = true;
            document.info = document.createInfo();
            this._oldLicense = null;
        }
        else {
            this._oldLicense = null;
            if (!this.isNullOrUndefined(document.info.license)) {
                this._oldLicense = this.oasLibrary().writeNode(document.info.license);
            }
        }
        document.info.license = document.info.createLicense();
        document.info.license.name = this._newLicenseName;
        document.info.license.url = this._newLicenseUrl;
    };
    /**
     * Resets the license back to the original value.
     * @param document
     */
    ChangeLicenseCommand.prototype.undo = function (document) {
        console.info("[ChangeLicenseCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        }
        else if (this._oldLicense) {
            document.info.license = document.info.createLicense();
            this.oasLibrary().readNode(this._oldLicense, document.info.license);
        }
        else {
            document.info.license = null;
        }
    };
    return ChangeLicenseCommand;
}(AbstractCommand));
/**
 * The OAI 2.0 impl.
 */
var ChangeLicenseCommand_20 = (function (_super) {
    __extends$3(ChangeLicenseCommand_20, _super);
    function ChangeLicenseCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeLicenseCommand_20.prototype.type = function () {
        return "ChangeLicenseCommand_20";
    };
    return ChangeLicenseCommand_20;
}(ChangeLicenseCommand));
/**
 * The OAI 3.0 impl.
 */
var ChangeLicenseCommand_30 = (function (_super) {
    __extends$3(ChangeLicenseCommand_30, _super);
    function ChangeLicenseCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeLicenseCommand_30.prototype.type = function () {
        return "ChangeLicenseCommand_30";
    };
    return ChangeLicenseCommand_30;
}(ChangeLicenseCommand));

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
var __extends$4 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeMediaTypeTypeCommand(document, mediaType, newType) {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types not supported in OpenAPI 2.0");
    }
    else {
        return new ChangeMediaTypeTypeCommand(mediaType, newType);
    }
}
/**
 * A command used to modify the type of a mediaType of a schema.
 */
var ChangeMediaTypeTypeCommand = (function (_super) {
    __extends$4(ChangeMediaTypeTypeCommand, _super);
    /**
     * C'tor.
     * @param {Oas20MediaTypeSchema | Oas30MediaTypeSchema} mediaType
     * @param {SimplifiedType} newType
     */
    function ChangeMediaTypeTypeCommand(mediaType, newType) {
        var _this = _super.call(this) || this;
        if (mediaType) {
            _this._mediaTypeName = mediaType.name();
            _this._mediaTypePath = _this.oasLibrary().createNodePath(mediaType);
        }
        _this._newType = newType;
        return _this;
    }
    /**
     * @return {string}
     */
    ChangeMediaTypeTypeCommand.prototype.type = function () {
        return "ChangeMediaTypeTypeCommand";
    };
    /**
     * Modifies the type/schema of a Media Type.
     * @param document
     */
    ChangeMediaTypeTypeCommand.prototype.execute = function (document) {
        console.info("[ChangeMediaTypeTypeCommand] Executing.");
        this._changed = false;
        var mediaType = this._mediaTypePath.resolve(document);
        if (!mediaType) {
            return;
        }
        // Save the old info (for later undo operation)
        if (this.isNullOrUndefined(mediaType.schema)) {
            this._oldMediaTypeSchema = null;
            mediaType.schema = mediaType.createSchema();
        }
        else {
            this._oldMediaTypeSchema = this.oasLibrary().writeNode(mediaType.schema);
        }
        // Update the media type schema's type
        if (this._newType.isSimpleType()) {
            mediaType.schema.$ref = null;
            mediaType.schema.type = this._newType.type;
            mediaType.schema.format = this._newType.as;
            mediaType.schema.items = null;
        }
        if (this._newType.isRef()) {
            mediaType.schema.$ref = this._newType.type;
            mediaType.schema.type = null;
            mediaType.schema.format = null;
            mediaType.schema.items = null;
        }
        if (this._newType.isArray()) {
            mediaType.schema.$ref = null;
            mediaType.schema.type = "array";
            mediaType.schema.format = null;
            mediaType.schema.items = mediaType.schema.createItemsSchema();
            if (this._newType.of) {
                if (this._newType.of.isRef()) {
                    mediaType.schema.items.$ref = this._newType.of.type;
                }
                else {
                    mediaType.schema.items.type = this._newType.of.type;
                    mediaType.schema.items.format = this._newType.of.as;
                }
            }
        }
        this._changed = true;
    };
    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    ChangeMediaTypeTypeCommand.prototype.undo = function (document) {
        console.info("[ChangeMediaTypeTypeCommand] Reverting.");
        if (!this._changed) {
            return;
        }
        var mediaType = this._mediaTypePath.resolve(document);
        if (!mediaType) {
            return;
        }
        if (this._oldMediaTypeSchema === null) {
            mediaType.schema = null;
        }
        else {
            mediaType.schema = mediaType.createSchema();
            this.oasLibrary().readNode(this._oldMediaTypeSchema, mediaType.schema);
        }
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ChangeMediaTypeTypeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._mediaTypePath = MarshallUtils.marshallNodePath(obj._mediaTypePath);
        obj._newType = MarshallUtils.marshallSimplifiedType(obj._newType);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ChangeMediaTypeTypeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._mediaTypePath = MarshallUtils.unmarshallNodePath(this._mediaTypePath);
        this._newType = MarshallUtils.unmarshallSimplifiedType(this._newType);
    };
    return ChangeMediaTypeTypeCommand;
}(AbstractCommand));

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
var __extends$5 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeParameterTypeCommand(document, parameter, newType) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeParameterTypeCommand_20(parameter, newType);
    }
    else {
        return new ChangeParameterTypeCommand_30(parameter, newType);
    }
}
/**
 * Factory function.
 */
function createChangeParameterDefinitionTypeCommand(document, parameter, newType) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeParameterDefinitionTypeCommand_20(parameter, newType);
    }
    else {
        return new ChangeParameterDefinitionTypeCommand_30(parameter, newType);
    }
}
/**
 * A command used to modify the type of a parameter of an operation.
 */
var ChangeParameterTypeCommand = (function (_super) {
    __extends$5(ChangeParameterTypeCommand, _super);
    /**
     * C'tor.
     * @param {Oas20Parameter | Oas30Parameter | Oas20ParameterDefinition | Oas30ParameterDefinition} parameter
     * @param {SimplifiedParameterType} newType
     */
    function ChangeParameterTypeCommand(parameter, newType) {
        var _this = _super.call(this) || this;
        if (parameter) {
            _this._paramPath = _this.oasLibrary().createNodePath(parameter);
        }
        _this._newType = newType;
        return _this;
    }
    /**
     * Modifies the type of an operation's parameter.
     * @param document
     */
    ChangeParameterTypeCommand.prototype.execute = function (document) {
        console.info("[ChangeParameterTypeCommand] Executing.");
        var param = this._paramPath.resolve(document);
        if (!param) {
            return;
        }
        // Save the old info (for later undo operation)
        this._oldParameter = this.oasLibrary().writeNode(param);
        // Change the parameter type
        this.doChangeParameter(document, param);
    };
    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    ChangeParameterTypeCommand.prototype.undo = function (document) {
        console.info("[ChangeParameterTypeCommand] Reverting.");
        var param = this._paramPath.resolve(document);
        if (!param) {
            return;
        }
        var parent = param.parent();
        var oldParam = parent.createParameter();
        this.oasLibrary().readNode(this._oldParameter, oldParam);
        var pindex = parent.parameters.indexOf(param);
        parent.parameters.splice(pindex, 1, oldParam);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ChangeParameterTypeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._paramPath = MarshallUtils.marshallNodePath(obj._paramPath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ChangeParameterTypeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._paramPath = MarshallUtils.unmarshallNodePath(this._paramPath);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    };
    return ChangeParameterTypeCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var ChangeParameterTypeCommand_20 = (function (_super) {
    __extends$5(ChangeParameterTypeCommand_20, _super);
    function ChangeParameterTypeCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    ChangeParameterTypeCommand_20.prototype.type = function () {
        return "ChangeParameterTypeCommand_20";
    };
    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {Oas20Parameter} param
     */
    ChangeParameterTypeCommand_20.prototype.doChangeParameter = function (document, param) {
        // If it's a body param, change the schema child.  Otherwise change the param itself.
        if (param.in === "body") {
            param.schema = param.createSchema();
            if (this._newType.isSimpleType()) {
                param.schema.type = this._newType.type;
                param.schema.format = this._newType.as;
            }
            if (this._newType.isRef()) {
                param.schema.$ref = this._newType.type;
            }
            if (this._newType.isArray()) {
                param.schema.type = "array";
                param.schema.format = null;
                param.schema.items = param.schema.createItemsSchema();
                if (this._newType.of) {
                    if (this._newType.of.isSimpleType()) {
                        param.schema.items.type = this._newType.of.type;
                        param.schema.items.format = this._newType.of.as;
                    }
                    if (this._newType.of.isRef()) {
                        param.schema.items.$ref = this._newType.of.type;
                    }
                }
            }
        }
        else {
            if (this._newType.isSimpleType()) {
                param.type = this._newType.type;
                param.format = this._newType.as;
                param.items = null;
            }
            if (this._newType.isArray()) {
                param.type = "array";
                param.items = param.createItems();
                if (this._newType.of) {
                    param.items.type = this._newType.of.type;
                    param.items.format = this._newType.of.as;
                }
            }
        }
        var required = this._newType.required;
        if (param.in === "path") {
            required = true;
        }
        if (!this.isNullOrUndefined(this._newType.required)) {
            param.required = required;
        }
    };
    return ChangeParameterTypeCommand_20;
}(ChangeParameterTypeCommand));
/**
 * OAI 2.0 impl specialized for changing parameter definitions.  Differs primarily in
 * the undo logic.
 */
var ChangeParameterDefinitionTypeCommand_20 = (function (_super) {
    __extends$5(ChangeParameterDefinitionTypeCommand_20, _super);
    /**
     * C'tor.
     * @param {Oas20ParameterDefinition} parameter
     * @param {SimplifiedParameterType} newType
     */
    function ChangeParameterDefinitionTypeCommand_20(parameter, newType) {
        return _super.call(this, parameter, newType) || this;
    }
    /**
     * @return {string}
     */
    ChangeParameterDefinitionTypeCommand_20.prototype.type = function () {
        return "ChangeParameterDefinitionTypeCommand_20";
    };
    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    ChangeParameterDefinitionTypeCommand_20.prototype.undo = function (document) {
        console.info("[ChangeParameterDefinitionType] Reverting.");
        var param = this._paramPath.resolve(document);
        if (!param) {
            return;
        }
        // Remove the old/updated parameter.
        document.parameters.removeParameter(param.parameterName());
        // Restore the parameter from before the command executed.
        var oldParam = document.parameters.createParameter(param.parameterName());
        this.oasLibrary().readNode(this._oldParameter, oldParam);
        document.parameters.addParameter(param.parameterName(), oldParam);
    };
    return ChangeParameterDefinitionTypeCommand_20;
}(ChangeParameterTypeCommand_20));
/**
 * OAI 3.0 impl.
 */
var ChangeParameterTypeCommand_30 = (function (_super) {
    __extends$5(ChangeParameterTypeCommand_30, _super);
    function ChangeParameterTypeCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    ChangeParameterTypeCommand_30.prototype.type = function () {
        return "ChangeParameterTypeCommand_30";
    };
    /**
     * Changes the parameter.
     * @param {OasDocument} document
     * @param {Oas30ParameterBase} parameter
     */
    ChangeParameterTypeCommand_30.prototype.doChangeParameter = function (document, parameter) {
        var schema = parameter.createSchema();
        if (this._newType.isRef()) {
            schema.$ref = this._newType.type;
        }
        if (this._newType.isSimpleType()) {
            schema.type = this._newType.type;
            schema.format = this._newType.as;
        }
        if (this._newType.isArray()) {
            schema.type = "array";
            schema.items = schema.createItemsSchema();
            if (this._newType.of) {
                schema.items.type = this._newType.of.type;
                schema.items.format = this._newType.of.as;
            }
        }
        parameter.schema = schema;
        var required = this._newType.required;
        if (parameter.in === "path") {
            required = true;
        }
        if (!this.isNullOrUndefined(this._newType.required)) {
            parameter.required = required;
        }
    };
    return ChangeParameterTypeCommand_30;
}(ChangeParameterTypeCommand));
/**
 * OAI 3.0 impl specialized for changing parameter definitions.  Differs primarily in
 * the undo logic.
 */
var ChangeParameterDefinitionTypeCommand_30 = (function (_super) {
    __extends$5(ChangeParameterDefinitionTypeCommand_30, _super);
    /**
     * C'tor.
     * @param {Oas30ParameterDefinition} parameter
     * @param {SimplifiedParameterType} newType
     */
    function ChangeParameterDefinitionTypeCommand_30(parameter, newType) {
        return _super.call(this, parameter, newType) || this;
    }
    /**
     * @return {string}
     */
    ChangeParameterDefinitionTypeCommand_30.prototype.type = function () {
        return "ChangeParameterDefinitionTypeCommand_30";
    };
    /**
     * Resets the param type back to its previous state.
     * @param document
     */
    ChangeParameterDefinitionTypeCommand_30.prototype.undo = function (document) {
        console.info("[ChangeParameterDefinitionType] Reverting.");
        var param = this._paramPath.resolve(document);
        if (!param) {
            return;
        }
        // Remove the old/updated parameter.
        document.components.removeParameterDefinition(param.parameterName());
        // Restore the parameter from before the command executed.
        var oldParam = document.components.createParameterDefinition(param.parameterName());
        this.oasLibrary().readNode(this._oldParameter, oldParam);
        document.components.addParameterDefinition(param.parameterName(), oldParam);
    };
    return ChangeParameterDefinitionTypeCommand_30;
}(ChangeParameterTypeCommand_30));

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
var __extends$6 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangePropertyCommand(document, node, property, newValue) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangePropertyCommand_20(node, property, newValue);
    }
    else {
        return new ChangePropertyCommand_30(node, property, newValue);
    }
}
/**
 * A command used to modify the simple property of a node.  Should not be used
 * to modify complex (object) properties, only simple property types like
 * string, boolean, number, etc.
 */
var ChangePropertyCommand = (function (_super) {
    __extends$6(ChangePropertyCommand, _super);
    /**
     * C'tor.
     * @param {OasNode} node
     * @param {string} property
     * @param {T} newValue
     */
    function ChangePropertyCommand(node, property, newValue) {
        var _this = _super.call(this) || this;
        if (node) {
            _this._nodePath = _this.oasLibrary().createNodePath(node);
        }
        _this._property = property;
        _this._newValue = newValue;
        return _this;
    }
    /**
     * Modifies the property of the node.
     * @param document
     */
    ChangePropertyCommand.prototype.execute = function (document) {
        console.info("[ChangePropertyCommand] Executing.");
        var node = this._nodePath.resolve(document);
        if (this.isNullOrUndefined(node)) {
            return;
        }
        this._oldValue = node[this._property];
        node[this._property] = this._newValue;
    };
    /**
     * Resets the property back to a previous state.
     * @param document
     */
    ChangePropertyCommand.prototype.undo = function (document) {
        console.info("[ChangePropertyCommand] Reverting.");
        var node = this._nodePath.resolve(document);
        if (this.isNullOrUndefined(node)) {
            return;
        }
        node[this._property] = this._oldValue;
        this._oldValue = null;
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ChangePropertyCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._nodePath = MarshallUtils.marshallNodePath(obj._nodePath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ChangePropertyCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._nodePath = MarshallUtils.unmarshallNodePath(this._nodePath);
    };
    return ChangePropertyCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var ChangePropertyCommand_20 = (function (_super) {
    __extends$6(ChangePropertyCommand_20, _super);
    function ChangePropertyCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePropertyCommand_20.prototype.type = function () {
        return "ChangePropertyCommand_20";
    };
    return ChangePropertyCommand_20;
}(ChangePropertyCommand));
/**
 * OAI 3.0 impl.
 */
var ChangePropertyCommand_30 = (function (_super) {
    __extends$6(ChangePropertyCommand_30, _super);
    function ChangePropertyCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePropertyCommand_30.prototype.type = function () {
        return "ChangePropertyCommand_30";
    };
    return ChangePropertyCommand_30;
}(ChangePropertyCommand));

/**
 * @contact
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/contacts/LICENSE-2.0
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
 * Factory function.
 */
function createChangeContactCommand(document, name, email, url) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeContactCommand_20(name, email, url);
    }
    else {
        return new ChangeContactCommand_30(name, email, url);
    }
}
/**
 * A command used to modify the contact information of a document.
 */
var ChangeContactCommand = (function (_super) {
    __extends$7(ChangeContactCommand, _super);
    /**
     * C'tor.
     * @param {string} name
     * @param {string} email
     * @param {string} url
     */
    function ChangeContactCommand(name, email, url) {
        var _this = _super.call(this) || this;
        _this._newName = name;
        _this._newEmail = email;
        _this._newUrl = url;
        return _this;
    }
    /**
     * Modifies the contact info.
     * @param document
     */
    ChangeContactCommand.prototype.execute = function (document) {
        console.info("[ChangeContactCommand] Executing.");
        this._oldContact = null;
        this._nullInfo = false;
        if (document.info === undefined || document.info === null) {
            this._nullInfo = true;
            document.info = document.createInfo();
            this._oldContact = null;
        }
        else {
            this._oldContact = null;
            if (document.info.contact) {
                this._oldContact = this.oasLibrary().writeNode(document.info.contact);
            }
        }
        document.info.contact = document.info.createContact();
        document.info.contact.name = this._newName;
        document.info.contact.url = this._newUrl;
        document.info.contact.email = this._newEmail;
    };
    /**
     * Resets the contact back to the original value.
     * @param document
     */
    ChangeContactCommand.prototype.undo = function (document) {
        console.info("[ChangeContactCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        }
        else if (this._oldContact) {
            document.info.contact = document.info.createContact();
            this.oasLibrary().readNode(this._oldContact, document.info.contact);
        }
        else {
            document.info.contact = null;
        }
    };
    return ChangeContactCommand;
}(AbstractCommand));
/**
 * The OAI 2.0 impl.
 */
var ChangeContactCommand_20 = (function (_super) {
    __extends$7(ChangeContactCommand_20, _super);
    function ChangeContactCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeContactCommand_20.prototype.type = function () {
        return "ChangeContactCommand_20";
    };
    return ChangeContactCommand_20;
}(ChangeContactCommand));
/**
 * The OAI 3.0 impl.
 */
var ChangeContactCommand_30 = (function (_super) {
    __extends$7(ChangeContactCommand_30, _super);
    function ChangeContactCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeContactCommand_30.prototype.type = function () {
        return "ChangeContactCommand_30";
    };
    return ChangeContactCommand_30;
}(ChangeContactCommand));

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
var __extends$8 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangePropertyTypeCommand(document, property, newType) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangePropertyTypeCommand_20(property, newType);
    }
    else {
        return new ChangePropertyTypeCommand_30(property, newType);
    }
}
/**
 * A command used to modify the type of a property of a schema.
 */
var ChangePropertyTypeCommand = (function (_super) {
    __extends$8(ChangePropertyTypeCommand, _super);
    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     * @param {SimplifiedPropertyType} newType
     */
    function ChangePropertyTypeCommand(property, newType) {
        var _this = _super.call(this) || this;
        if (property) {
            _this._propName = property.propertyName();
            _this._propPath = _this.oasLibrary().createNodePath(property);
        }
        _this._newType = newType;
        return _this;
    }
    /**
     * Modifies the type of an operation's property.
     * @param document
     */
    ChangePropertyTypeCommand.prototype.execute = function (document) {
        console.info("[ChangePropertyTypeCommand] Executing: " + this._newType);
        var prop = this._propPath.resolve(document);
        if (this.isNullOrUndefined(prop)) {
            return;
        }
        var required = prop.parent()["required"];
        // Save the old info (for later undo operation)
        this._oldProperty = this.oasLibrary().writeNode(prop);
        this._oldRequired = required && required.length > 0 && required.indexOf(prop.propertyName()) != -1;
        // Update the schema's type
        if (this._newType.isSimpleType()) {
            prop.$ref = null;
            prop.type = this._newType.type;
            prop.format = this._newType.as;
            prop.items = null;
        }
        if (this._newType.isRef()) {
            prop.$ref = this._newType.type;
            prop.type = null;
            prop.format = null;
            prop.items = null;
        }
        if (this._newType.isArray()) {
            prop.$ref = null;
            prop.type = "array";
            prop.format = null;
            prop.items = prop.createItemsSchema();
            if (this._newType.of) {
                if (this._newType.of.isRef()) {
                    prop.items.$ref = this._newType.of.type;
                }
                else {
                    prop.items.type = this._newType.of.type;
                    prop.items.format = this._newType.of.as;
                }
            }
        }
        if (!this.isNullOrUndefined(this._newType.required)) {
            // Going from optional to required
            if (this._newType.required && !this._oldRequired) {
                if (this.isNullOrUndefined(required)) {
                    required = [];
                    prop.parent()["required"] = required;
                    this._nullRequired = true;
                }
                required.push(prop.propertyName());
            }
            // Going from required to optional
            if (!this._newType.required && this._oldRequired) {
                required.splice(required.indexOf(prop.propertyName()), 1);
            }
        }
    };
    /**
     * Resets the prop type back to its previous state.
     * @param document
     */
    ChangePropertyTypeCommand.prototype.undo = function (document) {
        console.info("[ChangePropertyTypeCommand] Reverting.");
        var prop = this._propPath.resolve(document);
        if (this.isNullOrUndefined(prop)) {
            return;
        }
        var required = prop.parent()["required"];
        var wasRequired = required && required.length > 0 && required.indexOf(prop.propertyName()) != -1;
        var parentSchema = prop.parent();
        var oldProp = parentSchema.createPropertySchema(this._propName);
        this.oasLibrary().readNode(this._oldProperty, oldProp);
        parentSchema.removeProperty(this._propName);
        parentSchema.addProperty(this._propName, oldProp);
        if (!this.isNullOrUndefined(this._newType.required)) {
            if (this._nullRequired) {
                prop.parent()["required"] = null;
            }
            else {
                // Restoring optional from required
                if (wasRequired && !this._oldRequired) {
                    required.splice(required.indexOf(prop.propertyName()), 1);
                }
                // Restoring required from optional
                if (!wasRequired && this._oldRequired) {
                    required.push(prop.propertyName());
                }
            }
        }
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ChangePropertyTypeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._propPath = MarshallUtils.marshallNodePath(obj._propPath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ChangePropertyTypeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._propPath = MarshallUtils.unmarshallNodePath(this._propPath);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    };
    return ChangePropertyTypeCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var ChangePropertyTypeCommand_20 = (function (_super) {
    __extends$8(ChangePropertyTypeCommand_20, _super);
    function ChangePropertyTypeCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePropertyTypeCommand_20.prototype.type = function () {
        return "ChangePropertyTypeCommand_20";
    };
    return ChangePropertyTypeCommand_20;
}(ChangePropertyTypeCommand));
/**
 * OAI 3.0 impl.
 */
var ChangePropertyTypeCommand_30 = (function (_super) {
    __extends$8(ChangePropertyTypeCommand_30, _super);
    function ChangePropertyTypeCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePropertyTypeCommand_30.prototype.type = function () {
        return "ChangePropertyTypeCommand_30";
    };
    return ChangePropertyTypeCommand_30;
}(ChangePropertyTypeCommand));

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
var __extends$9 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeResponseTypeCommand(document, response, newType) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeResponseTypeCommand_20(response, newType);
    }
    else {
        throw new Error("ChangeResponseType is unsupported for OpenAPI 3.0.x documents.");
    }
}
/**
 * Factory function.
 */
function createChangeResponseDefinitionTypeCommand(document, response, newType) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeResponseDefinitionTypeCommand_20(response, newType);
    }
    else {
        throw new Error("ChangeResponseDefinitionTypeCommand is unsupported for OpenAPI 3.0.x documents.");
    }
}
/**
 * A command used to modify the type of a response.
 */
var ChangeResponseTypeCommand_20 = (function (_super) {
    __extends$9(ChangeResponseTypeCommand_20, _super);
    /**
     * C'tor.
     * @param {Oas20Response | Oas20ResponseDefinition} response
     * @param {SimplifiedType} newType
     */
    function ChangeResponseTypeCommand_20(response, newType) {
        var _this = _super.call(this) || this;
        if (response) {
            _this._responsePath = _this.oasLibrary().createNodePath(response);
        }
        _this._newType = newType;
        return _this;
    }
    /**
     * @return {string}
     */
    ChangeResponseTypeCommand_20.prototype.type = function () {
        return "ChangeResponseTypeCommand_20";
    };
    /**
     * Modifies the type of an operation's response.
     * @param document
     */
    ChangeResponseTypeCommand_20.prototype.execute = function (document) {
        console.info("[ChangeResponseTypeCommand] Executing.");
        var response = this._responsePath.resolve(document);
        if (!response) {
            return;
        }
        this._oldSchema = null;
        if (response.schema) {
            this._oldSchema = this.oasLibrary().writeNode(response.schema);
        }
        response.schema = response.createSchema();
        if (this._newType.isSimpleType()) {
            response.schema.type = this._newType.type;
            response.schema.format = this._newType.as;
        }
        if (this._newType.isRef()) {
            response.schema.$ref = this._newType.type;
        }
        if (this._newType.isArray()) {
            response.schema.type = "array";
            response.schema.items = response.schema.createItemsSchema();
            response.schema.items.type = this._newType.of.type;
            response.schema.items.format = this._newType.of.as;
        }
    };
    /**
     * Resets the response type back to its previous state.
     * @param document
     */
    ChangeResponseTypeCommand_20.prototype.undo = function (document) {
        console.info("[ChangeResponseTypeCommand] Reverting.");
        var response = this._responsePath.resolve(document);
        if (!response) {
            return;
        }
        if (this._oldSchema) {
            response.schema = response.createSchema();
            this.oasLibrary().readNode(this._oldSchema, response.schema);
        }
        else {
            response.schema = null;
        }
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ChangeResponseTypeCommand_20.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._responsePath = MarshallUtils.marshallNodePath(obj._responsePath);
        obj._newType = MarshallUtils.marshallSimplifiedParameterType(obj._newType);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ChangeResponseTypeCommand_20.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._responsePath = MarshallUtils.unmarshallNodePath(this._responsePath);
        this._newType = MarshallUtils.unmarshallSimplifiedParameterType(this._newType);
    };
    return ChangeResponseTypeCommand_20;
}(AbstractCommand));
/**
 * Changes the type of a response definition.
 */
var ChangeResponseDefinitionTypeCommand_20 = (function (_super) {
    __extends$9(ChangeResponseDefinitionTypeCommand_20, _super);
    /**
     * C'tor.
     * @param {Oas20Response | Oas20ResponseDefinition} response
     * @param {SimplifiedType} newType
     */
    function ChangeResponseDefinitionTypeCommand_20(response, newType) {
        return _super.call(this, response, newType) || this;
    }
    /**
     * @return {string}
     */
    ChangeResponseDefinitionTypeCommand_20.prototype.type = function () {
        return "ChangeResponseDefinitionTypeCommand_20";
    };
    return ChangeResponseDefinitionTypeCommand_20;
}(ChangeResponseTypeCommand_20));

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
var __extends$10 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeSecuritySchemeCommand(document, scheme) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeSecuritySchemeCommand_20(scheme);
    }
    else {
        return new ChangeSecuritySchemeCommand_30(scheme);
    }
}
/**
 * A command used to modify a security scheme.
 */
var ChangeSecuritySchemeCommand = (function (_super) {
    __extends$10(ChangeSecuritySchemeCommand, _super);
    /**
     * C'tor.
     * @param {Oas20SecurityScheme} scheme
     */
    function ChangeSecuritySchemeCommand(scheme) {
        var _this = _super.call(this) || this;
        if (scheme) {
            _this._schemeName = scheme.schemeName();
            _this._schemeObj = _this.oasLibrary().writeNode(scheme);
        }
        return _this;
    }
    /**
     * Modifies the security scheme.
     * @param document
     */
    ChangeSecuritySchemeCommand.prototype.execute = function (document) {
        console.info("[ChangeSecuritySchemeCommand] Executing.");
        this._oldScheme = null;
        var scheme = this.getSchemeFromDocument(document);
        if (this.isNullOrUndefined(scheme)) {
            return;
        }
        // Back up the old scheme info (for undo)
        this._oldScheme = this.oasLibrary().writeNode(scheme);
        // Replace with new scheme info
        this.replaceSchemeWith(scheme, this._schemeObj);
    };
    /**
     * Resets the security scheme back to the original value.
     * @param document
     */
    ChangeSecuritySchemeCommand.prototype.undo = function (document) {
        console.info("[ChangeSecuritySchemeCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldScheme)) {
            return;
        }
        var scheme = this.getSchemeFromDocument(document);
        if (this.isNullOrUndefined(scheme)) {
            return;
        }
        this.nullScheme(scheme);
        this.oasLibrary().readNode(this._oldScheme, scheme);
    };
    /**
     * Replaces the content of a scheme with the content from another scheme.
     * @param {Oas20SecurityScheme | Oas30SecurityScheme} toScheme
     * @param {Oas20SecurityScheme | Oas30SecurityScheme} fromScheme
     */
    ChangeSecuritySchemeCommand.prototype.replaceSchemeWith = function (toScheme, fromScheme) {
        this.nullScheme(toScheme);
        this.oasLibrary().readNode(fromScheme, toScheme);
    };
    /**
     * Null out all values in the given scheme.
     * @param {Oas20SecurityScheme | Oas30SecurityScheme} scheme
     */
    ChangeSecuritySchemeCommand.prototype.nullScheme = function (scheme) {
        scheme.description = null;
        scheme.type = null;
        scheme.name = null;
        scheme.in = null;
    };
    return ChangeSecuritySchemeCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var ChangeSecuritySchemeCommand_20 = (function (_super) {
    __extends$10(ChangeSecuritySchemeCommand_20, _super);
    function ChangeSecuritySchemeCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeSecuritySchemeCommand_20.prototype.type = function () {
        return "ChangeSecuritySchemeCommand_20";
    };
    /**
     * Return the scheme.
     * @param {Oas20Document} document
     * @return {Oas20SecurityScheme}
     */
    ChangeSecuritySchemeCommand_20.prototype.getSchemeFromDocument = function (document) {
        if (this.isNullOrUndefined(document.securityDefinitions)) {
            return;
        }
        return document.securityDefinitions.securityScheme(this._schemeName);
    };
    /**
     * Null out the scheme.
     * @param {Oas20SecurityScheme} scheme
     */
    ChangeSecuritySchemeCommand_20.prototype.nullScheme = function (scheme) {
        _super.prototype.nullScheme.call(this, scheme);
        scheme.tokenUrl = null;
        scheme.authorizationUrl = null;
        scheme.flow = null;
        scheme.scopes = null;
    };
    return ChangeSecuritySchemeCommand_20;
}(ChangeSecuritySchemeCommand));
/**
 * OAI 3.0 impl.
 */
var ChangeSecuritySchemeCommand_30 = (function (_super) {
    __extends$10(ChangeSecuritySchemeCommand_30, _super);
    function ChangeSecuritySchemeCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeSecuritySchemeCommand_30.prototype.type = function () {
        return "ChangeSecuritySchemeCommand_30";
    };
    /**
     * Return the scheme.
     * @param {Oas30Document} document
     * @return {Oas20SecurityScheme}
     */
    ChangeSecuritySchemeCommand_30.prototype.getSchemeFromDocument = function (document) {
        if (this.isNullOrUndefined(document.components)) {
            return;
        }
        return document.components.getSecurityScheme(this._schemeName);
    };
    /**
     * Null out the scheme.
     * @param {Oas30SecurityScheme} scheme
     */
    ChangeSecuritySchemeCommand_30.prototype.nullScheme = function (scheme) {
        _super.prototype.nullScheme.call(this, scheme);
        scheme.$ref = null;
        scheme.scheme = null;
        scheme.bearerFormat = null;
        scheme.flows = null;
        scheme.openIdConnectUrl = null;
    };
    return ChangeSecuritySchemeCommand_30;
}(ChangeSecuritySchemeCommand));

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
var __extends$11 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeTitleCommand(document, newTitle) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeTitleCommand_20(newTitle);
    }
    else {
        return new ChangeTitleCommand_30(newTitle);
    }
}
/**
 * A command used to modify the title of a document.
 */
var ChangeTitleCommand = (function (_super) {
    __extends$11(ChangeTitleCommand, _super);
    /**
     * C'tor.
     * @param {string} newTitle
     */
    function ChangeTitleCommand(newTitle) {
        var _this = _super.call(this) || this;
        _this._newTitle = newTitle;
        return _this;
    }
    /**
     * Modifies the title of the document.
     * @param document
     */
    ChangeTitleCommand.prototype.execute = function (document) {
        console.info("[ChangeTitleCommand] Executing.");
        if (document.info === undefined || document.info === null) {
            document.info = document.createInfo();
            this._nullInfo = true;
            this._oldTitle = null;
        }
        else {
            this._oldTitle = document.info.title;
        }
        document.info.title = this._newTitle;
    };
    /**
     * Resets the title back to a previous version.
     * @param document
     */
    ChangeTitleCommand.prototype.undo = function (document) {
        console.info("[ChangeTitleCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        }
        else {
            document.info.title = this._oldTitle;
        }
    };
    return ChangeTitleCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var ChangeTitleCommand_20 = (function (_super) {
    __extends$11(ChangeTitleCommand_20, _super);
    function ChangeTitleCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeTitleCommand_20.prototype.type = function () {
        return "ChangeTitleCommand_20";
    };
    return ChangeTitleCommand_20;
}(ChangeTitleCommand));
/**
 * OAI 3.0 impl.
 */
var ChangeTitleCommand_30 = (function (_super) {
    __extends$11(ChangeTitleCommand_30, _super);
    function ChangeTitleCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeTitleCommand_30.prototype.type = function () {
        return "ChangeTitleCommand_30";
    };
    return ChangeTitleCommand_30;
}(ChangeTitleCommand));

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
var __extends$12 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createChangeVersionCommand(document, newVersion) {
    if (document.getSpecVersion() === "2.0") {
        return new ChangeVersionCommand_20(newVersion);
    }
    else {
        return new ChangeVersionCommand_30(newVersion);
    }
}
/**
 * A command used to modify the version of a document.
 */
var ChangeVersionCommand = (function (_super) {
    __extends$12(ChangeVersionCommand, _super);
    /**
     * C'tor.
     * @param {string} newVersion
     */
    function ChangeVersionCommand(newVersion) {
        var _this = _super.call(this) || this;
        _this._newVersion = newVersion;
        return _this;
    }
    /**
     * Modifies the version of the document.
     * @param document
     */
    ChangeVersionCommand.prototype.execute = function (document) {
        console.info("[ChangeVersionCommand] Executing.");
        if (document.info === undefined || document.info === null) {
            document.info = document.createInfo();
            this._nullInfo = true;
            this._oldVersion = null;
        }
        else {
            this._oldVersion = document.info.version;
        }
        document.info.version = this._newVersion;
    };
    /**
     * Resets the version back to a previous version.
     * @param document
     */
    ChangeVersionCommand.prototype.undo = function (document) {
        console.info("[ChangeVersionCommand] Reverting.");
        if (this._nullInfo) {
            document.info = null;
        }
        else {
            document.info.version = this._oldVersion;
        }
    };
    return ChangeVersionCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var ChangeVersionCommand_20 = (function (_super) {
    __extends$12(ChangeVersionCommand_20, _super);
    function ChangeVersionCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeVersionCommand_20.prototype.type = function () {
        return "ChangeVersionCommand_20";
    };
    return ChangeVersionCommand_20;
}(ChangeVersionCommand));
/**
 * OAI 3.0 impl.
 */
var ChangeVersionCommand_30 = (function (_super) {
    __extends$12(ChangeVersionCommand_30, _super);
    function ChangeVersionCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangeVersionCommand_30.prototype.type = function () {
        return "ChangeVersionCommand_30";
    };
    return ChangeVersionCommand_30;
}(ChangeVersionCommand));

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
var __extends$13 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteAllParametersCommand(document, parent, type) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteAllParametersCommand_20(parent, type);
    }
    else {
        return new DeleteAllParametersCommand_30(parent, type);
    }
}
/**
 * A command used to delete all parameters from an operation.
 */
var DeleteAllParametersCommand = (function (_super) {
    __extends$13(DeleteAllParametersCommand, _super);
    /**
     * C'tor.
     * @param {Oas20Operation | Oas20PathItem} parent
     * @param {string} type
     */
    function DeleteAllParametersCommand(parent, type) {
        var _this = _super.call(this) || this;
        if (parent) {
            _this._parentPath = _this.oasLibrary().createNodePath(parent);
        }
        _this._paramType = type;
        return _this;
    }
    /**
     * Deletes the parameters.
     * @param document
     */
    DeleteAllParametersCommand.prototype.execute = function (document) {
        console.info("[DeleteAllParameters] Executing.");
        this._oldParams = [];
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(parent.parameters) || parent.parameters.length === 0) {
            return;
        }
        // Save the params we're about to delete for later undd
        var paramsToRemove = [];
        for (var _i = 0, _a = parent.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            if (param.in === this._paramType) {
                this._oldParams.push(this.oasLibrary().writeNode(param));
                paramsToRemove.push(param);
            }
        }
        if (this._oldParams.length === 0) {
            return;
        }
        paramsToRemove.forEach(function (paramToRemove) {
            parent.parameters.splice(parent.parameters.indexOf(paramToRemove), 1);
        });
    };
    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    DeleteAllParametersCommand.prototype.undo = function (document) {
        var _this = this;
        console.info("[DeleteAllParameters] Reverting.");
        if (this._oldParams.length === 0) {
            return;
        }
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        this._oldParams.forEach(function (param) {
            var p = parent.createParameter();
            _this.oasLibrary().readNode(param, p);
            parent.addParameter(p);
        });
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteAllParametersCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteAllParametersCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    return DeleteAllParametersCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteAllParametersCommand_20 = (function (_super) {
    __extends$13(DeleteAllParametersCommand_20, _super);
    function DeleteAllParametersCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteAllParametersCommand_20.prototype.type = function () {
        return "DeleteAllParametersCommand_20";
    };
    return DeleteAllParametersCommand_20;
}(DeleteAllParametersCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteAllParametersCommand_30 = (function (_super) {
    __extends$13(DeleteAllParametersCommand_30, _super);
    function DeleteAllParametersCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteAllParametersCommand_30.prototype.type = function () {
        return "DeleteAllParametersCommand_20";
    };
    return DeleteAllParametersCommand_30;
}(DeleteAllParametersCommand));

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
var __extends$14 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteAllPropertiesCommand(document, schema) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteAllPropertiesCommand_20(schema);
    }
    else {
        return new DeleteAllPropertiesCommand_30(schema);
    }
}
/**
 * A command used to delete all properties from a schema.
 */
var DeleteAllPropertiesCommand = (function (_super) {
    __extends$14(DeleteAllPropertiesCommand, _super);
    /**
     * C'tor.
     * @param {OasSchema} schema
     */
    function DeleteAllPropertiesCommand(schema) {
        var _this = _super.call(this) || this;
        if (schema) {
            _this._schemaPath = _this.oasLibrary().createNodePath(schema);
        }
        return _this;
    }
    /**
     * Deletes the properties.
     * @param document
     */
    DeleteAllPropertiesCommand.prototype.execute = function (document) {
        var _this = this;
        console.info("[DeleteAllPropertiesCommand] Executing.");
        this._oldProperties = [];
        var schema = this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            return;
        }
        schema.propertyNames().forEach(function (pname) {
            _this._oldProperties.push({
                name: pname,
                schema: _this.oasLibrary().writeNode(schema.removeProperty(pname))
            });
        });
    };
    /**
     * Restore the old (deleted) property.
     * @param document
     */
    DeleteAllPropertiesCommand.prototype.undo = function (document) {
        var _this = this;
        console.info("[DeleteAllPropertiesCommand] Reverting.");
        if (this._oldProperties.length === 0) {
            return;
        }
        var schema = this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            return;
        }
        this._oldProperties.forEach(function (oldProp) {
            var prop = schema.createPropertySchema(oldProp.name);
            _this.oasLibrary().readNode(oldProp.schema, prop);
            schema.addProperty(oldProp.name, prop);
        });
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteAllPropertiesCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._schemaPath = MarshallUtils.marshallNodePath(obj._schemaPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteAllPropertiesCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._schemaPath = MarshallUtils.unmarshallNodePath(this._schemaPath);
    };
    return DeleteAllPropertiesCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteAllPropertiesCommand_20 = (function (_super) {
    __extends$14(DeleteAllPropertiesCommand_20, _super);
    function DeleteAllPropertiesCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteAllPropertiesCommand_20.prototype.type = function () {
        return "DeleteAllPropertiesCommand_20";
    };
    return DeleteAllPropertiesCommand_20;
}(DeleteAllPropertiesCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteAllPropertiesCommand_30 = (function (_super) {
    __extends$14(DeleteAllPropertiesCommand_30, _super);
    function DeleteAllPropertiesCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteAllPropertiesCommand_30.prototype.type = function () {
        return "DeleteAllPropertiesCommand_30";
    };
    return DeleteAllPropertiesCommand_30;
}(DeleteAllPropertiesCommand));

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
var __extends$15 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteMediaTypeCommand(document, mediaType) {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types are not supported in OpenAPI 2.0.");
    }
    else {
        return new DeleteMediaTypeCommand(mediaType);
    }
}
/**
 * A command used to delete a single mediaType from an operation.
 */
var DeleteMediaTypeCommand = (function (_super) {
    __extends$15(DeleteMediaTypeCommand, _super);
    /**
     * C'tor.
     * @param {Oas30MediaType} mediaType
     */
    function DeleteMediaTypeCommand(mediaType) {
        var _this = _super.call(this) || this;
        if (mediaType) {
            _this._mediaTypeName = mediaType.name();
            _this._mediaTypePath = _this.oasLibrary().createNodePath(mediaType);
            _this._parentPath = _this.oasLibrary().createNodePath(mediaType.parent());
        }
        return _this;
    }
    DeleteMediaTypeCommand.prototype.type = function () {
        return "DeleteMediaTypeCommand";
    };
    /**
     * Deletes the mediaType.
     * @param document
     */
    DeleteMediaTypeCommand.prototype.execute = function (document) {
        console.info("[DeleteMediaTypeCommand] Executing.");
        this._oldMediaType = null;
        var mediaType = this._mediaTypePath.resolve(document);
        if (this.isNullOrUndefined(mediaType)) {
            return;
        }
        var parent = mediaType.parent();
        parent.removeMediaType(this._mediaTypeName);
        this._oldMediaType = this.oasLibrary().writeNode(mediaType);
    };
    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    DeleteMediaTypeCommand.prototype.undo = function (document) {
        console.info("[DeleteMediaTypeCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldMediaType)) {
            return;
        }
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var mediaType = parent.createMediaType(this._mediaTypeName);
        this.oasLibrary().readNode(this._oldMediaType, mediaType);
        parent.addMediaType(this._mediaTypeName, mediaType);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteMediaTypeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._mediaTypePath = MarshallUtils.marshallNodePath(obj._mediaTypePath);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteMediaTypeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._mediaTypePath = MarshallUtils.unmarshallNodePath(this._mediaTypePath);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    return DeleteMediaTypeCommand;
}(AbstractCommand));

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
var __extends$16 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteParameterCommand(document, parameter) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteParameterCommand_20(parameter);
    }
    else {
        return new DeleteParameterCommand_30(parameter);
    }
}
/**
 * A command used to delete a single parameter from an operation.
 */
var DeleteParameterCommand = (function (_super) {
    __extends$16(DeleteParameterCommand, _super);
    /**
     * C'tor.
     * @param {Oas20Parameter | Oas30Parameter} parameter
     */
    function DeleteParameterCommand(parameter) {
        var _this = _super.call(this) || this;
        if (parameter) {
            _this._parameterPath = _this.oasLibrary().createNodePath(parameter);
            _this._parentPath = _this.oasLibrary().createNodePath(parameter.parent());
        }
        return _this;
    }
    /**
     * Deletes the parameter.
     * @param document
     */
    DeleteParameterCommand.prototype.execute = function (document) {
        console.info("[DeleteParameterCommand] Executing.");
        this._oldParameter = null;
        var param = this._parameterPath.resolve(document);
        if (this.isNullOrUndefined(param)) {
            return;
        }
        var params = param.parent().parameters;
        params.splice(params.indexOf(param), 1);
        this._oldParameter = this.oasLibrary().writeNode(param);
    };
    /**
     * Restore the old (deleted) parameter.
     * @param document
     */
    DeleteParameterCommand.prototype.undo = function (document) {
        console.info("[DeleteParameterCommand] Reverting.");
        if (!this._oldParameter) {
            return;
        }
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        if (this.isNullOrUndefined(parent.parameters)) {
            parent.parameters = [];
        }
        var param = parent.createParameter();
        this.oasLibrary().readNode(this._oldParameter, param);
        parent.addParameter(param);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteParameterCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parameterPath = MarshallUtils.marshallNodePath(obj._parameterPath);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteParameterCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parameterPath = MarshallUtils.unmarshallNodePath(this._parameterPath);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    return DeleteParameterCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteParameterCommand_20 = (function (_super) {
    __extends$16(DeleteParameterCommand_20, _super);
    function DeleteParameterCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteParameterCommand_20.prototype.type = function () {
        return "DeleteParameterCommand_20";
    };
    return DeleteParameterCommand_20;
}(DeleteParameterCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteParameterCommand_30 = (function (_super) {
    __extends$16(DeleteParameterCommand_30, _super);
    function DeleteParameterCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteParameterCommand_30.prototype.type = function () {
        return "DeleteParameterCommand_30";
    };
    return DeleteParameterCommand_30;
}(DeleteParameterCommand));

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
var __extends$17 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeletePathCommand(document, path) {
    if (document.getSpecVersion() === "2.0") {
        return new DeletePathCommand_20(path);
    }
    else {
        return new DeletePathCommand_30(path);
    }
}
/**
 * A command used to delete a path.
 */
var DeletePathCommand = (function (_super) {
    __extends$17(DeletePathCommand, _super);
    /**
     * C'tor.
     * @param {string} path
     */
    function DeletePathCommand(path) {
        var _this = _super.call(this) || this;
        _this._path = path;
        return _this;
    }
    /**
     * Deletes the path.
     * @param document
     */
    DeletePathCommand.prototype.execute = function (document) {
        console.info("[DeletePathCommand] Executing for path: %s", this._path);
        this._oldPath = null;
        var paths = document.paths;
        if (this.isNullOrUndefined(paths)) {
            return;
        }
        this._oldPath = this.oasLibrary().writeNode(paths.removePathItem(this._path));
    };
    /**
     * Restore the old (deleted) path.
     * @param document
     */
    DeletePathCommand.prototype.undo = function (document) {
        console.info("[DeletePathCommand] Reverting.");
        var paths = document.paths;
        if (this.isNullOrUndefined(paths) || this.isNullOrUndefined(this._oldPath)) {
            return;
        }
        var pathItem = paths.createPathItem(this._path);
        this.oasLibrary().readNode(this._oldPath, pathItem);
        paths.addPathItem(this._path, pathItem);
    };
    return DeletePathCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeletePathCommand_20 = (function (_super) {
    __extends$17(DeletePathCommand_20, _super);
    function DeletePathCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeletePathCommand_20.prototype.type = function () {
        return "DeletePathCommand_20";
    };
    return DeletePathCommand_20;
}(DeletePathCommand));
/**
 * OAI 3.0 impl.
 */
var DeletePathCommand_30 = (function (_super) {
    __extends$17(DeletePathCommand_30, _super);
    function DeletePathCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeletePathCommand_30.prototype.type = function () {
        return "DeletePathCommand_30";
    };
    return DeletePathCommand_30;
}(DeletePathCommand));

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
var __extends$18 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeletePropertyCommand(document, property) {
    if (document.getSpecVersion() === "2.0") {
        return new DeletePropertyCommand_20(property);
    }
    else {
        return new DeletePropertyCommand_30(property);
    }
}
/**
 * A command used to delete a single property from a schema.
 */
var DeletePropertyCommand = (function (_super) {
    __extends$18(DeletePropertyCommand, _super);
    /**
     * C'tor.
     * @param {Oas20PropertySchema | Oas30PropertySchema} property
     */
    function DeletePropertyCommand(property) {
        var _this = _super.call(this) || this;
        if (property) {
            _this._propertyName = property.propertyName();
            _this._propertyPath = _this.oasLibrary().createNodePath(property);
            _this._schemaPath = _this.oasLibrary().createNodePath(property.parent());
        }
        return _this;
    }
    /**
     * Deletes the property.
     * @param document
     */
    DeletePropertyCommand.prototype.execute = function (document) {
        console.info("[DeletePropertyCommand] Executing.");
        this._oldProperty = null;
        var property = this._propertyPath.resolve(document);
        if (this.isNullOrUndefined(property)) {
            return;
        }
        var schema = property.parent();
        this._oldProperty = this.oasLibrary().writeNode(schema.removeProperty(this._propertyName));
    };
    /**
     * Restore the old (deleted) property.
     * @param document
     */
    DeletePropertyCommand.prototype.undo = function (document) {
        console.info("[DeletePropertyCommand] Reverting.");
        if (!this._oldProperty) {
            return;
        }
        var schema = this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            return;
        }
        var propSchema = schema.createPropertySchema(this._propertyName);
        this.oasLibrary().readNode(this._oldProperty, propSchema);
        schema.addProperty(this._propertyName, propSchema);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeletePropertyCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._propertyPath = MarshallUtils.marshallNodePath(obj._propertyPath);
        obj._schemaPath = MarshallUtils.marshallNodePath(obj._schemaPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeletePropertyCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._propertyPath = MarshallUtils.unmarshallNodePath(this._propertyPath);
        this._schemaPath = MarshallUtils.unmarshallNodePath(this._schemaPath);
    };
    return DeletePropertyCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeletePropertyCommand_20 = (function (_super) {
    __extends$18(DeletePropertyCommand_20, _super);
    function DeletePropertyCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeletePropertyCommand_20.prototype.type = function () {
        return "DeletePropertyCommand_20";
    };
    return DeletePropertyCommand_20;
}(DeletePropertyCommand));
/**
 * OAI 3.0 impl.
 */
var DeletePropertyCommand_30 = (function (_super) {
    __extends$18(DeletePropertyCommand_30, _super);
    function DeletePropertyCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeletePropertyCommand_30.prototype.type = function () {
        return "DeletePropertyCommand_30";
    };
    return DeletePropertyCommand_30;
}(DeletePropertyCommand));

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
var __extends$19 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteResponseCommand(document, response) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteResponseCommand_20(response);
    }
    else {
        return new DeleteResponseCommand_30(response);
    }
}
/**
 * A command used to delete a single response from an operation.
 */
var DeleteResponseCommand = (function (_super) {
    __extends$19(DeleteResponseCommand, _super);
    /**
     * C'tor.
     * @param {Oas20Response | Oas30Response} response
     */
    function DeleteResponseCommand(response) {
        var _this = _super.call(this) || this;
        if (response) {
            _this._responseCode = response.statusCode();
            _this._responsePath = _this.oasLibrary().createNodePath(response);
            _this._responsesPath = _this.oasLibrary().createNodePath(response.parent());
        }
        return _this;
    }
    /**
     * Deletes the response.
     * @param document
     */
    DeleteResponseCommand.prototype.execute = function (document) {
        console.info("[DeleteResponseCommand] Executing.");
        this._oldResponse = null;
        var response = this._responsePath.resolve(document);
        if (this.isNullOrUndefined(response)) {
            return;
        }
        var responses = response.parent();
        if (this.isNullOrUndefined(this._responseCode)) {
            responses.default = null;
        }
        else {
            responses.removeResponse(this._responseCode);
        }
        this._oldResponse = this.oasLibrary().writeNode(response);
    };
    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    DeleteResponseCommand.prototype.undo = function (document) {
        console.info("[DeleteResponseCommand] Reverting.");
        if (!this._oldResponse) {
            return;
        }
        var responses = this._responsesPath.resolve(document);
        if (this.isNullOrUndefined(responses)) {
            return;
        }
        var response = responses.createResponse(this._responseCode);
        this.oasLibrary().readNode(this._oldResponse, response);
        if (this.isNullOrUndefined(this._responseCode)) {
            responses.default = response;
        }
        else {
            responses.addResponse(this._responseCode, response);
        }
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteResponseCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._responsePath = MarshallUtils.marshallNodePath(obj._responsePath);
        obj._responsesPath = MarshallUtils.marshallNodePath(obj._responsesPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteResponseCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._responsePath = MarshallUtils.unmarshallNodePath(this._responsePath);
        this._responsesPath = MarshallUtils.unmarshallNodePath(this._responsesPath);
    };
    return DeleteResponseCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteResponseCommand_20 = (function (_super) {
    __extends$19(DeleteResponseCommand_20, _super);
    function DeleteResponseCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteResponseCommand_20.prototype.type = function () {
        return "DeleteResponseCommand_20";
    };
    return DeleteResponseCommand_20;
}(DeleteResponseCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteResponseCommand_30 = (function (_super) {
    __extends$19(DeleteResponseCommand_30, _super);
    function DeleteResponseCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteResponseCommand_30.prototype.type = function () {
        return "DeleteResponseCommand_30";
    };
    return DeleteResponseCommand_30;
}(DeleteResponseCommand));

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
var __extends$20 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteSchemaDefinitionCommand(document, definitionName) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteSchemaDefinitionCommand_20(definitionName);
    }
    else {
        return new DeleteSchemaDefinitionCommand_30(definitionName);
    }
}
/**
 * A command used to delete a schema definition.
 */
var DeleteSchemaDefinitionCommand = (function (_super) {
    __extends$20(DeleteSchemaDefinitionCommand, _super);
    /**
     * C'tor.
     * @param {string} definitionName
     */
    function DeleteSchemaDefinitionCommand(definitionName) {
        var _this = _super.call(this) || this;
        _this._definitionName = definitionName;
        return _this;
    }
    /**
     * Deletes the definition.
     * @param document
     */
    DeleteSchemaDefinitionCommand.prototype.execute = function (document) {
        console.info("[DeleteDefinitionSchemaCommand] Executing.");
        this._oldDefinition = this.doDeleteSchemaDefinition(document);
    };
    /**
     * Restore the old (deleted) definition.
     * @param document
     */
    DeleteSchemaDefinitionCommand.prototype.undo = function (document) {
        console.info("[DeleteDefinitionSchemaCommand] Reverting.");
        if (this._oldDefinition === null) {
            return;
        }
        this.doRestoreSchemaDefinition(document, this._oldDefinition);
    };
    return DeleteSchemaDefinitionCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteSchemaDefinitionCommand_20 = (function (_super) {
    __extends$20(DeleteSchemaDefinitionCommand_20, _super);
    function DeleteSchemaDefinitionCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteSchemaDefinitionCommand_20.prototype.type = function () {
        return "DeleteSchemaDefinitionCommand_20";
    };
    /**
     * Deletes the schema definition.
     * @param {Oas20Document} document
     * @return {any}
     */
    DeleteSchemaDefinitionCommand_20.prototype.doDeleteSchemaDefinition = function (document) {
        var definitions = document.definitions;
        if (this.isNullOrUndefined(definitions)) {
            return null;
        }
        var schemaDef = definitions.removeDefinition(this._definitionName);
        return this.oasLibrary().writeNode(schemaDef);
    };
    /**
     * Restores the schema definition.
     * @param {OasDocument} document
     * @param oldDefinition
     */
    DeleteSchemaDefinitionCommand_20.prototype.doRestoreSchemaDefinition = function (document, oldDefinition) {
        var definitions = document.definitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }
        var definition = document.definitions.createSchemaDefinition(this._definitionName);
        this.oasLibrary().readNode(oldDefinition, definition);
        definitions.addDefinition(this._definitionName, definition);
    };
    return DeleteSchemaDefinitionCommand_20;
}(DeleteSchemaDefinitionCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteSchemaDefinitionCommand_30 = (function (_super) {
    __extends$20(DeleteSchemaDefinitionCommand_30, _super);
    function DeleteSchemaDefinitionCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteSchemaDefinitionCommand_30.prototype.type = function () {
        return "DeleteSchemaDefinitionCommand_30";
    };
    /**
     * Deletes the schema definition.
     * @param {OasDocument} document
     * @return {any}
     */
    DeleteSchemaDefinitionCommand_30.prototype.doDeleteSchemaDefinition = function (document) {
        if (document.components) {
            var oldDef = document.components.removeSchemaDefinition(this._definitionName);
            return this.oasLibrary().writeNode(oldDef);
        }
        return null;
    };
    /**
     * Restores the schema definition.
     * @param {OasDocument} document
     * @param oldDefinition
     */
    DeleteSchemaDefinitionCommand_30.prototype.doRestoreSchemaDefinition = function (document, oldDefinition) {
        if (document.components) {
            var schemaDef = document.components.createSchemaDefinition(this._definitionName);
            this.oasLibrary().readNode(oldDefinition, schemaDef);
            document.components.addSchemaDefinition(this._definitionName, schemaDef);
        }
    };
    return DeleteSchemaDefinitionCommand_30;
}(DeleteSchemaDefinitionCommand));

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
var __extends$21 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteSecuritySchemeCommand(document, schemeName) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteSecuritySchemeCommand_20(schemeName);
    }
    else {
        return new DeleteSecuritySchemeCommand_30(schemeName);
    }
}
/**
 * A command used to delete a security scheme.
 */
var DeleteSecuritySchemeCommand = (function (_super) {
    __extends$21(DeleteSecuritySchemeCommand, _super);
    /**
     * C'tor.
     * @param {string} schemeName
     */
    function DeleteSecuritySchemeCommand(schemeName) {
        var _this = _super.call(this) || this;
        _this._schemeName = schemeName;
        return _this;
    }
    /**
     * Deletes the security scheme.
     * @param document
     */
    DeleteSecuritySchemeCommand.prototype.execute = function (document) {
        console.info("[DeleteSecuritySchemeCommand] Executing.");
        this._oldScheme = null;
        this._oldScheme = this.doDeleteScheme(document);
    };
    /**
     * Restore the old (deleted) security scheme.
     * @param document
     */
    DeleteSecuritySchemeCommand.prototype.undo = function (document) {
        console.info("[DeleteSecuritySchemeCommand] Reverting.");
        this.doRestoreScheme(document, this._oldScheme);
    };
    return DeleteSecuritySchemeCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteSecuritySchemeCommand_20 = (function (_super) {
    __extends$21(DeleteSecuritySchemeCommand_20, _super);
    function DeleteSecuritySchemeCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteSecuritySchemeCommand_20.prototype.type = function () {
        return "DeleteSecuritySchemeCommand_20";
    };
    /**
     * Delete the scheme.
     * @param {Oas20Document} document
     * @return {any}
     */
    DeleteSecuritySchemeCommand_20.prototype.doDeleteScheme = function (document) {
        var definitions = document.securityDefinitions;
        if (this.isNullOrUndefined(definitions)) {
            return;
        }
        return this.oasLibrary().writeNode(definitions.removeSecurityScheme(this._schemeName));
    };
    /**
     * Restore the scheme.
     * @param {OasDocument} document
     * @param oldScheme
     */
    DeleteSecuritySchemeCommand_20.prototype.doRestoreScheme = function (document, oldScheme) {
        var definitions = document.securityDefinitions;
        if (this.isNullOrUndefined(definitions) || this.isNullOrUndefined(oldScheme)) {
            return;
        }
        var scheme = definitions.createSecurityScheme(this._schemeName);
        this.oasLibrary().readNode(oldScheme, scheme);
        definitions.addSecurityScheme(this._schemeName, scheme);
    };
    return DeleteSecuritySchemeCommand_20;
}(DeleteSecuritySchemeCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteSecuritySchemeCommand_30 = (function (_super) {
    __extends$21(DeleteSecuritySchemeCommand_30, _super);
    function DeleteSecuritySchemeCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteSecuritySchemeCommand_30.prototype.type = function () {
        return "DeleteSecuritySchemeCommand_30";
    };
    /**
     * Deletes the scheme.
     * @param {OasDocument} document
     * @return {any}
     */
    DeleteSecuritySchemeCommand_30.prototype.doDeleteScheme = function (document) {
        if (document.components) {
            return this.oasLibrary().writeNode(document.components.removeSecurityScheme(this._schemeName));
        }
        else {
            return null;
        }
    };
    /**
     * Restores the scheme.
     * @param {OasDocument} document
     * @param oldScheme
     */
    DeleteSecuritySchemeCommand_30.prototype.doRestoreScheme = function (document, oldScheme) {
        if (document.components) {
            var scheme = document.components.createSecurityScheme(this._schemeName);
            this.oasLibrary().readNode(oldScheme, scheme);
            document.components.addSecurityScheme(this._schemeName, scheme);
        }
    };
    return DeleteSecuritySchemeCommand_30;
}(DeleteSecuritySchemeCommand));

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
var __extends$22 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteTagCommand(document, tagName) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteTagCommand_20(tagName);
    }
    else {
        return new DeleteTagCommand_30(tagName);
    }
}
/**
 * A command used to delete a single tag definition from the document.
 */
var DeleteTagCommand = (function (_super) {
    __extends$22(DeleteTagCommand, _super);
    /**
     * C'tor.
     * @param {string} tagName
     */
    function DeleteTagCommand(tagName) {
        var _this = _super.call(this) || this;
        _this._tagName = tagName;
        return _this;
    }
    /**
     * Deletes the tag.
     * @param document
     */
    DeleteTagCommand.prototype.execute = function (document) {
        console.info("[DeleteTagCommand] Executing.");
        if (this.isNullOrUndefined(document.tags)) {
            return;
        }
        var tags = document.tags;
        var tag = null;
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var t = tags_1[_i];
            if (t.name === this._tagName) {
                tag = t;
            }
        }
        this._oldIndex = tags.indexOf(tag);
        tags.splice(this._oldIndex, 1);
        this._oldTag = this.oasLibrary().writeNode(tag);
    };
    /**
     * Restore the old (deleted) tag.
     * @param document
     */
    DeleteTagCommand.prototype.undo = function (document) {
        console.info("[DeleteTagCommand] Reverting.");
        if (this.isNullOrUndefined(document.tags)) {
            document.tags = [];
        }
        var tag = document.createTag();
        this.oasLibrary().readNode(this._oldTag, tag);
        if (document.tags.length >= this._oldIndex) {
            document.tags.splice(this._oldIndex, 0, tag);
        }
        else {
            document.tags.push(tag);
        }
    };
    return DeleteTagCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteTagCommand_20 = (function (_super) {
    __extends$22(DeleteTagCommand_20, _super);
    function DeleteTagCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteTagCommand_20.prototype.type = function () {
        return "DeleteTagCommand_20";
    };
    return DeleteTagCommand_20;
}(DeleteTagCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteTagCommand_30 = (function (_super) {
    __extends$22(DeleteTagCommand_30, _super);
    function DeleteTagCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteTagCommand_30.prototype.type = function () {
        return "DeleteTagCommand_30";
    };
    return DeleteTagCommand_30;
}(DeleteTagCommand));

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
var __extends$23 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewMediaTypeCommand(document, node, newMediaType) {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Media Types were introduced in OpenAPI 3.0.0.");
    }
    else {
        return new NewMediaTypeCommand(node, newMediaType);
    }
}
/**
 * A command used to create a new media type.
 */
var NewMediaTypeCommand = (function (_super) {
    __extends$23(NewMediaTypeCommand, _super);
    /**
     * C'tor.
     * @param {Oas30ParameterBase | Oas30RequestBody | Oas30ResponseBase} node
     * @param {string} newMediaType
     */
    function NewMediaTypeCommand(node, newMediaType) {
        var _this = _super.call(this) || this;
        if (node) {
            _this._nodePath = _this.oasLibrary().createNodePath(node);
        }
        _this._newMediaType = newMediaType;
        return _this;
    }
    /**
     * @return {string}
     */
    NewMediaTypeCommand.prototype.type = function () {
        return "NewMediaTypeCommand";
    };
    /**
     * Adds the new media type to the node.
     * @param {Oas30Document} document
     */
    NewMediaTypeCommand.prototype.execute = function (document) {
        console.info("[NewMediaTypeCommand] Executing.");
        this._created = false;
        var node = this._nodePath.resolve(document);
        if (this.isNullOrUndefined(node)) {
            return;
        }
        if (!this.isNullOrUndefined(node.content[this._newMediaType])) {
            return;
        }
        node.addMediaType(this._newMediaType, node.createMediaType(this._newMediaType));
        this._created = true;
    };
    /**
     * Removes the path item.
     * @param document
     */
    NewMediaTypeCommand.prototype.undo = function (document) {
        console.info("[NewMediaTypeCommand] Reverting.");
        if (!this._created) {
            console.info("[NewMediaTypeCommand] media type already existed, nothing done so no rollback necessary.");
            return;
        }
        var node = this._nodePath.resolve(document);
        if (this.isNullOrUndefined(node)) {
            return;
        }
        node.removeMediaType(this._newMediaType);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    NewMediaTypeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._nodePath = MarshallUtils.marshallNodePath(obj._nodePath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    NewMediaTypeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._nodePath = MarshallUtils.unmarshallNodePath(this._nodePath);
    };
    return NewMediaTypeCommand;
}(AbstractCommand));

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
var __extends$24 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewOperationCommand(document, path, method) {
    if (document.getSpecVersion() === "2.0") {
        return new NewOperationCommand_20(path, method);
    }
    else {
        return new NewOperationCommand_30(path, method);
    }
}
/**
 * A command used to create a new operation in a path.
 */
var NewOperationCommand = (function (_super) {
    __extends$24(NewOperationCommand, _super);
    /**
     * C'tor.
     * @param {string} path
     * @param {string} method
     */
    function NewOperationCommand(path, method) {
        var _this = _super.call(this) || this;
        _this._path = path;
        _this._method = method;
        return _this;
    }
    /**
     * Adds the new operation to the path.
     * @param document
     */
    NewOperationCommand.prototype.execute = function (document) {
        console.info("[NewOperationCommand] Executing.");
        this._created = false;
        if (this.isNullOrUndefined(document.paths)) {
            return;
        }
        var path = document.paths.pathItem(this._path);
        if (this.isNullOrUndefined(path)) {
            return;
        }
        var operation = path.createOperation(this._method);
        path[this._method] = operation;
        this._created = true;
    };
    /**
     * Removes the path item.
     * @param document
     */
    NewOperationCommand.prototype.undo = function (document) {
        console.info("[NewOperationCommand] Reverting.");
        if (!this._created) {
            return;
        }
        if (this.isNullOrUndefined(document.paths)) {
            return;
        }
        var path = document.paths.pathItem(this._path);
        if (this.isNullOrUndefined(path)) {
            return;
        }
        path[this._method] = null;
    };
    return NewOperationCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewOperationCommand_20 = (function (_super) {
    __extends$24(NewOperationCommand_20, _super);
    function NewOperationCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewOperationCommand_20.prototype.type = function () {
        return "NewOperationCommand_20";
    };
    return NewOperationCommand_20;
}(NewOperationCommand));
/**
 * OAI 3.0 impl.
 */
var NewOperationCommand_30 = (function (_super) {
    __extends$24(NewOperationCommand_30, _super);
    function NewOperationCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewOperationCommand_30.prototype.type = function () {
        return "NewOperationCommand_30";
    };
    return NewOperationCommand_30;
}(NewOperationCommand));

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
var __extends$25 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewParamCommand(document, operation, paramName, paramType) {
    if (document.getSpecVersion() === "2.0") {
        return new NewParamCommand_20(operation, paramName, paramType);
    }
    else {
        return new NewParamCommand_30(operation, paramName, paramType);
    }
}
/**
 * A command used to create a new parameter.
 */
var NewParamCommand = (function (_super) {
    __extends$25(NewParamCommand, _super);
    /**
     * Constructor.
     * @param operation
     * @param paramName
     * @param paramType
     */
    function NewParamCommand(operation, paramName, paramType) {
        var _this = _super.call(this) || this;
        if (operation) {
            _this._parentPath = _this.oasLibrary().createNodePath(operation);
        }
        _this._paramName = paramName;
        _this._paramType = paramType;
        return _this;
    }
    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    NewParamCommand.prototype.execute = function (document) {
        console.info("[NewParamCommand] Executing.");
        this._created = false;
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            console.info("[NewParamCommand] Parent node (operation or path item) is null.");
            return;
        }
        if (this.hasParam(this._paramName, this._paramType, parent)) {
            console.info("[NewParamCommand] Param %s of type %s already exists.", this._paramName, this._paramType);
            return;
        }
        if (this.isNullOrUndefined(parent.parameters)) {
            parent.parameters = [];
        }
        var param = parent.createParameter();
        param.in = this._paramType;
        param.name = this._paramName;
        if (param.in === "path") {
            param.required = true;
        }
        parent.addParameter(param);
        console.info("[NewParamCommand] Param %s of type %s created successfully.", param.name, param.in);
        this._created = true;
    };
    /**
     * Removes the previously created param.
     * @param document
     */
    NewParamCommand.prototype.undo = function (document) {
        console.info("[NewParamCommand] Reverting.");
        if (!this._created) {
            return;
        }
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var theParam = null;
        for (var _i = 0, _a = parent.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            if (param.in === this._paramType && param.name === this._paramName) {
                theParam = param;
                break;
            }
        }
        // If found, remove it from the params.
        if (theParam) {
            parent.parameters.splice(parent.parameters.indexOf(theParam), 1);
            if (parent.parameters.length === 0) {
                parent.parameters = null;
            }
        }
    };
    /**
     * Returns true if the given param already exists in the parent.
     * @param paramName
     * @param paramType
     * @param parent
     * @returns {boolean}
     */
    NewParamCommand.prototype.hasParam = function (paramName, paramType, parent) {
        return parent.parameters && parent.parameters.filter(function (value) {
            return value.in === paramType && value.name === paramName;
        }).length > 0;
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    NewParamCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    NewParamCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    return NewParamCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewParamCommand_20 = (function (_super) {
    __extends$25(NewParamCommand_20, _super);
    function NewParamCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewParamCommand_20.prototype.type = function () {
        return "NewParamCommand_20";
    };
    return NewParamCommand_20;
}(NewParamCommand));
/**
 * OAI 3.0 impl.
 */
var NewParamCommand_30 = (function (_super) {
    __extends$25(NewParamCommand_30, _super);
    function NewParamCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewParamCommand_30.prototype.type = function () {
        return "NewParamCommand_30";
    };
    return NewParamCommand_30;
}(NewParamCommand));

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
var __extends$26 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewPathCommand(document, newPath) {
    if (document.getSpecVersion() === "2.0") {
        return new NewPathCommand_20(newPath);
    }
    else {
        return new NewPathCommand_30(newPath);
    }
}
/**
 * A command used to create a new path item in a document.
 */
var NewPathCommand = (function (_super) {
    __extends$26(NewPathCommand, _super);
    /**
     * C'tor.
     * @param {string} newPath
     */
    function NewPathCommand(newPath) {
        var _this = _super.call(this) || this;
        _this._newPath = newPath;
        return _this;
    }
    /**
     * Adds the new path to the document.
     * @param document
     */
    NewPathCommand.prototype.execute = function (document) {
        console.info("[NewPathCommand] Executing.");
        if (this.isNullOrUndefined(document.paths)) {
            document.paths = document.createPaths();
            this._nullPaths = true;
        }
        if (this.isNullOrUndefined(document.paths.pathItem(this._newPath))) {
            var pathItem = document.paths.createPathItem(this._newPath);
            document.paths.addPathItem(this._newPath, pathItem);
            this._pathExisted = false;
        }
        else {
            this._pathExisted = true;
        }
    };
    /**
     * Removes the path item.
     * @param document
     */
    NewPathCommand.prototype.undo = function (document) {
        console.info("[NewPathCommand] Reverting.");
        if (this._pathExisted) {
            console.info("[NewPathCommand] path already existed, nothing done so no rollback necessary.");
            return;
        }
        if (this._nullPaths) {
            console.info("[NewPathCommand] Paths was null, deleting it.");
            document.paths = null;
        }
        else {
            console.info("[NewPathCommand] Removing a path item: %s", this._newPath);
            document.paths.removePathItem(this._newPath);
        }
    };
    return NewPathCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewPathCommand_20 = (function (_super) {
    __extends$26(NewPathCommand_20, _super);
    function NewPathCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewPathCommand_20.prototype.type = function () {
        return "NewPathCommand_20";
    };
    return NewPathCommand_20;
}(NewPathCommand));
/**
 * OAI 3.0 impl.
 */
var NewPathCommand_30 = (function (_super) {
    __extends$26(NewPathCommand_30, _super);
    function NewPathCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewPathCommand_30.prototype.type = function () {
        return "NewPathCommand_30";
    };
    return NewPathCommand_30;
}(NewPathCommand));

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
var __extends$27 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewRequestBodyCommand(document, operation) {
    if (document.getSpecVersion() === "2.0") {
        return new NewRequestBodyCommand_20(operation);
    }
    else {
        return new NewRequestBodyCommand_30(operation);
    }
}
/**
 * A command used to create a new request body (parameter of an operation).
 */
var NewRequestBodyCommand = (function (_super) {
    __extends$27(NewRequestBodyCommand, _super);
    /**
     * C'tor.
     * @param {Oas20Operation} operation
     */
    function NewRequestBodyCommand(operation) {
        var _this = _super.call(this) || this;
        if (operation) {
            _this._operationPath = _this.oasLibrary().createNodePath(operation);
        }
        return _this;
    }
    /**
     * Creates a request body parameter for the operation.
     * @param document
     */
    NewRequestBodyCommand.prototype.execute = function (document) {
        console.info("[NewRequestBodyCommand] Executing.");
        this._created = false;
        var operation = this._operationPath.resolve(document);
        if (this.isNullOrUndefined(operation)) {
            return;
        }
        if (this.hasRequestBody(operation)) {
            return;
        }
        this.doCreateRequestBody(operation);
        this._created = true;
    };
    /**
     * Removes the previously created body param.
     * @param document
     */
    NewRequestBodyCommand.prototype.undo = function (document) {
        console.info("[NewRequestBodyCommand] Reverting.");
        if (!this._created) {
            return;
        }
        var operation = this._operationPath.resolve(document);
        if (this.isNullOrUndefined(operation)) {
            return;
        }
        this.doRemoveRequestBody(operation);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    NewRequestBodyCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._operationPath = MarshallUtils.marshallNodePath(obj._operationPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    NewRequestBodyCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._operationPath = MarshallUtils.unmarshallNodePath(this._operationPath);
    };
    return NewRequestBodyCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewRequestBodyCommand_20 = (function (_super) {
    __extends$27(NewRequestBodyCommand_20, _super);
    function NewRequestBodyCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    NewRequestBodyCommand_20.prototype.type = function () {
        return "NewRequestBodyCommand_20";
    };
    /**
     * Returns true if the given operation has a body param.
     * @param {Oas20Operation} operation
     * @return {boolean}
     */
    NewRequestBodyCommand_20.prototype.hasRequestBody = function (operation) {
        return operation.parameters && operation.parameters.filter(function (value) {
            return value.in === "body";
        }).length > 0;
    };
    /**
     * Creates a body parameter for the given operation.
     * @param {OasOperation} operation
     */
    NewRequestBodyCommand_20.prototype.doCreateRequestBody = function (operation) {
        if (this.isNullOrUndefined(operation.parameters)) {
            operation.parameters = [];
        }
        var param = operation.createParameter();
        param.in = "body";
        param.name = "body";
        operation.addParameter(param);
    };
    /**
     * Removes the body parameter.
     * @param {Oas20Operation} operation
     */
    NewRequestBodyCommand_20.prototype.doRemoveRequestBody = function (operation) {
        var bodyParam = null;
        for (var _i = 0, _a = operation.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            if (param.in === "body") {
                bodyParam = param;
                break;
            }
        }
        // If found, remove it from the params.
        if (bodyParam) {
            operation.parameters.splice(operation.parameters.indexOf(bodyParam), 1);
            if (operation.parameters.length === 0) {
                operation.parameters = null;
            }
        }
    };
    return NewRequestBodyCommand_20;
}(NewRequestBodyCommand));
/**
 * OAI 3.0 impl.
 */
var NewRequestBodyCommand_30 = (function (_super) {
    __extends$27(NewRequestBodyCommand_30, _super);
    function NewRequestBodyCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    NewRequestBodyCommand_30.prototype.type = function () {
        return "NewRequestBodyCommand_30";
    };
    /**
     * Returns true if the given operation already has a request body.
     * @param {OasOperation} operation
     * @return {boolean}
     */
    NewRequestBodyCommand_30.prototype.hasRequestBody = function (operation) {
        return !this.isNullOrUndefined(operation.requestBody);
    };
    /**
     * Creates a new, empty request body.
     * @param {OasOperation} operation
     */
    NewRequestBodyCommand_30.prototype.doCreateRequestBody = function (operation) {
        operation.requestBody = operation.createRequestBody();
    };
    /**
     * Removes the request body.
     * @param {OasOperation} operation
     */
    NewRequestBodyCommand_30.prototype.doRemoveRequestBody = function (operation) {
        operation.requestBody = null;
    };
    return NewRequestBodyCommand_30;
}(NewRequestBodyCommand));

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
var __extends$28 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewResponseCommand(document, operation, statusCode) {
    if (document.getSpecVersion() === "2.0") {
        return new NewResponseCommand_20(operation, statusCode);
    }
    else {
        return new NewResponseCommand_30(operation, statusCode);
    }
}
/**
 * A command used to create a new response in an operation.
 */
var NewResponseCommand = (function (_super) {
    __extends$28(NewResponseCommand, _super);
    /**
     * C'tor.
     * @param {Oas20Operation | Oas30Operation} operation
     * @param {string} statusCode
     */
    function NewResponseCommand(operation, statusCode) {
        var _this = _super.call(this) || this;
        if (operation) {
            _this._operationPath = _this.oasLibrary().createNodePath(operation);
        }
        _this._statusCode = statusCode;
        return _this;
    }
    /**
     * Creates a response for the operation.
     * @param document
     */
    NewResponseCommand.prototype.execute = function (document) {
        console.info("[NewResponseCommand] Executing.  Status Code=%s", this._statusCode);
        this._created = false;
        this._nullResponses = false;
        var operation = this._operationPath.resolve(document);
        if (this.isNullOrUndefined(operation)) {
            return;
        }
        if (this.isNullOrUndefined(operation.responses)) {
            operation.responses = operation.createResponses();
            this._nullResponses = true;
        }
        var response = operation.responses.response(this._statusCode);
        if (this.isNullOrUndefined(response)) {
            response = operation.responses.createResponse(this._statusCode);
            operation.responses.addResponse(this._statusCode, response);
            this._created = true;
        }
    };
    /**
     * Removes the previously created body param.
     * @param document
     */
    NewResponseCommand.prototype.undo = function (document) {
        console.info("[NewResponseCommand] Reverting.");
        var operation = this._operationPath.resolve(document);
        if (this.isNullOrUndefined(operation)) {
            return;
        }
        if (this._nullResponses) {
            operation.responses = null;
            return;
        }
        if (!this._created) {
            return;
        }
        operation.responses.removeResponse(this._statusCode);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    NewResponseCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._operationPath = MarshallUtils.marshallNodePath(obj._operationPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    NewResponseCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._operationPath = MarshallUtils.unmarshallNodePath(this._operationPath);
    };
    return NewResponseCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewResponseCommand_20 = (function (_super) {
    __extends$28(NewResponseCommand_20, _super);
    function NewResponseCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewResponseCommand_20.prototype.type = function () {
        return "NewResponseCommand_20";
    };
    return NewResponseCommand_20;
}(NewResponseCommand));
/**
 * OAI 3.0 impl.
 */
var NewResponseCommand_30 = (function (_super) {
    __extends$28(NewResponseCommand_30, _super);
    function NewResponseCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewResponseCommand_30.prototype.type = function () {
        return "NewResponseCommand_30";
    };
    return NewResponseCommand_30;
}(NewResponseCommand));

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
var __extends$29 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewSchemaDefinitionCommand(document, definitionName, example) {
    if (document.getSpecVersion() === "2.0") {
        return new NewSchemaDefinitionCommand_20(definitionName, example);
    }
    else {
        return new NewSchemaDefinitionCommand_30(definitionName, example);
    }
}
/**
 * A command used to create a new definition in a document.
 */
var NewSchemaDefinitionCommand = (function (_super) {
    __extends$29(NewSchemaDefinitionCommand, _super);
    /**
     * C'tor.
     * @param {string} definitionName
     * @param {string} example
     */
    function NewSchemaDefinitionCommand(definitionName, example) {
        var _this = _super.call(this) || this;
        _this._newDefinitionName = definitionName;
        _this._newDefinitionExample = example;
        return _this;
    }
    return NewSchemaDefinitionCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewSchemaDefinitionCommand_20 = (function (_super) {
    __extends$29(NewSchemaDefinitionCommand_20, _super);
    function NewSchemaDefinitionCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewSchemaDefinitionCommand_20.prototype.type = function () {
        return "NewSchemaDefinitionCommand_20";
    };
    /**
     * Adds the new definition to the document.
     * @param document
     */
    NewSchemaDefinitionCommand_20.prototype.execute = function (document) {
        console.info("[NewDefinitionCommand] Executing.");
        if (this.isNullOrUndefined(document.definitions)) {
            document.definitions = document.createDefinitions();
            this._nullDefinitions = true;
        }
        if (this.isNullOrUndefined(document.definitions.definition(this._newDefinitionName))) {
            var definition = void 0;
            if (!this.isNullOrUndefined(this._newDefinitionExample)) {
                definition = new oaiTsCore.OasSchemaFactory().createSchemaDefinitionFromExample(document, this._newDefinitionName, this._newDefinitionExample);
            }
            else {
                definition = document.definitions.createSchemaDefinition(this._newDefinitionName);
            }
            document.definitions.addDefinition(this._newDefinitionName, definition);
            this._defExisted = false;
        }
        else {
            this._defExisted = true;
        }
    };
    /**
     * Removes the definition.
     * @param document
     */
    NewSchemaDefinitionCommand_20.prototype.undo = function (document) {
        console.info("[NewDefinitionCommand] Reverting.");
        if (this._nullDefinitions) {
            document.definitions = null;
        }
        if (this._defExisted) {
            return;
        }
        document.definitions.removeDefinition(this._newDefinitionName);
    };
    return NewSchemaDefinitionCommand_20;
}(NewSchemaDefinitionCommand));
/**
 * OAI 3.0 impl.
 */
var NewSchemaDefinitionCommand_30 = (function (_super) {
    __extends$29(NewSchemaDefinitionCommand_30, _super);
    function NewSchemaDefinitionCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewSchemaDefinitionCommand_30.prototype.type = function () {
        return "NewSchemaDefinitionCommand_30";
    };
    /**
     * Adds the new definition to the document.
     * @param document
     */
    NewSchemaDefinitionCommand_30.prototype.execute = function (document) {
        console.info("[NewDefinitionCommand] Executing.");
        if (this.isNullOrUndefined(document.components)) {
            document.components = document.createComponents();
            this._nullComponents = true;
        }
        this._nullComponents = false;
        if (this.isNullOrUndefined(document.components.getSchemaDefinition(this._newDefinitionName))) {
            var definition = void 0;
            if (!this.isNullOrUndefined(this._newDefinitionExample)) {
                definition = new oaiTsCore.OasSchemaFactory().createSchemaDefinitionFromExample(document, this._newDefinitionName, this._newDefinitionExample);
            }
            else {
                definition = document.components.createSchemaDefinition(this._newDefinitionName);
            }
            document.components.addSchemaDefinition(this._newDefinitionName, definition);
            this._defExisted = false;
        }
        else {
            this._defExisted = true;
        }
    };
    /**
     * Removes the definition.
     * @param document
     */
    NewSchemaDefinitionCommand_30.prototype.undo = function (document) {
        console.info("[NewDefinitionCommand] Reverting.");
        if (this._nullComponents) {
            document.components = null;
        }
        if (this._defExisted) {
            return;
        }
        document.components.removeSchemaDefinition(this._newDefinitionName);
    };
    return NewSchemaDefinitionCommand_30;
}(NewSchemaDefinitionCommand));

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
var __extends$30 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewSchemaPropertyCommand(document, schema, propertyName) {
    if (document.getSpecVersion() === "2.0") {
        return new NewSchemaPropertyCommand_20(schema, propertyName);
    }
    else {
        return new NewSchemaPropertyCommand_30(schema, propertyName);
    }
}
/**
 * A command used to create a new schema property.
 */
var NewSchemaPropertyCommand = (function (_super) {
    __extends$30(NewSchemaPropertyCommand, _super);
    /**
     * Constructor.
     * @param schema
     * @param propertyName
     */
    function NewSchemaPropertyCommand(schema, propertyName) {
        var _this = _super.call(this) || this;
        if (schema) {
            _this._schemaPath = _this.oasLibrary().createNodePath(schema);
        }
        _this._propertyName = propertyName;
        return _this;
    }
    /**
     * Creates a new property of the schema.
     * @param document
     */
    NewSchemaPropertyCommand.prototype.execute = function (document) {
        console.info("[NewSchemaPropertyCommand] Executing.");
        this._created = false;
        var schema = this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            console.info("[NewSchemaPropertyCommand] Schema is null.");
            return;
        }
        if (schema.property(this._propertyName)) {
            console.info("[NewSchemaPropertyCommand] Property already exists.");
            return;
        }
        schema.addProperty(this._propertyName, schema.createPropertySchema(this._propertyName));
        console.info("[NewSchemaPropertyCommand] Property [%s] created successfully.", this._propertyName);
        this._created = true;
    };
    /**
     * Removes the previously created property.
     * @property document
     */
    NewSchemaPropertyCommand.prototype.undo = function (document) {
        console.info("[NewSchemaPropertyCommand] Reverting.");
        if (!this._created) {
            return;
        }
        var schema = this._schemaPath.resolve(document);
        if (this.isNullOrUndefined(schema)) {
            return;
        }
        if (!schema.property(this._propertyName)) {
            return;
        }
        schema.removeProperty(this._propertyName);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    NewSchemaPropertyCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._schemaPath = MarshallUtils.marshallNodePath(obj._schemaPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    NewSchemaPropertyCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._schemaPath = MarshallUtils.unmarshallNodePath(this._schemaPath);
    };
    return NewSchemaPropertyCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewSchemaPropertyCommand_20 = (function (_super) {
    __extends$30(NewSchemaPropertyCommand_20, _super);
    function NewSchemaPropertyCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewSchemaPropertyCommand_20.prototype.type = function () {
        return "NewSchemaPropertyCommand_20";
    };
    return NewSchemaPropertyCommand_20;
}(NewSchemaPropertyCommand));
/**
 * OAI 3.0 impl.
 */
var NewSchemaPropertyCommand_30 = (function (_super) {
    __extends$30(NewSchemaPropertyCommand_30, _super);
    function NewSchemaPropertyCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewSchemaPropertyCommand_30.prototype.type = function () {
        return "NewSchemaPropertyCommand_30";
    };
    return NewSchemaPropertyCommand_30;
}(NewSchemaPropertyCommand));

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
var __extends$31 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewSecuritySchemeCommand(document, scheme) {
    if (document.getSpecVersion() === "2.0") {
        return new NewSecuritySchemeCommand_20(scheme);
    }
    else {
        return new NewSecuritySchemeCommand_30(scheme);
    }
}
/**
 * A command used to create a new definition in a document.
 */
var NewSecuritySchemeCommand = (function (_super) {
    __extends$31(NewSecuritySchemeCommand, _super);
    /**
     * C'tor.
     * @param {Oas20SecurityScheme} scheme
     */
    function NewSecuritySchemeCommand(scheme) {
        var _this = _super.call(this) || this;
        if (scheme) {
            _this._scheme = _this.oasLibrary().writeNode(scheme);
            _this._schemeName = scheme.schemeName();
        }
        return _this;
    }
    return NewSecuritySchemeCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewSecuritySchemeCommand_20 = (function (_super) {
    __extends$31(NewSecuritySchemeCommand_20, _super);
    function NewSecuritySchemeCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    NewSecuritySchemeCommand_20.prototype.type = function () {
        return "NewSecuritySchemeCommand_20";
    };
    /**
     * Adds the new security scheme to the document.
     * @param {Oas20Document} document
     */
    NewSecuritySchemeCommand_20.prototype.execute = function (document) {
        console.info("[NewSecuritySchemeCommand] Executing.");
        this._nullSecurityDefinitions = false;
        if (this.isNullOrUndefined(document.securityDefinitions)) {
            document.securityDefinitions = document.createSecurityDefinitions();
            this._nullSecurityDefinitions = true;
        }
        if (this.isNullOrUndefined(document.securityDefinitions.securityScheme(this._schemeName))) {
            var scheme = document.securityDefinitions.createSecurityScheme(this._schemeName);
            this.oasLibrary().readNode(this._scheme, scheme);
            document.securityDefinitions.addSecurityScheme(this._schemeName, scheme);
            this._schemeExisted = false;
        }
        else {
            this._schemeExisted = true;
        }
    };
    /**
     * Removes the security scheme.
     * @param {Oas20Document} document
     */
    NewSecuritySchemeCommand_20.prototype.undo = function (document) {
        console.info("[NewSecuritySchemeCommand] Reverting.");
        if (this._schemeExisted) {
            return;
        }
        if (this._nullSecurityDefinitions) {
            document.securityDefinitions = null;
            return;
        }
        document.securityDefinitions.removeSecurityScheme(this._schemeName);
    };
    return NewSecuritySchemeCommand_20;
}(NewSecuritySchemeCommand));
/**
 * OAI 3.0 impl.
 */
var NewSecuritySchemeCommand_30 = (function (_super) {
    __extends$31(NewSecuritySchemeCommand_30, _super);
    function NewSecuritySchemeCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    NewSecuritySchemeCommand_30.prototype.type = function () {
        return "NewSecuritySchemeCommand_30";
    };
    /**
     * Adds the new security scheme to the document.
     * @param document
     */
    NewSecuritySchemeCommand_30.prototype.execute = function (document) {
        console.info("[NewSecuritySchemeCommand] Executing.");
        this._nullComponents = false;
        if (this.isNullOrUndefined(document.components)) {
            document.components = document.createComponents();
            this._nullComponents = true;
        }
        if (this.isNullOrUndefined(document.components.getSecurityScheme(this._schemeName))) {
            var scheme = document.components.createSecurityScheme(this._schemeName);
            this.oasLibrary().readNode(this._scheme, scheme);
            document.components.addSecurityScheme(this._schemeName, scheme);
            this._schemeExisted = false;
        }
        else {
            this._schemeExisted = true;
        }
    };
    /**
     * Removes the security scheme.
     * @param {Oas30Document} document
     */
    NewSecuritySchemeCommand_30.prototype.undo = function (document) {
        console.info("[NewSecuritySchemeCommand] Reverting.");
        if (this._schemeExisted) {
            return;
        }
        if (this._nullComponents) {
            document.components = null;
            return;
        }
        document.components.removeSecurityScheme(this._schemeName);
    };
    return NewSecuritySchemeCommand_30;
}(NewSecuritySchemeCommand));

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
var __extends$32 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createNewTagCommand(document, name, description) {
    if (document.getSpecVersion() === "2.0") {
        return new NewTagCommand_20(name, description);
    }
    else {
        return new NewTagCommand_30(name, description);
    }
}
/**
 * A command used to create a new tag.
 */
var NewTagCommand = (function (_super) {
    __extends$32(NewTagCommand, _super);
    /**
     * Constructor.
     * @param {string} name
     * @param {string} description
     */
    function NewTagCommand(name, description) {
        var _this = _super.call(this) || this;
        _this._tagName = name;
        _this._tagDescription = description;
        return _this;
    }
    /**
     * Creates a request body parameter for the operation.
     * @param {OasDocument} document
     */
    NewTagCommand.prototype.execute = function (document) {
        console.info("[NewTagCommand] Executing.");
        this._created = false;
        if (this.isNullOrUndefined(document.tags)) {
            document.tags = [];
        }
        var tag = this.findTag(document, this._tagName);
        if (this.isNullOrUndefined(tag)) {
            document.addTag(this._tagName, this._tagDescription);
            this._created = true;
        }
    };
    /**
     * Removes the previously created query param.
     * @param {OasDocument} document
     */
    NewTagCommand.prototype.undo = function (document) {
        console.info("[NewTagCommand] Reverting.");
        if (!this._created) {
            return;
        }
        var tag = this.findTag(document, this._tagName);
        if (this.isNullOrUndefined(tag)) {
            return;
        }
        document.tags.splice(document.tags.indexOf(tag), 1);
    };
    /**
     * Finds a single tag by its name.  No way to do this but iterate through the
     * tags array.
     * @param {OasDocument} doc
     * @param {string} tagName
     * @return {OasTag}
     */
    NewTagCommand.prototype.findTag = function (doc, tagName) {
        for (var _i = 0, _a = doc.tags; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.name === tagName) {
                return dt;
            }
        }
        return null;
    };
    return NewTagCommand;
}(AbstractCommand));
/**
 * OAI 2.0 impl.
 */
var NewTagCommand_20 = (function (_super) {
    __extends$32(NewTagCommand_20, _super);
    function NewTagCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewTagCommand_20.prototype.type = function () {
        return "NewTagCommand_20";
    };
    return NewTagCommand_20;
}(NewTagCommand));
/**
 * OAI 3.0 impl.
 */
var NewTagCommand_30 = (function (_super) {
    __extends$32(NewTagCommand_30, _super);
    function NewTagCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewTagCommand_30.prototype.type = function () {
        return "NewTagCommand_30";
    };
    return NewTagCommand_30;
}(NewTagCommand));

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
var __extends$34 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A command used to replace a path item with a newer version.
 */
var ReplaceNodeCommand = (function (_super) {
    __extends$34(ReplaceNodeCommand, _super);
    /**
     * C'tor.
     * @param {T} old
     * @param {T} replacement
     */
    function ReplaceNodeCommand(old, replacement) {
        var _this = _super.call(this) || this;
        if (old) {
            _this._nodePath = _this.oasLibrary().createNodePath(old);
        }
        if (replacement) {
            _this._new = _this.oasLibrary().writeNode(replacement);
        }
        return _this;
    }
    /**
     * Replaces the node.
     * @param document
     */
    ReplaceNodeCommand.prototype.execute = function (document) {
        console.info("[AbstractReplaceNodeCommand] Executing.");
        this._old = null;
        var oldNode = this._nodePath.resolve(document);
        if (this.isNullOrUndefined(oldNode)) {
            return;
        }
        this._old = this.oasLibrary().writeNode(oldNode);
        this.removeNode(document, oldNode);
        var newNode = this.readNode(document, this._new);
        this.addNode(document, newNode);
    };
    /**
     * Switch back!
     * @param document
     */
    ReplaceNodeCommand.prototype.undo = function (document) {
        console.info("[AbstractReplaceNodeCommand] Reverting.");
        var doc = document;
        if (this.isNullOrUndefined(this._old)) {
            return;
        }
        var node = this._nodePath.resolve(document);
        if (this.isNullOrUndefined(node)) {
            return;
        }
        this.removeNode(doc, node);
        var restoreNode = this.readNode(document, this._old);
        this.addNode(document, restoreNode);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ReplaceNodeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._nodePath = MarshallUtils.marshallNodePath(obj._nodePath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ReplaceNodeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._nodePath = MarshallUtils.unmarshallNodePath(this._nodePath);
    };
    return ReplaceNodeCommand;
}(AbstractCommand));

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
var __extends$33 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createReplaceOperationCommand(document, old, replacement) {
    if (document.getSpecVersion() === "2.0") {
        return new ReplaceOperationCommand_20(old, replacement);
    }
    else {
        return new ReplaceOperationCommand_30(old, replacement);
    }
}
/**
 * A command used to replace an operation with a newer version.
 */
var AbstractReplaceOperationCommand = (function (_super) {
    __extends$33(AbstractReplaceOperationCommand, _super);
    /**
     * @param {T} old
     * @param {T} replacement
     */
    function AbstractReplaceOperationCommand(old, replacement) {
        var _this = _super.call(this, old, replacement) || this;
        if (old) {
            _this._method = old.method();
            _this._path = old.parent().path();
        }
        return _this;
    }
    /**
     * Remove the given node.
     * @param {OasDocument} doc
     * @param {T} node
     */
    AbstractReplaceOperationCommand.prototype.removeNode = function (doc, node) {
        var path = doc.paths.pathItem(this._path);
        path[node.method()] = null;
    };
    /**
     * Adds the node to the document.
     * @param {OasDocument} doc
     * @param {T} node
     */
    AbstractReplaceOperationCommand.prototype.addNode = function (doc, node) {
        var path = doc.paths.pathItem(this._path);
        node._parent = path;
        node._ownerDocument = path.ownerDocument();
        path[node.method()] = node;
    };
    /**
     * Reads a node into the appropriate model.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    AbstractReplaceOperationCommand.prototype.readNode = function (doc, node) {
        var parent = doc.paths.pathItem(this._path);
        var operation = parent.createOperation(this._method);
        this.oasLibrary().readNode(node, operation);
        return operation;
    };
    return AbstractReplaceOperationCommand;
}(ReplaceNodeCommand));
/**
 * A command used to replace an operation with a newer version.
 */
var ReplaceOperationCommand_20 = (function (_super) {
    __extends$33(ReplaceOperationCommand_20, _super);
    function ReplaceOperationCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    ReplaceOperationCommand_20.prototype.type = function () {
        return "ReplaceOperationCommand_20";
    };
    return ReplaceOperationCommand_20;
}(AbstractReplaceOperationCommand));
/**
 * A command used to replace an operation with a newer version.
 */
var ReplaceOperationCommand_30 = (function (_super) {
    __extends$33(ReplaceOperationCommand_30, _super);
    function ReplaceOperationCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    ReplaceOperationCommand_30.prototype.type = function () {
        return "ReplaceOperationCommand_30";
    };
    return ReplaceOperationCommand_30;
}(AbstractReplaceOperationCommand));

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
var __extends$35 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createReplacePathItemCommand(document, old, replacement) {
    if (document.getSpecVersion() === "2.0") {
        return new ReplacePathItemCommand_20(old, replacement);
    }
    else {
        return new ReplacePathItemCommand_30(old, replacement);
    }
}
/**
 * A command used to replace a path item with a newer version.
 */
var AbstractReplacePathItemCommand = (function (_super) {
    __extends$35(AbstractReplacePathItemCommand, _super);
    /**
     * @param {OasPathItem} old
     * @param {OasPathItem} replacement
     */
    function AbstractReplacePathItemCommand(old, replacement) {
        var _this = _super.call(this, old, replacement) || this;
        if (old) {
            _this._pathName = old.path();
        }
        return _this;
    }
    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    AbstractReplacePathItemCommand.prototype.removeNode = function (doc, node) {
        doc.paths.removePathItem(node.path());
    };
    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    AbstractReplacePathItemCommand.prototype.addNode = function (doc, node) {
        node._ownerDocument = doc;
        node._parent = doc.paths;
        doc.paths.addPathItem(this._pathName, node);
    };
    /**
     * Reads a node into the appropriate model.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    AbstractReplacePathItemCommand.prototype.readNode = function (doc, node) {
        var pathItem = doc.paths.createPathItem(this._pathName);
        this.oasLibrary().readNode(node, pathItem);
        return pathItem;
    };
    return AbstractReplacePathItemCommand;
}(ReplaceNodeCommand));
/**
 * A command used to replace a path item with a newer version.
 */
var ReplacePathItemCommand_20 = (function (_super) {
    __extends$35(ReplacePathItemCommand_20, _super);
    function ReplacePathItemCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    ReplacePathItemCommand_20.prototype.type = function () {
        return "ReplacePathItemCommand_20";
    };
    return ReplacePathItemCommand_20;
}(AbstractReplacePathItemCommand));
/**
 * A command used to replace a path item with a newer version.
 */
var ReplacePathItemCommand_30 = (function (_super) {
    __extends$35(ReplacePathItemCommand_30, _super);
    function ReplacePathItemCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {string}
     */
    ReplacePathItemCommand_30.prototype.type = function () {
        return "ReplacePathItemCommand_30";
    };
    return ReplacePathItemCommand_30;
}(AbstractReplacePathItemCommand));

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
var __extends$36 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createReplaceSchemaDefinitionCommand(document, old, replacement) {
    if (document.getSpecVersion() === "2.0") {
        return new ReplaceSchemaDefinitionCommand_20(old, replacement);
    }
    else {
        return new ReplaceSchemaDefinitionCommand_30(old, replacement);
    }
}
/**
 * A command used to replace a definition schema with a newer version.
 */
var ReplaceSchemaDefinitionCommand_20 = (function (_super) {
    __extends$36(ReplaceSchemaDefinitionCommand_20, _super);
    /**
     * @param {Oas20SchemaDefinition} old
     * @param {Oas20SchemaDefinition} replacement
     */
    function ReplaceSchemaDefinitionCommand_20(old, replacement) {
        var _this = _super.call(this, old, replacement) || this;
        if (old) {
            _this._defName = old.definitionName();
        }
        return _this;
    }
    /**
     * @return {string}
     */
    ReplaceSchemaDefinitionCommand_20.prototype.type = function () {
        return "ReplaceSchemaDefinitionCommand_20";
    };
    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    ReplaceSchemaDefinitionCommand_20.prototype.removeNode = function (doc, node) {
        doc.definitions.removeDefinition(node.definitionName());
    };
    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    ReplaceSchemaDefinitionCommand_20.prototype.addNode = function (doc, node) {
        node._ownerDocument = doc;
        node._parent = doc.definitions;
        doc.definitions.addDefinition(node.definitionName(), node);
    };
    /**
     * Reads a node into the appropriate model.
     * @param {Oas20Document} doc
     * @param node
     * @return {Oas20SchemaDefinition}
     */
    ReplaceSchemaDefinitionCommand_20.prototype.readNode = function (doc, node) {
        var definition = doc.definitions.createSchemaDefinition(this._defName);
        this.oasLibrary().readNode(node, definition);
        return definition;
    };
    return ReplaceSchemaDefinitionCommand_20;
}(ReplaceNodeCommand));
/**
 * A command used to replace a definition schema with a newer version.
 */
var ReplaceSchemaDefinitionCommand_30 = (function (_super) {
    __extends$36(ReplaceSchemaDefinitionCommand_30, _super);
    /**
     * @param {Oas20SchemaDefinition} old
     * @param {Oas20SchemaDefinition} replacement
     */
    function ReplaceSchemaDefinitionCommand_30(old, replacement) {
        var _this = _super.call(this, old, replacement) || this;
        if (old) {
            _this._defName = old.name();
        }
        return _this;
    }
    /**
     * @return {string}
     */
    ReplaceSchemaDefinitionCommand_30.prototype.type = function () {
        return "ReplaceSchemaDefinitionCommand_30";
    };
    /**
     * Remove the given node.
     * @param doc
     * @param node
     */
    ReplaceSchemaDefinitionCommand_30.prototype.removeNode = function (doc, node) {
        doc.components.removeSchemaDefinition(node.name());
    };
    /**
     * Adds the node to the document.
     * @param doc
     * @param node
     */
    ReplaceSchemaDefinitionCommand_30.prototype.addNode = function (doc, node) {
        node._ownerDocument = doc;
        node._parent = doc.components;
        doc.components.addSchemaDefinition(node.name(), node);
    };
    /**
     * Reads a node into the appropriate model.
     * @param {Oas30Document} doc
     * @param node
     * @return {Oas30SchemaDefinition}
     */
    ReplaceSchemaDefinitionCommand_30.prototype.readNode = function (doc, node) {
        var definition = doc.components.createSchemaDefinition(this._defName);
        this.oasLibrary().readNode(node, definition);
        return definition;
    };
    return ReplaceSchemaDefinitionCommand_30;
}(ReplaceNodeCommand));

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
var __extends$37 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Allowable simple type values:
 *   - string
 *     - byte
 *     - binary
 *     - date
 *     - date-time
 *     - password
 *   - number
 *     - float
 *     - double
 *   - integer
 *     - int32
 *     - int64
 *   - boolean
 */
var SimplifiedType = (function () {
    function SimplifiedType() {
    }
    SimplifiedType.fromItems = function (items) {
        var rval = new SimplifiedType();
        if (items && items.type && items.type !== "array" && items.type !== "object" && items.type !== "file") {
            rval.type = items.type;
            if (items.format) {
                rval.as = items.format;
            }
        }
        if (items && items.type === "array" && items.items && !Array.isArray(items.items)) {
            rval.type = "array";
            rval.of = SimplifiedType.fromItems(items.items);
        }
        return rval;
    };
    SimplifiedType.fromSchema = function (schema) {
        var rval = new SimplifiedType();
        if (schema && schema.$ref) {
            rval.type = schema.$ref;
        }
        if (schema && schema.type && schema.type !== "array" &&
            schema.type !== "object" && schema.type !== "file") {
            rval.type = schema.type;
            if (schema.format) {
                rval.as = schema.format;
            }
        }
        if (schema && schema.type === "array" && schema.items && !Array.isArray(schema.items)) {
            rval.type = "array";
            rval.of = SimplifiedType.fromSchema(schema.items);
        }
        return rval;
    };
    SimplifiedType.prototype.isSimpleType = function () {
        return ["string", "number", "integer", "boolean"].indexOf(this.type) !== -1;
    };
    SimplifiedType.prototype.isArray = function () {
        return this.type === "array";
    };
    SimplifiedType.prototype.isRef = function () {
        return !ModelUtils.isNullOrUndefined(this.type) && this.type.indexOf("#/") === 0;
    };
    return SimplifiedType;
}());
/**
 * Adds the "required" property to the standard SimplifiedType.
 */
var SimplifiedParameterType = (function (_super) {
    __extends$37(SimplifiedParameterType, _super);
    function SimplifiedParameterType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimplifiedParameterType.fromParameter = function (param) {
        var rval = new SimplifiedParameterType();
        var st;
        if (param.ownerDocument().getSpecVersion() === "2.0") {
            if (param.in === "body") {
                st = SimplifiedType.fromSchema(param.schema);
            }
            else {
                st = SimplifiedType.fromItems(param);
            }
        }
        else {
            st = SimplifiedType.fromSchema(param.schema);
        }
        rval.type = st.type;
        rval.of = st.of;
        rval.as = st.as;
        rval.required = param.required;
        return rval;
    };
    return SimplifiedParameterType;
}(SimplifiedType));
var SimplifiedPropertyType = (function (_super) {
    __extends$37(SimplifiedPropertyType, _super);
    function SimplifiedPropertyType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimplifiedPropertyType.fromPropertySchema = function (schema) {
        var rval = new SimplifiedPropertyType();
        var propName = schema.propertyName();
        var required = schema.parent()["required"];
        var st = SimplifiedType.fromSchema(schema);
        rval.type = st.type;
        rval.of = st.of;
        rval.as = st.as;
        rval.required = false;
        if (required && required.length > 0 && required.indexOf(propName) != -1) {
            rval.required = true;
        }
        return rval;
    };
    return SimplifiedPropertyType;
}(SimplifiedType));

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
var __extends$39 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A command used to delete a child node.
 */
var DeleteNodeCommand = (function (_super) {
    __extends$39(DeleteNodeCommand, _super);
    /**
     * C'tor.
     * @param {string} property
     * @param {OasNode} parent
     */
    function DeleteNodeCommand(property, parent) {
        var _this = _super.call(this) || this;
        _this._property = property;
        if (parent) {
            _this._parentPath = _this.oasLibrary().createNodePath(parent);
        }
        return _this;
    }
    /**
     * Deletes the property of the node.
     * @param document
     */
    DeleteNodeCommand.prototype.execute = function (document) {
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var propertyNode = parent[this._property];
        if (this.isNullOrUndefined(propertyNode)) {
            this._oldValue = null;
            return;
        }
        else {
            this._oldValue = this.oasLibrary().writeNode(propertyNode);
        }
        parent[this._property] = null;
        delete parent[this._property];
    };
    /**
     * Restore the old (deleted) child node.
     * @param document
     */
    DeleteNodeCommand.prototype.undo = function (document) {
        console.info("[" + this.type() + "] Reverting.");
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(this._oldValue)) {
            return;
        }
        var restoredNode = this.readNode(document, this._oldValue);
        restoredNode._parent = parent;
        restoredNode._ownerDocument = parent.ownerDocument();
        parent[this._property] = restoredNode;
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteNodeCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteNodeCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    return DeleteNodeCommand;
}(AbstractCommand));

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
var __extends$38 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteOperationCommand(document, opMethod, pathItem) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteOperationCommand_20(opMethod, pathItem);
    }
    else {
        return new DeleteOperationCommand_30(opMethod, pathItem);
    }
}
/**
 * A command used to delete an operation.
 */
var AbstractDeleteOperationCommand = (function (_super) {
    __extends$38(AbstractDeleteOperationCommand, _super);
    function AbstractDeleteOperationCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    AbstractDeleteOperationCommand.prototype.readNode = function (doc, node) {
        var pathItem = this._parentPath.resolve(doc);
        var operation = pathItem.createOperation(this._property);
        this.oasLibrary().readNode(node, operation);
        return operation;
    };
    return AbstractDeleteOperationCommand;
}(DeleteNodeCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteOperationCommand_20 = (function (_super) {
    __extends$38(DeleteOperationCommand_20, _super);
    function DeleteOperationCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteOperationCommand_20.prototype.type = function () {
        return "DeleteOperationCommand_20";
    };
    return DeleteOperationCommand_20;
}(AbstractDeleteOperationCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteOperationCommand_30 = (function (_super) {
    __extends$38(DeleteOperationCommand_30, _super);
    function DeleteOperationCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteOperationCommand_30.prototype.type = function () {
        return "DeleteOperationCommand_30";
    };
    return DeleteOperationCommand_30;
}(AbstractDeleteOperationCommand));

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
var __extends$40 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteRequestBodyCommand(document, operation) {
    if (document.getSpecVersion() === "2.0") {
        throw new Error("Request Body was introduced in OpenAPI 3.0.0.");
    }
    else {
        return new DeleteRequestBodyCommand_30("requestBody", operation);
    }
}
/**
 * A command used to delete an operation.
 */
var DeleteRequestBodyCommand_30 = (function (_super) {
    __extends$40(DeleteRequestBodyCommand_30, _super);
    function DeleteRequestBodyCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteRequestBodyCommand_30.prototype.type = function () {
        return "DeleteRequestBodyCommand_30";
    };
    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {Oas30RequestBody}
     */
    DeleteRequestBodyCommand_30.prototype.readNode = function (doc, node) {
        var operation = this._parentPath.resolve(doc);
        var requestBody = operation.createRequestBody();
        this.oasLibrary().readNode(node, requestBody);
        return requestBody;
    };
    return DeleteRequestBodyCommand_30;
}(DeleteNodeCommand));

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
var __extends$41 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteAllResponsesCommand(document, operation) {
    if (document.getSpecVersion() === "2.0") {
        return new DeleteAllResponsesCommand_20("responses", operation);
    }
    else {
        return new DeleteAllResponsesCommand_30("responses", operation);
    }
}
/**
 * A command used to delete an operation.
 */
var AbstractDeleteAllResponsesCommand = (function (_super) {
    __extends$41(AbstractDeleteAllResponsesCommand, _super);
    function AbstractDeleteAllResponsesCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    AbstractDeleteAllResponsesCommand.prototype.readNode = function (doc, node) {
        var operation = this._parentPath.resolve(doc);
        var responses = operation.createResponses();
        this.oasLibrary().readNode(node, responses);
        return responses;
    };
    return AbstractDeleteAllResponsesCommand;
}(DeleteNodeCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteAllResponsesCommand_20 = (function (_super) {
    __extends$41(DeleteAllResponsesCommand_20, _super);
    function DeleteAllResponsesCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteAllResponsesCommand_20.prototype.type = function () {
        return "DeleteAllResponsesCommand_20";
    };
    return DeleteAllResponsesCommand_20;
}(AbstractDeleteAllResponsesCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteAllResponsesCommand_30 = (function (_super) {
    __extends$41(DeleteAllResponsesCommand_30, _super);
    function DeleteAllResponsesCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteAllResponsesCommand_30.prototype.type = function () {
        return "DeleteAllResponsesCommand_30";
    };
    return DeleteAllResponsesCommand_30;
}(AbstractDeleteAllResponsesCommand));

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
var __extends$42 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteContactCommand(document) {
    var property = "contact";
    var parent = document.info;
    if (document.getSpecVersion() === "2.0") {
        return new DeleteContactCommand_20(property, parent);
    }
    else {
        return new DeleteContactCommand_30(property, parent);
    }
}
/**
 * A command used to delete the license.
 */
var AbstractDeleteContactCommand = (function (_super) {
    __extends$42(AbstractDeleteContactCommand, _super);
    function AbstractDeleteContactCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    AbstractDeleteContactCommand.prototype.readNode = function (doc, node) {
        var contact = doc.info.createContact();
        this.oasLibrary().readNode(node, contact);
        return contact;
    };
    return AbstractDeleteContactCommand;
}(DeleteNodeCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteContactCommand_20 = (function (_super) {
    __extends$42(DeleteContactCommand_20, _super);
    function DeleteContactCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteContactCommand_20.prototype.type = function () {
        return "DeleteContactCommand_20";
    };
    return DeleteContactCommand_20;
}(AbstractDeleteContactCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteContactCommand_30 = (function (_super) {
    __extends$42(DeleteContactCommand_30, _super);
    function DeleteContactCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteContactCommand_30.prototype.type = function () {
        return "DeleteContactCommand_30";
    };
    return DeleteContactCommand_30;
}(AbstractDeleteContactCommand));

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
var __extends$43 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */
function createDeleteLicenseCommand(document) {
    var property = "license";
    var parent = document.info;
    if (document.getSpecVersion() === "2.0") {
        return new DeleteLicenseCommand_20(property, parent);
    }
    else {
        return new DeleteLicenseCommand_30(property, parent);
    }
}
/**
 * A command used to delete the license.
 */
var AbstractDeleteLicenseCommand = (function (_super) {
    __extends$43(AbstractDeleteLicenseCommand, _super);
    function AbstractDeleteLicenseCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Unmarshalls a node into the appropriate type.
     * @param {OasDocument} doc
     * @param node
     * @return {T}
     */
    AbstractDeleteLicenseCommand.prototype.readNode = function (doc, node) {
        var license = doc.info.createLicense();
        this.oasLibrary().readNode(node, license);
        return license;
    };
    return AbstractDeleteLicenseCommand;
}(DeleteNodeCommand));
/**
 * OAI 2.0 impl.
 */
var DeleteLicenseCommand_20 = (function (_super) {
    __extends$43(DeleteLicenseCommand_20, _super);
    function DeleteLicenseCommand_20() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteLicenseCommand_20.prototype.type = function () {
        return "DeleteLicenseCommand_20";
    };
    return DeleteLicenseCommand_20;
}(AbstractDeleteLicenseCommand));
/**
 * OAI 3.0 impl.
 */
var DeleteLicenseCommand_30 = (function (_super) {
    __extends$43(DeleteLicenseCommand_30, _super);
    function DeleteLicenseCommand_30() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DeleteLicenseCommand_30.prototype.type = function () {
        return "DeleteLicenseCommand_30";
    };
    return DeleteLicenseCommand_30;
}(AbstractDeleteLicenseCommand));

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
var __extends$44 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */

/**
 * A command used to create a new server in a document.
 */
var NewServerCommand = (function (_super) {
    __extends$44(NewServerCommand, _super);
    /**
     * C'tor.
     * @param {Oas30Document | Oas30PathItem | Oas30Operation} parent
     * @param {Oas30Server} server
     */
    function NewServerCommand(parent, server) {
        var _this = _super.call(this) || this;
        if (!_this.isNullOrUndefined(parent)) {
            _this._parentPath = _this.oasLibrary().createNodePath(parent);
        }
        if (!_this.isNullOrUndefined(server)) {
            _this._server = _this.oasLibrary().writeNode(server);
        }
        return _this;
    }
    /**
     * @return {string}
     */
    NewServerCommand.prototype.type = function () {
        return "NewServerCommand";
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    NewServerCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    NewServerCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    /**
     * Adds the new server to the document.
     * @param document
     */
    NewServerCommand.prototype.execute = function (document) {
        console.info("[NewServerCommand] Executing.");
        var parent = document;
        if (!this.isNullOrUndefined(this._parentPath)) {
            parent = this._parentPath.resolve(document);
        }
        // If the parent doesn't exist, abort!
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        if (this.isNullOrUndefined(parent.servers)) {
            parent.servers = [];
        }
        var server = parent.createServer();
        this.oasLibrary().readNode(this._server, server);
        if (this.serverAlreadyExists(parent, server)) {
            this._serverExisted = true;
            return;
        }
        else {
            parent.servers.push(server);
            this._serverExisted = false;
        }
    };
    /**
     * Removes the security server.
     * @param {Oas30Document} document
     */
    NewServerCommand.prototype.undo = function (document) {
        console.info("[NewServerCommand] Reverting.");
        if (this._serverExisted) {
            return;
        }
        var parent = document;
        if (!this.isNullOrUndefined(this._parentPath)) {
            parent = this._parentPath.resolve(document);
        }
        // If the parent doesn't exist, abort!
        if (this.isNullOrUndefined(parent) || this.isNullOrUndefined(parent.servers)) {
            return;
        }
        var serverUrl = this._server.url;
        var server = this.findServer(parent.servers, serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }
        parent.servers.splice(parent.servers.indexOf(server), 1);
        if (parent.servers.length === 0) {
            parent.servers = null;
        }
    };
    /**
     * Returns true if a server with the same url already exists in the parent.
     * @param {Oas30Document | Oas30PathItem | Oas30Operation} parent
     * @param {Oas30Server} server
     */
    NewServerCommand.prototype.serverAlreadyExists = function (parent, server) {
        var rval = false;
        parent.servers.forEach(function (pserver) {
            if (pserver.url == server.url) {
                rval = true;
            }
        });
        return rval;
    };
    /**
     * Finds a server by its URL from an array of servers.
     * @param {Oas30Server[]} servers
     * @param {string} serverUrl
     */
    NewServerCommand.prototype.findServer = function (servers, serverUrl) {
        var rval = null;
        if (this.isNullOrUndefined(servers)) {
            return null;
        }
        servers.forEach(function (server) {
            if (server.url == serverUrl) {
                rval = server;
            }
        });
        return rval;
    };
    return NewServerCommand;
}(AbstractCommand));

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
var __extends$45 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */

/**
 * A command used to delete a single server from an operation.
 */
var DeleteServerCommand = (function (_super) {
    __extends$45(DeleteServerCommand, _super);
    /**
     * C'tor.
     * @param {Oas30Server} server
     */
    function DeleteServerCommand(server) {
        var _this = _super.call(this) || this;
        if (!_this.isNullOrUndefined(server)) {
            _this._serverUrl = server.url;
            _this._parentPath = _this.oasLibrary().createNodePath(server.parent());
        }
        return _this;
    }
    DeleteServerCommand.prototype.type = function () {
        return "DeleteServerCommand";
    };
    /**
     * Deletes the server.
     * @param document
     */
    DeleteServerCommand.prototype.execute = function (document) {
        console.info("[DeleteServerCommand] Executing.");
        this._oldServer = null;
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var server = this.findServer(parent.servers, this._serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }
        parent.servers.splice(parent.servers.indexOf(server), 1);
        if (parent.servers.length === 0) {
            parent.servers = null;
        }
        this._oldServer = this.oasLibrary().writeNode(server);
    };
    /**
     * Restore the old (deleted) parameters.
     * @param document
     */
    DeleteServerCommand.prototype.undo = function (document) {
        console.info("[DeleteServerCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldServer)) {
            return;
        }
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var server = parent.createServer();
        this.oasLibrary().readNode(this._oldServer, server);
        if (this.isNullOrUndefined(parent.servers)) {
            parent.servers = [];
        }
        parent.servers.push(server);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    DeleteServerCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    DeleteServerCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    /**
     * Finds a server by its URL from an array of servers.
     * @param {Oas30Server[]} servers
     * @param {string} serverUrl
     */
    DeleteServerCommand.prototype.findServer = function (servers, serverUrl) {
        var rval = null;
        if (this.isNullOrUndefined(servers)) {
            return null;
        }
        servers.forEach(function (server) {
            if (server.url == serverUrl) {
                rval = server;
            }
        });
        return rval;
    };
    return DeleteServerCommand;
}(AbstractCommand));

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
var __extends$46 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Factory function.
 */

/**
 * A command used to modify a server.
 */
var ChangeServerCommand = (function (_super) {
    __extends$46(ChangeServerCommand, _super);
    /**
     * C'tor.
     * @param {Oas30Server} server
     */
    function ChangeServerCommand(server) {
        var _this = _super.call(this) || this;
        if (!_this.isNullOrUndefined(server)) {
            _this._parentPath = _this.oasLibrary().createNodePath(server.parent());
            _this._serverUrl = server.url;
            _this._serverObj = _this.oasLibrary().writeNode(server);
        }
        return _this;
    }
    ChangeServerCommand.prototype.type = function () {
        return "ChangeServerCommand";
    };
    /**
     * Modifies the server.
     * @param document
     */
    ChangeServerCommand.prototype.execute = function (document) {
        console.info("[ChangeServerCommand] Executing.");
        this._oldServer = null;
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var server = this.findServer(parent.servers, this._serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }
        // Back up the old server info (for undo)
        this._oldServer = this.oasLibrary().writeNode(server);
        // Replace with new server info
        this.replaceServerWith(server, this._serverObj);
    };
    /**
     * Resets the server back to the original value.
     * @param document
     */
    ChangeServerCommand.prototype.undo = function (document) {
        console.info("[ChangeServerCommand] Reverting.");
        if (this.isNullOrUndefined(this._oldServer)) {
            return;
        }
        var parent = this._parentPath.resolve(document);
        if (this.isNullOrUndefined(parent)) {
            return;
        }
        var server = this.findServer(parent.servers, this._serverUrl);
        if (this.isNullOrUndefined(server)) {
            return;
        }
        this.replaceServerWith(server, this._oldServer);
    };
    /**
     * Replaces the content of a server with the content from another server.
     * @param {Oas30Server} toServer
     * @param {Oas30Server} fromServer
     */
    ChangeServerCommand.prototype.replaceServerWith = function (toServer, fromServer) {
        toServer.getServerVariables().forEach(function (var_) {
            toServer.removeServerVariable(var_.name());
        });
        this.oasLibrary().readNode(fromServer, toServer);
    };
    /**
     * Marshall the command into a JS object.
     * @return {any}
     */
    ChangeServerCommand.prototype.marshall = function () {
        var obj = _super.prototype.marshall.call(this);
        obj._parentPath = MarshallUtils.marshallNodePath(obj._parentPath);
        return obj;
    };
    /**
     * Unmarshall the JS object.
     * @param obj
     */
    ChangeServerCommand.prototype.unmarshall = function (obj) {
        _super.prototype.unmarshall.call(this, obj);
        this._parentPath = MarshallUtils.unmarshallNodePath(this._parentPath);
    };
    /**
     * Finds a server by its URL from an array of servers.
     * @param {Oas30Server[]} servers
     * @param {string} serverUrl
     */
    ChangeServerCommand.prototype.findServer = function (servers, serverUrl) {
        var rval = null;
        if (this.isNullOrUndefined(servers)) {
            return null;
        }
        servers.forEach(function (server) {
            if (server.url == serverUrl) {
                rval = server;
            }
        });
        return rval;
    };
    return ChangeServerCommand;
}(AbstractCommand));

///<reference path="../commands/change-version.command.ts"/>
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
var commandFactory = {
    "AddPathItemCommand_20": function () { return new AddPathItemCommand_20(null, null); },
    "AddPathItemCommand_30": function () { return new AddPathItemCommand_30(null, null); },
    "AddSchemaDefinitionCommand_20": function () { return new AddSchemaDefinitionCommand_20(null); },
    "AddSchemaDefinitionCommand_30": function () { return new AddSchemaDefinitionCommand_30(null); },
    "ChangeContactCommand_20": function () { return new ChangeContactCommand_20(null, null, null); },
    "ChangeContactCommand_30": function () { return new ChangeContactCommand_30(null, null, null); },
    "ChangeDescriptionCommand_20": function () { return new ChangeDescriptionCommand_20(null); },
    "ChangeDescriptionCommand_30": function () { return new ChangeDescriptionCommand_30(null); },
    "ChangeLicenseCommand_20": function () { return new ChangeLicenseCommand_20(null, null); },
    "ChangeLicenseCommand_30": function () { return new ChangeLicenseCommand_30(null, null); },
    "ChangeMediaTypeTypeCommand": function () { return new ChangeMediaTypeTypeCommand(null, null); },
    "ChangeParameterDefinitionTypeCommand_20": function () { return new ChangeParameterDefinitionTypeCommand_20(null, null); },
    "ChangeParameterDefinitionTypeCommand_30": function () { return new ChangeParameterDefinitionTypeCommand_30(null, null); },
    "ChangeParameterTypeCommand_20": function () { return new ChangeParameterTypeCommand_20(null, null); },
    "ChangeParameterTypeCommand_30": function () { return new ChangeParameterTypeCommand_30(null, null); },
    "ChangePropertyCommand_20": function () { return new ChangePropertyCommand_20(null, null, null); },
    "ChangePropertyCommand_30": function () { return new ChangePropertyCommand_30(null, null, null); },
    "ChangePropertyTypeCommand_20": function () { return new ChangePropertyTypeCommand_20(null, null); },
    "ChangePropertyTypeCommand_30": function () { return new ChangePropertyTypeCommand_30(null, null); },
    "ChangeResponseTypeCommand_20": function () { return new ChangeResponseTypeCommand_20(null, null); },
    "ChangeResponseDefinitionTypeCommand_20": function () { return new ChangeResponseDefinitionTypeCommand_20(null, null); },
    "ChangeSecuritySchemeCommand_20": function () { return new ChangeSecuritySchemeCommand_20(null); },
    "ChangeSecuritySchemeCommand_30": function () { return new ChangeSecuritySchemeCommand_30(null); },
    "ChangeServerCommand": function () { return new ChangeServerCommand(null); },
    "ChangeTitleCommand_20": function () { return new ChangeTitleCommand_20(null); },
    "ChangeTitleCommand_30": function () { return new ChangeTitleCommand_30(null); },
    "ChangeVersionCommand_20": function () { return new ChangeVersionCommand_20(null); },
    "ChangeVersionCommand_30": function () { return new ChangeVersionCommand_30(null); },
    "DeleteAllParametersCommand_20": function () { return new DeleteAllParametersCommand_20(null, null); },
    "DeleteAllParametersCommand_30": function () { return new DeleteAllParametersCommand_30(null, null); },
    "DeleteAllPropertiesCommand_20": function () { return new DeleteAllPropertiesCommand_20(null); },
    "DeleteAllPropertiesCommand_30": function () { return new DeleteAllPropertiesCommand_30(null); },
    "DeleteMediaTypeCommand": function () { return new DeleteMediaTypeCommand(null); },
    "DeleteOperationCommand_20": function () { return new DeleteOperationCommand_20(null, null); },
    "DeleteOperationCommand_30": function () { return new DeleteOperationCommand_30(null, null); },
    "DeleteParameterCommand_20": function () { return new DeleteParameterCommand_20(null); },
    "DeleteParameterCommand_30": function () { return new DeleteParameterCommand_30(null); },
    "DeletePathCommand_20": function () { return new DeletePathCommand_20(null); },
    "DeletePathCommand_30": function () { return new DeletePathCommand_30(null); },
    "DeletePropertyCommand_20": function () { return new DeletePropertyCommand_20(null); },
    "DeletePropertyCommand_30": function () { return new DeletePropertyCommand_30(null); },
    "DeleteResponseCommand_20": function () { return new DeleteResponseCommand_20(null); },
    "DeleteResponseCommand_30": function () { return new DeleteResponseCommand_30(null); },
    "DeleteSchemaDefinitionCommand_20": function () { return new DeleteSchemaDefinitionCommand_20(null); },
    "DeleteSchemaDefinitionCommand_30": function () { return new DeleteSchemaDefinitionCommand_30(null); },
    "DeleteSecuritySchemeCommand_20": function () { return new DeleteSecuritySchemeCommand_20(null); },
    "DeleteSecuritySchemeCommand_30": function () { return new DeleteSecuritySchemeCommand_30(null); },
    "DeleteServerCommand": function () { return new DeleteServerCommand(null); },
    "DeleteTagCommand_20": function () { return new DeleteTagCommand_20(null); },
    "DeleteTagCommand_30": function () { return new DeleteTagCommand_30(null); },
    "DeleteRequestBodyCommand_30": function () { return new DeleteRequestBodyCommand_30(null, null); },
    "DeleteAllResponsesCommand_20": function () { return new DeleteAllResponsesCommand_20(null, null); },
    "DeleteAllResponsesCommand_30": function () { return new DeleteAllResponsesCommand_30(null, null); },
    "DeleteContactCommand_20": function () { return new DeleteContactCommand_20(null, null); },
    "DeleteContactCommand_30": function () { return new DeleteContactCommand_30(null, null); },
    "DeleteLicenseCommand_20": function () { return new DeleteLicenseCommand_20(null, null); },
    "DeleteLicenseCommand_30": function () { return new DeleteLicenseCommand_30(null, null); },
    "NewMediaTypeCommand": function () { return new NewMediaTypeCommand(null, null); },
    "NewOperationCommand_20": function () { return new NewOperationCommand_20(null, null); },
    "NewOperationCommand_30": function () { return new NewOperationCommand_30(null, null); },
    "NewParamCommand_20": function () { return new NewParamCommand_20(null, null, null); },
    "NewParamCommand_30": function () { return new NewParamCommand_30(null, null, null); },
    "NewPathCommand_20": function () { return new NewPathCommand_20(null); },
    "NewPathCommand_30": function () { return new NewPathCommand_30(null); },
    "NewRequestBodyCommand_20": function () { return new NewRequestBodyCommand_20(null); },
    "NewRequestBodyCommand_30": function () { return new NewRequestBodyCommand_30(null); },
    "NewResponseCommand_20": function () { return new NewResponseCommand_20(null, null); },
    "NewResponseCommand_30": function () { return new NewResponseCommand_30(null, null); },
    "NewSchemaDefinitionCommand_20": function () { return new NewSchemaDefinitionCommand_20(null, null); },
    "NewSchemaDefinitionCommand_30": function () { return new NewSchemaDefinitionCommand_30(null, null); },
    "NewSchemaPropertyCommand_20": function () { return new NewSchemaPropertyCommand_20(null, null); },
    "NewSchemaPropertyCommand_30": function () { return new NewSchemaPropertyCommand_30(null, null); },
    "NewSecuritySchemeCommand_20": function () { return new NewSecuritySchemeCommand_20(null); },
    "NewSecuritySchemeCommand_30": function () { return new NewSecuritySchemeCommand_30(null); },
    "NewServerCommand": function () { return new NewServerCommand(null, null); },
    "NewTagCommand_20": function () { return new NewTagCommand_20(null); },
    "NewTagCommand_30": function () { return new NewTagCommand_30(null); },
    "ReplaceOperationCommand_20": function () { return new ReplaceOperationCommand_20(null, null); },
    "ReplaceOperationCommand_30": function () { return new ReplaceOperationCommand_30(null, null); },
    "ReplacePathItemCommand_20": function () { return new ReplacePathItemCommand_20(null, null); },
    "ReplacePathItemCommand_30": function () { return new ReplacePathItemCommand_30(null, null); },
    "ReplaceSchemaDefinitionCommand_20": function () { return new ReplaceSchemaDefinitionCommand_20(null, null); },
    "ReplaceSchemaDefinitionCommand_30": function () { return new ReplaceSchemaDefinitionCommand_30(null, null); },
};
var MarshallUtils = (function () {
    function MarshallUtils() {
    }
    /**
     * Marshalls the given command into a JS object and returns it.
     * @param {ICommand} command
     */
    MarshallUtils.marshallCommand = function (command) {
        var obj = command.marshall();
        return obj;
    };
    /**
     * Unmarshalls the given JS object into a command and returns it.
     * @param object
     * @return {ICommand}
     */
    MarshallUtils.unmarshallCommand = function (object) {
        var cmdType = object["__type"];
        var factory = commandFactory[cmdType];
        if (!factory) {
            throw new Error("No unmarshalling factory found for command type: " + cmdType);
        }
        var cmd = factory();
        cmd.unmarshall(object);
        return cmd;
    };
    /**
     * Marshalls the given node path into a JS string.
     * @param {OasNodePath} nodePath
     * @return {any}
     */
    MarshallUtils.marshallNodePath = function (nodePath) {
        if (ModelUtils.isNullOrUndefined(nodePath)) {
            return null;
        }
        return nodePath.toString();
    };
    /**
     * Unmarshalls a node path back into an instance of OasNodePath.
     * @param path
     * @return {OasNodePath}
     */
    MarshallUtils.unmarshallNodePath = function (path) {
        if (ModelUtils.isNullOrUndefined(path)) {
            return null;
        }
        var nodePath = new oaiTsCore.OasNodePath(path);
        return nodePath;
    };
    /**
     * Marshalls the given simple type into a JS object.
     * @param {SimplifiedType} sType
     * @return {any}
     */
    MarshallUtils.marshallSimplifiedType = function (sType) {
        if (ModelUtils.isNullOrUndefined(sType)) {
            return null;
        }
        var obj = {
            type: sType.type,
            of: MarshallUtils.marshallSimplifiedType(sType.of),
            as: sType.as
        };
        return obj;
    };
    /**
     * Unmarshalls a simple type back into a JS object.
     * @param object
     * @return {SimplifiedType}
     */
    MarshallUtils.unmarshallSimplifiedType = function (object) {
        if (ModelUtils.isNullOrUndefined(object)) {
            return null;
        }
        var type = new SimplifiedType();
        type.type = object.type;
        type.of = MarshallUtils.unmarshallSimplifiedType(object.of);
        type.as = object.as;
        return type;
    };
    /**
     * Marshalls the given simple type into a JS object.
     * @param {SimplifiedParameterType} sType
     * @return {any}
     */
    MarshallUtils.marshallSimplifiedParameterType = function (sType) {
        if (ModelUtils.isNullOrUndefined(sType)) {
            return null;
        }
        var obj = {
            type: sType.type,
            of: MarshallUtils.marshallSimplifiedType(sType.of),
            as: sType.as,
            required: sType.required
        };
        return obj;
    };
    /**
     * Unmarshalls a simple parameter type back into a JS object.
     * @param object
     * @return {SimplifiedType}
     */
    MarshallUtils.unmarshallSimplifiedParameterType = function (object) {
        if (ModelUtils.isNullOrUndefined(object)) {
            return null;
        }
        var type = new SimplifiedParameterType();
        type.type = object.type;
        type.of = MarshallUtils.unmarshallSimplifiedType(object.of);
        type.as = object.as;
        type.required = object.required;
        return type;
    };
    /**
     * Marshalls the given simple type into a JS object.
     * @param {SimplifiedPropertyType} sType
     * @return {any}
     */
    MarshallUtils.marshallSimplifiedPropertyType = function (sType) {
        if (ModelUtils.isNullOrUndefined(sType)) {
            return null;
        }
        var obj = {
            type: sType.type,
            of: MarshallUtils.marshallSimplifiedType(sType.of),
            as: sType.as,
            required: sType.required
        };
        return obj;
    };
    /**
     * Unmarshalls a simple parameter type back into a JS object.
     * @param object
     * @return {SimplifiedType}
     */
    MarshallUtils.unmarshallSimplifiedPropertyType = function (object) {
        if (ModelUtils.isNullOrUndefined(object)) {
            return null;
        }
        var type = new SimplifiedPropertyType();
        type.type = object.type;
        type.of = MarshallUtils.unmarshallSimplifiedType(object.of);
        type.as = object.as;
        type.required = object.required;
        return type;
    };
    return MarshallUtils;
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

exports.AbstractCommand = AbstractCommand;
exports.ModelUtils = ModelUtils;
exports.MarshallUtils = MarshallUtils;
exports.SimplifiedType = SimplifiedType;
exports.SimplifiedParameterType = SimplifiedParameterType;
exports.SimplifiedPropertyType = SimplifiedPropertyType;
exports.createAddPathItemCommand = createAddPathItemCommand;
exports.AddPathItemCommand = AddPathItemCommand;
exports.AddPathItemCommand_20 = AddPathItemCommand_20;
exports.AddPathItemCommand_30 = AddPathItemCommand_30;
exports.createAddSchemaDefinitionCommand = createAddSchemaDefinitionCommand;
exports.AddSchemaDefinitionCommand = AddSchemaDefinitionCommand;
exports.AddSchemaDefinitionCommand_20 = AddSchemaDefinitionCommand_20;
exports.AddSchemaDefinitionCommand_30 = AddSchemaDefinitionCommand_30;
exports.createChangeContactCommand = createChangeContactCommand;
exports.ChangeContactCommand = ChangeContactCommand;
exports.ChangeContactCommand_20 = ChangeContactCommand_20;
exports.ChangeContactCommand_30 = ChangeContactCommand_30;
exports.createChangeDescriptionCommand = createChangeDescriptionCommand;
exports.ChangeDescriptionCommand = ChangeDescriptionCommand;
exports.ChangeDescriptionCommand_20 = ChangeDescriptionCommand_20;
exports.ChangeDescriptionCommand_30 = ChangeDescriptionCommand_30;
exports.createChangeLicenseCommand = createChangeLicenseCommand;
exports.ChangeLicenseCommand = ChangeLicenseCommand;
exports.ChangeLicenseCommand_20 = ChangeLicenseCommand_20;
exports.ChangeLicenseCommand_30 = ChangeLicenseCommand_30;
exports.createChangeMediaTypeTypeCommand = createChangeMediaTypeTypeCommand;
exports.ChangeMediaTypeTypeCommand = ChangeMediaTypeTypeCommand;
exports.createChangeParameterTypeCommand = createChangeParameterTypeCommand;
exports.createChangeParameterDefinitionTypeCommand = createChangeParameterDefinitionTypeCommand;
exports.ChangeParameterTypeCommand = ChangeParameterTypeCommand;
exports.ChangeParameterTypeCommand_20 = ChangeParameterTypeCommand_20;
exports.ChangeParameterDefinitionTypeCommand_20 = ChangeParameterDefinitionTypeCommand_20;
exports.ChangeParameterTypeCommand_30 = ChangeParameterTypeCommand_30;
exports.ChangeParameterDefinitionTypeCommand_30 = ChangeParameterDefinitionTypeCommand_30;
exports.createChangePropertyCommand = createChangePropertyCommand;
exports.ChangePropertyCommand = ChangePropertyCommand;
exports.ChangePropertyCommand_20 = ChangePropertyCommand_20;
exports.ChangePropertyCommand_30 = ChangePropertyCommand_30;
exports.createChangePropertyTypeCommand = createChangePropertyTypeCommand;
exports.ChangePropertyTypeCommand = ChangePropertyTypeCommand;
exports.ChangePropertyTypeCommand_20 = ChangePropertyTypeCommand_20;
exports.ChangePropertyTypeCommand_30 = ChangePropertyTypeCommand_30;
exports.createChangeResponseTypeCommand = createChangeResponseTypeCommand;
exports.createChangeResponseDefinitionTypeCommand = createChangeResponseDefinitionTypeCommand;
exports.ChangeResponseTypeCommand_20 = ChangeResponseTypeCommand_20;
exports.ChangeResponseDefinitionTypeCommand_20 = ChangeResponseDefinitionTypeCommand_20;
exports.createChangeSecuritySchemeCommand = createChangeSecuritySchemeCommand;
exports.ChangeSecuritySchemeCommand = ChangeSecuritySchemeCommand;
exports.ChangeSecuritySchemeCommand_20 = ChangeSecuritySchemeCommand_20;
exports.ChangeSecuritySchemeCommand_30 = ChangeSecuritySchemeCommand_30;
exports.createChangeTitleCommand = createChangeTitleCommand;
exports.ChangeTitleCommand = ChangeTitleCommand;
exports.ChangeTitleCommand_20 = ChangeTitleCommand_20;
exports.ChangeTitleCommand_30 = ChangeTitleCommand_30;
exports.createChangeVersionCommand = createChangeVersionCommand;
exports.ChangeVersionCommand = ChangeVersionCommand;
exports.ChangeVersionCommand_20 = ChangeVersionCommand_20;
exports.ChangeVersionCommand_30 = ChangeVersionCommand_30;
exports.createDeleteAllParametersCommand = createDeleteAllParametersCommand;
exports.DeleteAllParametersCommand = DeleteAllParametersCommand;
exports.DeleteAllParametersCommand_20 = DeleteAllParametersCommand_20;
exports.DeleteAllParametersCommand_30 = DeleteAllParametersCommand_30;
exports.createDeleteAllPropertiesCommand = createDeleteAllPropertiesCommand;
exports.DeleteAllPropertiesCommand = DeleteAllPropertiesCommand;
exports.DeleteAllPropertiesCommand_20 = DeleteAllPropertiesCommand_20;
exports.DeleteAllPropertiesCommand_30 = DeleteAllPropertiesCommand_30;
exports.createDeleteAllResponsesCommand = createDeleteAllResponsesCommand;
exports.AbstractDeleteAllResponsesCommand = AbstractDeleteAllResponsesCommand;
exports.DeleteAllResponsesCommand_20 = DeleteAllResponsesCommand_20;
exports.DeleteAllResponsesCommand_30 = DeleteAllResponsesCommand_30;
exports.createDeleteContactCommand = createDeleteContactCommand;
exports.AbstractDeleteContactCommand = AbstractDeleteContactCommand;
exports.DeleteContactCommand_20 = DeleteContactCommand_20;
exports.DeleteContactCommand_30 = DeleteContactCommand_30;
exports.createDeleteLicenseCommand = createDeleteLicenseCommand;
exports.AbstractDeleteLicenseCommand = AbstractDeleteLicenseCommand;
exports.DeleteLicenseCommand_20 = DeleteLicenseCommand_20;
exports.DeleteLicenseCommand_30 = DeleteLicenseCommand_30;
exports.createDeleteMediaTypeCommand = createDeleteMediaTypeCommand;
exports.DeleteMediaTypeCommand = DeleteMediaTypeCommand;
exports.DeleteNodeCommand = DeleteNodeCommand;
exports.createDeleteOperationCommand = createDeleteOperationCommand;
exports.AbstractDeleteOperationCommand = AbstractDeleteOperationCommand;
exports.DeleteOperationCommand_20 = DeleteOperationCommand_20;
exports.DeleteOperationCommand_30 = DeleteOperationCommand_30;
exports.createDeleteParameterCommand = createDeleteParameterCommand;
exports.DeleteParameterCommand = DeleteParameterCommand;
exports.DeleteParameterCommand_20 = DeleteParameterCommand_20;
exports.DeleteParameterCommand_30 = DeleteParameterCommand_30;
exports.createDeletePathCommand = createDeletePathCommand;
exports.DeletePathCommand = DeletePathCommand;
exports.DeletePathCommand_20 = DeletePathCommand_20;
exports.DeletePathCommand_30 = DeletePathCommand_30;
exports.createDeletePropertyCommand = createDeletePropertyCommand;
exports.DeletePropertyCommand = DeletePropertyCommand;
exports.DeletePropertyCommand_20 = DeletePropertyCommand_20;
exports.DeletePropertyCommand_30 = DeletePropertyCommand_30;
exports.createDeleteRequestBodyCommand = createDeleteRequestBodyCommand;
exports.DeleteRequestBodyCommand_30 = DeleteRequestBodyCommand_30;
exports.createDeleteResponseCommand = createDeleteResponseCommand;
exports.DeleteResponseCommand = DeleteResponseCommand;
exports.DeleteResponseCommand_20 = DeleteResponseCommand_20;
exports.DeleteResponseCommand_30 = DeleteResponseCommand_30;
exports.createDeleteSchemaDefinitionCommand = createDeleteSchemaDefinitionCommand;
exports.DeleteSchemaDefinitionCommand = DeleteSchemaDefinitionCommand;
exports.DeleteSchemaDefinitionCommand_20 = DeleteSchemaDefinitionCommand_20;
exports.DeleteSchemaDefinitionCommand_30 = DeleteSchemaDefinitionCommand_30;
exports.createDeleteSecuritySchemeCommand = createDeleteSecuritySchemeCommand;
exports.DeleteSecuritySchemeCommand = DeleteSecuritySchemeCommand;
exports.DeleteSecuritySchemeCommand_20 = DeleteSecuritySchemeCommand_20;
exports.DeleteSecuritySchemeCommand_30 = DeleteSecuritySchemeCommand_30;
exports.createDeleteTagCommand = createDeleteTagCommand;
exports.DeleteTagCommand = DeleteTagCommand;
exports.DeleteTagCommand_20 = DeleteTagCommand_20;
exports.DeleteTagCommand_30 = DeleteTagCommand_30;
exports.createNewMediaTypeCommand = createNewMediaTypeCommand;
exports.NewMediaTypeCommand = NewMediaTypeCommand;
exports.createNewOperationCommand = createNewOperationCommand;
exports.NewOperationCommand = NewOperationCommand;
exports.NewOperationCommand_20 = NewOperationCommand_20;
exports.NewOperationCommand_30 = NewOperationCommand_30;
exports.createNewParamCommand = createNewParamCommand;
exports.NewParamCommand = NewParamCommand;
exports.NewParamCommand_20 = NewParamCommand_20;
exports.NewParamCommand_30 = NewParamCommand_30;
exports.createNewPathCommand = createNewPathCommand;
exports.NewPathCommand = NewPathCommand;
exports.NewPathCommand_20 = NewPathCommand_20;
exports.NewPathCommand_30 = NewPathCommand_30;
exports.createNewRequestBodyCommand = createNewRequestBodyCommand;
exports.NewRequestBodyCommand = NewRequestBodyCommand;
exports.NewRequestBodyCommand_20 = NewRequestBodyCommand_20;
exports.NewRequestBodyCommand_30 = NewRequestBodyCommand_30;
exports.createNewResponseCommand = createNewResponseCommand;
exports.NewResponseCommand = NewResponseCommand;
exports.NewResponseCommand_20 = NewResponseCommand_20;
exports.NewResponseCommand_30 = NewResponseCommand_30;
exports.createNewSchemaDefinitionCommand = createNewSchemaDefinitionCommand;
exports.NewSchemaDefinitionCommand = NewSchemaDefinitionCommand;
exports.NewSchemaDefinitionCommand_20 = NewSchemaDefinitionCommand_20;
exports.NewSchemaDefinitionCommand_30 = NewSchemaDefinitionCommand_30;
exports.createNewSchemaPropertyCommand = createNewSchemaPropertyCommand;
exports.NewSchemaPropertyCommand = NewSchemaPropertyCommand;
exports.NewSchemaPropertyCommand_20 = NewSchemaPropertyCommand_20;
exports.NewSchemaPropertyCommand_30 = NewSchemaPropertyCommand_30;
exports.createNewSecuritySchemeCommand = createNewSecuritySchemeCommand;
exports.NewSecuritySchemeCommand = NewSecuritySchemeCommand;
exports.NewSecuritySchemeCommand_20 = NewSecuritySchemeCommand_20;
exports.NewSecuritySchemeCommand_30 = NewSecuritySchemeCommand_30;
exports.createNewTagCommand = createNewTagCommand;
exports.NewTagCommand = NewTagCommand;
exports.NewTagCommand_20 = NewTagCommand_20;
exports.NewTagCommand_30 = NewTagCommand_30;
exports.ReplaceNodeCommand = ReplaceNodeCommand;
exports.createReplaceOperationCommand = createReplaceOperationCommand;
exports.AbstractReplaceOperationCommand = AbstractReplaceOperationCommand;
exports.ReplaceOperationCommand_20 = ReplaceOperationCommand_20;
exports.ReplaceOperationCommand_30 = ReplaceOperationCommand_30;
exports.createReplacePathItemCommand = createReplacePathItemCommand;
exports.AbstractReplacePathItemCommand = AbstractReplacePathItemCommand;
exports.ReplacePathItemCommand_20 = ReplacePathItemCommand_20;
exports.ReplacePathItemCommand_30 = ReplacePathItemCommand_30;
exports.createReplaceSchemaDefinitionCommand = createReplaceSchemaDefinitionCommand;
exports.ReplaceSchemaDefinitionCommand_20 = ReplaceSchemaDefinitionCommand_20;
exports.ReplaceSchemaDefinitionCommand_30 = ReplaceSchemaDefinitionCommand_30;

Object.defineProperty(exports, '__esModule', { value: true });

})));
