package io.apicurio.tests.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Block `n` first requests, then allow the rest through.
 * 
 */
public class RetryLimitingProxy extends LimitingProxy {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    private int failures;

    public RetryLimitingProxy(int failures, String destinationHost, int destinationPort) {
        super(destinationHost, destinationPort);
        this.failures = failures;
    }

    @Override
    protected boolean allowed() {
        if (failures > 0) {
            failures--;
            return false;
        }
        return true;
    }
}