/*
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.core.cmd;

import java.nio.charset.Charset;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;

import io.apicurio.hub.core.cmd.OaiCommandExecutor;

/**
 * @author eric.wittmann@gmail.com
 */
public class OaiCommandExecutorTest {

    private static final String OAI_DOC = "{" + 
            "  \"openapi\": \"3.0.0\"" + 
            "}";

    @Test
    public void testExecuteCommands() throws Exception {
        OaiCommandExecutor executor = new OaiCommandExecutor();
        
        String document = OAI_DOC;
        // Load the commands
        List<String> commands = new LinkedList<String>();
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("change-title.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("change-version.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("change-license.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("add-schema-definition.command.json"), Charset.forName("UTF-8")));
        
        // Invoke the executeCommands function
        String actual = executor.executeCommands(document, commands);
//        System.out.println("---");
//        System.out.println(actual);
//        System.out.println("---");
        
        String expected = IOUtils.toString(OaiCommandExecutorTest.class.getResource("__expected.json"), Charset.forName("UTF-8"));
        
        String actualNormalized = OaiCommandExecutorTest.normalizeString((String) actual);
        String expectedNormalized = OaiCommandExecutorTest.normalizeString(expected);
        Assert.assertEquals(expectedNormalized, actualNormalized);
    }

    @Test
    public void testExecuteCommands2() throws Exception {
        OaiCommandExecutor executor = new OaiCommandExecutor();
        
        String document = IOUtils.toString(getClass().getResource("testExecuteCommands2/__begin.json"), Charset.forName("UTF-8"));
        // Load the commands
        List<String> commands = new LinkedList<String>();
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands2/change-version.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands2/delete-contact.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands2/change-description.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands2/delete-contact.command.json"), Charset.forName("UTF-8")));
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands2/change-contact.command.json"), Charset.forName("UTF-8")));
        
        // Invoke the executeCommands function
        String actual = executor.executeCommands(document, commands);
//        System.out.println("---");
//        System.out.println(actual);
//        System.out.println("---");
        
        String expected = IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands2/__expected.json"), Charset.forName("UTF-8"));
        
        String actualNormalized = OaiCommandExecutorTest.normalizeString((String) actual);
        String expectedNormalized = OaiCommandExecutorTest.normalizeString(expected);
        Assert.assertEquals(expectedNormalized, actualNormalized);
    }

    @Test
    public void testExecuteCommands_Rename() throws Exception {
        OaiCommandExecutor executor = new OaiCommandExecutor();
        
        String document = IOUtils.toString(getClass().getResource("testExecuteCommands_Rename/__begin.json"), Charset.forName("UTF-8"));
        // Load the commands
        List<String> commands = new LinkedList<String>();
        commands.add(IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands_Rename/rename-definition.command.json"), Charset.forName("UTF-8")));
        
        // Invoke the executeCommands function
        String actual = executor.executeCommands(document, commands);
//        System.out.println("---");
//        System.out.println(actual);
//        System.out.println("---");
        
        String expected = IOUtils.toString(OaiCommandExecutorTest.class.getResource("testExecuteCommands_Rename/__expected.json"), Charset.forName("UTF-8"));
        
        String actualNormalized = OaiCommandExecutorTest.normalizeString((String) actual);
        String expectedNormalized = OaiCommandExecutorTest.normalizeString(expected);
        Assert.assertEquals(expectedNormalized, actualNormalized);
    }
    
    protected static String normalizeString(String input) {
        return input.replaceAll("\\r\\n?", "\n");
    }

}
