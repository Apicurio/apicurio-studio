package io.apicurio.hub.api.beans;

import io.apicurio.hub.core.beans.StoredApiTemplate;

public class UpdateApiTemplate {
    private String name;
    private String description;
    private String document;

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the document
     */
    public String getDocument() {
        return document;
    }

    /**
     * @param document the document to set
     */
    public void setDocument(String document) {
        this.document = document;
    }
    
    public StoredApiTemplate toStoredApiTemplate() {
        StoredApiTemplate storedApiTemplate = new StoredApiTemplate();
        storedApiTemplate.setName(this.name);
        storedApiTemplate.setDescription(this.description);
        storedApiTemplate.setDocument(this.document);
        return storedApiTemplate;
    }
}
