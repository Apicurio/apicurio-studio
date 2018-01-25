
function executeCommands(oaiDoc, commands) {
    console.debug("[core-library] Entering executeCommands");
    console.debug("[core-library] OAI Doc: " + oaiDoc);
    var library = new OAI.OasLibraryUtils();
    console.debug("[core-library] Library: " + library);
    var oaiDocJSObj = JSON.parse(oaiDoc);
    var document = library.createDocument(oaiDocJSObj);
    console.debug("[core-library] Document: " + library);
    
    if (commands) {
        var numCmds = commands.length;
        console.debug("[core-library] Executing " + numCmds + " OAS commands.");
        for (var i = 0; i < numCmds; i++) {
            var cmd = commands[i];
            console.debug("[core-library] Executing [" + i + "] CMD: " + cmd);
            try {
                cmd = JSON.parse(cmd);
                cmd = OAI_commands.MarshallUtils.unmarshallCommand(cmd);
                cmd.execute(document);
            } catch (e) {
                console.error(e);
            }
        }
    }

    return JSON.stringify(library.writeNode(document), null, 2);
}
