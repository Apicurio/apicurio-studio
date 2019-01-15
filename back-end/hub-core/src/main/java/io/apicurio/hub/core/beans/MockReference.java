/*
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

package io.apicurio.hub.core.beans;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockReference {

    private String mockType;
    private String serviceRef;
    private String mockURL;

    /**
     * Constructor.
     */
    public MockReference() {
    }

    /**
     * @return the mockType
     */
    public String getMockType() {
        return mockType;
    }

    /**
     * @param mockType the mockType to set
     */
    public void setMockType(String mockType) {
        this.mockType = mockType;
    }

    /**
     * @return the serviceRef
     */
    public String getServiceRef() {
        return serviceRef;
    }

    /**
     * @param serviceRef the serviceRef to set
     */
    public void setServiceRef(String serviceRef) {
        this.serviceRef = serviceRef;
    }

    /**
     * @return the mockURL
     */
    public String getMockURL() {
        return mockURL;
    }

    /**
     * @param mockURL the mockURL to set
     */
    public void setMockURL(String mockURL) {
        this.mockURL = mockURL;
    }

}
