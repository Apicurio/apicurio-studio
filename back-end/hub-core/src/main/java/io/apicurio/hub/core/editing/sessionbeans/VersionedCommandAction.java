package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedCommandAction extends VersionedOperation {
    private String command;

    public String getCommand() {
        return command;
    }

    public VersionedCommandAction setCommand(String command) {
        this.command = command;
        return this;
    }


    public static VersionedCommandAction command(long contentVersion, String command) {
        return (VersionedCommandAction) new VersionedCommandAction()
                .setCommand(command)
                .setContentVersion(contentVersion)
                .setType("command");
    }
}
