package io.apicurio.studio.storage.mappers;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.common.apps.storage.sql.jdbi.mappers.RowMapper;
import io.apicurio.studio.spi.storage.model.DesignEventDto;

import java.sql.ResultSet;
import java.sql.SQLException;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignEventMapper implements RowMapper<DesignEventDto> {

    @Override
    public boolean supports(Class<?> klass) {
        return DesignEventDto.class.equals(klass);
    }

    @Override
    public DesignEventDto map(ResultSet rs) throws SQLException {
        return DesignEventDto.builder()
                .id(rs.getString("eventId"))
                .designId(rs.getString("designId"))
                .createdOn(rs.getTimestamp("createdOn").toInstant())
                .type(rs.getString("type"))
                .data(ContentHandle.create(rs.getBytes("data")))
                .build();
    }
}
