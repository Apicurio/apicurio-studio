package io.apicurio.studio.spi.storage;

import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.sql.jdbi.query.Query;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class SearchQuerySpecification {

    private final Map<String, WhereColumn> whereColumns = new HashMap<>();
    private final Map<String, OrderByColumn> orderByColumns = new HashMap<>();

    private boolean applied = false;

    private final List<WhereColumn> activeWhereColumns = new ArrayList<>();
    private final List<OrderByColumn> activeOrderByColumns = new ArrayList<>(1);
    private Integer offset;
    private Integer limit;

    // === Specify

    public SearchQuerySpecification addWhereColumn(String columnName, String queryPart, Function3<Query, Integer, Object, Void> binder) {
        whereColumns.put(columnName, WhereColumn.builder()
                .columnName(columnName)
                .queryPart(queryPart)
                .binder(binder)
                .build());
        return this;
    }

    public SearchQuerySpecification addOrderByColumn(String columnName, String prefix) {
        orderByColumns.put(columnName, OrderByColumn.builder()
                .columnName(columnName)
                .prefix(prefix)
                .build());
        return this;
    }

    // === Apply

    public void apply(SearchQuery search) {
        if (applied) {
            throw new IllegalStateException();
        }
        applied = true;
        for (WhereColumn searchWhereColumn : search.whereColumns) {
            var specWhereColumn = this.whereColumns.get(searchWhereColumn.columnName);
            if (specWhereColumn != null) {
                specWhereColumn.columnValue = searchWhereColumn.columnValue;
                activeWhereColumns.add(specWhereColumn);
            } else {
                throw new IllegalStateException("Unknown column " + searchWhereColumn);
            }
        }
        if (search.orderByColumns.size() != 1) {
            throw new IllegalStateException("Single order-by column required, but there are " + search.orderByColumns.size());
        }
        var searchOrderByColumn = search.orderByColumns.stream().findFirst().get();
        var specOrderByColumn = orderByColumns.get(searchOrderByColumn.columnName);
        if (specOrderByColumn != null) {
            specOrderByColumn.orderBy = searchOrderByColumn.orderBy;
            activeOrderByColumns.add(specOrderByColumn);
        } else {
            throw new IllegalStateException("Unknown column " + searchOrderByColumn);
        }
        offset = search.offset;
        limit = search.limit;
    }

    // === Produce

    public String getWherePart() {
        var res = new StringBuilder();
        for (WhereColumn column : activeWhereColumns) {
            res.append(column.queryPart).append(" \n");
        }
        return res.toString();
    }

    public String getOrderByPart() {
        var res = new StringBuilder();
        var column = activeOrderByColumns.get(0);
        if (column != null) {
            res.append("ORDER BY ");
            res.append(column.prefix).append(".").append(column.columnName); // TODO Prefix?
            res.append(" ");
            res.append(column.orderBy == SearchOrdering.DESC ? "DESC" : "ASC");
            res.append(" \n");
        }
        return res.toString();
    }

    public String getLimitPart() {
        var res = new StringBuilder();
        if (limit != null) {
            res.append("LIMIT ");
            res.append(limit);
            res.append(" ");
            if (offset != null) {
                res.append("OFFSET ");
                res.append(offset);
                res.append(" ");
            }
            res.append("\n");
        }
        return res.toString();
    }

    public int bindWhere(int idx, Query query) throws StorageException {
        for (WhereColumn column : activeWhereColumns) {
            // TODO Move to CAC
            if (column.columnValue instanceof String value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof Long value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof Integer value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof Enum<?> value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof Date value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof Instant value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof byte[] value) {
                query.bind(idx, value);
            } else if (column.columnValue instanceof ContentHandle value) {
                query.bind(idx, value);
            } else {
                throw new StorageException("Could not bind object " + column.columnValue + " to query. Unsupported type.", Map.of());
            }
            idx++;
        }
        return idx;
    }

    @Builder
    @Getter
    @EqualsAndHashCode(onlyExplicitlyIncluded = true)
    @ToString
    private static class WhereColumn {

        @EqualsAndHashCode.Include
        private String columnName;

        private String queryPart;

        private Function3<Query, Integer, Object, Void> binder;

        private Object columnValue;
    }

    @Builder
    @Getter
    @EqualsAndHashCode(onlyExplicitlyIncluded = true)
    @ToString
    private static class OrderByColumn {

        @EqualsAndHashCode.Include
        private String columnName;

        private String prefix;

        private SearchOrdering orderBy;
    }

    public enum SearchOrdering {
        DESC,
        ASC
    }

    @ToString
    public static class SearchQuery {

        private final Set<WhereColumn> whereColumns = new HashSet<>();
        private final Set<OrderByColumn> orderByColumns = new HashSet<>();
        private Integer offset;
        private Integer limit;

        public SearchQuery column(String columnName, Object columnValue) {
            // TODO Nullable columns
            if (columnValue != null) {
                whereColumns.add(WhereColumn.builder()
                        .columnName(columnName)
                        .columnValue(columnValue)
                        .build());
            }
            return this;
        }

        public SearchQuery orderBy(String columnName, SearchOrdering orderBy) {
            orderByColumns.add(OrderByColumn.builder()
                    .columnName(columnName)
                    .orderBy(orderBy)
                    .build());
            return this;
        }

        public SearchQuery limit(int offset, int limit) {
            this.offset = offset;
            this.limit = limit;
            return this;
        }
    }
}
