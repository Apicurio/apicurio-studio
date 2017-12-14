
function executeCommands(oaiDoc, commands) {
    var library = new OAI.OasLibraryUtils();
    var document = library.createDocument(oaiDoc);
    
    if (commands) {
        var numCmds = commands.length;
        console.info("Executing " + numCmds + " OAS commands.");
        for (var i = 0; i < numCmds; i++) {
            var cmd = commands[i];
            console.info("Executing cmd: " + cmd);
            cmd = JSON.parse(cmd);
            cmd = OAI_commands.MarshallUtils.unmarshallCommand(cmd);
            cmd.execute(document);
        }
    }

    return JSON.stringify(library.writeNode(document), null, 2);
}
