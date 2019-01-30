package io.apicurio.test.integration.arquillian.testprocessors;

import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import testprocessors.ITestOperationProcessor;
import testprocessors.TestAckOperationProcessor;
import testprocessors.TestCommandProcessor;
import testprocessors.TestSelectionOperationProcessor;

import javax.enterprise.context.ApplicationScoped;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@ApplicationScoped
public class TestOperationProcessor {
        public static final TestOperationProcessor INSTANCE = new TestOperationProcessor();

        private static final Logger logger = LoggerFactory.getLogger(TestOperationProcessor.class);
        private static final Map<String, ITestOperationProcessor> processorMap = new LinkedHashMap<>();

        static {
                INSTANCE.addProcessors();
        }


        private void addProcessors() {
                add(TestAckOperationProcessor.class);
                add(TestCommandProcessor.class);
                add(TestSelectionOperationProcessor.class);
        }

        private static void add(Class<? extends ITestOperationProcessor> clazz) {
                try {
                        ITestOperationProcessor instance = clazz.newInstance();
                        String name = instance.getOperationName();
                        processorMap.put(name, instance);

                } catch (InstantiationException | IllegalAccessException e) {
                        throw new RuntimeException(e);
                }
        }

        public void assertEquals(BaseOperation expect, String actual) {
                ITestOperationProcessor processor = processorMap.get(expect.getType());
                if(processor == null) {
                        throw new IllegalArgumentException("Test processor for operation did not exist " +
                                "You probably need to add an extra ITestOperationProcessor.");
                }
                processor.assertEquals(expect, actual);
        }
}
