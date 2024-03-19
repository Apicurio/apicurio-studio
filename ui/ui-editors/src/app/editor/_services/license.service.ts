/**
 * @license
 * Copyright 2022 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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

var LICENSE_DATA = [
    {
        id: "agpl-3.0",
        name: "GNU AGPLv3",
        fullName: "GNU Affero General Public License v3.0",
        description: "Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.",
        url: "https://www.gnu.org/licenses/agpl.txt",
        urls: [
            "https://www.gnu.org/licenses/agpl.html",
            "https://www.gnu.org/licenses/agpl.txt",
            "https://www.gnu.org/licenses/agpl.dbk",
            "https://www.gnu.org/licenses/agpl.texi",
            "https://www.gnu.org/licenses/agpl.tex",
            "https://www.gnu.org/licenses/agpl.md",
            "https://www.gnu.org/licenses/agpl.odt",
            "https://www.gnu.org/licenses/agpl.rtf"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/agpl-3.0/",
        permissions: [
            "commercial_use", "distribution", "modification", "patent_use", "private_use"
        ],
        conditions: [
            "disclose_source", "license_and_copyright_notice", "network_use_is_distribution", "same_license", "state_changes"
        ],
        limitations: [
            "liability", "warranty"
        ]
    },

    {
        id: "gpl-3.0",
        name: "GNU GPLv3",
        fullName: "GNU General Public License v3.0",
        description: "Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.",
        url: "https://www.gnu.org/licenses/gpl.txt",
        urls: [
            "https://www.gnu.org/licenses/gpl.html",
            "https://www.gnu.org/licenses/gpl.txt",
            "https://www.gnu.org/licenses/gpl.dbk",
            "https://www.gnu.org/licenses/gpl.texi",
            "https://www.gnu.org/licenses/gpl.tex",
            "https://www.gnu.org/licenses/gpl.md",
            "https://www.gnu.org/licenses/gpl.odt",
            "https://www.gnu.org/licenses/gpl.rtf"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/gpl-3.0/",
        permissions: [
            "commercial_use", "distribution", "modification", "patent_use", "private_use"
        ],
        conditions: [
            "disclose_source", "license_and_copyright_notice", "same_license", "state_changes"
        ],
        limitations: [
            "liability", "warranty"
        ]
    },

    {
        id: "lgpl-3.0",
        name: "GNU LGPLv3",
        fullName: "GNU Lesser General Public License v3.0",
        description: "Permissions of this copyleft license are conditioned on making available complete source code of licensed works and modifications under the same license or the GNU GPLv3. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work through interfaces provided by the licensed work may be distributed under different terms and without source code for the larger work.",
        url: "https://www.gnu.org/licenses/lgpl.txt",
        urls: [
            "https://www.gnu.org/licenses/lgpl.html",
            "https://www.gnu.org/licenses/lgpl.txt",
            "https://www.gnu.org/licenses/lgpl.dbk",
            "https://www.gnu.org/licenses/lgpl.texi",
            "https://www.gnu.org/licenses/lgpl.tex",
            "https://www.gnu.org/licenses/lgpl.md",
            "https://www.gnu.org/licenses/lgpl.odt",
            "https://www.gnu.org/licenses/lgpl.rtf"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/lgpl-3.0/",
        permissions: [
            "commercial_use", "distribution", "modification", "patent_use", "private_use"
        ],
        conditions: [
            "disclose_source", "license_and_copyright_notice", "same_license_library", "state_changes"
        ],
        limitations: [
            "liability", "warranty"
        ]
    },

    {
        id: "mpl-2.0",
        name: "Mozilla 2.0",
        fullName: "Mozilla Public License 2.0",
        description: "Permissions of this weak copyleft license are conditioned on making available source code of licensed files and modifications of those files under the same license (or in certain cases, one of the GNU licenses). Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work may be distributed under different terms and without source code for files added in the larger work.",
        url: "https://www.mozilla.org/en-US/MPL/2.0/",
        urls: [
            "https://www.mozilla.org/en-US/MPL/2.0/",
            "https://www.mozilla.org/media/MPL/2.0/index.815ca599c9df.txt"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/mpl-2.0/",
        permissions: [
            "commercial_use", "distribution", "modification", "patent_use", "private_use"
        ],
        conditions: [
            "disclose_source", "license_and_copyright_notice", "same_license_file"
        ],
        limitations: [
            "liability", "trademark_use", "warranty"
        ]
    },

    {
        id: "apache-2.0",
        name: "Apache 2.0",
        fullName: "Apache License 2.0",
        description: "A permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights. Licensed works, modifications, and larger works may be distributed under different terms and without source code.",
        url: "https://www.apache.org/licenses/LICENSE-2.0",
        urls: [
            "https://www.apache.org/licenses/LICENSE-2.0",
            "https://www.apache.org/licenses/LICENSE-2.0.txt",
            "http://www.apache.org/licenses/LICENSE-2.0.html"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/apache-2.0/",
        permissions: [
            "commercial_use", "distribution", "modification", "patent_use", "private_use"
        ],
        conditions: [
            "license_and_copyright_notice", "state_changes"
        ],
        limitations: [
            "liability", "trademark_use", "warranty"
        ]
    },

    {
        id: "mit",
        name: "MIT License",
        fullName: "MIT License",
        description: "A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.",
        url: "https://opensource.org/licenses/MIT",
        urls: [
            "https://opensource.org/licenses/MIT"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/mit/",
        permissions: [
            "commercial_use", "distribution", "modification", "private_use"
        ],
        conditions: [
            "license_and_copyright_notice"
        ],
        limitations: [
            "liability", "warranty"
        ]
    },

    {
        id: "unlicense",
        name: "The Unlicense",
        fullName: "The Unlicense",
        description: "A license with no conditions whatsoever which dedicates works to the public domain. Unlicensed works, modifications, and larger works may be distributed under different terms and without source code.",
        url: "http://unlicense.org",
        urls: [
            "http://unlicense.org"
        ],
        moreInfoUrl: "https://choosealicense.com/licenses/unlicense/",
        permissions: [
            "commercial_use", "distribution", "modification", "private_use"
        ],
        conditions: [],
        limitations: [
            "liability", "warranty"
        ]
    }

];

var PERMISSIONS = {
    "commercial_use": {
        "name": "Commercial Use",
        "description": "This software and derivatives may be used for commercial purposes."
    },
    "distribution": {"name": "Distribution", "description": "You may distribute this software."},
    "modification": {"name": "Modification", "description": "This software may be modified."},
    "patent_use": {
        "name": "Patent Use",
        "description": "This license provides an express grant of patent rights from the contributor to the recipient."
    },
    "private_use": {
        "name": "Private Use",
        "description": "You may use and modify the software without distributing it."
    }
};

var CONDITIONS = {
    "disclose_source": {
        "name": "Disclose source",
        "description": "Source code must be made available when distributing the software."
    },
    "license_and_copyright_notice": {
        "name": "License and copyright notice",
        "description": "Include a copy of the license and copyright notice with the software."
    },
    "network_use_is_distribution": {
        "name": "Network use is distribution",
        "description": "Users who interact with the software via network are given the right to receive a copy of the corresponding source code."
    },
    "same_license": {
        "name": "Same License",
        "description": "Modifications must be released under the same license when distributing the software. In some cases a similar or related license may be used."
    },
    "same_license_library": {
        "name": "Same License (library)",
        "description": "Modifications must be released under the same license when distributing the software. In some cases a similar or related license may be used, or this condition may not apply to works that use the software as a library."
    },
    "same_license_file": {
        "name": "Same License (file)",
        "description": "Modifications of existing files must be released under the same license when distributing the software. In some cases a similar or related license may be used."
    },
    "state_changes": {"name": "State changes", "description": "Indicate changes made to the code."}
};

var LIMITATIONS = {
    "liability": {"name": "Liability", "description": "This license includes a limitation of liability."},
    "trademark_use": {
        "name": "Trademark use",
        "description": "This license explicitly states that it does NOT grant you trademark rights, even though licenses without such a statement probably do not grant you any implicit trademark rights."
    },
    "warranty": {
        "name": "Warranty",
        "description": "The license explicitly states that it does NOT provide any warranty."
    }
};

export interface ILicense {
    id: string;
    name: string;
    fullName: string;
    description: string;
    url: string;
    moreInfoUrl: string;
    permissions: string[];
    conditions: string[];
    limitations: string[];
}

/**
 * A simple service providing convenient access to information about different
 * licenses commonly used to license APIs.
 */
