package io.apicurio.studio.storage.mappers;

import io.apicurio.common.apps.storage.sql.jdbi.mappers.RowMapper;
import io.apicurio.studio.spi.storage.model.DesignMetadataDto;

import java.sql.ResultSet;
import java.sql.SQLException;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignMetadataMapper implements RowMapper<DesignMetadataDto> {

    @Override
    public boolean supports(Class<?> klass) {
        return DesignMetadataDto.class.equals(klass);
    }

    @Override
    public DesignMetadataDto map(ResultSet rs) throws SQLException {
        return DesignMetadataDto.builder()
                .id(rs.getString("designId"))
                .name(rs.getString("name"))
                .description(rs.getString("description"))
                .createdBy(rs.getString("createdBy"))
                .createdOn(rs.getTimestamp("createdOn").toInstant())
                .modifiedBy(rs.getString("modifiedBy"))
                .modifiedOn(rs.getTimestamp("modifiedOn").toInstant())
                .type(rs.getString("type"))
                .origin(rs.getString("origin"))
                .build();
    }
}
