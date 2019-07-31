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

import {Injectable} from "@angular/core";
import {ApiDesignTemplate} from "../models/api-design-template.model";


/**
 * A service to manage a list of API Design templates that can be used when creating new
 * APIs.
 */
@Injectable()
export class TemplateService {

    private templates: ApiDesignTemplate[];

    constructor() {
        this.templates = this.loadTemplates();
    }

    private loadTemplates(): ApiDesignTemplate[] {
        return [
            {
                specVersion: "2.0",
                name: "Simple API",
                description: "Creates a very simple API with some basic settings that can be used as a starting point for your custom API.",
                content: SIMPLE_20
            },
            {
                specVersion: "2.0",
                name: "Pet Store Example",
                description: "Creates a standard/famous Swagger 2.0 Pet Store API sample.  Can be found here: https://petstore.swagger.io/v2/swagger.json",
                content: PET_STORE_20
            },
            {
                specVersion: "3.0.2",
                name: "Pet Store Example",
                description: "Creates a version of the classic Swagger Pet Store example but redesigned using OpenAPI 3!",
                content: PET_STORE_30
            },
            {
                specVersion: "3.0.2",
                name: "USPTO Dataset API",
                description: "Creates an API using the USPTO Data Set API (DSAPI) as a basis.",
                content: USPTO_30
            }
        ];
    }

    /**
     * Gets a list of templates for the given spec version.
     * @param specVersion
     */
    public getTemplates(specVersion: string): ApiDesignTemplate[] {
        let rval: ApiDesignTemplate[] = [];
        this.templates.forEach( template => {
            if (specVersion === template.specVersion) {
                rval.push(template);
            }
        });
        return rval;
    }


}

