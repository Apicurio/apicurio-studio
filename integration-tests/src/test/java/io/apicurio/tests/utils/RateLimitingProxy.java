package io.apicurio.tests.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RateLimitingProxy extends LimitingProxy {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    private int buckets;

    public RateLimitingProxy(int failAfterRequests, String destinationHost, int destinationPort) {
        super(destinationHost, destinationPort);
        // this will rate limit just based on total requests
        // that means that if buckets=3 the proxy will successfully redirect the first 3 requests and every request after that will be rejected with 429 status
        this.buckets = failAfterRequests;
    }

    @Override
    protected boolean allowed() {
        if (buckets > 0) {
            buckets--;
            return true;
        }
        return false;
    }
}
