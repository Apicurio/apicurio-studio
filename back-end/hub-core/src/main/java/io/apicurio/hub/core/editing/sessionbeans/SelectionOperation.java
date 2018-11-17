package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class SelectionOperation extends BaseOperation {
    private String user;
    private String id;
    private String selection;

    public SelectionOperation() {}

    public String getUser() {
        return user;
    }

    public SelectionOperation setUser(String user) {
        this.user = user;
        return this;
    }

    public String getId() {
        return id;
    }

    public SelectionOperation setId(String id) {
        this.id = id;
        return this;
    }

    public String getSelection() {
        return selection;
    }

    public SelectionOperation setSelection(String selection) {
        this.selection = selection;
        return this;
    }

    public static SelectionOperation select(String user, String id, String selection) {
        return (SelectionOperation) new SelectionOperation()
                .setUser(user)
                .setId(id)
                .setSelection(selection)
                .setType("selection");
    }
}
