
function executeCommands(oaiDoc, commands) {
    var library = new OAI.OasLibraryUtils();
    var document = library.createDocument(oaiDoc);
    
    if (commands) {
        var numCmds = commands.length;
        console.debug("Executing " + numCmds + " OAS commands.");
        for (var i = 0; i < numCmds; i++) {
            var cmd = commands[i];
            console.debug("Executing [" + i + "] CMD: " + cmd);
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
