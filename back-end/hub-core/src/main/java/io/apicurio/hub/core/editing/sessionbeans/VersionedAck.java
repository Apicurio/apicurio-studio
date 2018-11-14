package io.apicurio.hub.core.editing.sessionbeans;

/**
 * Important, note this is command ID, not command.
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */

public class VersionedAck extends VersionedOperation {
    private long commandId;

    public static VersionedAck ack(long contentVersion, long commandId) {
        return (VersionedAck) new VersionedAck()
                .setCommandId(commandId)
                .setContentVersion(contentVersion)
                .setType("ack");
    }

    public static VersionedAck ack(long contentVersion) {
        return (VersionedAck) new VersionedAck()
                .setContentVersion(contentVersion)
                .setType("ack");
    }

    public long getCommandId() {
        return commandId;
    }

    public VersionedAck setCommandId(long commandId) {
        this.commandId = commandId;
        return this;
    }
}
