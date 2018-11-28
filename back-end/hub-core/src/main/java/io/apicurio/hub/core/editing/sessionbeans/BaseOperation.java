package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class BaseOperation {
    private SourceEnum source = SourceEnum.LOCAL;

    private String type;

    public BaseOperation() {}

    public BaseOperation(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public BaseOperation setType(String type) {
        this.type = type;
        return this;
    }

    public SourceEnum getSource() {
        return source;
    }

    public BaseOperation setSource(SourceEnum source) {
        this.source = source;
        return this;
    }

    public enum SourceEnum {
        LOCAL, REMOTE
    }
}
