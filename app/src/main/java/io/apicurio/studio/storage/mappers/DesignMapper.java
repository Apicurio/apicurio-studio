package io.apicurio.studio.storage.mappers;

import io.apicurio.common.apps.storage.sql.jdbi.mappers.RowMapper;
import io.apicurio.studio.spi.storage.model.DesignDto;

import java.sql.ResultSet;
import java.sql.SQLException;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignMapper implements RowMapper<DesignDto> {

    @Override
    public boolean supports(Class<?> klass) {
        return DesignDto.class.equals(klass);
    }

    @Override
    public DesignDto map(ResultSet rs) throws SQLException {
        return DesignDto.builder()
                .id(rs.getString("designId"))
                .contentId(rs.getLong("contentId"))
                .build();
    }
}
