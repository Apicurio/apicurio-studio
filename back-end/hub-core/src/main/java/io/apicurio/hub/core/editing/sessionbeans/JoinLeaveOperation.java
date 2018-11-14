package io.apicurio.hub.core.editing.sessionbeans;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class JoinLeaveOperation extends BaseOperation {
    private String user;
    private String id;

    public JoinLeaveOperation() {}

    public String getUser() {
        return user;
    }

    public JoinLeaveOperation setUser(String user) {
        this.user = user;
        return this;
    }

    public String getId() {
        return id;
    }

    public JoinLeaveOperation setId(String id) {
        this.id = id;
        return this;
    }

    public static JoinLeaveOperation join(String user, String id) {
        return (JoinLeaveOperation) new JoinLeaveOperation()
                .setUser(user)
                .setId(id)
                .setType("join");
    }

    public static JoinLeaveOperation leave(String user, String id) {
        return (JoinLeaveOperation) new JoinLeaveOperation()
                .setUser(user)
                .setId(id)
                .setType("leave");
    }
}
