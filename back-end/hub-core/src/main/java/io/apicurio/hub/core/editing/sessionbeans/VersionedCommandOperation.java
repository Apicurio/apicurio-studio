package io.apicurio.hub.core.editing.sessionbeans;

import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedCommandOperation extends VersionedOperation {
    private JsonNode command;
    private long commandId = -1;

    public String getCommandStr() {
        return command.toString();
    }

    public JsonNode getCommand() {
        return command;
    }

    public VersionedCommandOperation setCommand(JsonNode command) {
        this.command = command;
        return this;
    }

    public VersionedCommandOperation setCommandStr(String command) {
        this.command = JsonUtil.toJsonTree(command);
        return this;
    }

    public long getCommandId() {
        return commandId;
    }

    public VersionedCommandOperation setCommandId(long commandId) {
        this.commandId = commandId;
        return this;
    }

    public static VersionedCommandOperation command(long contentVersion, String command) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommandStr(command)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static VersionedCommandOperation command(long contentVersion, String command, long commandId) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommandStr(command)
                .setCommandId(commandId)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static void main(String[] args) {
        String raw = "{\"type\":\"command\",\"commandId\":1543444583976,\"command\":{\"__type\":\"NewOperationCommand_30\",\"_path\":\"/pets\",\"_method\":\"head\",\"_created\":true}}";

        VersionedCommandOperation vco = JsonUtil.fromJson(raw, VersionedCommandOperation.class);

        System.out.println(vco.getCommandStr());

        System.out.println(vco.getCommand());

    }
}
