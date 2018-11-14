package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedOperation extends BaseOperation {
    private long contentVersion;

    public VersionedOperation() {}

    public long getContentVersion() {
        return contentVersion;
    }

    public VersionedOperation setContentVersion(long contentVersion) {
        this.contentVersion = contentVersion;
        return this;
    }

    public static VersionedOperation redo(long contentVersion) {
        return (VersionedOperation) new VersionedOperation()
                .setContentVersion(contentVersion)
                .setType("redo");
    }

    public static VersionedOperation undo(long contentVersion) {
        return (VersionedOperation) new VersionedOperation()
                .setContentVersion(contentVersion)
                .setType("undo");
    }
}
