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


import {Injectable} from "@angular/core";
import {OasValidationError} from "oai-ts-core";



var PROBLEM_EXPLANATIONS = {

    "CTC-001" : "If a URL is specified for the Contact information, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!",
    "CTC-002" : "If an email address is specified for the Contact, it must be a valid email format.  Make sure the value supplied is formatted properly.",
    "ED-002" : "The description of the External Documentation must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).",
    "ED-003" : "If a URL is specified for the External Documentation, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!",
    "HEAD-005" : "The default value provided for the Header does not match its type.  For example, if the type of the Header is \"integer\", any default value must actually be a valid integer.",
    "INF-003" : "The description of the API must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).",
    "IT-007" : "The default value provided for the parameter's items does not match its type.  For example, if the type of the type is \"integer\", any default value must actually be a valid integer.",
    "LIC-002" : "If a URL is specified for the License, it must be a valid URL format.  Double check the value of the URL and make sure there isn't a typo!",
    "OP-002" : "The description of the Operation must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).",
    "OP-005" : "When you indicate that an Operation consumes a particular type of data, you must provide a valid mime-type.  Examples of valid mime types include:  text/plain, application/json, application/x-www-form-urlencoded.",
    "OP-006" : "When you indicate that an Operation produces a particular type of data, you must provide a valid mime-type.  Examples of valid mime types include:  text/plain, application/json, application/pdf.",
    "PAR-010" : "The description of the Parameter must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).",
    "R-004" : "The provided Host information was invalid.  Only the host name (and optionally port) should be included.  An IP address is not allowed, nor is a URL.  Examples of a valid host include \"localhost\", \"api.example.org\", and \"api.example.org:8080\".",
    "R-005" : "When providing a Base Path for the API, it must start with a '/' character.  The Base Path is appended to the Scheme and Host information to form a full URL to the API.",
    "SS-011" : "An OAuth Security Scheme defintion may include an \"Authorization URL\".  When included, it must be a valid URL format (including scheme, host, port, and path).",
    "SS-012" : "An OAuth Security Scheme defintion may include a \"Token URL\".  When included, it must be a valid URL format (including scheme, host, port, and path).",
    "TAG-002" : "The description of the Tag must be in either plain text or Github-Flavored Markdown format.  Have a look at the value to make sure it's not something else (asciidoc, html, etc...).",
    "XML-001" : "When defining the XML format of a definition, the Namespace must be a valid XML URI/URL.  Check the value and make sure it's a valid XML Namespace URL format.",
    "EX-001" : "When defining examples for an Operation Response, each example must correspond to one of the mime-types defined by the Operation.  Note that the Operation can declare its own mime-types (via the \"produces\" property of the Operation) OR it can inherit the mime-types from the API's global \"produces\" property.",
    "PATH-005" : "Every path defined by the API must begin with a '/' character.  Paths are appended to the API URL to uniquely identify an endpoint for the API.",
    "PDEF-001" : "",
    "RDEF-001" : "",
    "RES-003" : "All Responses declared for an Operation must correspond to a valid HTTP response status code.  Valid status codes are things like 200, 404, 500.  A full list of status codes can be found here:  https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml",
    "SCPS-001" : "",
    "SDEF-001" : "",
    "SS-013" : "",
    "HEAD-003" : "When declaring a Header you must identify the Header's type.  Valid types for Headers include: string, number, integer, boolean, array.  Any other value (or no value at all) is not allowed.",
    "HEAD-004" : "When declaring a Header, the Header type can be further refined by indicating a \"format\".  Valid formats for Headers include: int32, int64, float, double, byte, binary, date, date-time, passworld.  Not all formats are valid for all types.  For more detailed information go here:  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat",
    "HEAD-006" : "Only Headers that are defined as Array type can specify a Collection Format.  For other types (such as string or number) the collection format does not make sense (as these types are not collections).",
    "HEAD-007" : "When indicating a Collection Format for a Header, the only valid values are: csv, ssv, tsv, pipes",
    "IT-003" : "For Parameters that are of type \"array\", the declarating of the Parameter's Items must indicate a type.  This is required so that consumers know what type of data each item of the array must be.  Valid values are: string, number, integer, boolean, array",
    "IT-004" : "When defining the type of an array-type parameter's items, the type can be further refined by indicating a \"format\".  Valid formats for parameter Items include: int32, int64, float, double, byte, binary, date, date-time, passworld.  Not all formats are valid for all types.  For more detailed information go here:  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat",
    "IT-005" : "When indicating a Collection Format for an array-style Parameter, the only valid values are: csv, ssv, tsv, pipes",
    "IT-006" : "Only Parameters that are defined as Array type can specify a Collection Format.  For other types (such as string or number) the collection format does not make sense (as these types are not collections).",
    "OP-001" : "When defining a summary for an Operation, it should be short and descriptive, limited to 120 characters.",
    "OP-004" : "Every operation may optionally have an operationId property.  If declared, it should follow standard software programming style (e.g. camelCase).  It must also be unique over all Operations in the API.",
    "OP-010" : "When declaring the valid schemes for an Operation, the only valid options are:  http, https, ws, wss",
    "PAR-007" : "All Path Parameters must have a name that maps to one of the dynamic elements of the path's template.  For example, if the path template is \"/items/{itemId}/widgets/{widgetId}\" then the only valid values for Path Paramter names are \"itemId\" and \"widgetId\".",
    "PAR-008" : "When using Form Data as the input to an Operation, the Operation must indicate that it can consume form data by listing either \"application/x-www-form-urlencoded\" or \"multipart/form-data\" in its list of Consumes mime-types.",
    "PAR-009" : "Every parameter must be located in one of the following locations:  URL Query Params, HTTP Headers, the Path Template, Form Data, or the HTTP Request Body.  Therefore, the \"in\" property for any Parameter must be one of:  query, header, path, formData, body.  Make sure your parameter doesn't mistakenly indicate some other value.",
    "PAR-011" : "When declaring a Parameter you must identify its type.  Valid types for Parameters include: string, number, integer, boolean, array, file.  Any other value (or no value at all) is not allowed.",
    "PAR-012" : "When defining a Parameter's type, it can be further refined by indicating a \"format\".  Valid formats for parameters include: int32, int64, float, double, byte, binary, date, date-time, passworld.  Not all formats are valid for all types.  For more detailed information go here:  https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat",
    "PAR-013" : "You can only indicate that empty values are allowed for Parameters that are in the query or in form data.  Other parameters (such as in headers or in the path) cannot be empty.",
    "PAR-014" : "Only Parameters that are defined as Array type can specify a Collection Format.  For other types (such as string or number) the collection format does not make sense (as these types are not collections).",
    "PAR-015" : "When indicating a Collection Format for an array-style Parameter, the only valid values are: csv, ssv, tsv, pipes, multi",
    "PAR-016" : "When specifying \"multi\" as the collection format for a Parameter, the Parameter must be either a Query Param or a Parameter in the Form Data.  This is because only those types of parameters support passing multiple values for a single name.",
    "PAR-017" : "If a Parameter is marked as \"required\", then no default value is allowed.  Because a default value is only used when the API consumer invokes the Operation without the Parameter, default values don't make sense for required Parameters.",
    "R-006" : "When indicating the default schemes supported by the API, only the following are valid choices: http, https, ws, wss",
    "R-007" : "When indicating the default data formats that the API consumes, the values must be valid mime-types.  Examples of valid mime types include:  text/plain, application/json, application/x-www-form-urlencoded.",
    "R-008" : "When indicating the default data formats that the API produces, the values must be valid mime-types.  Examples of valid mime types include:  text/plain, application/json, application/pdf.",
    "SREQ-002" : "Security Requirements can be specified for basic, apiKey, or oauth.  When using basic or apiKey authentication, the security requirement must NOT provide a list of scopes (the list of scopes must be empty).  In other words, scopes are only valid when using OAuth 2 authentication.",
    "SREQ-003" : "Security Requirements can be specified for basic, apiKey, or oauth.  When using OAuth 2 authentication, the security requirement MUST provide the list of scopes required for the caller to successfully access the API.",
    "SS-008" : "The OpenAPI specification only supports the following authentication types:  Basic, API Key, and OAuth 2.  Any other authentication types are not valid.  As a result, the value of \"in\" for a Security Scheme must be one of: basic, apiKey, oauth2",
    "SS-009" : "The only valid values for the \"in\" property of a Security Schema are: query, header.  This property indicates where in the Request the security token can be found (either in HTTP Request Headers or in the URL Query Parameters).",
    "SS-010" : "When using OAuth 2 authentication, the OAuth flow must be defined and it must be one of the possible supported OAuth flows.  The supported flows are:  implicit, password, application, and accessCode",
    "XML-002" : "When defining the XML representation of a definition, one of the options is to declare an element must be wrapped (by another XML element).  However, this is only relevant for \"array\" type properties, since array properties may have multiple values that should be contained within a parent (wrapper) XML element.",
    "PAR-018" : "The definition of the Parameter attempts to reference a Parameter found elsewhere (typically globally declared in the same API document) but the reference could not be resolved.  Perhaps the global Parameter was deleted, or there is a typo in the reference.",
    "PATH-001" : "A Path Item was defined as a reference to an external document, but that document could not be found  (or the referenced Path Item within it could not be found).",
    "RES-002" : "The definition of the Response attempts to reference a Response found elsewhere (typically globally declared in the same API document) but the reference could not be resolved.  Perhaps the global Response was deleted, or there is a typo in the reference.",
    "SCH-001" : "The definition of the Schema attempts to reference a type Definition found elsewhere (typically globally declared in the same API document) but the reference could not be resolved.  Perhaps the global Definition was deleted, or there is a typo in the reference.",
    "SREQ-001" : "The names of each security requirement declared for an Operation (or declared globally) must match the name of a globally defined Security Scheme.  Check to make sure that the names of the requirement match up with security schemes previously defined.",
    "OP-009" : "It is not possible to use Body and Form Data parameters in the same Operation.  These input types are mutually exclusive, since both are sent via the HTTP Request's body.",
    "PATH-004" : "It is not possible to use Body and Form Data parameters in the same Operation.  These input types are mutually exclusive, since both are sent via the HTTP Request's body.",
    "ED-001" : "When defining your External Documentation, you must provide a URL!",
    "HEAD-001" : "You need to specify a type when defining a Header.  Valid Header types include: string, number, integer, boolean, array.",
    "INF-001" : "The API must have a title provided.",
    "INF-002" : "The API must have a version provided.",
    "IT-001" : "When defining the items of an array-type Parameter, the type of the items MUST be indicated.  Please make sure you define the type of items for your array-type Parameter.",
    "LIC-001" : "When including License information for the API, a Name of the License is required (cannot be blank).",
    "OP-007" : "When declaring an Operation (e.g. GET, PUT, POST, etc...) at least one Response MUST be included.  Typically at least a 20x (success) response should be defined.",
    "PAR-001" : "All Parameters, regardless of location (query, path, form data) MUST include a name.  Parameters are uniquely identified by the combination of \"in\" (what kind of parameter it is such as query or path) and \"name\".",
    "PAR-002" : "Every Parameter must indicate what kind it is, by providing a value for the \"in\" property.  Value values include: query, formData, path, body.",
    "R-001" : "Every OpenAPI (version 2.0) document MUST include the root \"swagger\" property, and its value MUST be \"2.0\".",
    "R-002" : "Every OpenAPI document MUST include some basic information such as Name and Version.  This meta-data is contained in an \"info\" root property.  Please make sure to add this information to the API.",
    "R-003" : "The OpenAPI document must have at least one path defined.  Without any paths, consumers have no endpoints/operations to invoke.  Make sure to add at least one Path.  For example:  \"/items/{itemId}\"",
    "RES-001" : "Every Response (in each Operation) must have a description.  Please make sure to add a helpful description to your Responses.",
    "SS-001" : "When defining a Security Scheme, a type must be provided.  Possible security scheme types include: basic, apiKey, oauth2",
    "TAG-001" : "Tags defined in the OpenAPI document must each have a name (and the name must be unique).  Please make sure each tag defined has a name.",
    "HEAD-002" : "Whenever a Header is declared to be of type \"array\", the array's items must also be identified.  This manifests as a \"items\" property in the specification.  Please make sure to indicate what type the Header's array items must be.",
    "IT-002" : "Whenever a Parameter is declared to be of type \"array\", the array's items must also be identified.  This manifests as a \"items\" property in the specification.  Please make sure to indicate what type the Parameter's array items must be.",
    "PAR-003" : "Path style Parameters (dynamic parameters found in the path template of an endpoint) are always required.  Therefore the \"required\" property must be included for all Path Parameters, and its value must be true.",
    "PAR-004" : "When declaring a request body style Parameter, a schema must be provided in order to declare the type of data expected in the body.",
    "PAR-005" : "You must define the type of the parameter!  Possible parameter types include string, number, integer, boolean, array.",
    "PAR-006" : "Whenever a Parameter is declared to be of type \"array\", the array's items must also be identified.  This manifests as a \"items\" property in the specification.  Please make sure to indicate what type the Parameter's array items must be.",
    "SS-002" : "When using API Key style authentication, the \"name\" property must be declared to indicate where to find the key information.  The API Key must be passed in the request, either in an HTTP Header or as a Query Parameter.  In both cases, the name of the Header or Parameter must be declared.",
    "SS-003" : "When using API Key style authentication, the \"name\" property must be declared to indicate where to find the key information.  The API Key must be passed in the request, either in an HTTP Header or as a Query Parameter.  Therefore, possible values are: query, header",
    "SS-004" : "When using OAuth 2 as the authentication style, the \"flow\" property must be defined.  This property is used to indicate the precise OAuth 2 flow supported by the API.  Valid values for this property are: implicit, password, application, accessCode",
    "SS-005" : "When using OAuth 2 authentication's Implicit or Access Code flows, you must provide a valid Authorization URL.  The Authorization URL is required in order to properly implement the Implicit or Access Code OAuth 2 flows.",
    "SS-006" : "When using OAuth 2 authentication's Password, Application, or Access Code flows, you must provide a valid Token URL.  The Token URL is required in order to properly implement any of these flows.",
    "SS-007" : "Whenever OAuth 2 is used as the authentication method, a set of scopes must be defined.  Make sure you have a list of scopes configured for all OAuth 2 security schemes.",
    "OP-003" : "Each operation may have an optional \"operationId\" defined for it.  This ID must be unique across all operations in the API.",
    "PAR-019" : "Parameters are uniquely defined by their \"name\" and their \"location\" (path, query, formData, etc).  You cannot have two Parameters with the same combination of name and location.  Please make sure that all of your parameters are appropriately unique based on these two criteria.",
    "PAR-020" : "Only a single \"body\" parameter may be defined for an Operation.  A body parameter indicates that the operation expects to receive input (typically some JSON data) in the body of the HTTP request.  Since there is only one request body, only one paramet of this type can be specified.",
    "TAG-003" : "It was found that two (or more) tags have the same name.  Every tag in the document must have a unique name (different from all other tag names)."

};



/**
 * A simple service providing information and functionality about validation problems.
 * This includes providing more information (explanation) about any given problem type
 * as well as "quick fix" functionality.
 */
@Injectable()
export class ProblemsService {

    /**
     * Returns a full human-readable explanation for the given validation problem or
     * null if it doesn't have more information about it.
     * @param problem
     */
    public explanation(problem: OasValidationError): string {
        let explanation: string = PROBLEM_EXPLANATIONS[problem.errorCode];
        if (!explanation) {
            explanation = "No additional information found.";
        }
        return explanation;
    }

}