@Injectable()
export class LicenseService {

    /**
     * Returns a list of all licenses.
     *
     */
    public getLicenses(): ILicense[] {
        return LICENSE_DATA;
    }

    /**
     * Resolves a permission code into a name.
     * @param permission
     */
    public permissionName(permission: string): string {
        return PERMISSIONS[permission].name;
    }

    /**
     * Resolves a permission code into a description.
     * @param permission
     */
    public permissionDescription(permission: string): string {
        return PERMISSIONS[permission].description;
    }

    /**
     * Resolves a condition code into a name.
     * @param condition
     */
    public conditionName(condition: string): string {
        return CONDITIONS[condition].name;
    }

    /**
     * Resolves a condition code into a description.
     * @param condition
     */
    public conditionDescription(condition: string): string {
        return CONDITIONS[condition].description;
    }

    /**
     * Resolves a limitation code into a name.
     * @param limitation
     */
    public limitationName(limitation: string): string {
        return LIMITATIONS[limitation].name;
    }

    /**
     * Resolves a limitation code into a description.
     * @param limitation
     */
    public limitationDescription(limitation: string): string {
        return LIMITATIONS[limitation].description;
    }

    /**
     * Finds a license by its URL.  Multiple URLs may resolve to the same
     * license.
     * @param url
     * @return
     */
    public findLicense(url: string): ILicense {
        for (let license of LICENSE_DATA) {
            if (license.urls.indexOf(url) > -1) {
                return license;
            }
        }
        return null;
    }

}
