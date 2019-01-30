package testprocessors;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedAck;
import io.apicurio.hub.core.util.JsonUtil;
import org.junit.Assert;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class TestAckOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation base, String actualRaw) {
        VersionedAck expected = (VersionedAck) base;
        VersionedAck actual = JsonUtil.fromJson(actualRaw, unmarshallKlazz());

        Assert.assertEquals(expected.getCommandId(), actual.getCommandId());
        Assert.assertEquals(expected.getType(), actual.getType());
    }

    @Override
    public String getOperationName() {
        return "ack";
    }

    @Override
    public Class<VersionedAck> unmarshallKlazz() {
        return VersionedAck.class;
    }
}
