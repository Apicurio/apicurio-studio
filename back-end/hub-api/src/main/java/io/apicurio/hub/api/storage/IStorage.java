/*
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

package io.apicurio.hub.api.storage;

import java.util.Set;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IStorage {

    public ApiDesign getApiDesign(String designId) throws NotFoundException, StorageException;

    public void createApiDesign(ApiDesign design) throws AlreadyExistsException, StorageException;

    public void deleteApiDesign(String designId) throws NotFoundException, StorageException;

    public Set<ApiDesign> listApiDesigns() throws StorageException;

}
