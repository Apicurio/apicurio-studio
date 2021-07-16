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

package io.apicurio.hub.api.rest.impl;

import io.apicurio.hub.api.rest.ITemplatesResource;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author c.desc2@gmail.com
 */
public class TemplatesResource implements ITemplatesResource {

    private static Logger logger = LoggerFactory.getLogger(TemplatesResource.class);

    private static final List<ApiTemplate> allTemplates = List.of(
            new ApiTemplate(
                    ApiDesignType.OpenAPI20,
                    "Simple API",
                    "Creates a very simple API with some basic settings that can be used as a starting point for your custom API.",
                    "{\n" +
                            "    \"swagger\": \"2.0\",\n" +
                            "    \"info\": {\n" +
                            "        \"title\": \"Simple API 2.0\",\n" +
                            "        \"description\": \"This is a simple 2.0 API definition.\",\n" +
                            "        \"license\": {\n" +
                            "            \"name\": \"Apache 2.0\",\n" +
                            "            \"url\": \"https://www.apache.org/licenses/LICENSE-2.0\"\n" +
                            "        },\n" +
                            "        \"version\": \"1.0.0\"\n" +
                            "    },\n" +
                            "    \"consumes\": [\n" +
                            "        \"application/json\"\n" +
                            "    ],\n" +
                            "    \"produces\": [\n" +
                            "        \"application/json\"\n" +
                            "    ],\n" +
                            "    \"paths\": {\n" +
                            "        \"/widgets\": {\n" +
                            "            \"get\": {\n" +
                            "                \"summary\": \"List All Widgets\",\n" +
                            "                \"description\": \"Gets a list of all `Widget` entities.\",\n" +
                            "                \"operationId\": \"getWidgets\",\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"Successful response - returns an array of `Widget` entities.\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"array\",\n" +
                            "                            \"items\": {\n" +
                            "                                \"$ref\": \"#/definitions/Widget\"\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"post\": {\n" +
                            "                \"summary\": \"Create a Widget\",\n" +
                            "                \"description\": \"Creates a new instance of a `Widget`.\",\n" +
                            "                \"operationId\": \"createWidget\",\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"name\": \"body\",\n" +
                            "                        \"in\": \"body\",\n" +
                            "                        \"description\": \"A new `Widget` to be created.\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/Widget\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"responses\": {\n" +
                            "                    \"201\": {\n" +
                            "                        \"description\": \"Successful response.\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/widgets/{widgetId}\": {\n" +
                            "            \"get\": {\n" +
                            "                \"summary\": \"Get a Widget\",\n" +
                            "                \"description\": \"Gets the details of a single instance of a `Widget`.\",\n" +
                            "                \"operationId\": \"getWidget\",\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"Successful response - returns a single `Widget`.\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/Widget\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"put\": {\n" +
                            "                \"summary\": \"Update a Widget\",\n" +
                            "                \"description\": \"Updates an existing `Widget`.\",\n" +
                            "                \"operationId\": \"updateWidget\",\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"name\": \"body\",\n" +
                            "                        \"in\": \"body\",\n" +
                            "                        \"description\": \"Updated `Widget` information.\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/Widget\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"responses\": {\n" +
                            "                    \"202\": {\n" +
                            "                        \"description\": \"Successful response.\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"delete\": {\n" +
                            "                \"summary\": \"Delete a Widget\",\n" +
                            "                \"description\": \"Deletes an existing `Widget`.\",\n" +
                            "                \"operationId\": \"deleteWidget\",\n" +
                            "                \"responses\": {\n" +
                            "                    \"204\": {\n" +
                            "                        \"description\": \"Successful response.\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"parameters\": [\n" +
                            "                {\n" +
                            "                    \"name\": \"widgetId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"A unique identifier for a `Widget`.\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }\n" +
                            "            ]\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"definitions\": {\n" +
                            "        \"Widget\": {\n" +
                            "            \"title\": \"Root Type for Widget\",\n" +
                            "            \"description\": \"A very simple, generic data type.\",\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"properties\": {\n" +
                            "                \"name\": {\n" +
                            "                    \"description\": \"The name of the widget.\",\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"description\": {\n" +
                            "                    \"description\": \"The description of the widget.\",\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"example\": \"{\\n    \\\"name\\\": \\\"My Widget\\\",\\n    \\\"description\\\": \\\"Just a little widget for your review.\\\"\\n}\"\n" +
                            "        }\n" +
                            "    }\n" +
                            "}"),
            new ApiTemplate(
                    ApiDesignType.OpenAPI20,
                    "Pet Store Example",
                    "Creates a standard/famous Swagger 2.0 Pet Store API sample.  Can be found here: https://petstore.swagger.io/v2/swagger.json",
                    "{\n" +
                            "    \"swagger\": \"2.0\",\n" +
                            "    \"info\": {\n" +
                            "        \"description\": \"This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.\",\n" +
                            "        \"version\": \"1.0.0\",\n" +
                            "        \"title\": \"Swagger Petstore\",\n" +
                            "        \"termsOfService\": \"http://swagger.io/terms/\",\n" +
                            "        \"contact\": {\n" +
                            "            \"email\": \"apiteam@swagger.io\"\n" +
                            "        },\n" +
                            "        \"license\": {\n" +
                            "            \"name\": \"Apache 2.0\",\n" +
                            "            \"url\": \"http://www.apache.org/licenses/LICENSE-2.0.html\"\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"host\": \"petstore.swagger.io\",\n" +
                            "    \"basePath\": \"/v2\",\n" +
                            "    \"tags\": [{\n" +
                            "        \"name\": \"pet\",\n" +
                            "        \"description\": \"Everything about your Pets\",\n" +
                            "        \"externalDocs\": {\n" +
                            "            \"description\": \"Find out more\",\n" +
                            "            \"url\": \"http://swagger.io\"\n" +
                            "        }\n" +
                            "    }, {\n" +
                            "        \"name\": \"store\",\n" +
                            "        \"description\": \"Access to Petstore orders\"\n" +
                            "    }, {\n" +
                            "        \"name\": \"user\",\n" +
                            "        \"description\": \"Operations about user\",\n" +
                            "        \"externalDocs\": {\n" +
                            "            \"description\": \"Find out more about our store\",\n" +
                            "            \"url\": \"http://swagger.io\"\n" +
                            "        }\n" +
                            "    }],\n" +
                            "    \"schemes\": [\"https\", \"http\"],\n" +
                            "    \"paths\": {\n" +
                            "        \"/pet\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Add a new pet to the store\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"addPet\",\n" +
                            "                \"consumes\": [\"application/json\", \"application/xml\"],\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"Pet object that needs to be added to the store\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"$ref\": \"#/definitions/Pet\"\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"405\": {\n" +
                            "                        \"description\": \"Invalid input\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }]\n" +
                            "            },\n" +
                            "            \"put\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Update an existing pet\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"updatePet\",\n" +
                            "                \"consumes\": [\"application/json\", \"application/xml\"],\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"Pet object that needs to be added to the store\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"$ref\": \"#/definitions/Pet\"\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid ID supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"Pet not found\"\n" +
                            "                    },\n" +
                            "                    \"405\": {\n" +
                            "                        \"description\": \"Validation exception\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }]\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/pet/findByStatus\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Finds Pets by status\",\n" +
                            "                \"description\": \"Multiple status values can be provided with comma separated strings\",\n" +
                            "                \"operationId\": \"findPetsByStatus\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"status\",\n" +
                            "                    \"in\": \"query\",\n" +
                            "                    \"description\": \"Status values that need to be considered for filter\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"array\",\n" +
                            "                    \"items\": {\n" +
                            "                        \"type\": \"string\",\n" +
                            "                        \"enum\": [\"available\", \"pending\", \"sold\"],\n" +
                            "                        \"default\": \"available\"\n" +
                            "                    },\n" +
                            "                    \"collectionFormat\": \"multi\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"array\",\n" +
                            "                            \"items\": {\n" +
                            "                                \"$ref\": \"#/definitions/Pet\"\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid status value\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }]\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/pet/findByTags\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Finds Pets by tags\",\n" +
                            "                \"description\": \"Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.\",\n" +
                            "                \"operationId\": \"findPetsByTags\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"tags\",\n" +
                            "                    \"in\": \"query\",\n" +
                            "                    \"description\": \"Tags to filter by\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"array\",\n" +
                            "                    \"items\": {\n" +
                            "                        \"type\": \"string\"\n" +
                            "                    },\n" +
                            "                    \"collectionFormat\": \"multi\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"array\",\n" +
                            "                            \"items\": {\n" +
                            "                                \"$ref\": \"#/definitions/Pet\"\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid tag value\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }],\n" +
                            "                \"deprecated\": true\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/pet/{petId}\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Find pet by ID\",\n" +
                            "                \"description\": \"Returns a single pet\",\n" +
                            "                \"operationId\": \"getPetById\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"petId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"ID of pet to return\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/Pet\"\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid ID supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"Pet not found\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"api_key\": []\n" +
                            "                }]\n" +
                            "            },\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Updates a pet in the store with form data\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"updatePetWithForm\",\n" +
                            "                \"consumes\": [\"application/x-www-form-urlencoded\"],\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"petId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"ID of pet that needs to be updated\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                }, {\n" +
                            "                    \"name\": \"name\",\n" +
                            "                    \"in\": \"formData\",\n" +
                            "                    \"description\": \"Updated name of the pet\",\n" +
                            "                    \"required\": false,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }, {\n" +
                            "                    \"name\": \"status\",\n" +
                            "                    \"in\": \"formData\",\n" +
                            "                    \"description\": \"Updated status of the pet\",\n" +
                            "                    \"required\": false,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"405\": {\n" +
                            "                        \"description\": \"Invalid input\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }]\n" +
                            "            },\n" +
                            "            \"delete\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"Deletes a pet\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"deletePet\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"api_key\",\n" +
                            "                    \"in\": \"header\",\n" +
                            "                    \"required\": false,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }, {\n" +
                            "                    \"name\": \"petId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"Pet id to delete\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid ID supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"Pet not found\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }]\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/pet/{petId}/uploadImage\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"pet\"],\n" +
                            "                \"summary\": \"uploads an image\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"uploadFile\",\n" +
                            "                \"consumes\": [\"multipart/form-data\"],\n" +
                            "                \"produces\": [\"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"petId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"ID of pet to update\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                }, {\n" +
                            "                    \"name\": \"additionalMetadata\",\n" +
                            "                    \"in\": \"formData\",\n" +
                            "                    \"description\": \"Additional data to pass to server\",\n" +
                            "                    \"required\": false,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }, {\n" +
                            "                    \"name\": \"file\",\n" +
                            "                    \"in\": \"formData\",\n" +
                            "                    \"description\": \"file to upload\",\n" +
                            "                    \"required\": false,\n" +
                            "                    \"type\": \"file\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/ApiResponse\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"petstore_auth\": [\"write:pets\", \"read:pets\"]\n" +
                            "                }]\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/store/inventory\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"store\"],\n" +
                            "                \"summary\": \"Returns pet inventories by status\",\n" +
                            "                \"description\": \"Returns a map of status codes to quantities\",\n" +
                            "                \"operationId\": \"getInventory\",\n" +
                            "                \"produces\": [\"application/json\"],\n" +
                            "                \"parameters\": [],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"object\",\n" +
                            "                            \"additionalProperties\": {\n" +
                            "                                \"type\": \"integer\",\n" +
                            "                                \"format\": \"int32\"\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"security\": [{\n" +
                            "                    \"api_key\": []\n" +
                            "                }]\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/store/order\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"store\"],\n" +
                            "                \"summary\": \"Place an order for a pet\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"placeOrder\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"order placed for purchasing the pet\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"$ref\": \"#/definitions/Order\"\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/Order\"\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid Order\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/store/order/{orderId}\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"store\"],\n" +
                            "                \"summary\": \"Find purchase order by ID\",\n" +
                            "                \"description\": \"For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions\",\n" +
                            "                \"operationId\": \"getOrderById\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"orderId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"ID of pet that needs to be fetched\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"maximum\": 10.0,\n" +
                            "                    \"minimum\": 1.0,\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/Order\"\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid ID supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"Order not found\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"delete\": {\n" +
                            "                \"tags\": [\"store\"],\n" +
                            "                \"summary\": \"Delete purchase order by ID\",\n" +
                            "                \"description\": \"For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors\",\n" +
                            "                \"operationId\": \"deleteOrder\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"orderId\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"ID of the order that needs to be deleted\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"minimum\": 1.0,\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid ID supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"Order not found\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/user\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Create user\",\n" +
                            "                \"description\": \"This can only be done by the logged in user.\",\n" +
                            "                \"operationId\": \"createUser\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"Created user object\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"$ref\": \"#/definitions/User\"\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"default\": {\n" +
                            "                        \"description\": \"successful operation\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/user/createWithArray\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Creates list of users with given input array\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"createUsersWithArrayInput\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"List of user object\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"type\": \"array\",\n" +
                            "                        \"items\": {\n" +
                            "                            \"$ref\": \"#/definitions/User\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"default\": {\n" +
                            "                        \"description\": \"successful operation\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/user/createWithList\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Creates list of users with given input array\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"createUsersWithListInput\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"List of user object\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"type\": \"array\",\n" +
                            "                        \"items\": {\n" +
                            "                            \"$ref\": \"#/definitions/User\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"default\": {\n" +
                            "                        \"description\": \"successful operation\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/user/login\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Logs user into the system\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"loginUser\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"username\",\n" +
                            "                    \"in\": \"query\",\n" +
                            "                    \"description\": \"The user name for login\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }, {\n" +
                            "                    \"name\": \"password\",\n" +
                            "                    \"in\": \"query\",\n" +
                            "                    \"description\": \"The password for login in clear text\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"string\"\n" +
                            "                        },\n" +
                            "                        \"headers\": {\n" +
                            "                            \"X-Rate-Limit\": {\n" +
                            "                                \"type\": \"integer\",\n" +
                            "                                \"format\": \"int32\",\n" +
                            "                                \"description\": \"calls per hour allowed by the user\"\n" +
                            "                            },\n" +
                            "                            \"X-Expires-After\": {\n" +
                            "                                \"type\": \"string\",\n" +
                            "                                \"format\": \"date-time\",\n" +
                            "                                \"description\": \"date in UTC when token expires\"\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid username/password supplied\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/user/logout\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Logs out current logged in user session\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"logoutUser\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [],\n" +
                            "                \"responses\": {\n" +
                            "                    \"default\": {\n" +
                            "                        \"description\": \"successful operation\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/user/{username}\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Get user by user name\",\n" +
                            "                \"description\": \"\",\n" +
                            "                \"operationId\": \"getUserByName\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"username\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"The name that needs to be fetched. Use user1 for testing. \",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"$ref\": \"#/definitions/User\"\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid username supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"User not found\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"put\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Updated user\",\n" +
                            "                \"description\": \"This can only be done by the logged in user.\",\n" +
                            "                \"operationId\": \"updateUser\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"username\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"name that need to be updated\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }, {\n" +
                            "                    \"in\": \"body\",\n" +
                            "                    \"name\": \"body\",\n" +
                            "                    \"description\": \"Updated user object\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"schema\": {\n" +
                            "                        \"$ref\": \"#/definitions/User\"\n" +
                            "                    }\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid user supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"User not found\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"delete\": {\n" +
                            "                \"tags\": [\"user\"],\n" +
                            "                \"summary\": \"Delete user\",\n" +
                            "                \"description\": \"This can only be done by the logged in user.\",\n" +
                            "                \"operationId\": \"deleteUser\",\n" +
                            "                \"produces\": [\"application/xml\", \"application/json\"],\n" +
                            "                \"parameters\": [{\n" +
                            "                    \"name\": \"username\",\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"description\": \"The name that needs to be deleted\",\n" +
                            "                    \"required\": true,\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }],\n" +
                            "                \"responses\": {\n" +
                            "                    \"400\": {\n" +
                            "                        \"description\": \"Invalid username supplied\"\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"User not found\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"securityDefinitions\": {\n" +
                            "        \"petstore_auth\": {\n" +
                            "            \"type\": \"oauth2\",\n" +
                            "            \"authorizationUrl\": \"https://petstore.swagger.io/oauth/dialog\",\n" +
                            "            \"flow\": \"implicit\",\n" +
                            "            \"scopes\": {\n" +
                            "                \"write:pets\": \"modify pets in your account\",\n" +
                            "                \"read:pets\": \"read your pets\"\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"api_key\": {\n" +
                            "            \"type\": \"apiKey\",\n" +
                            "            \"name\": \"api_key\",\n" +
                            "            \"in\": \"header\"\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"definitions\": {\n" +
                            "        \"Order\": {\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"properties\": {\n" +
                            "                \"id\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                },\n" +
                            "                \"petId\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                },\n" +
                            "                \"quantity\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int32\"\n" +
                            "                },\n" +
                            "                \"shipDate\": {\n" +
                            "                    \"type\": \"string\",\n" +
                            "                    \"format\": \"date-time\"\n" +
                            "                },\n" +
                            "                \"status\": {\n" +
                            "                    \"type\": \"string\",\n" +
                            "                    \"description\": \"Order Status\",\n" +
                            "                    \"enum\": [\"placed\", \"approved\", \"delivered\"]\n" +
                            "                },\n" +
                            "                \"complete\": {\n" +
                            "                    \"type\": \"boolean\",\n" +
                            "                    \"default\": false\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"xml\": {\n" +
                            "                \"name\": \"Order\"\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"User\": {\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"properties\": {\n" +
                            "                \"id\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                },\n" +
                            "                \"username\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"firstName\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"lastName\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"email\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"password\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"phone\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"userStatus\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int32\",\n" +
                            "                    \"description\": \"User Status\"\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"xml\": {\n" +
                            "                \"name\": \"User\"\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"Category\": {\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"properties\": {\n" +
                            "                \"id\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                },\n" +
                            "                \"name\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"xml\": {\n" +
                            "                \"name\": \"Category\"\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"Tag\": {\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"properties\": {\n" +
                            "                \"id\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                },\n" +
                            "                \"name\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"xml\": {\n" +
                            "                \"name\": \"Tag\"\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"ApiResponse\": {\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"properties\": {\n" +
                            "                \"code\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int32\"\n" +
                            "                },\n" +
                            "                \"type\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                },\n" +
                            "                \"message\": {\n" +
                            "                    \"type\": \"string\"\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"Pet\": {\n" +
                            "            \"type\": \"object\",\n" +
                            "            \"required\": [\"name\", \"photoUrls\"],\n" +
                            "            \"properties\": {\n" +
                            "                \"id\": {\n" +
                            "                    \"type\": \"integer\",\n" +
                            "                    \"format\": \"int64\"\n" +
                            "                },\n" +
                            "                \"category\": {\n" +
                            "                    \"$ref\": \"#/definitions/Category\"\n" +
                            "                },\n" +
                            "                \"name\": {\n" +
                            "                    \"type\": \"string\",\n" +
                            "                    \"example\": \"doggie\"\n" +
                            "                },\n" +
                            "                \"photoUrls\": {\n" +
                            "                    \"type\": \"array\",\n" +
                            "                    \"xml\": {\n" +
                            "                        \"name\": \"photoUrl\",\n" +
                            "                        \"wrapped\": true\n" +
                            "                    },\n" +
                            "                    \"items\": {\n" +
                            "                        \"type\": \"string\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"tags\": {\n" +
                            "                    \"type\": \"array\",\n" +
                            "                    \"xml\": {\n" +
                            "                        \"name\": \"tag\",\n" +
                            "                        \"wrapped\": true\n" +
                            "                    },\n" +
                            "                    \"items\": {\n" +
                            "                        \"$ref\": \"#/definitions/Tag\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"status\": {\n" +
                            "                    \"type\": \"string\",\n" +
                            "                    \"description\": \"pet status in the store\",\n" +
                            "                    \"enum\": [\"available\", \"pending\", \"sold\"]\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"xml\": {\n" +
                            "                \"name\": \"Pet\"\n" +
                            "            }\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"externalDocs\": {\n" +
                            "        \"description\": \"Find out more about Swagger\",\n" +
                            "        \"url\": \"http://swagger.io\"\n" +
                            "    }\n" +
                            "}"),
            new ApiTemplate(
                    ApiDesignType.OpenAPI30,
                    "Pet Store Example",
                    "Creates a version of the classic Swagger Pet Store example but redesigned using OpenAPI 3!",
                    "{\n" +
                            "    \"openapi\": \"3.0.2\",\n" +
                            "    \"info\": {\n" +
                            "        \"title\": \"PetStore sample\",\n" +
                            "        \"version\": \"1.0.0\",\n" +
                            "        \"description\": \"A sample API that uses a petstore as an example to demonstrate features\\nin the OpenAPI 3.0 specification\",\n" +
                            "        \"termsOfService\": \"http://swagger.io/terms/\",\n" +
                            "        \"contact\": {\n" +
                            "            \"name\": \"Swagger API Team\",\n" +
                            "            \"url\": \"http://swagger.io\",\n" +
                            "            \"email\": \"apiteam@swagger.io\"\n" +
                            "        },\n" +
                            "        \"license\": {\n" +
                            "            \"name\": \"Apache 2.0\",\n" +
                            "            \"url\": \"https://www.apache.org/licenses/LICENSE-2.0.html\"\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"servers\": [\n" +
                            "        {\n" +
                            "            \"url\": \"http://petstore.swagger.io/api\"\n" +
                            "        }\n" +
                            "    ],\n" +
                            "    \"paths\": {\n" +
                            "        \"/pets\": {\n" +
                            "            \"get\": {\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"style\": \"form\",\n" +
                            "                        \"name\": \"tags\",\n" +
                            "                        \"description\": \"tags to filter by\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"array\",\n" +
                            "                            \"items\": {\n" +
                            "                                \"type\": \"string\"\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"in\": \"query\",\n" +
                            "                        \"required\": false\n" +
                            "                    },\n" +
                            "                    {\n" +
                            "                        \"name\": \"limit\",\n" +
                            "                        \"description\": \"maximum number of results to return\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"format\": \"int32\",\n" +
                            "                            \"type\": \"integer\"\n" +
                            "                        },\n" +
                            "                        \"in\": \"query\",\n" +
                            "                        \"required\": false\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"type\": \"array\",\n" +
                            "                                    \"items\": {\n" +
                            "                                        \"$ref\": \"#/components/schemas/Pet\"\n" +
                            "                                    }\n" +
                            "                                },\n" +
                            "                                \"examples\": {\n" +
                            "                                    \"laurent_cats\": {\n" +
                            "                                        \"value\": [\n" +
                            "                                            {\n" +
                            "                                                \"id\": 1,\n" +
                            "                                                \"name\": \"Zaza\",\n" +
                            "                                                \"tag\": \"cat\"\n" +
                            "                                            },\n" +
                            "                                            {\n" +
                            "                                                \"id\": 2,\n" +
                            "                                                \"name\": \"Tigresse\",\n" +
                            "                                                \"tag\": \"cat\"\n" +
                            "                                            },\n" +
                            "                                            {\n" +
                            "                                                \"id\": 3,\n" +
                            "                                                \"name\": \"Maki\",\n" +
                            "                                                \"tag\": \"cat\"\n" +
                            "                                            },\n" +
                            "                                            {\n" +
                            "                                                \"id\": 4,\n" +
                            "                                                \"name\": \"Toufik\",\n" +
                            "                                                \"tag\": \"cat\"\n" +
                            "                                            }\n" +
                            "                                        ]\n" +
                            "                                    }\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"pet response\"\n" +
                            "                    },\n" +
                            "                    \"default\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/Error\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"unexpected error\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"operationId\": \"findPets\",\n" +
                            "                \"description\": \"Returns all pets from the system that the user has access to\\n\"\n" +
                            "            },\n" +
                            "            \"post\": {\n" +
                            "                \"requestBody\": {\n" +
                            "                    \"description\": \"Pet to add to the store\",\n" +
                            "                    \"content\": {\n" +
                            "                        \"application/json\": {\n" +
                            "                            \"schema\": {\n" +
                            "                                \"$ref\": \"#/components/schemas/NewPet\"\n" +
                            "                            },\n" +
                            "                            \"examples\": {\n" +
                            "                                \"tigresse\": {\n" +
                            "                                    \"value\": {\n" +
                            "                                        \"name\": \"Tigresse\",\n" +
                            "                                        \"tag\": \"cat\"\n" +
                            "                                    }\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"required\": true\n" +
                            "                },\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/Pet\"\n" +
                            "                                },\n" +
                            "                                \"examples\": {\n" +
                            "                                    \"tigresse\": {\n" +
                            "                                        \"value\": {\n" +
                            "                                            \"id\": 2,\n" +
                            "                                            \"name\": \"Tigresse\",\n" +
                            "                                            \"tag\": \"cat\"\n" +
                            "                                        }\n" +
                            "                                    }\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"pet response\"\n" +
                            "                    },\n" +
                            "                    \"default\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/Error\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"unexpected error\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"operationId\": \"addPet\",\n" +
                            "                \"description\": \"Creates a new pet in the store.  Duplicates are allowed\"\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/pets/{id}\": {\n" +
                            "            \"get\": {\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"name\": \"id\",\n" +
                            "                        \"description\": \"ID of pet to fetch\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"format\": \"int64\",\n" +
                            "                            \"type\": \"integer\"\n" +
                            "                        },\n" +
                            "                        \"in\": \"path\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"examples\": {\n" +
                            "                            \"zaza\": {\n" +
                            "                                \"value\": 1\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/Pet\"\n" +
                            "                                },\n" +
                            "                                \"examples\": {\n" +
                            "                                    \"zaza\": {\n" +
                            "                                        \"value\": {\n" +
                            "                                            \"id\": 1,\n" +
                            "                                            \"name\": \"Zaza\",\n" +
                            "                                            \"tag\": \"cat\"\n" +
                            "                                        }\n" +
                            "                                    }\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"pet response\"\n" +
                            "                    },\n" +
                            "                    \"default\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/Error\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"unexpected error\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"operationId\": \"findPetById\",\n" +
                            "                \"description\": \"Returns a user based on a single ID, if the user does not have\\naccess to the pet\"\n" +
                            "            },\n" +
                            "            \"delete\": {\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"name\": \"id\",\n" +
                            "                        \"description\": \"ID of pet to delete\",\n" +
                            "                        \"schema\": {\n" +
                            "                            \"format\": \"int64\",\n" +
                            "                            \"type\": \"integer\"\n" +
                            "                        },\n" +
                            "                        \"in\": \"path\",\n" +
                            "                        \"required\": true\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"responses\": {\n" +
                            "                    \"204\": {\n" +
                            "                        \"description\": \"pet deleted\"\n" +
                            "                    },\n" +
                            "                    \"default\": {\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/Error\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        },\n" +
                            "                        \"description\": \"unexpected error\"\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"operationId\": \"deletePet\",\n" +
                            "                \"description\": \"deletes a single pet based on the ID supplied\"\n" +
                            "            },\n" +
                            "            \"parameters\": [\n" +
                            "                {\n" +
                            "                    \"name\": \"id\",\n" +
                            "                    \"description\": \"Pet identifier\",\n" +
                            "                    \"schema\": {\n" +
                            "                        \"type\": \"integer\"\n" +
                            "                    },\n" +
                            "                    \"in\": \"path\",\n" +
                            "                    \"required\": true\n" +
                            "                }\n" +
                            "            ]\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"components\": {\n" +
                            "        \"schemas\": {\n" +
                            "            \"Pet\": {\n" +
                            "                \"allOf\": [\n" +
                            "                    {\n" +
                            "                        \"$ref\": \"#/components/schemas/NewPet\"\n" +
                            "                    },\n" +
                            "                    {\n" +
                            "                        \"required\": [\n" +
                            "                            \"id\"\n" +
                            "                        ],\n" +
                            "                        \"properties\": {\n" +
                            "                            \"id\": {\n" +
                            "                                \"format\": \"int64\",\n" +
                            "                                \"type\": \"integer\"\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                ]\n" +
                            "            },\n" +
                            "            \"NewPet\": {\n" +
                            "                \"required\": [\n" +
                            "                    \"name\"\n" +
                            "                ],\n" +
                            "                \"properties\": {\n" +
                            "                    \"name\": {\n" +
                            "                        \"type\": \"string\"\n" +
                            "                    },\n" +
                            "                    \"tag\": {\n" +
                            "                        \"type\": \"string\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            },\n" +
                            "            \"Error\": {\n" +
                            "                \"required\": [\n" +
                            "                    \"code\",\n" +
                            "                    \"message\"\n" +
                            "                ],\n" +
                            "                \"properties\": {\n" +
                            "                    \"code\": {\n" +
                            "                        \"format\": \"int32\",\n" +
                            "                        \"type\": \"integer\"\n" +
                            "                    },\n" +
                            "                    \"message\": {\n" +
                            "                        \"type\": \"string\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    }\n" +
                            "}"),
            new ApiTemplate(
                    ApiDesignType.OpenAPI30,
                    "USPTO Dataset API",
                    "Creates an API using the USPTO Data Set API (DSAPI) as a basis.",
                    "{\n" +
                            "    \"openapi\": \"3.0.1\",\n" +
                            "    \"info\": {\n" +
                            "        \"title\": \"USPTO Data Set API\",\n" +
                            "        \"description\": \"The Data Set API (DSAPI) allows the public users to discover and search USPTO exported data sets. This is a generic API that allows USPTO users to make any CSV based data files searchable through API. With the help of GET call, it returns the list of data fields that are searchable. With the help of POST call, data can be fetched based on the filters on the field names. Please note that POST call is used to search the actual data. The reason for the POST call is that it allows users to specify any complex search criteria without worry about the GET size limitations as well as encoding of the input parameters.\",\n" +
                            "        \"contact\": {\n" +
                            "            \"name\": \"Open Data Portal\",\n" +
                            "            \"url\": \"https://developer.uspto.gov\",\n" +
                            "            \"email\": \"developer@uspto.gov\"\n" +
                            "        },\n" +
                            "        \"version\": \"1.0.0\"\n" +
                            "    },\n" +
                            "    \"servers\": [\n" +
                            "        {\n" +
                            "            \"url\": \"{scheme}://developer.uspto.gov/ds-api\",\n" +
                            "            \"variables\": {\n" +
                            "                \"scheme\": {\n" +
                            "                    \"enum\": [\n" +
                            "                        \"https\",\n" +
                            "                        \"http\"\n" +
                            "                    ],\n" +
                            "                    \"default\": \"https\",\n" +
                            "                    \"description\": \"The Data Set API is accessible via https and http\"\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    ],\n" +
                            "    \"paths\": {\n" +
                            "        \"/\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\n" +
                            "                    \"metadata\"\n" +
                            "                ],\n" +
                            "                \"summary\": \"List available data sets\",\n" +
                            "                \"operationId\": \"list-data-sets\",\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"Returns a list of data sets\",\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"$ref\": \"#/components/schemas/dataSetList\"\n" +
                            "                                },\n" +
                            "                                \"example\": {\n" +
                            "                                    \"total\": 2,\n" +
                            "                                    \"apis\": [\n" +
                            "                                        {\n" +
                            "                                            \"apiKey\": \"oa_citations\",\n" +
                            "                                            \"apiVersionNumber\": \"v1\",\n" +
                            "                                            \"apiUrl\": \"https://developer.uspto.gov/ds-api/oa_citations/v1/fields\",\n" +
                            "                                            \"apiDocumentationUrl\": \"https://developer.uspto.gov/ds-api-docs/index.html?url=https://developer.uspto.gov/ds-api/swagger/docs/oa_citations.json\"\n" +
                            "                                        },\n" +
                            "                                        {\n" +
                            "                                            \"apiKey\": \"cancer_moonshot\",\n" +
                            "                                            \"apiVersionNumber\": \"v1\",\n" +
                            "                                            \"apiUrl\": \"https://developer.uspto.gov/ds-api/cancer_moonshot/v1/fields\",\n" +
                            "                                            \"apiDocumentationUrl\": \"https://developer.uspto.gov/ds-api-docs/index.html?url=https://developer.uspto.gov/ds-api/swagger/docs/cancer_moonshot.json\"\n" +
                            "                                        }\n" +
                            "                                    ]\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/{dataset}/{version}/fields\": {\n" +
                            "            \"get\": {\n" +
                            "                \"tags\": [\n" +
                            "                    \"metadata\"\n" +
                            "                ],\n" +
                            "                \"summary\": \"Provides the general information about the API and the list of fields that can be used to query the dataset.\",\n" +
                            "                \"description\": \"This GET API returns the list of all the searchable field names that are in the oa_citations. Please see the 'fields' attribute which returns an array of field names. Each field or a combination of fields can be searched using the syntax options shown below.\",\n" +
                            "                \"operationId\": \"list-searchable-fields\",\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"name\": \"dataset\",\n" +
                            "                        \"in\": \"path\",\n" +
                            "                        \"description\": \"Name of the dataset.\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"string\"\n" +
                            "                        },\n" +
                            "                        \"example\": \"oa_citations\"\n" +
                            "                    },\n" +
                            "                    {\n" +
                            "                        \"name\": \"version\",\n" +
                            "                        \"in\": \"path\",\n" +
                            "                        \"description\": \"Version of the dataset.\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"schema\": {\n" +
                            "                            \"type\": \"string\"\n" +
                            "                        },\n" +
                            "                        \"example\": \"v1\"\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"The dataset API for the given version is found and it is accessible to consume.\",\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"type\": \"string\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"The combination of dataset name and version is not found in the system or it is not published yet to be consumed by public.\",\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"type\": \"string\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        },\n" +
                            "        \"/{dataset}/{version}/records\": {\n" +
                            "            \"post\": {\n" +
                            "                \"tags\": [\n" +
                            "                    \"search\"\n" +
                            "                ],\n" +
                            "                \"summary\": \"Provides search capability for the data set with the given search criteria.\",\n" +
                            "                \"description\": \"This API is based on Solr/Lucense Search. The data is indexed using SOLR. This GET API returns the list of all the searchable field names that are in the Solr Index. Please see the 'fields' attribute which returns an array of field names. Each field or a combination of fields can be searched using the Solr/Lucene Syntax. Please refer https://lucene.apache.org/core/3_6_2/queryparsersyntax.html#Overview for the query syntax. List of field names that are searchable can be determined using above GET api.\",\n" +
                            "                \"operationId\": \"perform-search\",\n" +
                            "                \"parameters\": [\n" +
                            "                    {\n" +
                            "                        \"name\": \"version\",\n" +
                            "                        \"in\": \"path\",\n" +
                            "                        \"description\": \"Version of the dataset.\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"schema\": {\n" +
                            "                            \"default\": \"v1\",\n" +
                            "                            \"type\": \"string\"\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    {\n" +
                            "                        \"name\": \"dataset\",\n" +
                            "                        \"in\": \"path\",\n" +
                            "                        \"description\": \"Name of the dataset. In this case, the default value is oa_citations\",\n" +
                            "                        \"required\": true,\n" +
                            "                        \"schema\": {\n" +
                            "                            \"default\": \"oa_citations\",\n" +
                            "                            \"type\": \"string\"\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                ],\n" +
                            "                \"requestBody\": {\n" +
                            "                    \"content\": {\n" +
                            "                        \"application/x-www-form-urlencoded\": {\n" +
                            "                            \"schema\": {\n" +
                            "                                \"required\": [\n" +
                            "                                    \"criteria\"\n" +
                            "                                ],\n" +
                            "                                \"type\": \"object\",\n" +
                            "                                \"properties\": {\n" +
                            "                                    \"criteria\": {\n" +
                            "                                        \"description\": \"Uses Lucene Query Syntax in the format of propertyName:value, propertyName:[num1 TO num2] and date range format: propertyName:[yyyyMMdd TO yyyyMMdd]. In the response please see the 'docs' element which has the list of record objects. Each record structure would consist of all the fields and their corresponding values.\",\n" +
                            "                                        \"default\": \"*:*\",\n" +
                            "                                        \"type\": \"string\"\n" +
                            "                                    },\n" +
                            "                                    \"start\": {\n" +
                            "                                        \"description\": \"Starting record number. Default value is 0.\",\n" +
                            "                                        \"default\": 0,\n" +
                            "                                        \"type\": \"integer\"\n" +
                            "                                    },\n" +
                            "                                    \"rows\": {\n" +
                            "                                        \"description\": \"Specify number of rows to be returned. If you run the search with default values, in the response you will see 'numFound' attribute which will tell the number of records available in the dataset.\",\n" +
                            "                                        \"default\": 100,\n" +
                            "                                        \"type\": \"integer\"\n" +
                            "                                    }\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                },\n" +
                            "                \"responses\": {\n" +
                            "                    \"200\": {\n" +
                            "                        \"description\": \"successful operation\",\n" +
                            "                        \"content\": {\n" +
                            "                            \"application/json\": {\n" +
                            "                                \"schema\": {\n" +
                            "                                    \"type\": \"array\",\n" +
                            "                                    \"items\": {\n" +
                            "                                        \"type\": \"object\",\n" +
                            "                                        \"additionalProperties\": {\n" +
                            "                                            \"type\": \"object\"\n" +
                            "                                        }\n" +
                            "                                    }\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    },\n" +
                            "                    \"404\": {\n" +
                            "                        \"description\": \"No matching record found for the given criteria.\"\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"components\": {\n" +
                            "        \"schemas\": {\n" +
                            "            \"dataSetList\": {\n" +
                            "                \"type\": \"object\",\n" +
                            "                \"properties\": {\n" +
                            "                    \"total\": {\n" +
                            "                        \"type\": \"integer\"\n" +
                            "                    },\n" +
                            "                    \"apis\": {\n" +
                            "                        \"type\": \"array\",\n" +
                            "                        \"items\": {\n" +
                            "                            \"type\": \"object\",\n" +
                            "                            \"properties\": {\n" +
                            "                                \"apiKey\": {\n" +
                            "                                    \"description\": \"To be used as a dataset parameter value\",\n" +
                            "                                    \"type\": \"string\"\n" +
                            "                                },\n" +
                            "                                \"apiVersionNumber\": {\n" +
                            "                                    \"description\": \"To be used as a version parameter value\",\n" +
                            "                                    \"type\": \"string\"\n" +
                            "                                },\n" +
                            "                                \"apiUrl\": {\n" +
                            "                                    \"format\": \"uriref\",\n" +
                            "                                    \"description\": \"The URL describing the dataset's fields\",\n" +
                            "                                    \"type\": \"string\"\n" +
                            "                                },\n" +
                            "                                \"apiDocumentationUrl\": {\n" +
                            "                                    \"format\": \"uriref\",\n" +
                            "                                    \"description\": \"A URL to the API console for each API\",\n" +
                            "                                    \"type\": \"string\"\n" +
                            "                                }\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"tags\": [\n" +
                            "        {\n" +
                            "            \"name\": \"metadata\",\n" +
                            "            \"description\": \"Find out about the data sets\"\n" +
                            "        },\n" +
                            "        {\n" +
                            "            \"name\": \"search\",\n" +
                            "            \"description\": \"Search a data set\"\n" +
                            "        }\n" +
                            "    ]\n" +
                            "}"),
            new ApiTemplate(
                    ApiDesignType.AsyncAPI20,
                    "Signed-up Event API",
                    "Creates an API that send user signed events using the AsyncAPI 2.0 standard",
                    "{\n" +
                            "    \"asyncapi\": \"2.0.0\",\n" +
                            "    \"id\": \"urn:io.asyncapi.example.user-signedup\",\n" +
                            "    \"info\": {\n" +
                            "        \"title\": \"User signed-up API\",\n" +
                            "        \"version\": \"0.1.0\",\n" +
                            "        \"description\": \"Sample AsyncAPI for user signedup events\",\n" +
                            "        \"license\": {\n" +
                            "            \"name\": \"Apache 2.0\",\n" +
                            "            \"url\": \"https://www.apache.org/licenses/LICENSE-2.0\"\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"servers\": {\n" +
                            "        \"development\": {\n" +
                            "            \"url\": \"broker.kafka.org:443\",\n" +
                            "            \"protocol\": \"kafka\"\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"defaultContentType\": \"application/json\",\n" +
                            "    \"channels\": {\n" +
                            "        \"user/signedup\": {\n" +
                            "            \"description\": \"The channel on which user signed up events may be consumed\",\n" +
                            "            \"subscribe\": {\n" +
                            "                \"summary\": \"Receive informations about user signed up\",\n" +
                            "                \"operationId\": \"receivedUserSIgnedUp\",\n" +
                            "                \"message\": {\n" +
                            "                    \"description\": \"An event describing that a user just signed up.\",\n" +
                            "                    \"traits\": [\n" +
                            "                        {\n" +
                            "                            \"$ref\": \"#/components/messageTraits/commonHeaders\"\n" +
                            "                        }\n" +
                            "                    ],\n" +
                            "                    \"payload\": {\n" +
                            "                        \"type\": \"object\",\n" +
                            "                        \"additionalProperties\": false,\n" +
                            "                        \"properties\": {\n" +
                            "                            \"fullName\": {\n" +
                            "                                \"type\": \"string\"\n" +
                            "                            },\n" +
                            "                            \"email\": {\n" +
                            "                                \"type\": \"string\",\n" +
                            "                                \"format\": \"email\"\n" +
                            "                            },\n" +
                            "                            \"age\": {\n" +
                            "                                \"type\": \"integer\",\n" +
                            "                                \"minimum\": 18\n" +
                            "                            }\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    },\n" +
                            "    \"components\": {\n" +
                            "        \"messageTraits\": {\n" +
                            "            \"commonHeaders\": {\n" +
                            "                \"headers\": {\n" +
                            "                    \"type\": \"object\",\n" +
                            "                    \"properties\": {\n" +
                            "                        \"my-app-header\": {\n" +
                            "                            \"type\": \"integer\",\n" +
                            "                            \"minimum\": 0,\n" +
                            "                            \"maximum\": 100\n" +
                            "                        }\n" +
                            "                    }\n" +
                            "                }\n" +
                            "            }\n" +
                            "        }\n" +
                            "    }\n" +
                            "}"));

    /**
     * @see ITemplatesResource#getAllTemplates(ApiDesignType)
     */
    @Override
    public List<ApiTemplate> getAllTemplates(ApiDesignType type) {
        if (type == null) {
            logger.info("Getting all templates");
            return allTemplates;
        } else {
            logger.info("Getting all templates of type {}", type);
            return allTemplates.stream().filter(apiTemplate -> type.equals(apiTemplate.getType())).collect(Collectors.toUnmodifiableList());
        }
    }
}
