package testprocessors;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public interface ITestOperationProcessor {
    void assertEquals(BaseOperation baseOperation, String actual);
    String getOperationName();
    Class<? extends BaseOperation> unmarshallKlazz();

    // Could add method to ensure sequences via contentVersion? Could be interesting.
}
