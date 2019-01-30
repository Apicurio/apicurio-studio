package testprocessors;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.junit.Assert;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class TestCommandProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation base, String actualRaw) {
        VersionedCommandOperation expected = (VersionedCommandOperation) base;
        VersionedCommandOperation actual = JsonUtil.fromJson(actualRaw, unmarshallKlazz());

        Assert.assertEquals(expected.getCommandId(), actual.getCommandId());
        Assert.assertEquals("JSON command string did not match", expected.getCommandStr(), actual.getCommandStr());
        Assert.assertEquals(expected.getType(), actual.getType());
    }

    public void doCompare() {

    }

    @Override
    public String getOperationName() {
        return "command";
    }

    @Override
    public Class<VersionedCommandOperation> unmarshallKlazz() {
        return VersionedCommandOperation.class;
    }
}
