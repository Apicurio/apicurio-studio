package io.apicurio.tests.utils;

import io.apicurio.studio.rest.client.StudioClient;
import io.apicurio.tests.ApicurioStudioBaseIT;

public class StudioWaitUtils {

    @FunctionalInterface
    public interface ConsumerExc<T> {
        void run(T t) throws Exception;
    }

    @FunctionalInterface
    public interface FunctionExc<T, R> {
        R run(T t) throws Exception;
    }

    public static void retry(StudioClient studioClient, ConsumerExc<StudioClient> studioOp) throws Exception {
        ApicurioStudioBaseIT.retry(() -> studioOp.run(studioClient));
    }

}
