package io.apicurio.hub.core.auth.impl;

import io.apicurio.hub.core.auth.IAuthorizationService;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.studio.shared.beans.StudioRole;
import io.apicurio.studio.shared.beans.User;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;

@ApplicationScoped
@Default
public class AuthorizationService implements IAuthorizationService {

    @Inject
    private HubConfiguration config;
    @Inject
    private IStorage storage;

    /**
     * @see IAuthorizationService#hasWriteAllPermission(User)
     */
    @Override
    public boolean hasWriteAllPermission(User user) {
        return config.isShareForEveryone();
    }

    /**
     * @see IAuthorizationService#hasWritePermission(User, String) 
     */
    @Override
    public boolean hasWritePermission(User user, String designId) throws StorageException {
        return hasWriteAllPermission(user)
                || hasPersonalWritePermission(user, designId);
    }

    /**
     * @see IAuthorizationService#hasPersonalWritePermission(User, String)
     */
    @Override
    public boolean hasPersonalWritePermission(User user, String designId) throws StorageException {
        return this.storage.hasWritePermission(user.getLogin(), designId);
    }

    /**
     * @see IAuthorizationService#hasOwnerPermission(User, String)
     */
    @Override
    public boolean hasOwnerPermission(User user, String designId) throws StorageException {
        return hasPersonalOwnerPermission(user, designId);
    }

    /**
     * @see IAuthorizationService#hasPersonalOwnerPermission(User, String)
     */
    @Override
    public boolean hasPersonalOwnerPermission(User user, String designId) throws StorageException {
        return this.storage.hasOwnerPermission(user.getLogin(), designId);
    }

    /**
     * @see IAuthorizationService#hasTemplateCreationPermission(User) 
     */
    @Override
    public boolean hasTemplateCreationPermission(User user) {
        return user.hasRole(StudioRole.APICURIO_ADMIN);
    }
}
