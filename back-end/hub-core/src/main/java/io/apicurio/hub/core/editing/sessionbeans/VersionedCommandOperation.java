package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedCommandOperation extends VersionedOperation {
    private String command;

    public String getCommand() {
        return command;
    }

    public VersionedCommandOperation setCommand(String command) {
        this.command = command;
        return this;
    }


    public static VersionedCommandOperation command(long contentVersion, String command) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setContentVersion(contentVersion)
                .setType("command");
    }
}