const PET_STORE_20 =
{
	"swagger": "2.0",
	"info": {
		"description": "This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key \`special-key\` to test the authorization filters.",
		"version": "1.0.0",
		"title": "Swagger Petstore",
		"termsOfService": "http://swagger.io/terms/",
		"contact": {
			"email": "apiteam@swagger.io"
		},
		"license": {
			"name": "Apache 2.0",
			"url": "http://www.apache.org/licenses/LICENSE-2.0.html"
		}
	},
	"host": "petstore.swagger.io",
	"basePath": "/v2",
	"tags": [{
		"name": "pet",
		"description": "Everything about your Pets",
		"externalDocs": {
			"description": "Find out more",
			"url": "http://swagger.io"
		}
	}, {
		"name": "store",
		"description": "Access to Petstore orders"
	}, {
		"name": "user",
		"description": "Operations about user",
		"externalDocs": {
			"description": "Find out more about our store",
			"url": "http://swagger.io"
		}
	}],
	"schemes": ["https", "http"],
	"paths": {
		"/pet": {
			"post": {
				"tags": ["pet"],
				"summary": "Add a new pet to the store",
				"description": "",
				"operationId": "addPet",
				"consumes": ["application/json", "application/xml"],
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"in": "body",
					"name": "body",
					"description": "Pet object that needs to be added to the store",
					"required": true,
					"schema": {
						"$ref": "#/definitions/Pet"
					}
				}],
				"responses": {
					"405": {
						"description": "Invalid input"
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}]
			},
			"put": {
				"tags": ["pet"],
				"summary": "Update an existing pet",
				"description": "",
				"operationId": "updatePet",
				"consumes": ["application/json", "application/xml"],
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"in": "body",
					"name": "body",
					"description": "Pet object that needs to be added to the store",
					"required": true,
					"schema": {
						"$ref": "#/definitions/Pet"
					}
				}],
				"responses": {
					"400": {
						"description": "Invalid ID supplied"
					},
					"404": {
						"description": "Pet not found"
					},
					"405": {
						"description": "Validation exception"
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}]
			}
		},
		"/pet/findByStatus": {
			"get": {
				"tags": ["pet"],
				"summary": "Finds Pets by status",
				"description": "Multiple status values can be provided with comma separated strings",
				"operationId": "findPetsByStatus",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "status",
					"in": "query",
					"description": "Status values that need to be considered for filter",
					"required": true,
					"type": "array",
					"items": {
						"type": "string",
						"enum": ["available", "pending", "sold"],
						"default": "available"
					},
					"collectionFormat": "multi"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"type": "array",
							"items": {
								"$ref": "#/definitions/Pet"
							}
						}
					},
					"400": {
						"description": "Invalid status value"
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}]
			}
		},
		"/pet/findByTags": {
			"get": {
				"tags": ["pet"],
				"summary": "Finds Pets by tags",
				"description": "Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
				"operationId": "findPetsByTags",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "tags",
					"in": "query",
					"description": "Tags to filter by",
					"required": true,
					"type": "array",
					"items": {
						"type": "string"
					},
					"collectionFormat": "multi"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"type": "array",
							"items": {
								"$ref": "#/definitions/Pet"
							}
						}
					},
					"400": {
						"description": "Invalid tag value"
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}],
				"deprecated": true
			}
		},
		"/pet/{petId}": {
			"get": {
				"tags": ["pet"],
				"summary": "Find pet by ID",
				"description": "Returns a single pet",
				"operationId": "getPetById",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "petId",
					"in": "path",
					"description": "ID of pet to return",
					"required": true,
					"type": "integer",
					"format": "int64"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/Pet"
						}
					},
					"400": {
						"description": "Invalid ID supplied"
					},
					"404": {
						"description": "Pet not found"
					}
				},
				"security": [{
					"api_key": []
				}]
			},
			"post": {
				"tags": ["pet"],
				"summary": "Updates a pet in the store with form data",
				"description": "",
				"operationId": "updatePetWithForm",
				"consumes": ["application/x-www-form-urlencoded"],
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "petId",
					"in": "path",
					"description": "ID of pet that needs to be updated",
					"required": true,
					"type": "integer",
					"format": "int64"
				}, {
					"name": "name",
					"in": "formData",
					"description": "Updated name of the pet",
					"required": false,
					"type": "string"
				}, {
					"name": "status",
					"in": "formData",
					"description": "Updated status of the pet",
					"required": false,
					"type": "string"
				}],
				"responses": {
					"405": {
						"description": "Invalid input"
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}]
			},
			"delete": {
				"tags": ["pet"],
				"summary": "Deletes a pet",
				"description": "",
				"operationId": "deletePet",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "api_key",
					"in": "header",
					"required": false,
					"type": "string"
				}, {
					"name": "petId",
					"in": "path",
					"description": "Pet id to delete",
					"required": true,
					"type": "integer",
					"format": "int64"
				}],
				"responses": {
					"400": {
						"description": "Invalid ID supplied"
					},
					"404": {
						"description": "Pet not found"
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}]
			}
		},
		"/pet/{petId}/uploadImage": {
			"post": {
				"tags": ["pet"],
				"summary": "uploads an image",
				"description": "",
				"operationId": "uploadFile",
				"consumes": ["multipart/form-data"],
				"produces": ["application/json"],
				"parameters": [{
					"name": "petId",
					"in": "path",
					"description": "ID of pet to update",
					"required": true,
					"type": "integer",
					"format": "int64"
				}, {
					"name": "additionalMetadata",
					"in": "formData",
					"description": "Additional data to pass to server",
					"required": false,
					"type": "string"
				}, {
					"name": "file",
					"in": "formData",
					"description": "file to upload",
					"required": false,
					"type": "file"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/ApiResponse"
						}
					}
				},
				"security": [{
					"petstore_auth": ["write:pets", "read:pets"]
				}]
			}
		},
		"/store/inventory": {
			"get": {
				"tags": ["store"],
				"summary": "Returns pet inventories by status",
				"description": "Returns a map of status codes to quantities",
				"operationId": "getInventory",
				"produces": ["application/json"],
				"parameters": [],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"type": "object",
							"additionalProperties": {
								"type": "integer",
								"format": "int32"
							}
						}
					}
				},
				"security": [{
					"api_key": []
				}]
			}
		},
		"/store/order": {
			"post": {
				"tags": ["store"],
				"summary": "Place an order for a pet",
				"description": "",
				"operationId": "placeOrder",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"in": "body",
					"name": "body",
					"description": "order placed for purchasing the pet",
					"required": true,
					"schema": {
						"$ref": "#/definitions/Order"
					}
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/Order"
						}
					},
					"400": {
						"description": "Invalid Order"
					}
				}
			}
		},
		"/store/order/{orderId}": {
			"get": {
				"tags": ["store"],
				"summary": "Find purchase order by ID",
				"description": "For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions",
				"operationId": "getOrderById",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "orderId",
					"in": "path",
					"description": "ID of pet that needs to be fetched",
					"required": true,
					"type": "integer",
					"maximum": 10.0,
					"minimum": 1.0,
					"format": "int64"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/Order"
						}
					},
					"400": {
						"description": "Invalid ID supplied"
					},
					"404": {
						"description": "Order not found"
					}
				}
			},
			"delete": {
				"tags": ["store"],
				"summary": "Delete purchase order by ID",
				"description": "For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors",
				"operationId": "deleteOrder",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "orderId",
					"in": "path",
					"description": "ID of the order that needs to be deleted",
					"required": true,
					"type": "integer",
					"minimum": 1.0,
					"format": "int64"
				}],
				"responses": {
					"400": {
						"description": "Invalid ID supplied"
					},
					"404": {
						"description": "Order not found"
					}
				}
			}
		},
		"/user": {
			"post": {
				"tags": ["user"],
				"summary": "Create user",
				"description": "This can only be done by the logged in user.",
				"operationId": "createUser",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"in": "body",
					"name": "body",
					"description": "Created user object",
					"required": true,
					"schema": {
						"$ref": "#/definitions/User"
					}
				}],
				"responses": {
					"default": {
						"description": "successful operation"
					}
				}
			}
		},
		"/user/createWithArray": {
			"post": {
				"tags": ["user"],
				"summary": "Creates list of users with given input array",
				"description": "",
				"operationId": "createUsersWithArrayInput",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"in": "body",
					"name": "body",
					"description": "List of user object",
					"required": true,
					"schema": {
						"type": "array",
						"items": {
							"$ref": "#/definitions/User"
						}
					}
				}],
				"responses": {
					"default": {
						"description": "successful operation"
					}
				}
			}
		},
		"/user/createWithList": {
			"post": {
				"tags": ["user"],
				"summary": "Creates list of users with given input array",
				"description": "",
				"operationId": "createUsersWithListInput",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"in": "body",
					"name": "body",
					"description": "List of user object",
					"required": true,
					"schema": {
						"type": "array",
						"items": {
							"$ref": "#/definitions/User"
						}
					}
				}],
				"responses": {
					"default": {
						"description": "successful operation"
					}
				}
			}
		},
		"/user/login": {
			"get": {
				"tags": ["user"],
				"summary": "Logs user into the system",
				"description": "",
				"operationId": "loginUser",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "username",
					"in": "query",
					"description": "The user name for login",
					"required": true,
					"type": "string"
				}, {
					"name": "password",
					"in": "query",
					"description": "The password for login in clear text",
					"required": true,
					"type": "string"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"type": "string"
						},
						"headers": {
							"X-Rate-Limit": {
								"type": "integer",
								"format": "int32",
								"description": "calls per hour allowed by the user"
							},
							"X-Expires-After": {
								"type": "string",
								"format": "date-time",
								"description": "date in UTC when token expires"
							}
						}
					},
					"400": {
						"description": "Invalid username/password supplied"
					}
				}
			}
		},
		"/user/logout": {
			"get": {
				"tags": ["user"],
				"summary": "Logs out current logged in user session",
				"description": "",
				"operationId": "logoutUser",
				"produces": ["application/xml", "application/json"],
				"parameters": [],
				"responses": {
					"default": {
						"description": "successful operation"
					}
				}
			}
		},
		"/user/{username}": {
			"get": {
				"tags": ["user"],
				"summary": "Get user by user name",
				"description": "",
				"operationId": "getUserByName",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "username",
					"in": "path",
					"description": "The name that needs to be fetched. Use user1 for testing. ",
					"required": true,
					"type": "string"
				}],
				"responses": {
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/User"
						}
					},
					"400": {
						"description": "Invalid username supplied"
					},
					"404": {
						"description": "User not found"
					}
				}
			},
			"put": {
				"tags": ["user"],
				"summary": "Updated user",
				"description": "This can only be done by the logged in user.",
				"operationId": "updateUser",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "username",
					"in": "path",
					"description": "name that need to be updated",
					"required": true,
					"type": "string"
				}, {
					"in": "body",
					"name": "body",
					"description": "Updated user object",
					"required": true,
					"schema": {
						"$ref": "#/definitions/User"
					}
				}],
				"responses": {
					"400": {
						"description": "Invalid user supplied"
					},
					"404": {
						"description": "User not found"
					}
				}
			},
			"delete": {
				"tags": ["user"],
				"summary": "Delete user",
				"description": "This can only be done by the logged in user.",
				"operationId": "deleteUser",
				"produces": ["application/xml", "application/json"],
				"parameters": [{
					"name": "username",
					"in": "path",
					"description": "The name that needs to be deleted",
					"required": true,
					"type": "string"
				}],
				"responses": {
					"400": {
						"description": "Invalid username supplied"
					},
					"404": {
						"description": "User not found"
					}
				}
			}
		}
	},
	"securityDefinitions": {
		"petstore_auth": {
			"type": "oauth2",
			"authorizationUrl": "https://petstore.swagger.io/oauth/dialog",
			"flow": "implicit",
			"scopes": {
				"write:pets": "modify pets in your account",
				"read:pets": "read your pets"
			}
		},
		"api_key": {
			"type": "apiKey",
			"name": "api_key",
			"in": "header"
		}
	},
	"definitions": {
		"Order": {
			"type": "object",
			"properties": {
				"id": {
					"type": "integer",
					"format": "int64"
				},
				"petId": {
					"type": "integer",
					"format": "int64"
				},
				"quantity": {
					"type": "integer",
					"format": "int32"
				},
				"shipDate": {
					"type": "string",
					"format": "date-time"
				},
				"status": {
					"type": "string",
					"description": "Order Status",
					"enum": ["placed", "approved", "delivered"]
				},
				"complete": {
					"type": "boolean",
					"default": false
				}
			},
			"xml": {
				"name": "Order"
			}
		},
		"User": {
			"type": "object",
			"properties": {
				"id": {
					"type": "integer",
					"format": "int64"
				},
				"username": {
					"type": "string"
				},
				"firstName": {
					"type": "string"
				},
				"lastName": {
					"type": "string"
				},
				"email": {
					"type": "string"
				},
				"password": {
					"type": "string"
				},
				"phone": {
					"type": "string"
				},
				"userStatus": {
					"type": "integer",
					"format": "int32",
					"description": "User Status"
				}
			},
			"xml": {
				"name": "User"
			}
		},
		"Category": {
			"type": "object",
			"properties": {
				"id": {
					"type": "integer",
					"format": "int64"
				},
				"name": {
					"type": "string"
				}
			},
			"xml": {
				"name": "Category"
			}
		},
		"Tag": {
			"type": "object",
			"properties": {
				"id": {
					"type": "integer",
					"format": "int64"
				},
				"name": {
					"type": "string"
				}
			},
			"xml": {
				"name": "Tag"
			}
		},
		"ApiResponse": {
			"type": "object",
			"properties": {
				"code": {
					"type": "integer",
					"format": "int32"
				},
				"type": {
					"type": "string"
				},
				"message": {
					"type": "string"
				}
			}
		},
		"Pet": {
			"type": "object",
			"required": ["name", "photoUrls"],
			"properties": {
				"id": {
					"type": "integer",
					"format": "int64"
				},
				"category": {
					"$ref": "#/definitions/Category"
				},
				"name": {
					"type": "string",
					"example": "doggie"
				},
				"photoUrls": {
					"type": "array",
					"xml": {
						"name": "photoUrl",
						"wrapped": true
					},
					"items": {
						"type": "string"
					}
				},
				"tags": {
					"type": "array",
					"xml": {
						"name": "tag",
						"wrapped": true
					},
					"items": {
						"$ref": "#/definitions/Tag"
					}
				},
				"status": {
					"type": "string",
					"description": "pet status in the store",
					"enum": ["available", "pending", "sold"]
				}
			},
			"xml": {
				"name": "Pet"
			}
		}
	},
	"externalDocs": {
		"description": "Find out more about Swagger",
		"url": "http://swagger.io"
	}
};


