package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class BaseOperation {
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

}
