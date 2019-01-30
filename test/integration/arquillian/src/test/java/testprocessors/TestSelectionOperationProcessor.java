package testprocessors;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.SelectionOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.junit.Assert;

import javax.inject.Singleton;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class TestSelectionOperationProcessor implements ITestOperationProcessor {
    @Override
    public void assertEquals(BaseOperation base, String actualRaw) {
        SelectionOperation expected = (SelectionOperation) base;
        SelectionOperation actual = JsonUtil.fromJson(actualRaw, unmarshallKlazz());

        Assert.assertEquals(expected.getUser(), actual.getUser());
        //Assert.assertEquals(expected.getId(), actual.getId()); TODO is this predictable in some way?
        Assert.assertEquals(expected.getSelection(), actual.getSelection());
        Assert.assertEquals(expected.getType(), actual.getType());
    }

    @Override
    public String getOperationName() {
        return "selection";
    }

    @Override
    public Class<SelectionOperation> unmarshallKlazz() {
        return SelectionOperation.class;
    }
}