const SIMPLE_20 = {
    "swagger": "2.0",
    "info": {
        "title": "Simple API 2.0",
        "description": "This is a simple 2.0 API definition.",
        "license": {
            "name": "Apache 2.0",
            "url": "https://www.apache.org/licenses/LICENSE-2.0"
        },
        "version": "1.0.0"
    },
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "paths": {
        "/widgets": {
            "get": {
                "summary": "List All Widgets",
                "description": "Gets a list of all `Widget` entities.",
                "operationId": "getWidgets",
                "responses": {
                    "200": {
                        "description": "Successful response - returns an array of `Widget` entities.",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Widget"
                            }
                        }
                    }
                }
            },
            "post": {
                "summary": "Create a Widget",
                "description": "Creates a new instance of a `Widget`.",
                "operationId": "createWidget",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "description": "A new `Widget` to be created.",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/Widget"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Successful response."
                    }
                }
            }
        },
        "/widgets/{widgetId}": {
            "get": {
                "summary": "Get a Widget",
                "description": "Gets the details of a single instance of a `Widget`.",
                "operationId": "getWidget",
                "responses": {
                    "200": {
                        "description": "Successful response - returns a single `Widget`.",
                        "schema": {
                            "$ref": "#/definitions/Widget"
                        }
                    }
                }
            },
            "put": {
                "summary": "Update a Widget",
                "description": "Updates an existing `Widget`.",
                "operationId": "updateWidget",
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "description": "Updated `Widget` information.",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/Widget"
                        }
                    }
                ],
                "responses": {
                    "202": {
                        "description": "Successful response."
                    }
                }
            },
            "delete": {
                "summary": "Delete a Widget",
                "description": "Deletes an existing `Widget`.",
                "operationId": "deleteWidget",
                "responses": {
                    "204": {
                        "description": "Successful response."
                    }
                }
            },
            "parameters": [
                {
                    "name": "widgetId",
                    "in": "path",
                    "description": "A unique identifier for a `Widget`.",
                    "required": true,
                    "type": "string"
                }
            ]
        }
    },
    "definitions": {
        "Widget": {
            "title": "Root Type for Widget",
            "description": "A very simple, generic data type.",
            "type": "object",
            "properties": {
                "name": {
                    "description": "The name of the widget.",
                    "type": "string"
                },
                "description": {
                    "description": "The description of the widget.",
                    "type": "string"
                }
            },
            "example": "{\n    \"name\": \"My Widget\",\n    \"description\": \"Just a little widget for your review.\"\n}"
        }
    }
};


