package io.apicurio.studio.storage.common;

import io.apicurio.common.apps.storage.exceptions.AlreadyExistsException;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.studio.spi.storage.StudioStorageException;
import io.apicurio.studio.spi.storage.ResourceAlreadyExistsStorageException;
import io.apicurio.studio.spi.storage.ResourceNotFoundStorageException;

import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
@SuppressWarnings("unchecked")
public class StorageExceptionMapperImpl implements StorageExceptionMapper {

    @Override
    public StudioStorageException map(StorageException original) {
        if (original instanceof NotFoundException) {
            return new ResourceNotFoundStorageException("Resource not found.", original);
        }
        if (original instanceof AlreadyExistsException) {
            return new ResourceAlreadyExistsStorageException("Resource already exists.", original);
        }
        return new StudioStorageException("Something went wrong when accessing SQL storage.", original);
    }
}
