package io.apicurio.hub.core.editing.sessionbeans;

import io.apicurio.hub.core.beans.ApiDesignCommand;

/**
 *                 builder.append("{");
 *                 builder.append("\"contentVersion\": ");
 *                 builder.append(command.getContentVersion());
 *                 builder.append(", ");
 *                 builder.append("\"type\": \"command\", ");
 *                 builder.append("\"author\": \"");
 *                 builder.append(command.getAuthor());
 *                 builder.append("\", ");
 *                 builder.append("\"reverted\": ");
 *                 builder.append(command.isReverted());
 *                 builder.append(", ");
 *                 builder.append("\"command\": ");
 *                 builder.append(cmdData);
 *                 builder.append("}");
 *
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class FullCommandOperation extends VersionedCommandOperation {
    private String author;
    private boolean reverted;

    public String getAuthor() {
        return author;
    }

    public FullCommandOperation setAuthor(String author) {
        this.author = author;
        return this;
    }


    public boolean isReverted() {
        return reverted;
    }

    public FullCommandOperation setReverted(boolean reverted) {
        this.reverted = reverted;
        return this;
    }

    public static FullCommandOperation fullCommand(ApiDesignCommand command) {
        return FullCommandOperation.fullCommand(command.getContentVersion(),
                command.getCommand(),
                command.getAuthor(),
                command.isReverted());
    }

    public static FullCommandOperation fullCommand(long contentVersion, String commandContent, String author, boolean reverted) {
        return (FullCommandOperation) new FullCommandOperation()
                .setAuthor(author)
                .setReverted(reverted)
                .setCommandStr(commandContent)
                .setContentVersion(contentVersion)
                .setType("command");
    }

}