const PET_STORE_30 = {
	"openapi": "3.0.2",
	"info": {
		"title": "PetStore sample",
		"version": "1.0.0",
		"description": "A sample API that uses a petstore as an example to demonstrate features\nin the OpenAPI 3.0 specification",
		"termsOfService": "http://swagger.io/terms/",
		"contact": {
			"name": "Swagger API Team",
			"url": "http://swagger.io",
			"email": "apiteam@swagger.io"
		},
		"license": {
			"name": "Apache 2.0",
			"url": "https://www.apache.org/licenses/LICENSE-2.0.html"
		}
	},
	"servers": [
		{
			"url": "http://petstore.swagger.io/api"
		}
	],
	"paths": {
		"/pets": {
			"get": {
				"parameters": [
					{
						"style": "form",
						"name": "tags",
						"description": "tags to filter by",
						"schema": {
							"type": "array",
							"items": {
								"type": "string"
							}
						},
						"in": "query",
						"required": false
					},
					{
						"name": "limit",
						"description": "maximum number of results to return",
						"schema": {
							"format": "int32",
							"type": "integer"
						},
						"in": "query",
						"required": false
					}
				],
				"responses": {
					"200": {
						"content": {
							"application/json": {
								"schema": {
									"type": "array",
									"items": {
										"$ref": "#/components/schemas/Pet"
									}
								},
								"examples": {
									"laurent_cats": {
										"value": [
											{
												"id": 1,
												"name": "Zaza",
												"tag": "cat"
											},
											{
												"id": 2,
												"name": "Tigresse",
												"tag": "cat"
											},
											{
												"id": 3,
												"name": "Maki",
												"tag": "cat"
											},
											{
												"id": 4,
												"name": "Toufik",
												"tag": "cat"
											}
										]
									}
								}
							}
						},
						"description": "pet response"
					},
					"default": {
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Error"
								}
							}
						},
						"description": "unexpected error"
					}
				},
				"operationId": "findPets",
				"description": "Returns all pets from the system that the user has access to\n"
			},
			"post": {
				"requestBody": {
					"description": "Pet to add to the store",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/NewPet"
							},
							"examples": {
								"tigresse": {
									"value": {
										"name": "Tigresse",
										"tag": "cat"
									}
								}
							}
						}
					},
					"required": true
				},
				"responses": {
					"200": {
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Pet"
								},
								"examples": {
									"tigresse": {
										"value": {
											"id": 2,
											"name": "Tigresse",
											"tag": "cat"
										}
									}
								}
							}
						},
						"description": "pet response"
					},
					"default": {
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Error"
								}
							}
						},
						"description": "unexpected error"
					}
				},
				"operationId": "addPet",
				"description": "Creates a new pet in the store.  Duplicates are allowed"
			}
		},
		"/pets/{id}": {
			"get": {
				"parameters": [
					{
						"name": "id",
						"description": "ID of pet to fetch",
						"schema": {
							"format": "int64",
							"type": "integer"
						},
						"in": "path",
						"required": true,
						"examples": {
							"zaza": {
								"value": 1
							}
						}
					}
				],
				"responses": {
					"200": {
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Pet"
								},
								"examples": {
									"zaza": {
										"value": {
											"id": 1,
											"name": "Zaza",
											"tag": "cat"
										}
									}
								}
							}
						},
						"description": "pet response"
					},
					"default": {
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Error"
								}
							}
						},
						"description": "unexpected error"
					}
				},
				"operationId": "findPetById",
				"description": "Returns a user based on a single ID, if the user does not have\naccess to the pet"
			},
			"delete": {
				"parameters": [
					{
						"name": "id",
						"description": "ID of pet to delete",
						"schema": {
							"format": "int64",
							"type": "integer"
						},
						"in": "path",
						"required": true
					}
				],
				"responses": {
					"204": {
						"description": "pet deleted"
					},
					"default": {
						"content": {
							"application/json": {
								"schema": {
									"$ref": "#/components/schemas/Error"
								}
							}
						},
						"description": "unexpected error"
					}
				},
				"operationId": "deletePet",
				"description": "deletes a single pet based on the ID supplied"
			},
			"parameters": [
				{
					"name": "id",
					"description": "Pet identifier",
					"schema": {
						"type": "integer"
					},
					"in": "path",
					"required": true
				}
			]
		}
	},
	"components": {
		"schemas": {
			"Pet": {
				"allOf": [
					{
						"$ref": "#/components/schemas/NewPet"
					},
					{
						"required": [
							"id"
						],
						"properties": {
							"id": {
								"format": "int64",
								"type": "integer"
							}
						}
					}
				]
			},
			"NewPet": {
				"required": [
					"name"
				],
				"properties": {
					"name": {
						"type": "string"
					},
					"tag": {
						"type": "string"
					}
				}
			},
			"Error": {
				"required": [
					"code",
					"message"
				],
				"properties": {
					"code": {
						"format": "int32",
						"type": "integer"
					},
					"message": {
						"type": "string"
					}
				}
			}
		}
	}
};

