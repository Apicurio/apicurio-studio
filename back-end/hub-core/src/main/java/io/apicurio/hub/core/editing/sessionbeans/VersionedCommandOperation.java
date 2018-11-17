package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedCommandOperation extends VersionedOperation {
    private String command;
    private String commandId;

    public String getCommand() {
        return command;
    }

    public VersionedCommandOperation setCommand(String command) {
        this.command = command;
        return this;
    }

    public String getCommandId() {
        return commandId;
    }

    public VersionedCommandOperation setCommandId(String commandId) {
        this.commandId = commandId;
        return this;
    }

    public static VersionedCommandOperation command(long contentVersion, String command) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static VersionedCommandOperation command(long contentVersion, String command, String commandId) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setCommandId(commandId)
                .setContentVersion(contentVersion)
                .setType("command");
    }


}
