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

package io.apicurio.hub.core.metrics;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author eric.wittmann@gmail.com
 */
public class PrometheusApiMetricsTest {

    /**
     * Test method for {@link io.apicurio.hub.core.beans.ApiDesignResourceInfo#fromContent(java.lang.String)}.
     */
    @Test
    public void testDomainFromUser() throws Exception {
        Assert.assertEquals("example.com", PrometheusApiMetrics.domainFromUser("test@example.com"));
        Assert.assertEquals("other-space.com", PrometheusApiMetrics.domainFromUser("foo-bar@other-space.com"));
        Assert.assertEquals("foo-bar", PrometheusApiMetrics.domainFromUser("foo-bar"));
        Assert.assertNull(PrometheusApiMetrics.domainFromUser(null));
    }

}