const USPTO_30 = {
    "openapi": "3.0.1",
    "info": {
        "title": "USPTO Data Set API",
        "description": "The Data Set API (DSAPI) allows the public users to discover and search USPTO exported data sets. This is a generic API that allows USPTO users to make any CSV based data files searchable through API. With the help of GET call, it returns the list of data fields that are searchable. With the help of POST call, data can be fetched based on the filters on the field names. Please note that POST call is used to search the actual data. The reason for the POST call is that it allows users to specify any complex search criteria without worry about the GET size limitations as well as encoding of the input parameters.",
        "contact": {
            "name": "Open Data Portal",
            "url": "https://developer.uspto.gov",
            "email": "developer@uspto.gov"
        },
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "{scheme}://developer.uspto.gov/ds-api",
            "variables": {
                "scheme": {
                    "enum": [
                        "https",
                        "http"
                    ],
                    "default": "https",
                    "description": "The Data Set API is accessible via https and http"
                }
            }
        }
    ],
    "paths": {
        "/": {
            "get": {
                "tags": [
                    "metadata"
                ],
                "summary": "List available data sets",
                "operationId": "list-data-sets",
                "responses": {
                    "200": {
                        "description": "Returns a list of data sets",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/dataSetList"
                                },
                                "example": {
                                    "total": 2,
                                    "apis": [
                                        {
                                            "apiKey": "oa_citations",
                                            "apiVersionNumber": "v1",
                                            "apiUrl": "https://developer.uspto.gov/ds-api/oa_citations/v1/fields",
                                            "apiDocumentationUrl": "https://developer.uspto.gov/ds-api-docs/index.html?url=https://developer.uspto.gov/ds-api/swagger/docs/oa_citations.json"
                                        },
                                        {
                                            "apiKey": "cancer_moonshot",
                                            "apiVersionNumber": "v1",
                                            "apiUrl": "https://developer.uspto.gov/ds-api/cancer_moonshot/v1/fields",
                                            "apiDocumentationUrl": "https://developer.uspto.gov/ds-api-docs/index.html?url=https://developer.uspto.gov/ds-api/swagger/docs/cancer_moonshot.json"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/{dataset}/{version}/fields": {
            "get": {
                "tags": [
                    "metadata"
                ],
                "summary": "Provides the general information about the API and the list of fields that can be used to query the dataset.",
                "description": "This GET API returns the list of all the searchable field names that are in the oa_citations. Please see the 'fields' attribute which returns an array of field names. Each field or a combination of fields can be searched using the syntax options shown below.",
                "operationId": "list-searchable-fields",
                "parameters": [
                    {
                        "name": "dataset",
                        "in": "path",
                        "description": "Name of the dataset.",
                        "required": true,
                        "schema": {
                            "type": "string"
                        },
                        "example": "oa_citations"
                    },
                    {
                        "name": "version",
                        "in": "path",
                        "description": "Version of the dataset.",
                        "required": true,
                        "schema": {
                            "type": "string"
                        },
                        "example": "v1"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The dataset API for the given version is found and it is accessible to consume.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "The combination of dataset name and version is not found in the system or it is not published yet to be consumed by public.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/{dataset}/{version}/records": {
            "post": {
                "tags": [
                    "search"
                ],
                "summary": "Provides search capability for the data set with the given search criteria.",
                "description": "This API is based on Solr/Lucense Search. The data is indexed using SOLR. This GET API returns the list of all the searchable field names that are in the Solr Index. Please see the 'fields' attribute which returns an array of field names. Each field or a combination of fields can be searched using the Solr/Lucene Syntax. Please refer https://lucene.apache.org/core/3_6_2/queryparsersyntax.html#Overview for the query syntax. List of field names that are searchable can be determined using above GET api.",
                "operationId": "perform-search",
                "parameters": [
                    {
                        "name": "version",
                        "in": "path",
                        "description": "Version of the dataset.",
                        "required": true,
                        "schema": {
                            "default": "v1",
                            "type": "string"
                        }
                    },
                    {
                        "name": "dataset",
                        "in": "path",
                        "description": "Name of the dataset. In this case, the default value is oa_citations",
                        "required": true,
                        "schema": {
                            "default": "oa_citations",
                            "type": "string"
                        }
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/x-www-form-urlencoded": {
                            "schema": {
                                "required": [
                                    "criteria"
                                ],
                                "type": "object",
                                "properties": {
                                    "criteria": {
                                        "description": "Uses Lucene Query Syntax in the format of propertyName:value, propertyName:[num1 TO num2] and date range format: propertyName:[yyyyMMdd TO yyyyMMdd]. In the response please see the 'docs' element which has the list of record objects. Each record structure would consist of all the fields and their corresponding values.",
                                        "default": "*:*",
                                        "type": "string"
                                    },
                                    "start": {
                                        "description": "Starting record number. Default value is 0.",
                                        "default": 0,
                                        "type": "integer"
                                    },
                                    "rows": {
                                        "description": "Specify number of rows to be returned. If you run the search with default values, in the response you will see 'numFound' attribute which will tell the number of records available in the dataset.",
                                        "default": 100,
                                        "type": "integer"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "No matching record found for the given criteria."
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "dataSetList": {
                "type": "object",
                "properties": {
                    "total": {
                        "type": "integer"
                    },
                    "apis": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "apiKey": {
                                    "description": "To be used as a dataset parameter value",
                                    "type": "string"
                                },
                                "apiVersionNumber": {
                                    "description": "To be used as a version parameter value",
                                    "type": "string"
                                },
                                "apiUrl": {
                                    "format": "uriref",
                                    "description": "The URL describing the dataset's fields",
                                    "type": "string"
                                },
                                "apiDocumentationUrl": {
                                    "format": "uriref",
                                    "description": "A URL to the API console for each API",
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "tags": [
        {
            "name": "metadata",
            "description": "Find out about the data sets"
        },
        {
            "name": "search",
            "description": "Search a data set"
        }
    ]
};