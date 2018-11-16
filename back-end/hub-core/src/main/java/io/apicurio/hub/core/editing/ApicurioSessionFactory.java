package io.apicurio.hub.core.editing;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ApicurioSessionFactory {
    // Suggest API ID
    SharedApicurioSession joinSession(String id, OperationHandler handler);
}

