package io.apicurio.hub.core.editing;

import javax.websocket.CloseReason;
import java.io.IOException;
import java.util.Map;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ApicurioSessionContext {
    Map<String, String> getPathParameters();

    String getQueryString();

    String getId();

    Map<String, String> getQueryStringMap();

    <T> void sendAsText(T obj) throws IOException;

    void close(CloseReason closeReason) throws IOException;
}
