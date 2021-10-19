package io.apicurio.hub.core.auth;

import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.studio.shared.beans.User;

/**
 * Interface used to check the logged in user's authorization to execute a given action.
 * @author c.desc2@gmail.com
 */
public interface IAuthorizationService {
    
    /**
     * Checks whether the user has write access regardless of the design
     * @param user the user
     * @return if the user has write access
     */
    boolean hasWriteAllPermission(User user);

    /**
     * Checks whether the user has write permission on the design
     * @param user the user
     * @param designId the designId
     * @return if the user has write access
     */
    boolean hasWritePermission(User user, String designId) throws StorageException;

    /**
     * Checks whether the user is collaborator or owner of the design
     * @param user the user
     * @param designId the designId
     * @return if the user has write access
     */
    boolean hasPersonalWritePermission(User user, String designId) throws StorageException;

    /**
     * Checks whether the user has owner permission on the design
     * @param user the user
     * @param designId the designId
     * @return if the user has owner permission
     */
    boolean hasOwnerPermission(User user, String designId) throws StorageException;

    /**
     * Checks whether the user is owner of the given design
     * @param user the user
     * @param designId the designId
     * @return if the user is owner of the design
     */
    boolean hasPersonalOwnerPermission(User user, String designId) throws StorageException;

    /**
     * Checks whether the user can create templates
     * @param user the user
     * @return if the user can create templates
     */
    boolean hasTemplateCreationPermission(User user);
}
