package io.apicurio.hub.api.beans;

public class BitbucketTeam {

    private String displayName;
    private String username;
    private String uuid;
    private boolean userTeam;

    /**
     * @return the displayName
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * @param displayName the displayName to set
     */
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the uuid
     */
    public String getUuid() {
        return uuid;
    }

    /**
     * @param uuid the uuid to set
     */
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    /**
     * @return the userTeam
     */
    public boolean isUserTeam() {
        return userTeam;
    }

    /**
     * @param userTeam the userTeam to set
     */
    public void setUserTeam(boolean userTeam) {
        this.userTeam = userTeam;
    }
}
