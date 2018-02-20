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

var HTTP_CODE_DATA = [
    { code: "100", line: "Continue" },
    { code: "101", line: "Switching Protocols" },
    { code: "102", line: "Processing" },
    { code: "200", line: "OK" },
    { code: "201", line: "Created" },
    { code: "202", line: "Accepted" },
    { code: "203", line: "Non_Authoritative" },
    { code: "204", line: "No Content" },
    { code: "205", line: "Reset Content" },
    { code: "206", line: "Partial Content" },
    { code: "207", line: "Multi-Status" },
    { code: "208", line: "Already Reported" },
    { code: "226", line: "IM Used" },
    { code: "300", line: "Multiple Choices" },
    { code: "301", line: "Moved Permanently" },
    { code: "302", line: "Found" },
    { code: "303", line: "See Other" },
    { code: "304", line: "Not Modified" },
    { code: "305", line: "Use Proxy" },
    { code: "306", line: "Switch Proxy" },
    { code: "307", line: "Temporary Redirect" },
    { code: "308", line: "Permanent Redirect" },
    { code: "400", line: "Bad Request" },
    { code: "401", line: "Unauthorized" },
    { code: "402", line: "Payment Required" },
    { code: "403", line: "Forbidden" },
    { code: "404", line: "Not Found" },
    { code: "405", line: "Method Not Allowed" },
    { code: "406", line: "Not Acceptable" },
    { code: "407", line: "Proxy Authentication Required" },
    { code: "408", line: "Request Time-Out" },
    { code: "409", line: "Conflict" },
    { code: "410", line: "Gone" },
    { code: "411", line: "Length Required" },
    { code: "412", line: "Precondition Failed" },
    { code: "413", line: "Payload Too Large" },
    { code: "414", line: "URI Too Long" },
    { code: "415", line: "Unsupported Media Type" },
    { code: "416", line: "Range Not Satisfiable" },
    { code: "417", line: "Expectation Failed" },
    { code: "418", line: "I'm a teapot!" },
    { code: "421", line: "Misdirected Request" },
    { code: "422", line: "Unprocessable Entity" },
    { code: "423", line: "Locked" },
    { code: "424", line: "Failed Dependency" },
    { code: "426", line: "Upgrade Required" },
    { code: "428", line: "Precondition Required" },
    { code: "429", line: "Too Many Requests" },
    { code: "431", line: "Request Header Fields Too Large" },
    { code: "451", line: "Unavailable For Legal Reasons" },
    { code: "500", line: "Internal Server Error" },
    { code: "501", line: "Not Implemented" },
    { code: "502", line: "Bad Gateway" },
    { code: "503", line: "Service Unavailable" },
    { code: "504", line: "Gateway Time-Out" },
    { code: "505", line: "HTTP Version Not Supported" },
    { code: "506", line: "Variant Also Negotiates" },
    { code: "507", line: "Insufficient Storage" },
    { code: "508", line: "Loop Detected" },
    { code: "510", line: "Not Extended" },
    { code: "511", line: "Network Authentication Required" }
];

export interface HttpCode {
    code: string;
    line: string;
}

/**
 * A simple service providing convenient access to information about HTTP
 * response codes.
 */
export class HttpCodeService {

    /**
     * Returns a list of all codes.
     */
    public getCodes(): HttpCode[] {
        return HTTP_CODE_DATA;
    }

    /**
     * Resolves a single code (returns the HttpCode object for a given response code).
     * @param code
     * @return {any}
     */
    public getCode(code: string): HttpCode {
        for (let c of this.getCodes()) {
            if (c.code === code) {
                return c;
            }
        }
        return null;
    }

}
