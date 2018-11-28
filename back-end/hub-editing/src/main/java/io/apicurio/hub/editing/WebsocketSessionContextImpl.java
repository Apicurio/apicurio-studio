package io.apicurio.hub.editing;

import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

import javax.websocket.CloseReason;
import javax.websocket.Session;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class WebsocketSessionContextImpl implements ApicurioSessionContext {

    private final Session session;

    public WebsocketSessionContextImpl(Session session) {
        this.session = session;
    }

    @Override
    public Map<String, String> getPathParameters() {
        return session.getPathParameters();
    }

    @Override
    public String getQueryString() {
        return session.getQueryString();
    }

    @Override
    public String getId() {
        return session.getId();
    }

    @Override
    public Map<String, String> getQueryStringMap() {
        Map<String, String> rval = new HashMap<>();
        List<NameValuePair> list = URLEncodedUtils.parse(session.getQueryString(), StandardCharsets.UTF_8);
        for (NameValuePair nameValuePair : list) {
            rval.put(nameValuePair.getName(), nameValuePair.getValue());
        }
        return rval;
    }

    @Override
    public <T> void sendAsText(T obj) throws IOException {
        session.getBasicRemote().sendText(JsonUtil.toJson(obj));
    }

//    @Override
//    public void sendText(String data) throws IOException {
//        session.getBasicRemote().sendText(JsonUtil.toJson(operation));
//    }

    @Override
    public void close(CloseReason closeReason) throws IOException {
        session.close();
    }
}
